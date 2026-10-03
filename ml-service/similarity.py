import numpy as np
from pydantic import BaseModel
from typing import List

# Simple perceptual hash (pHash) simulation for hackathon
# In reality, you'd use ImageHash or OpenCV on the actual image bytes.
def generate_phash(width: int, height: int, size_bytes: int, format: str) -> str:
    # A fake deterministic hash based on metadata
    seed = (width * 13) ^ (height * 17) ^ (size_bytes * 19) + sum(ord(c) for c in format)
    np.random.seed(seed % (2**32))
    # 64-bit binary hash string
    return "".join([str(i) for i in np.random.randint(0, 2, 64)])

def hamming_distance(hash1: str, hash2: str) -> int:
    return sum(c1 != c2 for c1, c2 in zip(hash1, hash2))

def similarity_percentage(hash1: str, hash2: str) -> float:
    dist = hamming_distance(hash1, hash2)
    # 64 bits total. 0 dist = 100%, 64 dist = 0%
    return round((1 - (dist / 64)) * 100, 1)

class MediaItem(BaseModel):
    id: str
    width: int
    height: int
    bytes: int
    format: str

class SimilarityRequest(BaseModel):
    target: MediaItem
    library: List[MediaItem]

def process_similarity(request: SimilarityRequest):
    target_hash = generate_phash(request.target.width, request.target.height, request.target.bytes, request.target.format)
    
    results = []
    for item in request.library:
        if item.id == request.target.id:
            continue
            
        item_hash = generate_phash(item.width, item.height, item.bytes, item.format)
        sim = similarity_percentage(target_hash, item_hash)
        
        # Artificial bump for identical dimensions/sizes to fake "same image" for demo
        if item.width == request.target.width and item.height == request.target.height:
            sim = min(100.0, sim + 40.0)
            
        if sim > 50: # Only return somewhat similar items
            results.append({
                "id": item.id,
                "similarity": sim
            })
            
    # Sort descending
    results = sorted(results, key=lambda x: x["similarity"], reverse=True)
    return results
