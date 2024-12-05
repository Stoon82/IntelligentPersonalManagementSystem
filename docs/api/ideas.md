# Ideas API

## Overview
The Ideas API provides endpoints for managing creative ideas, brainstorming sessions, and concept development.

## Endpoints

### List Ideas
```http
GET /api/ideas
```

#### Query Parameters
- `status` (optional): Filter by idea status
- `tags` (optional): Filter by tags
- `search` (optional): Search in title and description

#### Response
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "status": "string",
    "tags": ["string"],
    "created_at": "string",
    "updated_at": "string",
    "user_id": "string"
  }
]
```

### Create Idea
```http
POST /api/ideas
```

#### Request Body
```json
{
  "title": "string",
  "description": "string",
  "status": "string",
  "tags": ["string"]
}
```

### Get Idea
```http
GET /api/ideas/{idea_id}
```

### Update Idea
```http
PUT /api/ideas/{idea_id}
```

#### Request Body
```json
{
  "title": "string",
  "description": "string",
  "status": "string",
  "tags": ["string"]
}
```

### Delete Idea
```http
DELETE /api/ideas/{idea_id}
```

### Add Comment
```http
POST /api/ideas/{idea_id}/comments
```

#### Request Body
```json
{
  "content": "string"
}
```

### List Comments
```http
GET /api/ideas/{idea_id}/comments
```

## Idea Statuses
- `DRAFT`
- `ACTIVE`
- `IN_DEVELOPMENT`
- `COMPLETED`
- `ARCHIVED`

## Error Responses

### 404 Not Found
```json
{
  "detail": "Idea not found"
}
```

### 403 Forbidden
```json
{
  "detail": "Not authorized to access this idea"
}
```
