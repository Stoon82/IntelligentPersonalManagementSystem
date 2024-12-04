# Intelligent Project Management System (IPMS) Documentation

## Overview
IPMS is a comprehensive project management system that combines traditional project management features with intelligent capabilities for idea management, concept organization, and activity tracking.

## Documentation Structure

### API Documentation
- [Authentication](api/auth.md) - User authentication and authorization
- [Projects](api/projects.md) - Project management endpoints
- [Tasks](api/tasks.md) - Task management endpoints
- [Ideas](api/ideas.md) - Idea management endpoints
- [Concepts](api/concepts.md) - Concept notes endpoints
- [Activities](api/activities.md) - Activity tracking endpoints

### Frontend Documentation
- [Architecture](frontend/architecture.md) - Frontend architecture overview
- [Components](frontend/components/README.md) - Reusable UI components
- [Services](frontend/services/README.md) - API integration services
- [State Management](frontend/state/README.md) - Application state management

### Database Documentation
- [Schema](database/schema.md) - Database schema and models
- [Relationships](database/relationships.md) - Entity relationships

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL 12+

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

## Development Guidelines
- Follow the TypeScript coding standards
- Use the provided API services for backend communication
- Document all new features and API endpoints
- Write tests for critical functionality

## Contributing
Please read our contributing guidelines before submitting pull requests.
