# DentalAI API Reference

## Base URL

```
Development: http://localhost:8000
Production:  https://api.dentalai.example.com
```

## Versioning

Current version: `v1`

All endpoints are prefixed with `/api/v1/`

## Authentication

Authentication is handled via JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

For development, some endpoints may accept mock authentication.

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Endpoints

### Authentication

#### POST /auth/login
Authenticate user and receive access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "patient"
  }
}
```

#### GET /auth/me
Get current authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "user-123",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "patient"
}
```

---

### Appointments

#### GET /appointments
List appointments with optional filters.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| patient_id | string | Filter by patient |
| dentist_id | string | Filter by dentist |
| status | string | Filter by status |
| date | string | Filter by date (ISO format) |

**Response:**
```json
{
  "items": [
    {
      "id": "apt-123",
      "patient_id": "patient-123",
      "dentist_id": "dentist-123",
      "date_time": "2026-09-10T09:00:00Z",
      "duration": 60,
      "appointment_type": "Check-up",
      "status": "scheduled",
      "reason": "Regular check-up",
      "patient_name": "John Doe",
      "dentist_name": "Dr. Smith"
    }
  ],
  "total": 1,
  "page": 1,
  "page_size": 20,
  "total_pages": 1
}
```

#### GET /appointments/{appointment_id}
Get specific appointment details.

**Response:**
```json
{
  "id": "apt-123",
  "patient_id": "patient-123",
  "dentist_id": "dentist-123",
  "date_time": "2026-09-10T09:00:00Z",
  "duration": 60,
  "appointment_type": "Check-up",
  "status": "scheduled",
  "reason": "Regular check-up",
  "notes": null
}
```

#### POST /appointments
Create new appointment.

**Request Body:**
```json
{
  "patient_id": "patient-123",
  "dentist_id": "dentist-123",
  "date_time": "2026-09-10T09:00:00Z",
  "duration": 60,
  "appointment_type": "Check-up",
  "reason": "Regular check-up"
}
```

**Response:**
```json
{
  "id": "apt-new-456",
  "patient_id": "patient-123",
  "dentist_id": "dentist-123",
  "date_time": "2026-09-10T09:00:00Z",
  "duration": 60,
  "appointment_type": "Check-up",
  "status": "scheduled",
  "reason": "Regular check-up"
}
```

#### PATCH /appointments/{appointment_id}
Update appointment.

**Request Body:**
```json
{
  "date_time": "2026-09-11T10:00:00Z",
  "status": "confirmed"
}
```

#### DELETE /appointments/{appointment_id}
Cancel appointment.

**Response:**
```json
{
  "success": true,
  "message": "Appointment cancelled"
}
```

---

### Chat / AI Assistant

#### POST /chat
Send message to AI assistant.

**Request Body:**
```json
{
  "message": "I need to schedule an appointment",
  "conversation_id": "conv-123" // optional
}
```

**Response:**
```json
{
  "message": {
    "id": "msg-456",
    "role": "assistant",
    "content": "I'd be happy to help you schedule an appointment!",
    "timestamp": "2026-09-03T10:30:00Z"
  },
  "conversation_id": "conv-123"
}
```

#### GET /chat/{conversation_id}/messages
Get conversation history.

**Response:**
```json
{
  "items": [
    {
      "id": "msg-123",
      "role": "user",
      "content": "Hello",
      "timestamp": "2026-09-03T10:00:00Z"
    },
    {
      "id": "msg-456",
      "role": "assistant",
      "content": "Hi! How can I help you?",
      "timestamp": "2026-09-03T10:00:05Z"
    }
  ]
}
```

---

### Patient Summary (Dentist)

#### POST /summary/generate
Generate AI-powered patient summary.

**Request Body:**
```json
{
  "patient_id": "patient-123",
  "appointment_id": "apt-123" // optional
}
```

**Response:**
```json
{
  "id": "sum-789",
  "patient_id": "patient-123",
  "summary": "Patient has good oral health...",
  "key_points": [
    "No cavities detected",
    "Minor gum sensitivity",
    "Allergy: Penicillin"
  ],
  "generated_at": "2026-09-03T10:35:00Z"
}
```

---

## Data Types

### Appointment Status
- `scheduled` - Initial state
- `confirmed` - Confirmed by patient
- `completed` - Visit completed
- `cancelled` - Cancelled by patient/clinic
- `no-show` - Patient did not attend

### User Roles
- `patient` - Patient account
- `dentist` - Dental professional
- `receptionist` - Front desk staff
- `admin` - System administrator

## Error Codes

| Code | Description |
|------|-------------|
| `AUTH_INVALID` | Invalid credentials |
| `AUTH_EXPIRED` | Token expired |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Invalid request data |
| `FORBIDDEN` | Insufficient permissions |
| `INTERNAL_ERROR` | Server error |

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| `/auth/*` | 10 requests/minute |
| `/chat` | 30 requests/minute |
| `/summary/*` | 10 requests/minute |
| Other endpoints | 100 requests/minute |

## Medical Disclaimer

All AI-generated responses include appropriate disclaimers. The API should not be used to make medical decisions. Always consult qualified healthcare professionals.
