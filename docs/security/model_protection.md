# Model Protection Architecture

## Overview
This document outlines the architecture for securing FiduScan AI models against theft, cloning, and reverse engineering.

## 1. Encrypted Model Storage
- **Mechanism:** All trained model artifacts (`.pt`, `.onnx`, `.safetensors`) must be stored encrypted at rest.
- **Implementation:** Utilize AWS Key Management Service (KMS) with Customer Managed Keys (CMKs) to encrypt models in S3. 
- **Access Control:** Enforce strict IAM policies ensuring only authorized backend services and CI/CD pipelines can assume the role to decrypt the models.

## 2. Model Signing
- **Mechanism:** Ensure model integrity and authenticity before loading.
- **Implementation:** Sign the model artifacts using a private key during the CI/CD deployment phase. 
- **Validation:** The backend service must verify the cryptographic signature using the corresponding public key before allowing the model into memory.

## 3. Secure Model Loading
- **Mechanism:** Protect the model weights during runtime initialization.
- **Implementation:** 
  - Decrypt models in-memory rather than writing decrypted files to the local disk.
  - Disable core dumps on production inference servers to prevent memory scraping attacks that could extract loaded weights.
  - Restrict the environment running the inference code using container security contexts (e.g., dropping all Linux capabilities, running as non-root, read-only file systems).
