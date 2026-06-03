# Workspace Blueprints

## 1. Investigation Workspace
The Investigation Workspace is the central hub for Analysts and Reviewers working on a specific Case.

**Components:**
- **Header:** Case ID, Title, Priority Badge, Status Dropdown, and "Export Package" action button.
- **Left Pane (Evidence & Findings):** 
  - List of linked Evidence Items. Clicking an item opens the Media Viewer modal.
  - Linked Authenticity Reports.
- **Right Pane (Collaboration & Review):**
  - **Notes Thread:** Chat-like interface for Analyst annotations, findings, and conclusions.
  - **Review Module:** Form for Reviewers to approve or reject the case findings, triggering state transitions.
  - **Blockchain Verification Block:** Displays Polygon transaction hashes anchoring the case evidence.

## 2. Evidence Workspace
The Evidence Workspace is a dedicated detail view for a single uploaded media file and its forensic analysis.

**Components:**
- **Header:** File Name, Upload Timestamp, and overarching Authenticity Score badge.
- **Main Content (Split View):**
  - **Top/Left:** Interactive Media Viewer (Image zoom, Audio waveform, Video player).
  - **Top/Right (Analysis):** 
    - Authenticity Status panel (Deepfake detection results).
    - Watermark Status panel (Extracted ID, Integrity Status).
- **Bottom Content (Provenance):**
  - **Evidence Chain:** Timeline view of the media's lifecycle (Upload -> Scan -> Report Generation).
  - **Audit Trail:** Table logging user and system access/modification events specific to this file.
