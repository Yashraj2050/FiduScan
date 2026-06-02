# FiduScan FAQ

## General Questions

**Q: Does FiduScan store my uploaded files?**
A: No. We operate on a strict zero-retention policy. Your files are processed entirely in memory and are securely deleted the moment the inference completes. Only the scan metadata and cryptographic hash are saved to your History log.

**Q: What types of AI generation can FiduScan detect?**
A: FiduScan is trained to detect outputs from major generative models including Midjourney, DALL-E, Stable Diffusion (for images), ElevenLabs, generic vocoders (for audio), and various deepfake/face-swapping algorithms (for video).

**Q: Why does the system say my real photo is "Suspicious"?**
A: Heavy editing, heavy JPEG compression, or extreme lighting modifications (like aggressive Photoshop smoothing) can sometimes mimic the artifacts left behind by generative AI. "Suspicious" means anomalies were detected, but not enough to definitively label it as AI-generated.

## Accounts & Billing

**Q: Can I upgrade my plan later?**
A: Yes! You can seamlessly upgrade or downgrade your plan at any time through the **Settings > Billing** dashboard.

**Q: What happens if I hit my usage limit?**
A: Once you exhaust your monthly quota for a specific modality (e.g., Image scans), the system will block further uploads for that modality until your billing cycle resets or you upgrade your plan.

**Q: Do failed scans count against my limit?**
A: No. If a file is rejected during the upload validation phase (e.g., invalid format or size), or if the backend encounters a processing error, your usage limit will not be decremented.

## Technical Questions

**Q: How do I use the API?**
A: Navigate to the **Developer Portal**, generate an API key, and include it in the `Authorization: Bearer <your_key>` header of your HTTP requests. Full API documentation is available within the portal.

**Q: Why is my API key hidden?**
A: For security reasons, API keys are hashed securely (using SHA-256) before they are stored in our database. Since we do not store the plaintext key, we cannot show it to you again after it is generated. If you lose your key, simply revoke it and generate a new one.

**Q: What is a Grad-CAM heatmap?**
A: Grad-CAM (Gradient-weighted Class Activation Mapping) is a visual explanation technique. For images, it overlays a "heatmap" showing exactly which pixels the neural network focused on when making its decision. Red/hot areas indicate strong AI artifacts.
