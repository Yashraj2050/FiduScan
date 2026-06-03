# IP Protection Architecture

## Overview
This document defines the safeguards implemented to protect the intellectual property (IP) of FiduScan, with a primary focus on AI models, proprietary algorithms, and frontend code.

## 1. Model Protection
- **Mechanism:** Avoid serving raw models to client devices. 
- **Implementation:** Models are kept strictly on secure, internal servers. If edge deployment is required in the future, models must be compiled, quantized, and heavily obfuscated (e.g., using ONNX Runtime with encryption) to prevent reverse engineering of weights and architectures.

## 2. Inference Protection
- **Mechanism:** Secure the inference APIs against model extraction attacks.
- **Implementation:**
  - Introduce slight perturbations or noise to output probabilities to prevent adversarial distillation.
  - Implement strict rate limiting (see Anti-Abuse Architecture) to make brute-force extraction economically unviable.
  - Monitor for structured query patterns indicative of extraction attempts.

## 3. Source Map Handling
- **Mechanism:** Prevent exposure of readable frontend source code in production.
- **Implementation:** 
  - Ensure source maps are disabled or securely hosted (not publicly accessible) in production environments.
  - Integrate error tracking tools (e.g., Sentry) using secure, authenticated source map uploads during the CI/CD pipeline, ensuring client browsers never receive the mapping files.

## 4. Frontend Hardening
- **Mechanism:** Obfuscate and secure client-side code.
- **Implementation:**
  - Utilize aggressive minification and code obfuscation tools (e.g., Terser, JavaScript Obfuscator).
  - Implement Content Security Policy (CSP) headers to prevent XSS and unauthorized script execution.
  - Employ integrity checks (Subresource Integrity - SRI) on all loaded scripts.

## 5. Model Storage Security
- **Mechanism:** Secure models at rest.
- **Implementation:**
  - Store model weights in private cloud buckets (e.g., AWS S3) with strict IAM policies (no public read access).
  - Enable Server-Side Encryption (SSE) using Customer Managed Keys (KMS).
  - Ensure version control for models is kept in private, access-controlled registries (e.g., MLflow, AWS SageMaker Model Registry).
