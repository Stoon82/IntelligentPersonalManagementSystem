# Journal API

## Overview
The Journal API provides endpoints for managing personal and project-related journal entries.

## Endpoints

### List Journal Entries
```http
GET /api/journal
```

#### Query Parameters
- `start_date` (optional): Filter entries from this date
- `end_date` (optional): Filter entries until this date
- `project_id` (optional): Filter by project
- `tags` (optional): Filter by tags

#### Response
```json
[
  {
    "id": "string",
    "title": "string",
    "content": "string",
    "date": "string",
    "tags": ["string"],
    "project_id": "string",
    "created_at": "string",
    "updated_at": "string"
  }
]
```

### Create Journal Entry
```http
POST /api/journal
```

#### Request Body
```json
{
  "title": "string",
  "content": "string",
  "date": "string",
  "tags": ["string"],
  "project_id": "string"
}
```

### Get Journal Entry
```http
GET /api/journal/{entry_id}
```

### Update Journal Entry
```http
PUT /api/journal/{entry_id}
```

#### Request Body
```json
{
  "title": "string",
  "content": "string",
  "date": "string",
  "tags": ["string"],
  "project_id": "string"
}
```

### Delete Journal Entry
```http
DELETE /api/journal/{entry_id}
```

### Get Journal Statistics
```http
GET /api/journal/stats
```

#### Response
```json
{
  "total_entries": "integer",
  "entries_by_month": {
    "YYYY-MM": "integer"
  },
  "top_tags": [
    {
      "tag": "string",
      "count": "integer"
    }
  ]
}
```

## Error Responses

### 404 Not Found
```json
{
  "detail": "Journal entry not found"
}
```

### 403 Forbidden
```json
{
  "detail": "Not authorized to access this journal entry"
}
```
