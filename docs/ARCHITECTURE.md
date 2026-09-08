# DentalAI Architecture

## Overview

DentalAI is a full-stack web application built with a modern, scalable architecture. The system uses AI agents as assistants for administrative tasks while maintaining strict boundaries against medical decision-making.

## Technology Stack

### Frontend
- **React 18** - UI library with hooks
- **Vite** - Build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **React Router 6** - Client-side routing
- **Lucide React** - Icon library

### Backend
- **Python 3.10+** - Runtime
- **FastAPI** - Web framework
- **SQLAlchemy 2.0** - ORM (async)
- **Pydantic 2.0** - Data validation
- **aiosqlite** - Async SQLite driver

### Infrastructure
- **SQLite** - Development database
- **PostgreSQL-ready** - Production database (configurable)

## Project Structure

```
DentalAI/
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/             # Base UI components (Button, Card, etc.)
│   │   │   └── layout/         # Layout components (Sidebar, Header)
│   │   ├── pages/              # Route pages
│   │   │   ├── patient/        # Patient-specific pages
│   │   │   └── dentist/        # Dentist-specific pages
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API service layer
│   │   ├── types/              # TypeScript type definitions
│   │   └── utils/              # Utility functions
│   └── public/                 # Static assets
│
├── backend/                    # Python backend
│   ├── api/                   # API endpoints
│   │   └── endpoints/         # Route handlers
│   ├── agents/                # AI agent implementations
│   ├── models/                # SQLAlchemy ORM models
│   ├── schemas/              # Pydantic schemas
│   ├── services/             # Business logic
│   ├── tools/                # Agent tools
│   ├── database/             # Database configuration
│   ├── core/                 # Core utilities (config, security)
│   └── main.py               # Application entry point
│
├── docs/                     # Documentation
├── tests/                    # Test files
└── docs/                     # Project docs
```

## Component Architecture

### Frontend Layers

1. **Pages** (`/pages`)
   - Route-level components
   - Handle page-specific logic
   - Compose layouts and components

2. **Layouts** (`/components/layout`)
   - Page structure wrappers
   - Navigation handling
   - Authentication-aware rendering

3. **UI Components** (`/components/ui`)
   - Reusable base components
   - Design system implementation
   - Styled with Tailwind CSS

4. **Services** (`/services`)
   - API communication layer
   - Request/response handling
   - Mock data for development

5. **Hooks** (`/hooks`)
   - State management patterns
   - Data fetching logic
   - Reusable stateful logic

### Backend Layers

1. **API Layer** (`/api/endpoints`)
   - FastAPI route handlers
   - Request validation
   - Response formatting

2. **Service Layer** (`/services`)
   - Business logic
   - Data transformation
   - Cross-cutting concerns

3. **Data Layer** (`/models`, `/schemas`)
   - SQLAlchemy models (database)
   - Pydantic schemas (validation)

4. **Agent Layer** (`/agents`)
   - AI orchestration
   - Tool definitions
   - Response generation

## Data Flow

```
User Action → React Component → Service → API Endpoint → 
    → Agent/Service → Database → Response → 
    → React Hook → Component Update
```

## Security Considerations

- API keys stored server-side only
- Environment variables for sensitive data
- CORS configured for specific origins
- Password hashing (bcrypt)
- JWT for authentication (future)
- No medical decision-making by AI

## Environment Configuration

```bash
# Frontend (.env)
VITE_API_URL=http://localhost:8000

# Backend (.env)
DATABASE_URL=sqlite+aiosqlite:///./dentalai.db
OPENAI_API_KEY=your-key-here
SECRET_KEY=your-secret-key
```

## API Design

### Versioning
- API versioning: `/api/v1/`
- Future versions: `/api/v2/`

### Endpoints Structure
```
/api/v1/auth/login
/api/v1/appointments
/api/v1/chat
```

### Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
```

## Database Schema

### Core Entities
- **User** - Base user (patient, dentist, receptionist, admin)
- **Appointment** - Scheduled visits
- **Message** - Chat messages
- **Conversation** - Chat sessions
- **PatientSummary** - AI-generated summaries

### Relationships
- Patient → Appointments (1:N)
- Dentist → Appointments (1:N)
- Patient → Conversations (1:N)
- Conversation → Messages (1:N)

## AI Agent Architecture

### Available Agents

1. **Patient Assistant**
   - Handles patient inquiries
   - Provides appointment info
   - Answers general questions

2. **Summary Generator**
   - Creates patient visit summaries
   - Extracts key points
   - Provides recommendations

### Agent Principles
- Never diagnose conditions
- Never prescribe treatments
- Always recommend professional consultation
- Maintain strict scope boundaries

## Deployment Considerations

### Frontend
- Build: `npm run build`
- Output: `frontend/dist/`
- Deploy: Static hosting (Vercel, Netlify, S3)

### Backend
- Run: `uvicorn main:app --host 0.0.0.0 --port 8000`
- Database migration support needed for production
- Environment-specific configuration

## Future Enhancements

- Real authentication (JWT/OAuth)
- PostgreSQL for production
- WebSocket for real-time chat
- AI model integration (OpenAI/Anthropic)
- Email/SMS notifications
- File upload for X-rays/documents
