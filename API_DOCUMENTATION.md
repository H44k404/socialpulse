# SocialPulse API Documentation

## Authentication

All API endpoints require authentication except for authentication endpoints themselves.

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## Endpoints

### Authentication

#### POST /api/auth/signin
Sign in with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "User Name",
    "avatar": "https://...",
    "plan": "pro"
  },
  "token": "jwt_token_here",
  "message": "Sign in successful"
}
```

#### POST /api/auth/signup
Create a new account.

**Request Body:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### POST /api/auth/forgot-password
Request password reset.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

### Dashboard

#### GET /api/dashboard/analytics
Get analytics data.

**Query Parameters:**
- `timeframe`: 7d, 30d, 90d (default: 30d)
- `platform`: instagram, twitter, facebook, linkedin

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalPosts": 1247,
      "totalEngagement": 45632,
      "totalFollowers": 89234,
      "growthRate": 12.5
    },
    "engagement": {
      "likes": 23456,
      "comments": 8765,
      "shares": 3456,
      "saves": 1955
    },
    "platformStats": [...],
    "recentPosts": [...],
    "growthChart": [...]
  }
}
```

### Posts Management

#### GET /api/posts
Get user's posts.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "content": "Post content...",
      "platforms": ["instagram", "twitter"],
      "scheduledDate": "2024-01-15T10:00:00Z",
      "status": "scheduled",
      "createdAt": "2024-01-10T09:00:00Z",
      "media": []
    }
  ]
}
```

#### POST /api/posts
Create a new post.

**Request Body:**
```json
{
  "content": "Post content here...",
  "platforms": ["instagram", "twitter"],
  "scheduledDate": "2024-01-15T10:00:00Z",
  "media": ["image1.jpg", "image2.jpg"]
}
```

### User Profile

#### GET /api/user/profile
Get user profile information.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "email": "user@example.com",
    "name": "User Name",
    "avatar": "https://...",
    "bio": "User bio...",
    "website": "https://website.com",
    "location": "City, Country",
    "plan": "pro",
    "socialAccounts": {
      "instagram": {
        "username": "username",
        "connected": true,
        "followers": 15420
      }
    }
  }
}
```

#### PUT /api/user/profile
Update user profile.

**Request Body:**
```json
{
  "name": "Updated Name",
  "bio": "Updated bio...",
  "website": "https://newwebsite.com",
  "location": "New City, Country"
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": "Error message",
  "details": [...] // For validation errors
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized
- 404: Not Found
- 409: Conflict (user already exists)
- 500: Internal Server Error

## Rate Limiting

API endpoints are rate limited to prevent abuse:
- Authentication endpoints: 5 requests per minute
- Other endpoints: 100 requests per minute

## Future Enhancements

- Real database integration (PostgreSQL/MongoDB)
- Social media platform integrations
- File upload handling
- Email notifications
- Webhook support
- Advanced analytics
- Team collaboration features