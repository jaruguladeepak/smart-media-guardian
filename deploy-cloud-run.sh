#!/bin/bash
# ─────────────────────────────────────────────────────────────
# MediaFlow AI — Google Cloud Run Deployment Script
# Run this from the repo root after installing gcloud CLI:
# https://cloud.google.com/sdk/docs/install
# ─────────────────────────────────────────────────────────────

set -e  # Exit on any error

# ── CONFIG ── Edit these before running ──────────────────────
PROJECT_ID="your-gcp-project-id"          # Your GCP project ID
REGION="us-central1"                       # Cloud Run region
SERVICE_NAME="mediaflow-ml-api"            # Name of the Cloud Run service
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"
# ─────────────────────────────────────────────────────────────

echo "==> Authenticating with Google Cloud..."
gcloud auth configure-docker

echo "==> Building Docker image..."
docker build -t "$IMAGE_NAME" ./python-ml-service

echo "==> Pushing image to Google Container Registry..."
docker push "$IMAGE_NAME"

echo "==> Deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
  --image "$IMAGE_NAME" \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --port 8000 \
  --memory 2Gi \
  --cpu 2 \
  --timeout 120 \
  --project "$PROJECT_ID"

echo ""
echo "==> Deployment complete!"
echo "==> Your Cloud Run URL:"
gcloud run services describe "$SERVICE_NAME" \
  --region "$REGION" \
  --project "$PROJECT_ID" \
  --format "value(status.url)"

echo ""
echo "==> Next: Set this URL in Vercel as:"
echo "    ML_API_URL=<url above>"
echo "    NEXT_PUBLIC_ML_API_URL=<url above>"
