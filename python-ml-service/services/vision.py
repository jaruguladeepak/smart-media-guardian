import random
import time
from typing import Dict, Any

class VisionService:
    def __init__(self):
        self.model_name = "resnet50_v2"
        self.embedding_dim = 512
        
    def analyze(self, image_url: str) -> Dict[str, Any]:
        """
        Expanded Computer Vision tasks as requested in MediaFlow AI 4.0
        """
        # Simulate processing delay
        time.sleep(0.6)
        
        # Generate synthetic 512D embedding
        embedding = [round(random.uniform(-1.0, 1.0), 4) for _ in range(self.embedding_dim)]
        
        objects = random.sample(["person", "car", "dog", "laptop", "tree", "coffee_cup"], k=random.randint(1, 4))
        has_face = "person" in objects
        faces = [{"box": [10, 20, 50, 60], "confidence": 0.98}] if has_face else []
        
        return {
            "objects": [{"label": obj, "confidence": round(random.uniform(0.7, 0.99), 2)} for obj in objects],
            "classification": {
                "label": "indoor" if "laptop" in objects else "outdoor",
                "confidence": 0.92
            },
            "ocr": {
                "text": "MediaFlow 2026" if random.random() > 0.8 else "",
                "confidence": 0.85
            },
            "quality": {
                "blur_score": round(random.uniform(0.1, 0.9), 2),
                "brightness": round(random.uniform(0.3, 0.8), 2),
                "aesthetic_score": random.randint(40, 95)
            },
            "faces": faces,
            "embedding": embedding,
            "caption": f"A view showing {' and '.join(objects[:2])}" if objects else "Abstract view",
            "model_used": self.model_name
        }
        
    def extract_features(self, image_url: str) -> Dict[str, Any]:
        """Legacy wrapper for pipeline.py compatibility"""
        res = self.analyze(image_url)
        return {
            "embedding": res["embedding"],
            "detected_objects": [obj["label"] for obj in res["objects"]],
            "scene_classification": res["classification"]["label"],
            "model_used": res["model_used"]
        }

vision_service = VisionService()
