# DentalAI Security Guidelines

## Overview

Security is a critical aspect of DentalAI. This document outlines our security practices, considerations, and guidelines for developers working on the project.

## Core Security Principles

1. **Defense in Depth** - Multiple layers of security
2. **Least Privilege** - Minimum necessary access
3. **Secure by Default** - Safe default configurations
4. **Privacy by Design** - Data protection built-in

## Environment Variables

### Required Secrets (Backend)

```bash
# .env (NEVER commit this file)
SECRET_KEY=your-secret-key-min-32-chars
DATABASE_URL=sqlite+aiosqlite:///./dentalai.db
OPENAI_API_KEY=sk-...  # Server-side only
```

### Frontend Environment

```bash
# .env.local (Vite)
VITE_API_URL=http://localhost:8000
# Note: No secrets here - all API keys stay on backend
```

## API Key Management

### Backend-Only Storage
- All AI API keys (OpenAI, Anthropic) are stored in backend `.env`
- Keys are NEVER sent to frontend
- Keys are NEVER exposed in API responses

### Implementation Pattern
```python
# ✅ CORRECT - Key stays on server
@app.get("/chat")
async def chat():
    api_key = settings.openai_api_key  # Server-side only
    # Use key for LLM call...
    return {"response": "..."}

# ❌ WRONG - Never expose keys
@app.get("/config")
async def config():
    return {"api_key": settings.openai_api_key}  # SECURITY RISK!
```

## Authentication

### Current Implementation (MVP)
- Simple email/password authentication
- Mock JWT tokens for development

### Production Requirements
- [ ] Implement proper JWT authentication
- [ ] Use secure password hashing (bcrypt)
- [ ] Implement token refresh
- [ ] Add session management
- [ ] Implement logout/invalidating tokens

### Password Security
```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)
```

## CORS Configuration

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)
```

**Production:** Replace with specific production URLs.

## Data Protection

### Sensitive Data Handling
- Patient medical information is sensitive
- Encrypt data at rest (production database)
- Use HTTPS for all communications
- Implement audit logging

### Data to Protect
- Personal Identifiable Information (PII)
- Medical history
- Insurance information
- Contact details

### What's NOT Protected (MVP)
- Public pages (landing, login)
- Aggregate/anonymized statistics

## Input Validation

### Pydantic Validation
```python
from pydantic import EmailStr, Field

class PatientCreate(BaseModel):
    email: EmailStr
    first_name: str = Field(min_length=1, max_length=100)
    phone: Optional[str] = None
```

### SQL Injection Prevention
- Use SQLAlchemy ORM (parameterized queries)
- Never concatenate user input into SQL
- Validate all input types

## Medical Disclaimer & Boundaries

### Important Limitations

The DentalAI system is designed to assist with administrative tasks ONLY.

**AI Agents MUST NOT:**
- Diagnose conditions
- Prescribe treatments
- Interpret medical images
- Make treatment recommendations
- Replace professional judgment

**AI Agents SHOULD:**
- Provide general information
- Help with scheduling
- Answer administrative questions
- Recommend consulting professionals

### Implementation
```python
DISCLAIMER = """
Important: This AI assistant provides general information only.
It does not diagnose conditions or provide medical advice.
Always consult a qualified healthcare professional.
"""
```

## Security Checklist

### Development
- [x] Environment variables for secrets
- [x] CORS configured
- [x] Input validation (Pydantic)
- [x] Password hashing ready
- [x] No secrets in frontend

### Pre-Production
- [ ] HTTPS enabled
- [ ] Database encryption
- [ ] Rate limiting
- [ ] Audit logging
- [ ] Security audit
- [ ] Penetration testing

### Production
- [ ] Monitor security alerts
- [ ] Regular updates
- [ ] Backup strategy
- [ ] Incident response plan

## HIPAA Considerations

While DentalAI is designed with healthcare in mind, full HIPAA compliance requires:

1. **Administrative Safeguards**
   - Designated security official
   - Workforce training
   - Contingency planning

2. **Physical Safeguards**
   - Facility access controls
   - Workstation security
   - Device management

3. **Technical Safeguards**
   - Access controls (unique IDs)
   - Audit controls
   - Integrity controls
   - Transmission security

**Note:** This MVP is NOT HIPAA compliant. Production deployment requires additional measures.

## Reporting Security Issues

If you discover a security vulnerability, please:
1. Do NOT disclose publicly
2. Contact the development team
3. Provide detailed reproduction steps

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [HIPAA Guidelines](https://www.hhs.gov/hipaa/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
