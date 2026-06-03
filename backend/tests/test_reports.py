import pytest
from backend.reports import ReportGenerator

def test_generate_and_verify_valid_report():
    gen = ReportGenerator()
    data = {"scan_id": "123", "watermark_status": "FOUND"}
    report = gen.generate_json_report(data)
    
    assert report["scan_id"] == "123"
    assert "report_hash" in report
    
    assert gen.verify_report(report) == True

def test_verify_corrupted_report():
    gen = ReportGenerator()
    data = {"scan_id": "123", "watermark_status": "FOUND"}
    report = gen.generate_json_report(data)
    
    # Tamper with the report
    report["watermark_status"] = "NOT_FOUND"
    
    assert gen.verify_report(report) == False
