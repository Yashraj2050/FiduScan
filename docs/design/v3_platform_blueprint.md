# V3.0 Platform Blueprint

## Overview
This document consolidates the FiduScan v3.0 platform design, transforming it from a simple scanning utility into a full-scale forensic investigation platform.

## Dashboard Design
The Dashboard acts as the operational command center upon login.

**Key Sections:**
- **Recent Investigations:** A horizontal scroll or compact table of the 5 most recently active Cases.
- **Evidence Summary:** High-level metrics indicating total media analyzed (Images, Audio, Video) this month.
- **Verification Statistics:** Doughnut chart visualizing the ratio of Authentic vs. Manipulated vs. Unknown media.
- **Watermark Statistics:** Metrics showing total successful watermark extractions.
- **Usage Metrics:** A visual progress bar detailing API quota consumption vs. current billing tier limits.

## Architectural Layout
- **Sidebar Nav:** Persistent on desktop, hidden in a hamburger menu on mobile. See `navigation_architecture.md`.
- **Top Bar:** Contextual actions, Search, User Profile.
- **Main Content Pane:** Houses the respective workspaces. See `workspace_blueprints.md`.

## System Composition
The v3.0 UI will be constructed entirely using the components defined in `design_system.md` (Cards, Tables, Evidence Panels, Timeline Views, Verification Badges) to ensure a cohesive, enterprise-grade look and feel across all 8 Primary Navigation routes.
