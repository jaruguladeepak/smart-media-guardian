import pandas as pd
from pydantic import BaseModel
from typing import List, Dict
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

class ClusterItem(BaseModel):
    id: str
    width: int
    height: int
    bytes: int
    format: str

class ClusterRequest(BaseModel):
    n_clusters: int = 5
    items: List[ClusterItem]

def process_clustering(request: ClusterRequest):
    if len(request.items) < request.n_clusters:
        return {"error": "Not enough items for clustering"}
        
    df = pd.DataFrame([
        {
            "id": item.id,
            "resolution": (item.width * item.height) / 1000000,
            "aspect_ratio": item.width / item.height if item.height > 0 else 1,
            "size_mb": item.bytes / 1000000
        }
        for item in request.items
    ])
    
    # Feature extraction and scaling
    X = df[["resolution", "aspect_ratio", "size_mb"]]
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Apply K-Means
    kmeans = KMeans(n_clusters=request.n_clusters, random_state=42)
    clusters = kmeans.fit_predict(X_scaled)
    
    # Organize results
    result = []
    for i in range(request.n_clusters):
        cluster_indices = [idx for idx, c in enumerate(clusters) if c == i]
        cluster_items = [df.iloc[idx]["id"] for idx in cluster_indices]
        
        # Determine cluster label heuristically based on cluster center
        center = kmeans.cluster_centers_[i]
        orig_center = scaler.inverse_transform([center])[0]
        
        # Simple heuristic naming for the hackathon
        res, aspect, size = orig_center
        label = "Standard Media"
        if aspect > 1.5: label = "Widescreen"
        elif aspect < 0.8: label = "Vertical / Mobile"
        elif size > 5.0: label = "High Res / Raw"
        elif size < 0.5: label = "Web Optimized"
        
        result.append({
            "cluster_id": i + 1,
            "label": f"Cluster {i+1}: {label}",
            "items": cluster_items,
            "count": len(cluster_items)
        })
        
    return result
