# FiduScan User Guide

Welcome to FiduScan! This comprehensive guide will walk you through everything you need to know to use our AI Forensic Detection System effectively.

## 1. Introduction
**What is FiduScan?**
FiduScan is a state-of-the-art Anti-Gravity forensic system built to detect AI-generated and manipulated media. By utilizing advanced neural networks (such as EfficientNet-B0) and multimodal analysis engines, FiduScan can analyze images, audio recordings, and video files to determine their authenticity with cryptographic certainty.

## 2. Account Creation
To get started:
1. Navigate to the FiduScan homepage.
2. Click **Sign Up** in the top navigation bar.
3. Enter your email address and create a secure password.
4. Verify your email address by clicking the link sent to your inbox.
5. You will automatically be enrolled in the Free Tier upon successful registration.

## 3. Login
1. Click **Sign In** from the homepage.
2. Enter your registered email and password.
3. You will be redirected to the main Scanner Dashboard. FiduScan uses secure JSON Web Tokens (JWT) to keep your session authenticated securely.

## 4. Image Analysis
1. Select the **Image** tab on the Scanner Dashboard.
2. Drag and drop any supported image file (JPEG, PNG, WEBP, BMP) into the drop zone, or click to upload.
3. The system will process the image for compression artifacts, digital noise, and structural anomalies.
4. Within seconds, a detailed result card will appear along with EXIF metadata extraction and Grad-CAM heatmaps (where applicable).

## 5. Audio Analysis
1. Select the **Audio** tab on the Scanner Dashboard.
2. Upload a supported audio file (WAV, MP3, M4A).
3. The backend will convert the audio into a Log-Mel Spectrogram and analyze it for vocoder artifacts and synthetic generation signatures.
4. The result card will display the confidence score of the audio's authenticity.

## 6. Video Analysis
1. Select the **Video** tab on the Scanner Dashboard.
2. Upload a supported video file (MP4, MOV, AVI, MKV).
3. FiduScan will extract keyframes and audio tracks, analyzing both in parallel.
4. The system aggregates the frame, temporal, and audio scores to provide a single, unified prediction.

## 7. Understanding Results
When an analysis completes, you will receive a Result Card containing the following metrics:
- **Confidence Score:** A percentage (e.g., 98%) indicating how certain the neural network is of its prediction.
- **Risk Meter:** A visual indicator showing the overall risk level of the file.
- **Likely Fake / AI Generated:** The system is highly confident (>80%) the media was generated or heavily manipulated by AI.
- **Suspicious:** The system detects anomalies but cannot definitively classify it as AI-generated. Human review is recommended.
- **Likely Real / Authentic:** The system found no significant traces of AI generation. 

## 8. Scan History
Access the **History** tab from the main navigation to view a log of your past scans. You can filter by modality (Image, Audio, Video) or by result type. Each entry includes a cryptographic ID, timestamp, and the final prediction.

## 9. Developer Portal
For programmatic access, navigate to **Settings > Developer Portal**.
Here, you can generate a secure API key to authenticate requests against our REST API. Keys are cryptographically hashed; make sure to copy your key immediately, as it will never be shown again.

## 10. Billing Dashboard
Under **Settings > Billing**, you can manage your subscription. This dashboard tracks your usage (Image, Audio, and Video scans) against your plan limits.

## 11. Subscription Plans
- **Free:** Perfect for casual users. Includes basic limits (e.g., 100 images, 10 audio, 5 video scans per month).
- **Pro:** Built for professionals. Higher throughput and limits.
- **Enterprise:** Designed for trust & safety teams. Massive scale, dedicated SLAs, and priority processing.

## 12. Troubleshooting
- **File too large:** Ensure your file falls under the upload limits (20MB for Image/Audio, 50MB for Video).
- **Limit Reached:** If you see a "Payment Required" or "Limit Reached" error, visit the Billing Dashboard to upgrade your plan.
- **System Error:** If the scanner gets stuck, try refreshing the page or checking your internet connection.

*(For detailed answers to common questions, please see the [FAQ Guide](./faq.md).)*
