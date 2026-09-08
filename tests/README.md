# DentalAI Tests

## Running Tests

### Backend Tests
```bash
cd backend
pip install -r requirements.txt
pytest
```

### Frontend Tests
```bash
cd frontend
npm install
npm test
```

## Test Structure

```
tests/
├── backend/
│   ├── test_api.py        # API endpoint tests
│   └── test_agents.py     # Agent tests (future)
├── frontend/
│   └── example.test.ts    # Frontend tests (future)
└── README.md
```

## Current Test Status

- Backend: Basic tests for API endpoints
- Frontend: Placeholder tests (to be implemented with testing library)

## Notes

- Tests are minimal for MVP
- Expand test coverage as features are added
- Include integration tests for API workflows
- Add E2E tests with Playwright/Cypress
