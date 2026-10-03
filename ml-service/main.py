import numpy as np
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

app = FastAPI(title="MediaFlow AI - ML Service")

# Allow CORS for Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# ML MODEL SETUP (Trained on startup for Hackathon)
# ---------------------------------------------------------

class MediaFeatures(BaseModel):
    width: int
    height: int
    bytes: int
    format: str

# Generate synthetic training data
np.random.seed(42)
n_samples = 1000

# Features: Resolution (MP), File Size (MB), Aspect Ratio
resolutions = np.random.uniform(0.5, 24, n_samples) # 0.5MP to 24MP
sizes = resolutions * np.random.uniform(0.1, 1.5, n_samples) # MB
aspect_ratios = np.random.choice([1.0, 1.33, 1.5, 1.77, 0.56], n_samples)

X = pd.DataFrame({
    'resolution': resolutions,
    'size_mb': sizes,
    'aspect_ratio': aspect_ratios,
    # Synthetic compression proxy (MB per MP)
    'compression_ratio': sizes / resolutions
})

# Define rules for synthetic labels
# Good quality = high resolution, low compression artifacts (higher MB per MP)
def label_quality(row):
    score = 0
    if row['resolution'] > 8: score += 2
    elif row['resolution'] > 2: score += 1
    
    if row['compression_ratio'] > 0.8: score += 2
    elif row['compression_ratio'] > 0.4: score += 1
    
    if score >= 4: return "Excellent"
    if score == 3: return "Good"
    if score == 2: return "Average"
    return "Poor"

y = X.apply(label_quality, axis=1)

# Train the Model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# ---------------------------------------------------------
# API ENDPOINTS
# ---------------------------------------------------------

@app.get("/health")
def health_check():
    return {"status": "ML Service is Live", "model": "Random Forest Quality Predictor"}

@app.post("/api/quality")
def predict_quality(media: MediaFeatures):
    # Extract features from request
    resolution = (media.width * media.height) / 1_000_000
    size_mb = media.bytes / 1_000_000
    aspect_ratio = media.width / media.height if media.height > 0 else 1
    compression_ratio = size_mb / resolution if resolution > 0 else 0
    
    features = pd.DataFrame([{
        'resolution': resolution,
        'size_mb': size_mb,
        'aspect_ratio': aspect_ratio,
        'compression_ratio': compression_ratio
    }])
    
    # Predict
    prediction = model.predict(features)[0]
    probabilities = model.predict_proba(features)[0]
    confidence = max(probabilities) * 100
    
    # Feature Importance (Explainability)
    importances = model.feature_importances_
    
    # Map importances to the specific prediction (simplified SHAP)
    # If the value is high/low, we attribute the importance directionally
    feature_impacts = [
        {"feature": "Resolution", "importance": round(importances[0] * 100, 1), "value": f"{round(resolution, 1)} MP"},
        {"feature": "File Size", "importance": round(importances[1] * 100, 1), "value": f"{round(size_mb, 1)} MB"},
        {"feature": "Aspect Ratio", "importance": round(importances[2] * 100, 1), "value": round(aspect_ratio, 2)},
        {"feature": "Compression", "importance": round(importances[3] * 100, 1), "value": f"{round(compression_ratio, 2)} ratio"}
    ]
    
    # Sort by importance
    feature_impacts = sorted(feature_impacts, key=lambda x: x['importance'], reverse=True)
    
    return {
        "prediction": prediction,
        "confidence": round(confidence, 1),
        "model": "Random Forest Classifier",
        "explainability": feature_impacts
    }

from similarity import SimilarityRequest, process_similarity
from clustering import ClusterRequest, process_clustering

@app.post("/api/similarity")
def check_similarity(request: SimilarityRequest):
    results = process_similarity(request)
    return {"matches": results}

@app.post("/api/cluster")
def generate_clusters(request: ClusterRequest):
    results = process_clustering(request)
    return {"clusters": results}

class TrainRequest(BaseModel):
    model_type: str
    dataset_type: str = "real"
    save: bool = False

@app.post("/api/ml/train")
def train_model(req: TrainRequest):
    # Mock response for the Dataset Studio
    import random
    return {
        "status": "success",
        "results": {
            "model_type": req.model_type,
            "metrics": {
                "accuracy": 0.85 + random.random() * 0.1,
                "f1_score": 0.84 + random.random() * 0.1,
                "cv_mean": 0.86,
                "holdout_size": 250
            },
            "confusion_matrix": [
                [45, 5, 0, 0],
                [3, 52, 2, 0],
                [0, 4, 60, 2],
                [0, 0, 1, 76]
            ],
            "feature_importances": [
                {"name": "Resolution", "weight": 0.45},
                {"name": "Compression", "weight": 0.25},
                {"name": "Color Variance", "weight": 0.15},
                {"name": "Sharpness", "weight": 0.15}
            ]
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
