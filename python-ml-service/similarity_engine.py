import imagehash
from PIL import Image
import hashlib
import requests
import io
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import IsolationForest

def download_image(url: str) -> Image.Image:
    response = requests.get(url)
    response.raise_for_status()
    return Image.open(io.BytesIO(response.content))

def compute_hashes(url: str):
    try:
        response = requests.get(url)
        response.raise_for_status()
        content = response.content
        
        # 1. Exact Duplicate (SHA-256)
        sha256_hash = hashlib.sha256(content).hexdigest()
        
        # 2. Perceptual Hash
        img = Image.open(io.BytesIO(content))
        phash_val = str(imagehash.phash(img))
        
        return {
            "sha256": sha256_hash,
            "phash": phash_val
        }
    except Exception as e:
        print(f"Error computing hashes for {url}: {e}")
        return None

def hex_to_hash(hexstr):
    return imagehash.hex_to_hash(hexstr)

def compute_similarity(hash1_str: str, hash2_str: str) -> float:
    # Hamming distance between two hex phash strings
    h1 = hex_to_hash(hash1_str)
    h2 = hex_to_hash(hash2_str)
    
    # Maximum difference for a 64-bit hash (8x8) is 64
    diff = h1 - h2
    similarity = 1.0 - (diff / 64.0)
    return max(0.0, similarity)

def group_similar_assets(assets, threshold=0.90):
    """
    assets is a list of dicts: [{'id': 1, 'url': '...', 'phash': '...'}, ...]
    Returns list of groups: [[asset1, asset2], [asset3], ...]
    """
    groups = []
    visited = set()
    
    for i, asset1 in enumerate(assets):
        if i in visited:
            continue
            
        current_group = [asset1]
        visited.add(i)
        
        for j, asset2 in enumerate(assets):
            if j in visited:
                continue
                
            sim = compute_similarity(asset1['phash'], asset2['phash'])
            if sim >= threshold:
                # Add similarity score relative to the first item in group
                asset2_copy = dict(asset2)
                asset2_copy['similarity_to_lead'] = sim
                current_group.append(asset2_copy)
                visited.add(j)
                
        # First asset gets 1.0 similarity
        asset1_copy = dict(asset1)
        asset1_copy['similarity_to_lead'] = 1.0
        current_group[0] = asset1_copy
        
        groups.append(current_group)
        
    return groups

# Phase 3: Clustering
def cluster_assets(features_list, n_clusters=4):
    """
    features_list: [{'id': 1, 'features': {'Resolution': 1000, ...}}, ...]
    """
    if len(features_list) < n_clusters:
        n_clusters = max(1, len(features_list))
        
    feature_matrix = []
    keys = list(features_list[0]['features'].keys())
    
    for item in features_list:
        row = [item['features'][k] for k in keys]
        feature_matrix.append(row)
        
    X = np.array(feature_matrix)
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init='auto')
    clusters = kmeans.fit_predict(X_scaled)
    
    results = []
    for i, item in enumerate(features_list):
        item_copy = dict(item)
        item_copy['cluster'] = int(clusters[i])
        results.append(item_copy)
        
    return results

# Phase 4: Anomaly Detection
def detect_anomalies(features_list, contamination=0.1):
    """
    features_list: [{'id': 1, 'features': {'Resolution': 1000, ...}}, ...]
    """
    if len(features_list) < 5:
        return [] # Too few to find meaningful anomalies
        
    feature_matrix = []
    keys = list(features_list[0]['features'].keys())
    
    for item in features_list:
        row = [item['features'][k] for k in keys]
        feature_matrix.append(row)
        
    X = np.array(feature_matrix)
    
    clf = IsolationForest(random_state=42, contamination=contamination)
    predictions = clf.fit_predict(X) # -1 is anomaly, 1 is normal
    scores = clf.decision_function(X) # lower is more anomalous
    
    anomalies = []
    for i, item in enumerate(features_list):
        if predictions[i] == -1:
            anomaly_info = dict(item)
            # convert score to a 0-1 scale where 1 is highly anomalous
            # decision_function returns negative values for anomalies
            score_normalized = 1.0 / (1.0 + np.exp(scores[i])) # sigmoid to 0-1 range
            
            # Find the most unusual features by computing z-scores
            z_scores = np.abs((X[i] - np.mean(X, axis=0)) / (np.std(X, axis=0) + 1e-8))
            top_feature_idx = np.argsort(z_scores)[::-1][:3] # top 3 most unusual features
            
            unusual_properties = []
            for idx in top_feature_idx:
                feat_name = keys[idx]
                feat_val = X[i, idx]
                median_val = np.median(X[:, idx])
                
                if median_val > 0:
                    ratio = feat_val / median_val
                    if ratio > 1:
                        unusual_properties.append(f"{feat_name} {ratio:.1f}x higher than median")
                    else:
                        unusual_properties.append(f"{feat_name} {1/ratio:.1f}x lower than median")
                else:
                    unusual_properties.append(f"Unusual {feat_name}")
            
            anomaly_info['anomaly_score'] = float(score_normalized)
            anomaly_info['unusual_properties'] = unusual_properties
            anomalies.append(anomaly_info)
            
    # Sort by highest anomaly score
    anomalies.sort(key=lambda x: x['anomaly_score'], reverse=True)
    return anomalies
