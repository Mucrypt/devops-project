# 🚀 NexusAI Backend - Quick Start Guide

## Overview

This is a complete, production-ready Node.js + Express + MongoDB backend for the NexusAI application - an AI-powered app builder platform.

## Features at a Glance

✅ **Authentication System** - JWT, email verification, password reset  
✅ **User Management** - Profiles, roles, subscriptions  
✅ **Project Management** - CRUD, collaboration, analytics  
✅ **AI Chat Integration** - OpenAI/Anthropic support  
✅ **Deployment System** - Multi-provider support  
✅ **Payment Integration** - Stripe subscriptions  
✅ **Security** - Rate limiting, helmet, sanitization  
✅ **Logging** - Winston logger with file output  
✅ **API Documentation** - Complete endpoint reference  

## 🏃 Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Setup Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

**Minimum required variables:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nexusai
JWT_SECRET=your-super-secret-key-change-this
CLIENT_URL=http://localhost:5173
```

### Step 3: Start MongoDB

**Option A - Local MongoDB:**
```bash
mongod
```

**Option B - Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:6
```

**Option C - MongoDB Atlas:**
Use a cloud connection string in your `.env`

### Step 4: Start the Server
```bash
npm run dev
```

Server starts at `http://localhost:5000`

### Step 5: Test the API
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2024-12-27T...",
  "uptime": 1.234,
  "environment": "development"
}
```

## 📦 What's Included

### Core Files
- `src/server.js` - Main application entry point
- `src/config/` - Configuration files (CORS, database)
- `src/models/` - Mongoose models (User, Project, Chat, Deployment)
- `src/controllers/` - Business logic for all features
- `src/routes/` - API route definitions
- `src/middleware/` - Auth, error handling, validation
- `src/utils/` - Helper functions (JWT, email, logger)

### API Endpoints

**Authentication:** `/api/v1/auth/*`
- Register, login, logout
- Password reset
- Email verification
- Refresh tokens

**Users:** `/api/v1/users/*`
- User CRUD operations
- Profile management
- Preferences

**Projects:** `/api/v1/projects/*`
- Create/manage projects
- Collaboration features
- Project analytics
- Clone projects

**Chat:** `/api/v1/chat/*`
- AI chat sessions
- Message history
- Token tracking

**Deployments:** `/api/v1/deployments/*`
- Create deployments
- Track status
- View logs

**Subscriptions:** `/api/v1/subscriptions/*`
- Stripe integration
- Plan management
- Billing

**Analytics:** `/api/v1/analytics/*`
- User metrics
- Project stats
- Usage tracking

## 🔧 Configuration Guide

### Environment Variables

#### Required
- `NODE_ENV` - development/production
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens (use a strong random string)
- `CLIENT_URL` - Frontend URL for CORS

#### Optional (for full features)
- `STRIPE_SECRET_KEY` - For payment processing
- `OPENAI_API_KEY` - For AI chat features
- `EMAIL_*` - SMTP settings for emails
- `AWS_*` - For file uploads to S3

### Database Models

**User Model:**
- Authentication (email/password)
- Subscription management
- Usage tracking
- Preferences

**Project Model:**
- Project metadata
- Collaboration
- Deployment info
- AI context

**Chat Model:**
- Conversation history
- Token usage
- Code blocks

**Deployment Model:**
- Build status
- Logs
- Metrics

## 🎯 Common Use Cases

### Register a New User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

### Create a Project
```bash
curl -X POST http://localhost:5000/api/v1/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "My App",
    "description": "A cool app",
    "framework": "nextjs"
  }'
```

### Start a Chat
```bash
curl -X POST http://localhost:5000/api/v1/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "projectId": "PROJECT_ID",
    "title": "Development Chat"
  }'
```

## 🐳 Docker Deployment

### Build and Run
```bash
docker-compose up -d
```

This starts:
- API server on port 5000
- MongoDB on port 27017

### Stop
```bash
docker-compose down
```

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with 12 rounds
- **Rate Limiting** - Prevents brute force attacks
- **Helmet** - Secure HTTP headers
- **CORS** - Configured cross-origin access
- **Input Validation** - express-validator
- **MongoDB Sanitization** - NoSQL injection prevention

## 📊 Monitoring & Logs

Logs are stored in `logs/`:
- `all.log` - All application logs
- `error.log` - Error logs only

Log levels: error, warn, info, http, debug

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Lint code
npm run lint

# Fix lint issues
npm run lint:fix
```

## 🚢 Production Deployment

### Using PM2
```bash
npm install -g pm2
pm2 start src/server.js --name nexusai-api
pm2 save
pm2 startup
```

### Environment Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure production MongoDB
- [ ] Set up Stripe in live mode
- [ ] Configure email service
- [ ] Set up proper CORS origins
- [ ] Enable HTTPS
- [ ] Configure firewall rules

## 📚 Additional Resources

- [Complete API Documentation](./API_DOCS.md)
- [Full README](./README.md)
- [Frontend Repository](../chat-to-code-38)

## 🆘 Troubleshooting

**MongoDB Connection Error:**
- Check if MongoDB is running
- Verify connection string in `.env`
- Check firewall rules

**JWT Token Invalid:**
- Make sure `JWT_SECRET` is set
- Check token format in Authorization header
- Verify token hasn't expired

**Rate Limit Exceeded:**
- Wait for the rate limit window to reset
- Check rate limit configuration in middleware

**Port Already in Use:**
- Change `PORT` in `.env`
- Or kill the process using port 5000

## 🤝 Support

- Documentation: See README.md and API_DOCS.md
- Issues: Open an issue on GitHub
- Email: support@nexusai.dev

## 📄 License

MIT License - See LICENSE file for details

---

**Ready to build? Start with:**
```bash
npm run dev
```

Then visit http://localhost:5000/health 🎉
