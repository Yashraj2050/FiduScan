"""
Structured JSON logger for FiduScan — writes immutable logs to /logs/.
"""
import json
import logging
import sys
from datetime import datetime, timezone
from pathlib import Path

LOGS_DIR = Path(__file__).parent.parent.parent / "logs"
LOGS_DIR.mkdir(parents=True, exist_ok=True)
LOG_FILE = LOGS_DIR / "inference.log"


class JSONFormatter(logging.Formatter):
    """Formats log records as single-line JSON for tamper-resistant audit trails."""

    def format(self, record: logging.LogRecord) -> str:
        log_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        if record.exc_info:
            log_entry["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_entry)


def setup_logger(name: str, level: int = logging.DEBUG) -> logging.Logger:
    """
    Creates a logger that outputs:
    - Structured JSON to /logs/inference.log (append-only)
    - Human-readable format to stdout
    """
    logger = logging.getLogger(name)
    if logger.handlers:
        return logger  # Already configured

    logger.setLevel(level)

    # ── File handler (JSON, append-only) ──────────────────────────────────────
    fh = logging.FileHandler(LOG_FILE, mode="a", encoding="utf-8")
    fh.setLevel(logging.DEBUG)
    fh.setFormatter(JSONFormatter())
    logger.addHandler(fh)

    # ── Stream handler (human-readable) ───────────────────────────────────────
    sh = logging.StreamHandler(sys.stdout)
    sh.setLevel(logging.INFO)
    sh.setFormatter(
        logging.Formatter("%(asctime)s | %(levelname)-8s | %(name)s | %(message)s")
    )
    logger.addHandler(sh)

    logger.propagate = False
    return logger
