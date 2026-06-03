# Navigation Design

## Overview
This document outlines the navigation topology for FiduScan v3.0, designed to accommodate the transition from a single-purpose tool to a comprehensive enterprise investigation platform.

## Global Navigation (Left Sidebar)

### Layer 1: Core Operations
- **Dashboard** (Overview metrics, recent scans, quota usage)
- **Deepfake Scanner** (Image, Audio, Video analysis)
- **Watermarking** (Embed & Extract/Verify)

### Layer 2: Investigation & Evidence
- **Cases** (Enterprise case management pipeline)
- **Reports** (Archive of generated forensic reports)
- **Evidence Vault** (Chain of custody logs and blockchain verification)

### Layer 3: Administration
- **Developer API** (Keys and webhooks)
- **Settings** (Billing, Team, Profile)

## Contextual Navigation (Top Bar)
- **Global Search:** Search by Scan ID, Case ID, or Report Hash.
- **Environment Switcher:** Toggle between Production and Sandbox (for API testing).
- **Profile Dropdown:** Quick access to sign out and theme toggle (Dark/Light).
