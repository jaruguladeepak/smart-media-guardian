FROM python:3.10-slim

WORKDIR /app

# Install system dependencies required by OpenCV and PyTorch
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgl1-mesa-glx \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Install Python dependencies
# torch/torchvision are large; install CPU-only builds to reduce image size
RUN pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu
RUN pip install --no-cache-dir -r requirements.txt

# Copy only the inference-required files (no training scripts or venv)
COPY main.py .
COPY feature_extractor.py .
COPY similarity_engine.py .
COPY vision_service.py .
COPY quality_model.joblib .
COPY media_features.csv .
COPY imagenet_labels.json .
COPY services/ ./services/

# Set torch hub cache dir to avoid re-downloading ResNet weights on every restart
ENV TORCH_HOME=/app/.torch
RUN mkdir -p /app/.torch

EXPOSE 8000

# Bind to 0.0.0.0 so the container port is accessible from outside
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
