"""Authentication endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid
from database import get_db
from models import User
from core.security import verify_password, create_access_token, decode_token
from schemas import UserRole

router = APIRouter()
security = HTTPBearer(auto_error=False)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: AsyncSession = Depends(get_db)) -> User:
    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated", headers={"WWW-Authenticate": "Bearer"})
    token_data = decode_token(credentials.credentials)
    if not token_data:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token", headers={"WWW-Authenticate": "Bearer"})
    user_id = token_data.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

async def get_current_user_optional(credentials: HTTPAuthorizationCredentials = Depends(security), db: AsyncSession = Depends(get_db)) -> User | None:
    if not credentials: return None
    token_data = decode_token(credentials.credentials)
    if not token_data: return None
    user_id = token_data.get("sub")
    if not user_id: return None
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()

def require_role(*roles: str):
    async def check_role(user: User = Depends(get_current_user)) -> User:
        if user.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Access denied. Required role: {roles}")
        return user
    return check_role

@router.post("/register")
async def register(
    full_name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    role: UserRole = Form(UserRole.PATIENT),
    phone: str | None = Form(None),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).where(User.email == email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    from core.security import create_password_hash
    user = User(id=str(uuid.uuid4()), full_name=full_name, email=email, phone=phone, role=role.value, password_hash=create_password_hash(password))
    db.add(user)
    await db.commit()
    await db.refresh(user)
    access_token = create_access_token(data={"sub": user.id, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer", "user": {"id": user.id, "full_name": user.full_name, "email": user.email, "phone": user.phone, "role": user.role, "created_at": str(user.created_at), "updated_at": str(user.updated_at)}}

@router.post("/login")
async def login(email: str = Form(...), password: str = Form(...), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    access_token = create_access_token(data={"sub": user.id, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer", "user": {"id": user.id, "full_name": user.full_name, "email": user.email, "phone": user.phone, "role": user.role, "created_at": str(user.created_at), "updated_at": str(user.updated_at)}}

@router.get("/me")
async def get_me(user: User = Depends(get_current_user)):
    return {"id": user.id, "full_name": user.full_name, "email": user.email, "phone": user.phone, "role": user.role, "created_at": str(user.created_at), "updated_at": str(user.updated_at)}