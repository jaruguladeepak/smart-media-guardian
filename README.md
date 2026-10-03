# MediaFlow AI 🚀

> **Intelligent Media Operations Platform built around Cloudinary**

MediaFlow AI automates the entire journey from raw media to optimized, organized, searchable, and shareable content. It demonstrates how Cloudinary can act as the backbone for an end-to-end enterprise media pipeline.

![MediaFlow AI Architecture](https://res.cloudinary.com/demo/image/upload/v1727786400/mediaflow-architecture.png)

## 🌟 The Problem
Modern teams upload thousands of raw assets. They struggle with:
1. **Unorganized Messes:** No one tags or organizes the assets.
2. **Unsafe Content:** Manual moderation is too slow.
3. **Unoptimized Delivery:** Serving massive 4K assets to mobile devices ruins SEO and UX.
4. **Scattered Workflows:** Tools for tagging, cropping, sharing, and analytics are completely disjointed.

## 🛠️ Our Solution
MediaFlow AI solves this by connecting Cloudinary's powerful APIs into a seamless operational flow:

### 1. Upload & Analyze (AI)
- **Upload:** Strict server-side validation ensures only valid media reaches your Cloudinary bucket.
- **AI Intelligence:** Media is immediately run through **Google Auto-Tagging** to extract semantic metadata.
- **Moderation:** Assets are automatically scanned via **WebPurify**; flagged items are sent to a dedicated Moderation Center.

### 2. Auto-Organization
- **Smart Collections:** AI tags automatically route media into virtual folders (e.g., `#Education`, `#Vehicles`), meaning zero manual organization is required.
- **Advanced Search:** Query your entire media library by combining AI tags, formats, moderation status, and custom metadata.

### 3. Transform & Optimize
- **Transform Studio:** An interactive studio to apply Cloudinary transformations (Smart Crop, Background Removal, Grayscale) with real-time Before/After comparisons.
- **Bulk Processing:** Apply presets to dozens of assets simultaneously.
- **Auto-Optimization:** Everything exported uses `f_auto,q_auto` to guarantee the most efficient delivery without sacrificing quality.

### 4. Share & Analyze
- **Public Galleries:** Turn any collection into a public-facing gallery with a single click.
- **Share Links:** Generate unique, expiring URLs for individual assets.
- **Analytics Dashboard:** Monitor system health, AI operation rates, and storage metrics in real-time.

---

## 🏗️ Technical Architecture

```text
                 MEDIAFLOW AI
                       │
          ┌────────────┴────────────┐
          │                         │
       CLOUDINARY                NEXT.JS
          │                         │
   ┌──────┼──────┐           ┌──────┼──────┐
   │      │      │           │      │      │
 Upload  AI     Transform   UI    State   APIs
   │    Tags       │
   │ Moderation    │
   │ Metadata      │
   │               │
   └───────┬───────┘
           │
       Organization
           │
   Search / Collections
           │
       Analytics
           │
        Export
           │
      Share / Gallery
```

### Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Media Engine:** Cloudinary (Upload API, Admin API, Transformations)
- **State Management:** Zustand (w/ Persistence layer)
- **Styling:** Tailwind CSS + Lucide Icons
- **Language:** TypeScript

---

## 🚀 Running Locally

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/smart-media-guardian.git
cd smart-media-guardian
npm install
```

### 2. Configure Cloudinary
Create a `.env.local` file in the root:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### 3. Run the Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`. Use the built-in **Demo Command Center** (in the sidebar) to walk through the complete hackathon flow.

---

## 🔒 Production Security Note
This app demonstrates enterprise security patterns:
- Cloudinary `API_SECRET` is strictly isolated to Next.js server-side API routes.
- File type and chunk size (`50MB`) limits are validated server-side.
- Robust UI fallback handling distinguishes between `LIVE` Cloudinary execution, missing `NOT CONFIGURED` add-ons, and local `DEMO` state.
