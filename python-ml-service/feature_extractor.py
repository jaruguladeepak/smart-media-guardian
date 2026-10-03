import cv2
import numpy as np
import requests
import io
import os

def extract_features_from_url(url: str):
    try:
        # Download image
        resp = requests.get(url)
        resp.raise_for_status()
        image_array = np.asarray(bytearray(resp.content), dtype=np.uint8)
        img = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
        
        if img is None:
            raise ValueError("Could not decode image")

        # Convert to grayscale for some features
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # 1. Resolution
        height, width = img.shape[:2]
        resolution = width * height
        
        # 2. Aspect Ratio
        aspect_ratio = width / float(height) if height > 0 else 1.0
        
        # 3. Brightness (normalized 0-1)
        brightness = np.mean(gray) / 255.0
        
        # 4. Contrast (normalized 0-1)
        contrast = np.std(gray) / 128.0 # Rough normalization
        contrast = min(contrast, 1.0)
        
        # 5. Sharpness (Laplacian variance)
        laplacian = cv2.Laplacian(gray, cv2.CV_64F)
        sharpness = np.var(laplacian) / 5000.0 # scale down for our model
        sharpness = min(sharpness, 1.0)
        
        # 6. Edge Density (Canny)
        edges = cv2.Canny(gray, 100, 200)
        edge_density = np.sum(edges > 0) / float(resolution)
        
        # 7. Color Variance
        b, g, r = cv2.split(img)
        color_variance = (np.var(b) + np.var(g) + np.var(r)) / (3 * (128**2))
        color_variance = min(color_variance, 1.0)
        
        # 8. Compression (Estimate from file size vs resolution)
        file_size_bytes = len(resp.content)
        # raw uncompressed size: resolution * 3 bytes
        compression_ratio = file_size_bytes / float(resolution * 3)
        # Invert so higher compression factor = more compressed
        compression_feature = 1.0 - min(compression_ratio * 10, 1.0)
        
        # 9. Entropy
        hist = cv2.calcHist([gray], [0], None, [256], [0, 256])
        hist = hist.ravel() / hist.sum()
        logs = np.log2(hist + 1e-7)
        entropy = -1 * (hist * logs).sum()
        
        return {
            'Resolution': resolution,
            'AspectRatio': aspect_ratio,
            'Brightness': brightness,
            'Contrast': contrast,
            'Sharpness': sharpness,
            'EdgeDensity': edge_density,
            'ColorVariance': color_variance,
            'Compression': compression_feature,
            'Entropy': entropy
        }
    except Exception as e:
        print(f"Error extracting features: {e}")
        # Return fallback features if extraction fails (e.g. for video URLs currently unsupported)
        return {
            'Resolution': 1920*1080,
            'AspectRatio': 1.77,
            'Brightness': 0.5,
            'Contrast': 0.5,
            'Sharpness': 0.5,
            'EdgeDensity': 0.1,
            'ColorVariance': 0.5,
            'Compression': 0.5,
            'Entropy': 5.0
        }
