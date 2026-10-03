from .vision import vision_service
from .quality import quality_service
import time

class IntelligencePipeline:
    def process_asset(self, asset_data: dict) -> dict:
        """
        Main orchestrator that runs the asset through the entire intelligence pipeline.
        """
        start_time = time.time()
        url = asset_data.get('secure_url', '')
        
        # 1. Feature Extraction & Vision
        vision_results = vision_service.extract_features(url)
        
        # 2. Quality Prediction
        quality_results = quality_service.predict_quality(vision_results)
        
        # 3. Decision Engine Logic
        recommendation = "Keep Original"
        if quality_results['quality_category'] == 'POOR':
            recommendation = "Optimize Quality"
            
        end_time = time.time()
        
        return {
            "asset_id": asset_data.get('public_id', 'unknown'),
            "intelligence_report": {
                "vision": vision_results,
                "quality": quality_results,
                "decision": recommendation,
                "processing_time_ms": int((end_time - start_time) * 1000)
            }
        }

pipeline = IntelligencePipeline()
