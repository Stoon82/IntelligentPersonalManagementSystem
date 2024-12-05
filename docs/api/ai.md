# AI Integration API

## Overview
The AI Integration API provides endpoints for accessing AI-powered features and capabilities within the IPMS system.

## Endpoints

### Generate Project Insights
```http
POST /api/ai/insights/project/{project_id}
```

#### Response
```json
{
  "insights": [
    {
      "type": "string",
      "description": "string",
      "confidence": "number",
      "suggestions": ["string"]
    }
  ]
}
```

### Analyze Task Dependencies
```http
POST /api/ai/analyze/tasks
```

#### Request Body
```json
{
  "project_id": "string",
  "tasks": ["string"]
}
```

#### Response
```json
{
  "dependencies": [
    {
      "task_id": "string",
      "depends_on": ["string"],
      "confidence": "number"
    }
  ],
  "suggestions": [
    {
      "type": "string",
      "description": "string"
    }
  ]
}
```

### Generate Task Suggestions
```http
POST /api/ai/suggest/tasks
```

#### Request Body
```json
{
  "project_id": "string",
  "context": "string"
}
```

#### Response
```json
{
  "suggestions": [
    {
      "title": "string",
      "description": "string",
      "priority": "string",
      "estimated_time": "string"
    }
  ]
}
```

### Analyze Journal Sentiment
```http
POST /api/ai/analyze/journal
```

#### Request Body
```json
{
  "entry_ids": ["string"]
}
```

#### Response
```json
{
  "sentiments": [
    {
      "entry_id": "string",
      "sentiment": "string",
      "confidence": "number",
      "key_topics": ["string"]
    }
  ]
}
```

### Generate Documentation
```http
POST /api/ai/generate/docs
```

#### Request Body
```json
{
  "content_type": "string",
  "context": "string",
  "format": "string"
}
```

#### Response
```json
{
  "content": "string",
  "sections": [
    {
      "title": "string",
      "content": "string"
    }
  ],
  "metadata": {
    "generated_at": "string",
    "model_version": "string"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid input for AI analysis"
}
```

### 429 Too Many Requests
```json
{
  "detail": "AI quota exceeded"
}
```

### 503 Service Unavailable
```json
{
  "detail": "AI service temporarily unavailable"
}
```
