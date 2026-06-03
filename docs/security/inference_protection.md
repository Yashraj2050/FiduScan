# Inference Protection Architecture

## Overview
This document outlines the safeguards implemented to protect the FiduScan inference endpoints from extraction attacks, abuse, and side-channel vulnerabilities.

## 1. Inference Isolation
- **Mechanism:** Run model inference in heavily isolated environments.
- **Implementation:** 
  - Deploy inference workloads in dedicated Virtual Private Cloud (VPC) subnets with no inbound internet access.
  - Use API Gateways or reverse proxies to route traffic to the isolated inference workers.
  - Implement gRPC or secure internal mTLS for communication between the backend API and the inference microservice.

## 2. Endpoint Hardening
- **Mechanism:** Secure the API layer handling inference requests against model inversion and distillation attacks.
- **Implementation:**
  - **Output Perturbation:** Inject controlled, deterministic noise (e.g., differential privacy mechanisms) into the probability scores to prevent adversaries from perfectly mapping the decision boundary.
  - **Granular Rate Limiting:** Apply extremely strict rate limits (e.g., token bucket) on inference endpoints specifically, penalizing rapid, similar requests.
  - **Anomaly Detection:** Monitor inference requests for structured query patterns (e.g., grid search over image perturbations) and automatically block suspected extraction attempts.
