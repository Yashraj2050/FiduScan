import hashlib
import json
import time

class ReportGenerator:
    def generate_json_report(self, data: dict) -> dict:
        report = {
            "scan_id": data.get("scan_id", "scan_default"),
            "report_id": f"rep_{int(time.time())}",
            "timestamp": int(time.time()),
            "watermark_status": data.get("watermark_status", "UNKNOWN"),
            "watermark_id": data.get("watermark_id"),
            "authenticity_score": data.get("authenticity_score", 0.0),
            "verification_confidence": data.get("verification_confidence", 0.0),
            "detection_results": data.get("detection_results", {}),
            "risk_assessment": data.get("risk_assessment", "MODERATE"),
        }
        
        # Add integrity hash
        report_str = json.dumps(report, sort_keys=True)
        report["report_hash"] = hashlib.sha256(report_str.encode()).hexdigest()
        report["report_signature"] = "SIG_MOCK"
        report["verification_metadata"] = {"method": "ECDSA", "version": "1.0"}
        
        return report

    def verify_report(self, report: dict) -> bool:
        original_hash = report.get("report_hash")
        
        # Create a copy to hash
        report_copy = report.copy()
        report_copy.pop("report_hash", None)
        report_copy.pop("report_signature", None)
        report_copy.pop("verification_metadata", None)
        
        recomputed_hash = hashlib.sha256(json.dumps(report_copy, sort_keys=True).encode()).hexdigest()
        
        return original_hash == recomputed_hash
