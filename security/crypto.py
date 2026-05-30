"""
Security — Cryptographic utilities for model artifact integrity.
SHA-256 hashing + AES-256 encryption for model checkpoints.
"""
import hashlib
import json
import os
from datetime import datetime, timezone
from pathlib import Path

from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad, unpad

HASH_REGISTRY = Path(__file__).parent.parent / "logs" / "model_hashes.json"


# ─── SHA-256 Hashing ─────────────────────────────────────────────────────────

def hash_model_artifact(model_path: Path) -> str:
    """
    Computes SHA-256 hash of a model checkpoint file.
    Appends the result immutably to logs/model_hashes.json.

    Args:
        model_path: Path to the .pth model file.

    Returns:
        Hex digest string.
    """
    sha256 = hashlib.sha256()
    with open(model_path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            sha256.update(chunk)

    digest = sha256.hexdigest()
    _record_hash(model_path.name, digest)
    return digest


def verify_model_artifact(model_path: Path, expected_hash: str) -> bool:
    """
    Verifies a model artifact against an expected SHA-256 hash.

    Returns True if the file matches, False if tampered.
    """
    actual_hash = hash_model_artifact(model_path)
    tamper_detected = actual_hash != expected_hash
    if tamper_detected:
        import logging
        logging.getLogger("fiduscan.security").critical(
            f"🚨 TAMPER DETECTED: {model_path.name} — "
            f"Expected: {expected_hash[:16]}... | Actual: {actual_hash[:16]}..."
        )
    return not tamper_detected


def _record_hash(filename: str, digest: str):
    """Appends hash record immutably to logs/model_hashes.json."""
    HASH_REGISTRY.parent.mkdir(parents=True, exist_ok=True)

    records = []
    if HASH_REGISTRY.exists():
        with open(HASH_REGISTRY, "r") as f:
            try:
                records = json.load(f)
            except json.JSONDecodeError:
                records = []

    records.append({
        "filename": filename,
        "sha256": digest,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })

    with open(HASH_REGISTRY, "w") as f:
        json.dump(records, f, indent=2)


# ─── AES-256 Encryption ───────────────────────────────────────────────────────

def encrypt_model(model_path: Path, output_path: Path | None = None) -> tuple[Path, bytes]:
    """
    Encrypts a model checkpoint with AES-256-CBC.

    Args:
        model_path: Path to the plaintext .pth file.
        output_path: Destination path for encrypted file. Defaults to <model_path>.enc

    Returns:
        (encrypted_path, aes_key) — store the AES key securely (e.g., in a vault).
    """
    if output_path is None:
        output_path = model_path.with_suffix(".enc")

    key = get_random_bytes(32)   # AES-256
    iv = get_random_bytes(16)    # CBC IV
    cipher = AES.new(key, AES.MODE_CBC, iv)

    with open(model_path, "rb") as f:
        plaintext = f.read()

    ciphertext = cipher.encrypt(pad(plaintext, AES.block_size))

    with open(output_path, "wb") as f:
        f.write(iv + ciphertext)   # Prepend IV for decryption

    print(f"🔐 Model encrypted: {output_path}")
    return output_path, key


def decrypt_model(encrypted_path: Path, key: bytes, output_path: Path | None = None) -> Path:
    """
    Decrypts an AES-256-CBC encrypted model checkpoint.

    Args:
        encrypted_path: Path to the .enc file.
        key: 32-byte AES key.
        output_path: Path to write decrypted file. Defaults to <encrypted_path>.pth

    Returns:
        Path to decrypted .pth file.
    """
    if output_path is None:
        output_path = encrypted_path.with_suffix(".pth")

    with open(encrypted_path, "rb") as f:
        data = f.read()

    iv = data[:16]
    ciphertext = data[16:]
    cipher = AES.new(key, AES.MODE_CBC, iv)
    plaintext = unpad(cipher.decrypt(ciphertext), AES.block_size)

    with open(output_path, "wb") as f:
        f.write(plaintext)

    print(f"🔓 Model decrypted: {output_path}")
    return output_path
