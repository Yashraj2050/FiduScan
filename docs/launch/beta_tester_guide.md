# FiduScan Beta Tester Guide

Welcome to the FiduScan Beta Program! Thank you for participating in the early testing phase of our multimodal AI detection platform. Your feedback is crucial to ensuring FiduScan provides reliable, enterprise-grade protection against synthetic media.

## 1. Product Overview
FiduScan is a high-performance Anti-Gravity forensic system designed to detect AI-generated media (deepfakes, synthetic audio, and generated imagery) with cryptographic certainty. Under the hood, FiduScan leverages state-of-the-art vision models like EfficientNet-B0 and advanced spectrogram analysis to classify authenticity.

## 2. Supported Inputs
During the beta, you can test FiduScan across three primary modalities:
- **Images:** JPEG, PNG, WEBP, BMP (up to 20MB)
- **Audio:** WAV, MP3, M4A, MPEG (up to 20MB)
- **Video:** MP4, MOV, AVI, MKV (up to 50MB)

## 3. How To Register
1. Navigate to the FiduScan staging URL provided in your beta invitation email.
2. Click **Sign In** in the top navigation bar.
3. Since this is a closed beta, you will use the access credentials provided to you. If you were provided a token link, simply click it to authenticate automatically.

## 4. How To Run A Scan
1. Open the **Scanner** tab.
2. Select your desired modality using the top filter (Image, Audio, Video).
3. Drag and drop your file into the highlighted upload zone, or click to browse your file system.
4. Wait for the inference engine to process the file.
5. Review the Result Card (Binary prediction, confidence score) and the Metadata Viewer (EXIF flags or Grad-CAM heatmaps for images).

## 5. How To View Scan History
1. Click the **History** tab in the main navigation.
2. Here, you will see a persistent list of all previous scans you have conducted.
3. You can filter this list by Modality (Image, Audio, Video) or Result (AI Generated, Authentic) using the top drop-down menus.

## 6. How To Use Developer Portal
1. Navigate to the **Settings** tab and click on **Developer Portal**.
2. Click **Generate New Key**.
3. **IMPORTANT:** Copy the 32-byte cryptographic key immediately. For security reasons (SHA-256 hashing), it will never be displayed again.
4. You can use this key to authenticate REST API requests against the FiduScan backend if you wish to test programmatic integrations.

## 7. Known Beta Limitations
- **Heatmaps:** Currently only supported for Image modalities. Audio and Video heatmaps are slated for Phase 9.
- **File Size:** Strictly capped to prevent test-server overload.
- **Billing Portal:** The Stripe integration is currently in **TEST MODE**. Do not use real credit cards if you attempt to upgrade your plan limits.

## 8. What Feedback We Want
We are specifically looking for detailed feedback in the following categories:
- **Bugs:** Interface crashes, stuck loading states, or failed API calls (HTTP 500s).
- **UX Issues:** Confusing navigation, missing feedback during uploads, or hard-to-read charts.
- **Performance Issues:** Inference times exceeding 3 seconds, UI lag, or slow history loading.
- **Detection Accuracy:** False positives (authentic media flagged as AI) and False negatives (AI media flagged as authentic).

## 9. How To Report Issues
Please use the official **Feedback Template** when submitting reports. You can submit reports directly to our Beta Triage channel in the provided Slack workspace or via the dedicated support email.

## 10. Privacy & Data Handling
FiduScan operates on a strict zero-retention policy for media content.
- Uploaded files are processed in-memory and instantly discarded after inference.
- Only the cryptographic hash of the file and the resulting metadata are stored in your Scan History.
- We do not use your uploaded data to train our models.
