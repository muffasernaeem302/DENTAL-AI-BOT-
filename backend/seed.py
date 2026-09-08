"""Seed script to create demo users."""
import asyncio
import uuid
from database import async_session_maker, engine, Base
from models import User, DentistProfile
from core.security import create_password_hash
from schemas import UserRole

async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with async_session_maker() as db:
        patient = User(id=str(uuid.uuid4()), full_name="Demo Patient", email="patient@demo.com", phone="+1 (555) 123-4567", role=UserRole.PATIENT.value, password_hash=create_password_hash("demo123"))
        db.add(patient)
        
        dentist = User(id=str(uuid.uuid4()), full_name="Dr. Sarah Chen", email="dentist@demo.com", phone="+1 (555) 987-6543", role=UserRole.DENTIST.value, password_hash=create_password_hash("demo123"))
        db.add(dentist)
        
        dentist_profile = DentistProfile(id=str(uuid.uuid4()), user_id=dentist.id, specialization="General Dentistry", license_reference="DENT-12345")
        db.add(dentist_profile)
        
        admin = User(id=str(uuid.uuid4()), full_name="Admin User", email="admin@demo.com", phone="+1 (555) 000-0000", role=UserRole.ADMIN.value, password_hash=create_password_hash("demo123"))
        db.add(admin)
        
        await db.commit()
        print("Demo users created:")
        print("  - patient@demo.com / demo123 (Patient)")
        print("  - dentist@demo.com / demo123 (Dentist)")
        print("  - admin@demo.com / demo123 (Admin)")

if __name__ == "__main__":
    asyncio.run(seed())