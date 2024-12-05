# Intelligent Project Management System (IPMS) Documentation

## Overview
IPMS is a comprehensive project management system that combines traditional project management features with intelligent capabilities for idea management, concept organization, and activity tracking.

## Documentation Structure

### Backend Documentation
- [Authentication](api/auth.md) - User authentication and authorization
- [Projects](api/projects.md) - Project management endpoints
- [Tasks](api/tasks.md) - Task management endpoints
- [Ideas](api/ideas.md) - Idea management endpoints
- [Journal](api/journal.md) - Journal entries management
- [User Content](api/user-content.md) - User content management
- [AI Integration](api/ai.md) - AI-powered features and capabilities

### Frontend Documentation
- [Architecture](frontend/architecture.md) - Frontend architecture overview
- [Components](frontend/components/README.md) - Reusable UI components
- [Pages](frontend/pages/README.md) - Application pages and routing
- [Contexts](frontend/contexts/README.md) - React context providers
- [Hooks](frontend/hooks/README.md) - Custom React hooks
- [Services](frontend/services/README.md) - API integration services
- [Types](frontend/types/README.md) - TypeScript type definitions
- [Utils](frontend/utils/README.md) - Utility functions
- [Styles](frontend/styles/README.md) - Global styles and theming
- [Debug Tools](frontend/debug/README.md) - Debugging utilities and tools

### Database Documentation
- [Schema](database/schema.md) - Database schema and models
- [Migrations](database/migrations.md) - Database migrations with Alembic
- [Relationships](database/relationships.md) - Entity relationships

### Development Tools
- [Debug Module](debug/README.md) - Debugging and logging utilities
- [Scripts](scripts/README.md) - Development and maintenance scripts
- [Tests](tests/README.md) - Testing guidelines and structure

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- SQLite (default) or PostgreSQL 12+

### Environment Setup
1. Set up backend environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. Set up frontend environment:
   ```bash
   cd frontend
   npm install
   ```

### Running the Application
1. Start the backend server:
   ```bash
   cd backend
   python main.py
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

### Debug Mode
- Press `Ctrl + Shift + D` to toggle debug mode
- Debug mode shows element IDs and information for all interactive UI elements
- Debug logs are stored in the `logs` directory

## Development Guidelines
- Follow TypeScript coding standards for frontend development
- Follow PEP 8 guidelines for Python backend code
- Use provided API services for backend communication
- Document all new features and API endpoints
- Write tests for critical functionality
- Use the debug module for troubleshooting

## Project Structure
```
IPMS/
├── backend/
│   ├── ai/           - AI integration modules
│   ├── auth/         - Authentication modules
│   ├── models/       - Database models
│   ├── routers/      - API endpoints
│   ├── schemas/      - Pydantic schemas
│   ├── services/     - Business logic
│   └── tests/        - Backend tests
├── frontend/
│   ├── src/
│   │   ├── components/  - Reusable UI components
│   │   ├── contexts/    - React contexts
│   │   ├── hooks/       - Custom hooks
│   │   ├── pages/       - Application pages
│   │   ├── services/    - API services
│   │   ├── styles/      - CSS styles
│   │   ├── types/       - TypeScript types
│   │   └── utils/       - Utility functions
│   └── tests/           - Frontend tests
└── docs/               - Project documentation
