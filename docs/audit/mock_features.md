# Mock Features (Tech Debt)

## Overview
The following features present themselves as functional to the API/Frontend but rely entirely on in-memory dictionaries rather than durable, scalable backend architecture.

## 1. Enterprise Cases & Review Workflows
- **File:** `backend/case_management.py`
- **Issue:** Uses `self.cases = {}`. Data is lost upon container restart. No PostgreSQL models exist for `Case`, `InvestigatorNote`, or `EvidenceLink`.

## 2. Evidence Chain
- **File:** `backend/evidence_chain.py`
- **Issue:** Uses `self.evidence_records = {}`. The immutable chain of custody is highly volatile and disappears if the server crashes.

## 3. Blockchain Anchoring
- **File:** `backend/blockchain.py`
- **Issue:** Uses `self.blockchain_records = {}`. The transaction hash (`tx_hash`) is generated via `hashlib.sha256(str(time.time()).encode()).hexdigest()` rather than an actual Web3 RPC call to Polygon or Ethereum.
