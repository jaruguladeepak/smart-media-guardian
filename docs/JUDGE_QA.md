# ❓ Potential Judge Q&A

**Q: How are you ensuring security with the Cloudinary API?**
**A:** "We enforce a strict server-side architecture. The Next.js UI never talks to Cloudinary directly for write operations. Instead, we have server-side API routes (`/api/upload`, `/api/analyze`) that securely hold our `CLOUDINARY_API_SECRET`. Furthermore, we validate mime types and enforce a 50MB file size limit before the upload stream even begins."

**Q: If your account doesn't have the Google Vision / WebPurify add-ons, how did you build this?**
**A:** "Great question! We built a robust fallback architecture. Our API attempts the live Cloudinary explicit analysis call. If it detects a 'subscription required' error, it smoothly falls back to a simulated mock response while tagging the result as `NOT_CONFIGURED` in the UI. This proves the integration logic works while gracefully handling account tier limits."

**Q: What is the primary value proposition over just using Cloudinary's built-in Media Library?**
**A:** "Cloudinary's dashboard is built for developers. MediaFlow AI is built for *operational teams* (marketing, content moderators, editors). We abstract the complex URL parameters (`c_fill, g_auto, f_auto`) into an intuitive UI, automate the organization via Smart Collections, and wrap it in a sharing and analytics layer."

**Q: How are you handling state and persistence?**
**A:** "We use Zustand with its `persist` middleware mapped to localStorage. This acts as our instant, lightweight database for the hackathon, ensuring that all our metadata, collections, and activity logs survive page refreshes and simulate a true database experience perfectly."

**Q: What was the hardest technical challenge?**
**A:** "Bridging the asynchronous nature of AI analysis with a snappy user interface. We built a 'Processing Queue' and Notification Center to handle operations asynchronously. When an upload finishes, the UI instantly reflects it, but the heavy AI tagging and moderation run in the background, pinging the Notification Bell when complete."
