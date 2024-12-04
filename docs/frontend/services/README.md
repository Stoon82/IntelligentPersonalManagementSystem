# Frontend Services Documentation

## Overview
This directory contains all the frontend services that handle API communication and data management.

## Service Structure
Each service is responsible for a specific domain of the application:

### API Service (`api.ts`)
Base API configuration and interceptors.

```typescript
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});
```

### Authentication Service (`auth.ts`)
Handles user authentication and session management.

```typescript
export const auth = {
  login: (credentials: LoginCredentials): Promise<AuthResponse>,
  register: (data: RegisterData): Promise<AuthResponse>,
  getProfile: (): Promise<User>,
  logout: (): Promise<void>,
  refreshToken: (refreshToken: string): Promise<AuthResponse>
};
```

### Project Service (`projects.ts`)
Manages project-related operations.

```typescript
export const projects = {
  getAll: (): Promise<Project[]>,
  getById: (id: number): Promise<Project>,
  create: (project: ProjectCreate): Promise<Project>,
  update: (id: number, project: ProjectUpdate): Promise<Project>,
  delete: (id: number): Promise<void>,
  getMembers: (id: number): Promise<ProjectMember[]>,
  getActivities: (id: number): Promise<Activity[]>
};
```

### Ideas Service (`ideas.ts`)
Handles idea management.

```typescript
export const ideas = {
  getAll: (): Promise<Idea[]>,
  getByProject: (projectId: number): Promise<Idea[]>,
  create: (idea: IdeaCreate): Promise<Idea>,
  update: (id: number, idea: IdeaUpdate): Promise<Idea>,
  delete: (id: number): Promise<void>
};
```

### Concepts Service (`concepts.ts`)
Manages concept notes.

```typescript
export const concepts = {
  getProjectConcepts: (projectId: number): Promise<ConceptNote[]>,
  create: (note: ConceptNoteCreate): Promise<ConceptNote>,
  update: (id: number, note: ConceptNoteUpdate): Promise<ConceptNote>,
  delete: (id: number): Promise<void>
};
```

## Usage Examples

### Authentication
```typescript
// Login
const login = async (username: string, password: string) => {
  try {
    const response = await auth.login({ username, password });
    // Handle successful login
  } catch (error) {
    // Handle error
  }
};

// Get user profile
const getProfile = async () => {
  try {
    const user = await auth.getProfile();
    // Use user data
  } catch (error) {
    // Handle error
  }
};
```

### Projects
```typescript
// Get all projects
const getProjects = async () => {
  try {
    const projects = await projects.getAll();
    // Use projects data
  } catch (error) {
    // Handle error
  }
};

// Create a new project
const createProject = async (projectData: ProjectCreate) => {
  try {
    const newProject = await projects.create(projectData);
    // Handle successful creation
  } catch (error) {
    // Handle error
  }
};
```

## Error Handling
All services use a consistent error handling approach:

```typescript
try {
  const result = await serviceCall();
  // Handle success
} catch (error) {
  if (error.response) {
    // Handle API error response
    switch (error.response.status) {
      case 401:
        // Handle unauthorized
        break;
      case 404:
        // Handle not found
        break;
      default:
        // Handle other errors
    }
  } else if (error.request) {
    // Handle network error
  } else {
    // Handle other errors
  }
}
```

## Best Practices
1. Always use typed parameters and responses
2. Handle errors appropriately
3. Use the API service for all HTTP requests
4. Keep service functions small and focused
5. Document all service functions and types
