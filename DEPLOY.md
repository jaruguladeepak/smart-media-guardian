# MediaFlow AI — GitHub Push Instructions
# Run these commands in PowerShell from the project root

# Step 1: Go to https://github.com/new
# Create a new EMPTY repository (no README, no .gitignore, no license)
# Name it: smart-media-guardian
# Visibility: Public (required for free Render deployments)

# Step 2: Add the GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/smart-media-guardian.git

# Step 3: Push (the commit is already made — this just uploads it)
git push -u origin master

# ─────────────────────────────────────────────────────────
# After push is done, go to Render:
# ─────────────────────────────────────────────────────────
# 1. https://render.com → New → Web Service
# 2. Connect GitHub → select smart-media-guardian
# 3. Settings:
#    Name:           mediaflow-ai-ml
#    Root Directory: python-ml-service
#    Runtime:        Docker
#    Port:           8000
# 4. Click "Create Web Service"
# 5. Wait for build (10-20 mins for PyTorch install)
# 6. Copy the URL: https://mediaflow-ai-ml.onrender.com

# ─────────────────────────────────────────────────────────
# Then verify the Render backend:
# ─────────────────────────────────────────────────────────
# python python-ml-service/verify_deployment.py https://mediaflow-ai-ml.onrender.com

# ─────────────────────────────────────────────────────────
# Then deploy Next.js to Vercel:
# ─────────────────────────────────────────────────────────
# 1. https://vercel.com → New Project → Import from GitHub
# 2. Select smart-media-guardian
# 3. Environment Variables:
#    ML_API_URL             = https://mediaflow-ai-ml.onrender.com
#    NEXT_PUBLIC_ML_API_URL = https://mediaflow-ai-ml.onrender.com
#    (+ your existing CLOUDINARY vars)
# 4. Click Deploy
