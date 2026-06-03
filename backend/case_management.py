import time
import zipfile
import io
import json
from typing import Dict, Any, List

class CaseManagementEngine:
    def __init__(self):
        self.cases = {}

    def create_case(self, data: dict) -> dict:
        case_id = f"case_{int(time.time())}"
        case = {
            "case_id": case_id,
            "title": data.get("title", "Untitled Case"),
            "description": data.get("description", ""),
            "owner": data.get("owner", "analyst_1"),
            "status": "OPEN",
            "priority": data.get("priority", "MEDIUM"),
            "created_at": int(time.time()),
            "updated_at": int(time.time()),
            "evidence": [],
            "notes": [],
            "review_status": "PENDING",
            "approval_status": "PENDING"
        }
        self.cases[case_id] = case
        return case

    def update_case(self, case_id: str, data: dict) -> dict:
        if case_id in self.cases:
            self.cases[case_id].update(data)
            self.cases[case_id]["updated_at"] = int(time.time())
            return self.cases[case_id]
        return None

    def add_evidence(self, case_id: str, evidence_id: str) -> dict:
        if case_id in self.cases:
            self.cases[case_id]["evidence"].append(evidence_id)
            self.cases[case_id]["updated_at"] = int(time.time())
            return self.cases[case_id]
        return None

    def add_notes(self, case_id: str, note: dict) -> dict:
        if case_id in self.cases:
            note_obj = {
                "author": note.get("author"),
                "content": note.get("content"),
                "type": note.get("type", "FINDING"),
                "timestamp": int(time.time())
            }
            self.cases[case_id]["notes"].append(note_obj)
            self.cases[case_id]["updated_at"] = int(time.time())
            return self.cases[case_id]
        return None

    def review_case(self, case_id: str, review_data: dict) -> dict:
        if case_id in self.cases:
            self.cases[case_id]["review_status"] = review_data.get("review_status", "REVIEWED")
            self.cases[case_id]["approval_status"] = review_data.get("approval_status", "APPROVED")
            self.cases[case_id]["updated_at"] = int(time.time())
            return self.cases[case_id]
        return None

    def export_case(self, case_id: str) -> bytes:
        if case_id in self.cases:
            case = self.cases[case_id]
            zip_buffer = io.BytesIO()
            with zipfile.ZipFile(zip_buffer, "a", zipfile.ZIP_DEFLATED, False) as zip_file:
                # Add case details
                zip_file.writestr("case_details.json", json.dumps(case, indent=2))
                # Add mock reports, hashes, anchors, audit trail
                zip_file.writestr("audit_trail.json", json.dumps({"events": []}, indent=2))
                zip_file.writestr("blockchain_anchors.json", json.dumps({"anchors": []}, indent=2))
            return zip_buffer.getvalue()
        return None
