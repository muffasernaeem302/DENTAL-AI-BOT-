"""
Security utilities for DentalAI backend.
"""
from datetime import datetime, timedelta
from typing import Optional
import hashlib
import hmac
import base64
import json
from .config import settings


def create_password_hash(password: str) -> str:
    """Create a secure hash of the password."""
    salt = settings.secret_key[:16]
    hash_input = f"{salt}{password}{settings.secret_key}".encode()
    hash_value = hashlib.sha256(hash_input).hexdigest()
    return f"{salt}${hash_value}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    try:
        salt, stored_hash = hashed_password.split('$')
        hash_input = f"{salt}{plain_password}{settings.secret_key}".encode()
        computed_hash = hashlib.sha256(hash_input).hexdigest()
        return hmac.compare_digest(computed_hash, stored_hash)
    except ValueError:
        return False


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT-like access token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.access_token_expire_minutes))
    to_encode.update({
        "exp": expire.isoformat(),
        "iat": datetime.utcnow().isoformat()
    })
    
    header = base64.urlsafe_b64encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode()).decode()
    payload = base64.urlsafe_b64encode(json.dumps(to_encode).encode()).decode()
    
    signature_input = f"{header}.{payload}".encode()
    signature = hmac.new(
        settings.secret_key.encode(),
        signature_input,
        hashlib.sha256
    ).hexdigest()
    
    return f"{header}.{payload}.{signature}"


def decode_token(token: str) -> Optional[dict]:
    """Decode and verify an access token."""
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
        
        header, payload, signature = parts
        
        # Verify signature
        signature_input = f"{header}.{payload}".encode()
        expected_signature = hmac.new(
            settings.secret_key.encode(),
            signature_input,
            hashlib.sha256
        ).hexdigest()
        
        if not hmac.compare_digest(signature, expected_signature):
            return None
        
        # Decode payload
        payload_data = json.loads(base64.urlsafe_b64decode(payload.encode()))
        
        # Check expiration
        exp = datetime.fromisoformat(payload_data.get("exp", datetime.utcnow().isoformat()))
        if exp < datetime.utcnow():
            return None
        
        return payload_data
    except Exception:
        return None


def get_token_payload(token: str) -> Optional[dict]:
    """Get payload from token without verification (for debugging)."""
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
        return json.loads(base64.urlsafe_b64decode(parts[1].encode()))
    except Exception:
        return None
