# Tasks API

## Overview
The Tasks API provides endpoints for managing project tasks, including creation, updates, and status tracking.

## Endpoints

### List Tasks
```http
GET /api/tasks
```

#### Query Parameters
- `project_id` (optional): Filter tasks by project
- `status` (optional): Filter by task status
- `priority` (optional): Filter by priority level

#### Response
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "status": "string",
    "priority": "string",
    "due_date": "string",
    "project_id": "string",
    "assigned_to": "string",
    "created_at": "string",
    "updated_at": "string"
  }
]
```

### Create Task
```http
POST /api/tasks
```

#### Request Body
```json
{
  "title": "string",
  "description": "string",
  "status": "string",
  "priority": "string",
  "due_date": "string",
  "project_id": "string",
  "assigned_to": "string"
}
```

### Get Task
```http
GET /api/tasks/{task_id}
```

### Update Task
```http
PUT /api/tasks/{task_id}
```

#### Request Body
```json
{
  "title": "string",
  "description": "string",
  "status": "string",
  "priority": "string",
  "due_date": "string",
  "assigned_to": "string"
}
```

### Delete Task
```http
DELETE /api/tasks/{task_id}
```

### Update Task Status
```http
PATCH /api/tasks/{task_id}/status
```

#### Request Body
```json
{
  "status": "string"
}
```

## Task Statuses
- `TODO`
- `IN_PROGRESS`
- `REVIEW`
- `DONE`

## Priority Levels
- `LOW`
- `MEDIUM`
- `HIGH`
- `URGENT`

## Error Responses

### 404 Not Found
```json
{
  "detail": "Task not found"
}
```

### 403 Forbidden
```json
{
  "detail": "Not authorized to access this task"
}
```
