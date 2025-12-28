# API Endpoints Reference

## Authentication

### POST /api/v1/auth/register
Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": { ...user object },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### POST /api/v1/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### POST /api/v1/auth/logout
Logout current user.

### POST /api/v1/auth/refresh-token
Refresh access token using refresh token.

### POST /api/v1/auth/forgot-password
Request password reset email.

### PATCH /api/v1/auth/reset-password/:token
Reset password using token from email.

### GET /api/v1/auth/verify-email/:token
Verify email address using token.

### GET /api/v1/auth/me
Get current authenticated user's information.

---

## Users

### GET /api/v1/users
Get all users (Admin only).

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search term
- `role` - Filter by role

### GET /api/v1/users/:id
Get user by ID.

### PATCH /api/v1/users/:id
Update user information.

### DELETE /api/v1/users/:id
Deactivate user account.

### PATCH /api/v1/users/:id/password
Update user password.

### PATCH /api/v1/users/:id/preferences
Update user preferences.

---

## Projects

### POST /api/v1/projects
Create a new project.

**Request Body:**
```json
{
  "name": "My Awesome App",
  "description": "A modern web application",
  "framework": "nextjs",
  "technologies": ["react", "typescript", "tailwind"]
}
```

### GET /api/v1/projects
Get all projects for authenticated user.

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `status` - Filter by status
- `search` - Search term

### GET /api/v1/projects/:id
Get project by ID.

### PATCH /api/v1/projects/:id
Update project.

### DELETE /api/v1/projects/:id
Delete project.

### POST /api/v1/projects/:id/clone
Clone an existing project.

### POST /api/v1/projects/:id/collaborators
Add collaborator to project (Pro/Enterprise).

### DELETE /api/v1/projects/:id/collaborators
Remove collaborator from project.

### GET /api/v1/projects/:id/analytics
Get project analytics.

---

## Chat

### POST /api/v1/chat
Create a new chat session.

**Request Body:**
```json
{
  "projectId": "project_id",
  "title": "Implementation Discussion"
}
```

### GET /api/v1/chat
Get all chats for a project.

**Query Parameters:**
- `projectId` - Project ID (required)

### GET /api/v1/chat/:id
Get chat by ID.

### POST /api/v1/chat/:id/messages
Send a message in chat.

**Request Body:**
```json
{
  "content": "Create a user authentication component with React"
}
```

### PATCH /api/v1/chat/:id/status
Update chat status.

---

## Deployments

### POST /api/v1/deployments
Create a new deployment.

**Request Body:**
```json
{
  "projectId": "project_id",
  "provider": "vercel",
  "branch": "main",
  "environmentVariables": [
    { "key": "API_URL", "value": "https://api.example.com" }
  ],
  "isProduction": true
}
```

### GET /api/v1/deployments
Get all deployments.

**Query Parameters:**
- `projectId` - Filter by project

### GET /api/v1/deployments/:id
Get deployment by ID.

### POST /api/v1/deployments/:id/cancel
Cancel an in-progress deployment.

### GET /api/v1/deployments/:id/logs
Get deployment logs.

---

## Subscriptions

### GET /api/v1/subscriptions/plans
Get available subscription plans (Public).

### POST /api/v1/subscriptions
Create a new subscription.

**Request Body:**
```json
{
  "plan": "pro",
  "paymentMethodId": "pm_xxx"
}
```

### GET /api/v1/subscriptions
Get current subscription status.

### PATCH /api/v1/subscriptions/:id
Update subscription plan.

### DELETE /api/v1/subscriptions/:id
Cancel subscription.

---

## Analytics

### GET /api/v1/analytics/overview
Get overall analytics for authenticated user.

### GET /api/v1/analytics/projects/:projectId
Get analytics for a specific project.

### GET /api/v1/analytics/users/:userId
Get analytics for a specific user (Admin only).

---

## Webhooks

### POST /api/v1/webhooks/stripe
Stripe webhook endpoint (handled automatically).

---

## Response Codes

- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Authentication

Most endpoints require authentication using Bearer token:

```
Authorization: Bearer <your_jwt_token>
```

## Rate Limits

- General API: 100 requests per 15 minutes
- Authentication: 5 requests per 15 minutes
- Chat: 20 requests per minute
