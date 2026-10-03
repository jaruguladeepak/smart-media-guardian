import cv2
import numpy as np
import requests
import io
import pandas as pd
import joblib

FEATURE_NAMES = ['Resolution', 'AspectRatio', 'Brightness', 'Contrast', 'Sharpness', 'EdgeDensity', 'ColorVariance', 'Compression', 'Entropy']
model = joblib.load("quality_model.joblib")

# We will patch extract_features_from_url to accept an image array directly for this test
def extract_features(img, file_size_bytes):
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

def run_pipeline(name, img, file_size):
    features = extract_features(img, file_size)
    features_df = pd.DataFrame([features], columns=FEATURE_NAMES)
    pred = model.predict(features_df)[0]
    probs = model.predict_proba(features_df)[0]
    conf = float(np.max(probs))
    
    features["Prediction"] = pred
    features["Confidence"] = f"{conf * 100:.1f}%"
    features["Name"] = name
    return features

results = []

# IMAGE A: High-resolution, sharp
url_a = "https://picsum.photos/id/237/1920/1080"
resp_a = requests.get(url_a)
img_a = cv2.imdecode(np.asarray(bytearray(resp_a.content), dtype=np.uint8), cv2.IMREAD_COLOR)
results.append(run_pipeline("Image A (1920x1080)", img_a, len(resp_a.content)))

# IMAGE B: Medium-quality image (800x600)
url_b = "https://picsum.photos/id/237/800/600"
resp_b = requests.get(url_b)
img_b = cv2.imdecode(np.asarray(bytearray(resp_b.content), dtype=np.uint8), cv2.IMREAD_COLOR)
results.append(run_pipeline("Image B (800x600)", img_b, len(resp_b.content)))

# IMAGE C: Deliberately degraded image (400x300, JPEG Q10, Blurred)
url_c = "https://picsum.photos/id/237/400/300"
resp_c = requests.get(url_c)
img_c = cv2.imdecode(np.asarray(bytearray(resp_c.content), dtype=np.uint8), cv2.IMREAD_COLOR)
# Degrade it
img_c = cv2.GaussianBlur(img_c, (15, 15), 0)
_, buf_c = cv2.imencode('.jpg', img_c, [int(cv2.IMWRITE_JPEG_QUALITY), 10])
img_c_degraded = cv2.imdecode(buf_c, cv2.IMREAD_COLOR)
results.append(run_pipeline("Image C (Degraded)", img_c_degraded, len(buf_c)))

# Output table
df = pd.DataFrame(results)
cols = ['Name', 'Prediction', 'Confidence', 'Resolution', 'Brightness', 'Contrast', 'Sharpness', 'Entropy', 'Compression']
df = df[cols]
print(df.to_markdown(index=False))
