# Project API Documentation

## Base URL
All project endpoints are prefixed with `/api/projects`

## Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Get All Projects
`GET /api/projects`

Retrieves a list of projects for the authenticated user.

**Query Parameters:**
- `status` (optional): Filter by project status (planning, in_progress, completed, cancelled)
- `skip` (optional): Number of records to skip (default: 0)
- `limit` (optional): Number of records to return (default: 10, max: 100)
- `sort_by` (optional): Sort by field (created_at, updated_at, title, status)
- `sort_order` (optional): Sort order (asc, desc, default: desc)

**Response:**
```typescript
{
  data: Project[];
  total: number;
}
```

### Get Project Members
`GET /api/projects/{project_id}/members`

Retrieves all members of a specific project.

**Parameters:**
- `project_id` (required): ID of the project

**Response:**
```typescript
ProjectMember[]
```

### Get Project Activities
`GET /api/projects/{project_id}/activities`

Retrieves all activities for a specific project.

**Parameters:**
- `project_id` (required): ID of the project
- `skip` (optional): Number of records to skip (default: 0)
- `limit` (optional): Number of records to return (default: 50, max: 100)

**Response:**
```typescript
Activity[]
```

### Get Project Concepts
`GET /api/projects/{project_id}/concepts`

Retrieves all concept notes for a specific project.

**Parameters:**
- `project_id` (required): ID of the project

**Response:**
```typescript
ConceptNote[]
```

### Get Project Ideas
`GET /api/projects/{project_id}/ideas`

Retrieves all ideas linked to a specific project.

**Parameters:**
- `project_id` (required): ID of the project

**Response:**
```typescript
Idea[]
```

### Create Project
`POST /api/projects`

Creates a new project.

**Request Body:**
```typescript
{
  title: string;
  description?: string;
  status?: ProjectStatus;
  target_end_date?: string; // ISO date string
}
```

**Response:**
```typescript
Project
```

### Update Project
`PUT /api/projects/{project_id}`

Updates an existing project.

**Parameters:**
- `project_id` (required): ID of the project

**Request Body:**
```typescript
{
  title?: string;
  description?: string;
  status?: ProjectStatus;
  target_end_date?: string; // ISO date string
}
```

**Response:**
```typescript
Project
```

### Delete Project
`DELETE /api/projects/{project_id}`

Deletes a project and all associated data.

**Parameters:**
- `project_id` (required): ID of the project

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

## Models

### Project
```typescript
interface Project {
  id: number;
  title: string;
  description?: string;
  status: ProjectStatus;
  start_date: string;
  target_end_date?: string;
  actual_end_date?: string;
  owner_id: number;
  created_at: string;
  updated_at: string;
}
```

### ProjectMember
```typescript
interface ProjectMember {
  id: number;
  project_id: number;
  user_id: number;
  role: string;
  permissions: string[];
  joined_at: string;
}
```

### ProjectStatus
```typescript
type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'cancelled';
```
