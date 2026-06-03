import time
import hashlib
from typing import Dict, Any

class BlockchainAnchorEngine:
    def __init__(self):
        # Mocking blockchain state
        self.blockchain_records = {}

    def anchor_evidence(self, evidence_record: Dict[str, Any]) -> dict:
        """
        Anchors the evidence into the mocked blockchain.
        Does not store media files on-chain, only hashes and IDs.
        """
        tx_hash = f"0x{hashlib.sha256(str(time.time()).encode()).hexdigest()}"
        
        anchor = {
            "evidence_id": evidence_record.get("evidence_id"),
            "file_hash": evidence_record.get("file_hash"),
            "report_hash": evidence_record.get("report_hash"),
            "watermark_id": evidence_record.get("watermark_id"),
            "timestamp": int(time.time()),
            "tx_hash": tx_hash,
            "status": "CONFIRMED"
        }
        
        self.blockchain_records[evidence_record.get("evidence_id")] = anchor
        return anchor

    def verify_anchor(self, evidence_id: str, current_file_hash: str, current_report_hash: str) -> dict:
        """
        Verifies that the blockchain record exists, hash matches, timestamp matches.
        """
        anchor = self.blockchain_records.get(evidence_id)
        
        if not anchor:
            return {"valid": False, "reason": "Anchor not found on-chain"}
            
        file_hash_match = anchor["file_hash"] == current_file_hash
        report_hash_match = anchor["report_hash"] == current_report_hash
        
        return {
            "valid": file_hash_match and report_hash_match,
            "anchor_timestamp": anchor["timestamp"],
            "tx_hash": anchor["tx_hash"],
            "file_hash_match": file_hash_match,
            "report_hash_match": report_hash_match
        }

    def retrieve_anchor_status(self, evidence_id: str) -> dict:
        anchor = self.blockchain_records.get(evidence_id)
        if anchor:
            return {"status": anchor["status"], "tx_hash": anchor["tx_hash"]}
        return {"status": "NOT_FOUND"}
