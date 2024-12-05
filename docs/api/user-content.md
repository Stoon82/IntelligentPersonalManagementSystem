# User Content API

## Overview
The User Content API provides endpoints for managing user-generated content, including files, notes, and attachments.

## Endpoints

### List User Content
```http
GET /api/content
```

#### Query Parameters
- `type` (optional): Filter by content type
- `tags` (optional): Filter by tags
- `search` (optional): Search in title and description

#### Response
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "type": "string",
    "file_path": "string",
    "mime_type": "string",
    "size": "integer",
    "tags": ["string"],
    "created_at": "string",
    "updated_at": "string"
  }
]
```

### Upload Content
```http
POST /api/content/upload
```

#### Request Body (multipart/form-data)
- `file`: File to upload
- `title`: Content title
- `description` (optional): Content description
- `tags` (optional): Content tags

### Get Content
```http
GET /api/content/{content_id}
```

### Download Content
```http
GET /api/content/{content_id}/download
```

### Update Content Metadata
```http
PUT /api/content/{content_id}
```

#### Request Body
```json
{
  "title": "string",
  "description": "string",
  "tags": ["string"]
}
```

### Delete Content
```http
DELETE /api/content/{content_id}
```

### Get Storage Statistics
```http
GET /api/content/stats
```

#### Response
```json
{
  "total_files": "integer",
  "total_size": "integer",
  "by_type": {
    "documents": {
      "count": "integer",
      "size": "integer"
    },
    "images": {
      "count": "integer",
      "size": "integer"
    }
  }
}
```

## Content Types
- `DOCUMENT`
- `IMAGE`
- `VIDEO`
- `AUDIO`
- `OTHER`

## Error Responses

### 404 Not Found
```json
{
  "detail": "Content not found"
}
```

### 413 Payload Too Large
```json
{
  "detail": "File size exceeds limit"
}
```

### 415 Unsupported Media Type
```json
{
  "detail": "File type not supported"
}
```
