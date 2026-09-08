# DentalAI

AI-powered dental clinic assistant and multi-agent workflow platform.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- npm or yarn

### Installation

```bash
# Install all dependencies
npm install

# Install frontend dependencies
npm install --workspace=frontend

# Install backend dependencies
npm install --workspace=backend
```

### Running the Application

#### Development Mode (Both Frontend & Backend)

```bash
npm run dev
```

#### Individual Services

**Frontend (React + Vite):**
```bash
npm run dev:frontend
# Opens at http://localhost:5173
```

**Backend (FastAPI):**
```bash
npm run dev:backend
# Runs at http://localhost:8000
```

### Building for Production

**Frontend:**
```bash
npm run build --workspace=frontend
```

**Backend:**
```bash
npm run build --workspace=backend
```

## 📁 Project Structure

```
DentalAI/
├── frontend/          # React + Vite + TypeScript frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route pages
│   │   ├── layouts/     # Layout components
│   │   ├── services/    # API services
│   │   ├── hooks/       # Custom React hooks
│   │   ├── types/       # TypeScript types
│   │   └── utils/       # Utility functions
├── backend/           # Python + FastAPI backend
│   ├── api/           # API endpoints
│   ├── agents/         # AI agent implementations
│   ├── models/         # SQLAlchemy models
│   ├── schemas/        # Pydantic schemas
│   ├── services/       # Business logic
│   ├── tools/          # Agent tools
│   ├── database/       # Database configuration
│   └── core/           # Core configuration
├── docs/              # Documentation
└── tests/             # Test files
```

## 🎯 Core Features

### For Patients
- AI-powered chat assistant for questions
- Appointment scheduling and management
- Pre-visit information collection
- Personal profile management
- Secure communication with clinic

### For Dentists
- Patient dashboard with summaries
- Appointment management
- AI-generated patient visit summaries
- Patient history and records access

### For Receptionists
- Appointment scheduling
- Patient check-in/check-out
- Communication management

### For Administrators
- System configuration
- User management
- Analytics dashboard

## 🔒 Security

- API keys stored server-side only
- Environment variables for sensitive data
- Role-based access control
- HIPAA-conscious design principles

## 📚 Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [AI Agents](docs/AGENTS.md)
- [API Reference](docs/API.md)
- [Security](docs/SECURITY.md)

## ⚠️ Medical Disclaimer

DentalAI is designed to assist dental clinics with administrative tasks and patient communication. It is **NOT** intended to:

- Diagnose medical conditions
- Prescribe treatments
- Replace qualified healthcare professionals

Always consult with qualified dental professionals for medical advice.

## 📄 License

MIT License - See LICENSE file for details.
