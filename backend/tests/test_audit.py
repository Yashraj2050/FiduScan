"""
Enterprise Audit Logging Tests — FiduScan v6.5
Covers cryptographic hashing, immutable ledger verification, filtering, and export.
"""

import uuid
from datetime import datetime, timezone, timedelta
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import Base
from audit_models import EnterpriseAuditLog, OrgAuditConfig, RetentionPolicy, EventType
from audit_service import AuditLogger, AuditQueryService, AuditRetentionService
from models import Organization

TEST_DB_URL = "sqlite:///./test_audit.db"
engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(autouse=True, scope="module")
def setup_db():
    import models
    import audit_models
    import sso_models
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    if os.path.exists("test_audit.db"):
        os.remove("test_audit.db")

@pytest.fixture()
def db():
    session = TestingSession()
    try:
        yield session
    finally:
        session.rollback()
        session.close()

@pytest.fixture()
def org(db):
    org = Organization(org_id=str(uuid.uuid4()), name="Audit Test Org")
    db.add(org)
    db.commit()
    return org

class TestAuditLogger:
    
    def test_log_creation_and_chaining(self, db, org):
        # Genesis block
        log1 = AuditLogger.log_event(
            db=db, org_id=org.org_id, action="login", event_type=EventType.AUTH, user_id="u1"
        )
        assert log1.previous_hash == AuditLogger.GENESIS_HASH
        assert len(log1.log_hash) == 64
        
        # Second block
        log2 = AuditLogger.log_event(
            db=db, org_id=org.org_id, action="report_download", event_type=EventType.DATA, user_id="u1"
        )
        assert log2.previous_hash == log1.log_hash
        
        db.commit()
        
        # Verify chain
        is_valid, msg = AuditLogger.verify_chain(db, org.org_id)
        assert is_valid is True

    def test_tamper_detection_content_modification(self, db, org):
        AuditLogger.log_event(db, org.org_id, "login", EventType.AUTH)
        log = AuditLogger.log_event(db, org.org_id, "api_key_created", EventType.SECURITY)
        db.commit()
        
        # Tamper the log
        log.action = "api_key_deleted"
        db.commit()
        
        is_valid, msg = AuditLogger.verify_chain(db, org.org_id)
        assert is_valid is False
        assert "Tamper detected" in msg

    def test_tamper_detection_chain_break(self, db, org):
        log1 = AuditLogger.log_event(db, org.org_id, "login", EventType.AUTH)
        log2 = AuditLogger.log_event(db, org.org_id, "logout", EventType.AUTH)
        db.commit()
        
        # Tamper the chain pointer
        log2.previous_hash = "0" * 64
        db.commit()
        
        is_valid, msg = AuditLogger.verify_chain(db, org.org_id)
        assert is_valid is False
        assert "Chain broken" in msg

class TestAuditQueryService:

    def test_filtering_and_pagination(self, db, org):
        AuditLogger.log_event(db, org.org_id, "login", EventType.AUTH, user_id="userA")
        AuditLogger.log_event(db, org.org_id, "login", EventType.AUTH, user_id="userB")
        AuditLogger.log_event(db, org.org_id, "evidence_creation", EventType.DATA, user_id="userA")
        db.commit()
        
        # Filter by user
        logs, total = AuditQueryService.get_logs(db, org.org_id, user_id="userA")
        assert total == 2
        
        # Filter by action
        logs, total = AuditQueryService.get_logs(db, org.org_id, action="login")
        assert total == 2
        
        # Pagination
        logs, total = AuditQueryService.get_logs(db, org.org_id, limit=1)
        assert len(logs) == 1
        assert total == 3

    def test_csv_export(self, db, org):
        AuditLogger.log_event(db, org.org_id, "login", EventType.AUTH, user_id="export_user")
        db.commit()
        
        logs, _ = AuditQueryService.get_logs(db, org.org_id)
        csv_data = AuditQueryService.export_csv(logs)
        
        assert "Timestamp,ID,User ID,Event Type" in csv_data
        assert "export_user" in csv_data

class TestAuditRetentionService:

    def test_retention_purge(self, db, org):
        # Create an old log manually
        old_log = EnterpriseAuditLog(
            id=str(uuid.uuid4()),
            org_id=org.org_id,
            event_type=EventType.AUTH.value,
            action="login",
            created_at=datetime.now(timezone.utc) - timedelta(days=40),
            previous_hash=AuditLogger.GENESIS_HASH,
            log_hash="testhash"
        )
        db.add(old_log)
        db.commit()
        
        config = OrgAuditConfig(org_id=org.org_id, retention_policy=RetentionPolicy.DAYS_30.value)
        db.add(config)
        db.commit()
        
        deleted = AuditRetentionService.enforce_retention_policy(db, org.org_id)
        assert deleted == 1
        
        logs, total = AuditQueryService.get_logs(db, org.org_id)
        assert total == 0
