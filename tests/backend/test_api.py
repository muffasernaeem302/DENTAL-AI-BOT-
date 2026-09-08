"""
Backend API tests for DentalAI.
"""
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from main import app


@pytest_asyncio.fixture
async def client():
    """Create async test client."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.mark.asyncio
async def test_root(client):
    """Test root endpoint."""
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "DentalAI"
    assert data["status"] == "running"


@pytest.mark.asyncio
async def test_health_check(client):
    """Test health endpoint."""
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


@pytest.mark.asyncio
async def test_appointments_require_authentication(client):
    """Appointment data is protected by authentication."""
    response = await client.get("/api/appointments/")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_chat_requires_authentication(client):
    """Patient conversations are protected by authentication."""
    response = await client.post(
        "/api/ai/chat",
        data={"message": "Hello, I need an appointment"},
    )
    assert response.status_code == 401
