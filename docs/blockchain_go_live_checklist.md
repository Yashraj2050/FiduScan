# FiduScan — Polygon Anchoring Go-Live Checklist

**Version:** v9.0-timesformer-video  
**Last Updated:** 2026-06-11

---

## 1. Audit Summary

The Polygon blockchain integration is severely fragmented and **non-functional**. While a robust `BlockchainService` exists utilizing `web3.py` for actual Polygon transactions, the application routers are wired to non-existent or mocked engines. Attempting to use the blockchain endpoints in their current state will result in `ImportError` crashes and fake mock data.

**Status:** NOT READY FOR PRODUCTION

---

## 2. Feature Verification

### Wallet & RPC Integration
- [x] **RPC Provider:** `BlockchainService._get_web3()` properly configures `Web3.HTTPProvider` with the `POLYGON_RPC_URL` and injects `geth_poa_middleware` (required for Polygon).
- [x] **Wallet Integration:** `w3.eth.account.from_key()` handles the `POLYGON_PRIVATE_KEY`.
- [ ] **Environment Configuration:** Missing from production environment.

### Transaction Flow
- [x] **Transaction Signing:** Implemented correctly in the service with `chainId: 137`.
- [x] **Transaction Submission:** `send_raw_transaction` and `wait_for_transaction_receipt` are implemented correctly.
- [x] **Explorer Verification:** Generates correct `polygonscan.com/tx/` URLs.
- [ ] **Router Wiring (CRITICAL):** The real `BlockchainService` is **never called** by the application. 

### Anchor Persistence & Engine
- [ ] **Engine Missing (CRITICAL):** `backend/routers/blockchain.py` attempts to import `BlockchainAnchorEngine` from `backend.blockchain`, but this class does not exist. This will cause an immediate crash.
- [ ] **Database Persistence:** `backend/blockchain.py` defines an SQLAlchemy `Anchor` model, but the endpoints contain comments like `# Simulate a web3 transaction` and return hardcoded mock data (`"transaction_id": "0x_mock_tx"`). No actual database writes occur.

---

## 3. Required Environment Variables

To go live, these variables must be configured in Railway:

1. `POLYGON_RPC_URL`: (e.g., Alchemy or Infura Polygon Mainnet RPC URL).
2. `POLYGON_PRIVATE_KEY`: Private key of the funding wallet (must contain MATIC for gas fees).

---

## 4. Action Plan for Completion

1. **Fix Router Import Crashes:** Remove references to the non-existent `BlockchainAnchorEngine`.
2. **Wire Real Web3 Service:** Connect `backend/routers/blockchain.py` directly to the `BlockchainService.anchor_evidence()` method.
3. **Implement Database Persistence:** After a successful Polygon transaction, write the receipt data (`tx_hash`, `block_number`, etc.) to the `Anchor` SQLAlchemy model.
4. **Fund Wallet:** Ensure the wallet associated with `POLYGON_PRIVATE_KEY` is funded with MATIC for mainnet gas fees.
