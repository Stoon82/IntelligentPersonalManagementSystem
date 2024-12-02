# IPMS (Intelligent Project Management System)

A full-stack web application for project management with a React TypeScript frontend and FastAPI backend.

## Project Structure

```
IPMS/
├── backend/           # Python FastAPI backend
│   ├── auth/         # Authentication logic
│   ├── models/       # Database models
│   ├── routers/      # API routes
│   ├── schemas/      # Pydantic schemas
│   ├── services/     # Business logic
│   └── tests/        # Backend tests
└── frontend/         # React TypeScript frontend
    ├── public/       # Static files
    └── src/          # Source code
        ├── components/
        ├── contexts/
        ├── hooks/
        ├── pages/
        ├── services/
        └── types/
```

## Setup Instructions

### Backend Setup

1. Create and activate a virtual environment:
   ```bash
   cd backend
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a .env file in the backend directory with:
   ```
   DATABASE_URL=sqlite:///./sql_app.db
   SECRET_KEY=your-secret-key-here
   ```

4. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Development

- Backend API documentation is available at `/docs` or `/redoc`
- Frontend uses Material-UI for components
- TypeScript is used for type safety
- Tests are available in both frontend and backend `/tests` directories
