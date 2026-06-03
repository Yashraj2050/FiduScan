# FiduScan v3.0 Design System

## Overview
This document defines the core visual components and styling guidelines for the FiduScan v3.0 forensic platform, prioritizing clarity, trust, and data density.

## Core Components

### 1. Cards
- **Usage:** High-level summaries (e.g., Dashboard metrics, Case overviews).
- **Style:** Subtle borders, light drop shadows. Dark mode variants use elevated surface colors (e.g., Tailwind `bg-zinc-900` over `bg-black`).

### 2. Data Tables
- **Usage:** List views for Investigations, Evidence Records, and API Logs.
- **Style:** Dense rows, sticky headers, inline quick-actions (e.g., View Report, Copy Hash). Support for pagination, advanced filtering, and sorting.

### 3. Evidence Panels
- **Usage:** Split-pane detail views displaying media alongside its forensic analysis.
- **Style:** 
  - **Media Viewer:** High-fidelity rendering (no compression) with zoom controls.
  - **Data Sidebar:** Key-value pairs for metadata, heatmaps, and spectrograms.

### 4. Timeline Views
- **Usage:** Visualizing the Evidence Chain of Custody and Audit Trails.
- **Style:** Vertical stepper UI. Nodes represent events (Creation, Verification, Modification). Cryptographic hashes and user IDs are displayed inline with timestamps.

### 5. Verification Badges
- **Usage:** Instantly communicating authenticity and integrity statuses.
- **Style:** 
  - **Verified/Authentic:** Green pill with checkmark icon.
  - **Tampered/Corrupted:** Red pill with warning icon.
  - **Blockchain Anchored:** Purple/Blue pill with Polygon/Ethereum icon linking to the block explorer.

## User Roles
1. **Individual:** Base access, personal quota limits, cannot access team features.
2. **Team Member (Analyst):** Can upload evidence, generate reports, and add notes to cases.
3. **Reviewer:** Can review findings and transition case statuses.
4. **Administrator:** Full platform control, billing, API key management, and RBAC provisioning.
