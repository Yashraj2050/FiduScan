import hashlib
import time
from typing import List, Dict

class EvidenceChainEngine:
    def __init__(self):
        self.evidence_records = {}
        self.audit_log = []
        
    def create_evidence_record(self, data: dict) -> dict:
        record_id = f"ev_{int(time.time())}"
        
        record = {
            "evidence_id": record_id,
            "file_hash": data.get("file_hash"),
            "report_hash": data.get("report_hash"),
            "watermark_id": data.get("watermark_id"),
            "timestamp": int(time.time()),
            "user_id": data.get("user_id"),
            "authenticity_score": data.get("authenticity_score"),
            "history": []
        }
        
        # Log creation in chain of custody
        self._log_event(record_id, "CREATED", data.get("user_id"))
        self.evidence_records[record_id] = record
        return record

    def verify_evidence(self, record_id: str, current_file_hash: str, current_report_hash: str) -> dict:
        record = self.evidence_records.get(record_id)
        if not record:
            return {"valid": False, "reason": "Not Found"}
            
        file_valid = record["file_hash"] == current_file_hash
        report_valid = record["report_hash"] == current_report_hash
        
        self._log_event(record_id, "VERIFIED", "system", {"file_valid": file_valid, "report_valid": report_valid})
        
        return {
            "valid": file_valid and report_valid,
            "file_integrity": file_valid,
            "report_integrity": report_valid,
            "watermark_integrity": True # Placeholder
        }

    def retrieve_evidence_history(self, record_id: str) -> List[dict]:
        return [log for log in self.audit_log if log["evidence_id"] == record_id]

    def _log_event(self, record_id: str, action: str, actor: str, details: dict = None):
        event = {
            "timestamp": int(time.time()),
            "evidence_id": record_id,
            "action": action,
            "actor": actor,
            "details": details or {}
        }
        self.audit_log.append(event)
        
        if record_id in self.evidence_records:
            self.evidence_records[record_id]["history"].append(event)
