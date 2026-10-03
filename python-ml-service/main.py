from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import joblib
import pandas as pd
import numpy as np
import os
import json
import time
from datetime import datetime
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from feature_extractor import extract_features_from_url
from similarity_engine import compute_hashes, group_similar_assets, cluster_assets, detect_anomalies
from similarity_engine import compute_similarity as compute_phash_similarity
from similarity_engine import compute_similarity as compute_phash_similarity
from services.pipeline import pipeline
from services.vision import vision_service

# Optional import for vision service, gracefully fail if torch is not installed
try:
    from vision_service import analyze_image, compute_cosine_similarity, compute_hybrid_similarity
    from sklearn.decomposition import PCA
    VISION_ENABLED = True
except ImportError:
    VISION_ENABLED = False
    print("Warning: PyTorch vision_service not available. Vision endpoints disabled.")

app = FastAPI(title="MediaFlow AI - ML Service")

# Allow requests from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Model
MODEL_PATH = "quality_model.joblib"
model = None
LIBRARY_FEATURES = None
FEATURE_NAMES = ['Resolution', 'AspectRatio', 'Brightness', 'Contrast', 'Sharpness', 'EdgeDensity', 'ColorVariance', 'Compression', 'Entropy']
anomaly_clf = None
scaler = None

# Simple in-memory embedding storage for visual search
embedding_store = {}
feedback_store = []

@app.on_event("startup")
def load_model():
    global model, LIBRARY_FEATURES, anomaly_clf, scaler
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print(f"Loaded model from {MODEL_PATH}")
    else:
        print("Model not found. Please run train_model.py first.")
        
    csv_path = "media_features.csv"
    if os.path.exists(csv_path):
        try:
            df = pd.read_csv(csv_path)
            # drop rows with missing values
            df = df.dropna(subset=FEATURE_NAMES)
            X = df[FEATURE_NAMES].values
            scaler = StandardScaler()
            X_scaled = scaler.fit_transform(X)
            
            anomaly_clf = IsolationForest(random_state=42, contamination=0.1)
            anomaly_clf.fit(X_scaled)
            
            LIBRARY_FEATURES = X_scaled
            print(f"Loaded {len(X)} library features for Anomaly/Similarity.")
        except Exception as e:
            print(f"Error loading {csv_path}: {e}")

class PredictionRequest(BaseModel):
    url: str

class AssetHashRequest(BaseModel):
    url: str

class SimilarityGroupRequest(BaseModel):
    assets: List[Dict[str, Any]]
    threshold: Optional[float] = 0.90

@app.post("/api/ml/analyze")
async def analyze_media(request: dict):
    """
    Run an asset through the complete intelligence pipeline.
    Uses real models instead of mock pipeline.
    """
    try:
        url = request.get('secureUrl') or request.get('url') or ''
        public_id = request.get('publicId') or request.get('asset_id') or 'unknown.jpg'
        
        if not url:
            raise HTTPException(status_code=400, detail="Missing url or secureUrl")
            
        timings = {}
        t0 = time.time()

        # 1. Vision Processing (Real ResNet-18)
        vision_result = None
        if VISION_ENABLED:
            vision_result = analyze_image(url)
            
        if not vision_result:
            # Fallback if torch fails or not available
            vision_result = {
                "predictions": [{"label": "Unknown", "confidence": 0.0}],
                "embedding": [0.0] * 512,
                "embedding_dimensions": 512
            }
        t1 = time.time()
        timings["resnet"] = int((t1 - t0) * 1000)
            
        # 2. Extract Features
        t2 = time.time()
        features_dict = extract_features_from_url(url)
        features_df = pd.DataFrame([features_dict], columns=FEATURE_NAMES)
        t3 = time.time()
        timings["extraction"] = int((t3 - t2) * 1000)

        # 3. Quality Prediction (Real Random Forest)
        t4 = time.time()
        quality_prediction = "Unknown"
        probabilities_dict = {"Poor": 0.0, "Average": 0.0, "Good": 0.0, "Excellent": 0.0}
        
        if model is not None:
            pred = model.predict(features_df)[0]
            probs = model.predict_proba(features_df)[0]
            
            # Map predictions
            quality_prediction = str(pred)
            # In our dataset, labels might be 'Poor', 'Average', 'Good', 'Excellent'
            # Assuming model.classes_ has these in some order:
            for idx, cls_name in enumerate(model.classes_):
                if cls_name in probabilities_dict:
                    probabilities_dict[cls_name] = round(float(probs[idx]), 3)
        t5 = time.time()
        timings["random_forest"] = int((t5 - t4) * 1000)
            
        # 4. Anomaly and Similarity (Real feature-based inference)
        t6 = time.time()
        risk = 0.05
        closest = "None"
        sim_score = 0.0
        xai_explanations = []
        
        if anomaly_clf is not None and scaler is not None and LIBRARY_FEATURES is not None:
            X_input_scaled = scaler.transform(features_df.values)
            
            # Anomaly Risk calculation
            score = anomaly_clf.decision_function(X_input_scaled)[0]
            risk = float(1.0 / (1.0 + np.exp(score)))
            
            # Similarity Calculation (Euclidean distance on scaled features)
            t7 = time.time()
            timings["anomaly"] = int((t7 - t6) * 1000)
            
            distances = np.linalg.norm(LIBRARY_FEATURES - X_input_scaled[0], axis=1)
            closest_idx = np.argmin(distances)
            min_dist = distances[closest_idx]
            sim_score = float(1.0 / (1.0 + min_dist))
            closest = f"asset_{closest_idx:04d}.jpg"
            
            t8 = time.time()
            timings["similarity"] = int((t8 - t7) * 1000)
            
            # XAI Explanation (Compare input features to library mean)
            library_mean = np.mean(LIBRARY_FEATURES, axis=0)
            diff = X_input_scaled[0] - library_mean
            for i, feat_name in enumerate(FEATURE_NAMES):
                # Only include top 5 most distinguishing features
                if abs(diff[i]) > 0.5:
                    xai_explanations.append({
                        "feature": feat_name,
                        "impact": round(float(diff[i]), 2),
                        "value": round(float(features_dict[feat_name]), 2)
                    })
            xai_explanations.sort(key=lambda x: abs(x["impact"]), reverse=True)
            xai_explanations = xai_explanations[:5]
            
            t9 = time.time()
            timings["xai"] = int((t9 - t8) * 1000)
            
        # 5. Decision Engine Recommendations
        t10 = time.time()
        recommendations = []
        if quality_prediction in ["Poor", "Average"]:
            recommendations.append("⚠ Optimize image")
        if features_dict.get('Resolution', 0) > 2000000 and features_dict.get('Compression', 0) > 0.5:
            recommendations.append("⚠ Generate WebP")
        if features_dict.get('AspectRatio', 1) > 1.2:
            recommendations.append("⚠ Generate 4:5 version")
        if risk > 0.8:
            recommendations.append("⚠ High anomaly detected")
        else:
            recommendations.append("✓ No anomaly detected")
        if sim_score > 0.95:
            recommendations.append(f"⚠ Possible duplicate of {closest}")
        else:
            recommendations.append("✓ No duplicate detected")
            
        t11 = time.time()
        timings["decision"] = int((t11 - t10) * 1000)

        # Ensure features are standard python types
        clean_features = {k: float(v) if isinstance(v, (np.float32, np.float64, float, int)) else v for k, v in features_dict.items()}
        
        # Build the exact JSON shape requested by the user
        response_payload = {
            "asset": {
                "filename": public_id.split('/')[-1] if '/' in public_id else public_id
            },
            "timings": timings,
            "features": clean_features,
            "quality": {
                "prediction": quality_prediction,
                "probabilities": probabilities_dict
            },
            "vision": {
                "classification": vision_result.get("predictions", []),
                "embedding_dimensions": vision_result.get("embedding_dimensions", 512),
                "embedding_preview": [float(x) for x in vision_result.get("embedding", [])[:4]]
            },
            "anomaly": {
                "risk": round(risk, 3)
            },
            "similarity": {
                "closest_asset": closest,
                "score": round(sim_score, 3)
            },
            "xai": xai_explanations,
            "decisions": recommendations
        }
        
        return {"intelligence": response_payload}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ml/vision/analyze")
async def analyze_vision(request: dict):
    """
    Computer Vision Studio endpoint
    """
    try:
        url = request.get("url", "")
        if not url:
            raise HTTPException(status_code=400, detail="Missing 'url'")
        result = vision_service.analyze(url)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class ClusterRequest(BaseModel):
    assets: List[Dict[str, Any]]
    n_clusters: Optional[int] = 4
    
class AnomalyRequest(BaseModel):
    assets: List[Dict[str, Any]]
    contamination: Optional[float] = 0.1

class VisionAnalyzeRequest(BaseModel):
    url: str
    asset_id: str

class HybridSimilarityRequest(BaseModel):
    url1: str
    url2: str

class VisualSearchRequest(BaseModel):
    url: str
    top_k: Optional[int] = 10

class FeedbackRequest(BaseModel):
    asset_id: str
    prediction: str
    is_correct: bool
    user_label: Optional[str] = None

@app.post("/api/ml/quality")
def predict_quality(req: PredictionRequest):
    if model is None:
        raise HTTPException(status_code=500, detail="ML Model not loaded")
        
    # 1. Extract Features
    features_dict = extract_features_from_url(req.url)
    
    # 2. Prepare for model
    feature_names = ['Resolution', 'AspectRatio', 'Brightness', 'Contrast', 'Sharpness', 'EdgeDensity', 'ColorVariance', 'Compression', 'Entropy']
    features_df = pd.DataFrame([features_dict], columns=feature_names)
    
    # 3. Predict Quality
    prediction = model.predict(features_df)[0]
    probabilities = model.predict_proba(features_df)[0]
    
    confidence = float(np.max(probabilities))
    
    # 4. Feature Importance Explanation
    global_importances = model.feature_importances_
    importance_pairs = [(name, float(importance)) for name, importance in zip(feature_names, global_importances)]
    importance_pairs.sort(key=lambda x: x[1], reverse=True)
    top_features = [{"name": name, "weight": weight} for name, weight in importance_pairs[:5]]
    
    # Map probabilities to classes
    prob_dict = {str(cls_name): float(prob) for cls_name, prob in zip(model.classes_, probabilities)}
    
    return {
        "prediction": prediction,
        "confidence": confidence,
        "features": features_dict,
        "probabilities": prob_dict,
        "explanation": top_features
    }

@app.post("/api/ml/hash")
def get_hashes(req: AssetHashRequest):
    hashes = compute_hashes(req.url)
    if hashes:
        return hashes
    raise HTTPException(status_code=400, detail="Could not compute hashes")

@app.post("/api/ml/similarity/group")
def group_similarity(req: SimilarityGroupRequest):
    groups = group_similar_assets(req.assets, req.threshold)
    return {"groups": groups}

@app.post("/api/ml/clustering")
def run_clustering(req: ClusterRequest):
    clusters = cluster_assets(req.assets, req.n_clusters)
    return {"clustered_assets": clusters}

@app.post("/api/ml/anomalies")
def find_anomalies(req: AnomalyRequest):
    anomalies = detect_anomalies(req.assets, req.contamination)
    return {"anomalies": anomalies}

@app.post("/api/ml/vision/analyze")
def analyze_vision(req: VisionAnalyzeRequest):
    if not VISION_ENABLED:
        raise HTTPException(status_code=501, detail="Vision ML is not enabled")
    
    result = analyze_image(req.url)
    if result:
        # Store embedding for visual search and PCA
        embedding_store[req.asset_id] = result['embedding']
        return result
    raise HTTPException(status_code=500, detail="Failed to process image")

@app.post("/api/ml/vision/hybrid_similarity")
def hybrid_similarity(req: HybridSimilarityRequest):
    if not VISION_ENABLED:
        raise HTTPException(status_code=501, detail="Vision ML is not enabled")
        
    hashes1 = compute_hashes(req.url1)
    hashes2 = compute_hashes(req.url2)
    
    if not hashes1 or not hashes2:
        raise HTTPException(status_code=500, detail="Could not fetch or hash images")
        
    sha256_match = hashes1['sha256'] == hashes2['sha256']
    phash_sim = compute_phash_similarity(hashes1['phash'], hashes2['phash'])
    
    v1 = analyze_image(req.url1)
    v2 = analyze_image(req.url2)
    
    if not v1 or not v2:
        raise HTTPException(status_code=500, detail="Could not compute DL embeddings")
        
    dl_sim = compute_cosine_similarity(v1['embedding'], v2['embedding'])
    
    hybrid_score = compute_hybrid_similarity(phash_sim, dl_sim, sha256_match)
    
    return {
        "exact_duplicate_match": sha256_match,
        "phash_similarity": phash_sim,
        "dl_similarity": dl_sim,
        "overall_visual_match": hybrid_score
    }

@app.post("/api/ml/vision/search")
def visual_search(req: VisualSearchRequest):
    if not VISION_ENABLED:
        raise HTTPException(status_code=501, detail="Vision ML is not enabled")
        
    target = analyze_image(req.url)
    if not target:
        raise HTTPException(status_code=500, detail="Failed to analyze target image")
        
    target_emb = target['embedding']
    results = []
    
    for asset_id, emb in embedding_store.items():
        sim = compute_cosine_similarity(target_emb, emb)
        results.append({"asset_id": asset_id, "similarity": sim})
        
    results.sort(key=lambda x: x['similarity'], reverse=True)
    return {"results": results[:req.top_k]}

@app.get("/api/ml/vision/pca")
def get_pca_embeddings():
    if not VISION_ENABLED:
        raise HTTPException(status_code=501, detail="Vision ML is not enabled")
        
    if len(embedding_store) < 2:
        return {"points": []}
        
    asset_ids = list(embedding_store.keys())
    embeddings = np.array([embedding_store[aid] for aid in asset_ids])
    
    # K-Means clusters for coloring
    from sklearn.cluster import KMeans
    n_clusters = min(4, len(embeddings))
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    clusters = kmeans.fit_predict(embeddings)
    
    # PCA to 2D
    pca = PCA(n_components=2)
    embeddings_2d = pca.fit_transform(embeddings)
    
    # Normalize to 0-1 range for easier UI rendering
    x_min, x_max = embeddings_2d[:, 0].min(), embeddings_2d[:, 0].max()
    y_min, y_max = embeddings_2d[:, 1].min(), embeddings_2d[:, 1].max()
    
    points = []
    for i in range(len(asset_ids)):
        x_norm = float((embeddings_2d[i, 0] - x_min) / (x_max - x_min + 1e-8))
        y_norm = float((embeddings_2d[i, 1] - y_min) / (y_max - y_min + 1e-8))
        points.append({
            "asset_id": asset_ids[i],
            "x": x_norm,
            "y": y_norm,
            "cluster": int(clusters[i])
        })
        
    return {"points": points}

@app.post("/api/ml/feedback")
def submit_feedback(req: FeedbackRequest):
    feedback_entry = {
        "asset_id": req.asset_id,
        "prediction": req.prediction,
        "is_correct": req.is_correct,
        "user_label": req.user_label,
        "timestamp": datetime.now().isoformat()
    }
    feedback_store.append(feedback_entry)
    
    # In a real app, save to a database or append to a CSV
    with open("human_feedback.json", "w") as f:
        json.dump(feedback_store, f)
        
    return {"status": "success", "message": "Feedback recorded"}

class TrainRequest(BaseModel):
    model_type: str
    dataset_type: Optional[str] = "synthetic"
    save: Optional[bool] = False

@app.post("/api/ml/train")
def train_model(req: TrainRequest):
    try:
        from dynamic_trainer import train_dynamic_model
        # We only have a synthetic generator for this demo, 
        # but in a real scenario dataset_type='real' would pull from human_feedback.json
        results = train_dynamic_model(req.model_type, save=req.save)
        return {"status": "success", "results": results}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ml/status")
def status():
    return {
        "status": "online", 
        "model_loaded": model is not None,
        "vision_enabled": VISION_ENABLED,
        "embeddings_indexed": len(embedding_store)
    }
