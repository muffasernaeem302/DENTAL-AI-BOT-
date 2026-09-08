"""API module for DentalAI backend."""
from fastapi import APIRouter
from .endpoints import auth, patients, appointments, conversations, intakes
from .endpoints.ai import chat as ai_chat
from .endpoints.alerts import router as alerts_router

api_router = APIRouter(prefix="/api")

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(patients.router, prefix="/patients", tags=["Patients"])
api_router.include_router(appointments.router, prefix="/appointments", tags=["Appointments"])
api_router.include_router(conversations.router, prefix="/conversations", tags=["Conversations"])
api_router.include_router(intakes.router, prefix="/intakes", tags=["Intakes"])
api_router.include_router(ai_chat.router, prefix="/ai", tags=["AI Chat"])
api_router.include_router(alerts_router, prefix="/alerts", tags=["Dentist Alerts"])
 
