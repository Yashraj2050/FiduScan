# V3.0 UI Blueprint

## Overview
This document outlines the visual and structural blueprint for upgrading the FiduScan user interface in Phase 15B, moving away from a rudimentary layout to a highly polished, enterprise-grade Next.js application.

## Layout Structure
- **App Shell:** A persistent Left Sidebar (collapsible) and Top App Bar.
- **Content Area:** A dynamic main content pane utilizing Next.js App Router for seamless transitions.

## Key Component Blueprints

### 1. Unified Scanner Interface
- **Design:** A drag-and-drop zone that accepts images, audio, and video interchangeably.
- **Feedback:** Real-time processing indicators transitioning into the forensic dashboard.
- **Output:** Split pane viewing (e.g., original media on the left, Grad-CAM heatmap/spectrogram on the right).

### 2. Case Management Dashboard
- **Design:** A Kanban-style or Data Grid layout listing active investigations.
- **Detail View:** A split-screen layout. Left side containing media and reports; Right side containing the chronological chain of custody and investigator note thread.

### 3. Report & Evidence Viewer
- **Design:** A standardized, read-only view of a forensic report displaying the final authenticity score prominently at the top.
- **Verification Badges:** Cryptographic signatures and blockchain anchor statuses will be represented by interactive badges (e.g., "Verified on Polygon" linking to the tx hash).

## Tech Stack Requirements
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS with a standardized design system (Figma tokens).
- **State Management:** React Context or Zustand for global state (e.g., active case context).
- **Components:** Radix UI or shadcn/ui for accessible, enterprise-grade primitive components.
