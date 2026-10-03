import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import requests
import io
import json
import urllib.request
import os

# Initialize device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load pre-trained ResNet18 model
model = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1)
model = model.to(device)
model.eval()

# We need the 512D embeddings before the final classification layer
# The 'fc' layer is the final fully connected layer in ResNet18
# We can create a feature extractor by replacing it with an Identity layer, 
# or just hooking into it.
embedding_layer = torch.nn.Sequential(*(list(model.children())[:-1]))
embedding_layer = embedding_layer.to(device)
embedding_layer.eval()

# Preprocessing transforms
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Load ImageNet labels
LABELS_URL = "https://raw.githubusercontent.com/anishathalye/imagenet-simple-labels/master/imagenet-simple-labels.json"
imagenet_labels = []

def load_labels():
    global imagenet_labels
    if not imagenet_labels:
        try:
            if not os.path.exists("imagenet_labels.json"):
                urllib.request.urlretrieve(LABELS_URL, "imagenet_labels.json")
            with open("imagenet_labels.json") as f:
                imagenet_labels = json.load(f)
        except Exception as e:
            print("Failed to load ImageNet labels:", e)

load_labels()

def download_image(url: str) -> Image.Image:
    response = requests.get(url)
    response.raise_for_status()
    # Convert to RGB to ensure 3 channels
    return Image.open(io.BytesIO(response.content)).convert("RGB")

def analyze_image(url: str):
    """
    Downloads image, runs through ResNet18 to get:
    1. Top classifications
    2. 512D embedding
    """
    try:
        img = download_image(url)
        input_tensor = preprocess(img)
        input_batch = input_tensor.unsqueeze(0).to(device) # Create a mini-batch as expected by the model

        with torch.no_grad():
            # Get classification predictions
            output = model(input_batch)
            probabilities = torch.nn.functional.softmax(output[0], dim=0)
            
            # Get Top 5 predictions
            top5_prob, top5_catid = torch.topk(probabilities, 5)
            
            predictions = []
            for i in range(top5_prob.size(0)):
                cat_id = top5_catid[i].item()
                label = imagenet_labels[cat_id] if imagenet_labels and cat_id < len(imagenet_labels) else f"Category {cat_id}"
                predictions.append({
                    "label": label.capitalize(),
                    "confidence": float(top5_prob[i].item())
                })
            
            # Get 512D embeddings
            embedding = embedding_layer(input_batch)
            embedding_vector = embedding.squeeze().cpu().numpy().tolist()
            
            return {
                "predictions": predictions,
                "embedding": embedding_vector,
                "embedding_dimensions": len(embedding_vector)
            }
            
    except Exception as e:
        print(f"Error in vision analysis for {url}: {e}")
        return None

def compute_cosine_similarity(vec1, vec2):
    """Compute cosine similarity between two vectors"""
    import numpy as np
    v1 = np.array(vec1)
    v2 = np.array(vec2)
    
    if np.linalg.norm(v1) == 0 or np.linalg.norm(v2) == 0:
        return 0.0
        
    return float(np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2)))

def compute_hybrid_similarity(phash_sim: float, dl_sim: float, sha256_match: bool) -> float:
    """
    Combines exact match, perceptual hash similarity, and DL embedding similarity.
    Methodology:
    - If exact match, 100%
    - DL embeddings capture semantic meaning (e.g. "a dog" vs "a cat").
    - pHash captures structural/visual composition (e.g. cropped version of the same image).
    We weigh them based on what "similar" means in this context. 
    A 60/40 split towards DL embeddings usually gives better semantic matches.
    """
    if sha256_match:
        return 1.0
        
    # Example weighting: 60% DL (Semantic), 40% pHash (Structural)
    combined = (dl_sim * 0.6) + (phash_sim * 0.4)
    return combined
