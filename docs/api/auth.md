# Authentication API

## Overview
The authentication system provides secure user registration, login, and token management.

## Endpoints

### Register User
```http
POST /api/auth/register
```

#### Request Body
```json
{
  "email": "string",
  "password": "string",
  "username": "string"
}
```

#### Response
```json
{
  "id": "string",
  "email": "string",
  "username": "string"
}
```

### Login
```http
POST /api/auth/login
```

#### Request Body
```json
{
  "username": "string",
  "password": "string"
}
```

#### Response
```json
{
  "access_token": "string",
  "token_type": "bearer"
}
```

### Get Current User
```http
GET /api/auth/me
```

#### Response
```json
{
  "id": "string",
  "email": "string",
  "username": "string"
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "detail": "Incorrect username or password"
}
```

### 400 Bad Request
```json
{
  "detail": "Email already registered"
}
```
