# NexusAI Backend API

A comprehensive, production-ready backend API for NexusAI - an AI-powered application builder platform. Built with Node.js, Express, MongoDB, and modern best practices.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (RBAC)
  - Email verification
  - Password reset functionality
  - Refresh token support

- **User Management**
  - User profiles and preferences
  - Subscription plans (Starter, Pro, Enterprise)
  - Usage tracking and limits

- **Project Management**
  - Create, read, update, delete projects
  - Project collaboration with role-based permissions
  - Project cloning
  - Project analytics

- **AI Chat Integration**
  - Conversational AI for code generation
  - Chat history and context management
  - Token usage tracking
  - Support for OpenAI, Anthropic, and other AI services

- **Deployment System**
  - Multi-provider deployment (Vercel, Netlify, AWS)
  - Deployment history and logs
  - Build status tracking
  - Environment variable management

- **Subscription & Payments**
  - Stripe integration
  - Multiple subscription tiers
  - Webhook handling for payment events
  - Trial period support

- **Analytics**
  - User analytics
  - Project analytics
  - Deployment metrics
  - Usage statistics

- **Security**
  - Helmet for HTTP headers security
  - Rate limiting
  - MongoDB sanitization
  - CORS configuration
  - Input validation

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB >= 6.0
- Stripe account (for payments)
- OpenAI or Anthropic API key (for AI features)

## 🛠️ Installation

1. Clone the repository:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nexusai
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=your-stripe-key
OPENAI_API_KEY=your-openai-key
# ... other variables
```

5. Create logs directory:
```bash
mkdir logs
```

## 🚀 Running the Application

### Development Mode (with hot reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Health Check
```
GET /health
```

### Authentication Endpoints

#### Register
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Login
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Get Current User
```
GET /api/v1/auth/me
Authorization: Bearer <token>
```

### Project Endpoints

#### Create Project
```
POST /api/v1/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Awesome App",
  "description": "A modern web application",
  "framework": "nextjs",
  "technologies": ["react", "typescript", "tailwind"]
}
```

#### Get All Projects
```
GET /api/v1/projects?page=1&limit=10
Authorization: Bearer <token>
```

#### Get Single Project
```
GET /api/v1/projects/:id
Authorization: Bearer <token>
```

### Chat Endpoints

#### Create Chat Session
```
POST /api/v1/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "project_id_here",
  "title": "Implementation Discussion"
}
```

#### Send Message
```
POST /api/v1/chat/:id/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Create a user authentication component"
}
```

### Deployment Endpoints

#### Create Deployment
```
POST /api/v1/deployments
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "project_id_here",
  "provider": "vercel",
  "branch": "main",
  "isProduction": true
}
```

#### Get Deployments
```
GET /api/v1/deployments?projectId=project_id_here
Authorization: Bearer <token>
```

### Subscription Endpoints

#### Get Plans
```
GET /api/v1/subscriptions/plans
```

#### Create Subscription
```
POST /api/v1/subscriptions
Authorization: Bearer <token>
Content-Type: application/json

{
  "plan": "pro",
  "paymentMethodId": "pm_xxx"
}
```

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── cors.config.js
│   │   └── database.config.js
│   ├── controllers/      # Route controllers
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── project.controller.js
│   │   ├── chat.controller.js
│   │   ├── deployment.controller.js
│   │   ├── subscription.controller.js
│   │   ├── analytics.controller.js
│   │   └── webhook.controller.js
│   ├── middleware/       # Custom middleware
│   │   ├── auth.middleware.js
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── validator.js
│   ├── models/          # Database models
│   │   ├── User.model.js
│   │   ├── Project.model.js
│   │   ├── Chat.model.js
│   │   └── Deployment.model.js
│   ├── routes/          # API routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── project.routes.js
│   │   ├── chat.routes.js
│   │   ├── deployment.routes.js
│   │   ├── subscription.routes.js
│   │   ├── analytics.routes.js
│   │   └── webhook.routes.js
│   ├── utils/           # Utility functions
│   │   ├── appError.js
│   │   ├── asyncHandler.js
│   │   ├── email.js
│   │   ├── jwt.js
│   │   └── logger.js
│   └── server.js        # Application entry point
├── logs/                # Log files
├── .env.example         # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🔒 Environment Variables

See `.env.example` for all available environment variables.

### Required Variables:
- `NODE_ENV` - Application environment (development/production)
- `PORT` - Server port
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLIENT_URL` - Frontend application URL

### Optional Variables:
- `STRIPE_SECRET_KEY` - Stripe API key for payments
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `AWS_*` - AWS credentials for S3 file uploads
- `EMAIL_*` - Email service configuration

## 🧪 Testing

```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 📝 Code Quality

### Linting
```bash
npm run lint
```

### Fix linting issues
```bash
npm run lint:fix
```

## 🔐 Security Features

- **Helmet**: Sets secure HTTP headers
- **Rate Limiting**: Prevents brute force attacks
- **CORS**: Configured cross-origin resource sharing
- **MongoDB Sanitization**: Prevents NoSQL injection
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Request validation using express-validator
- **Password Hashing**: Using bcryptjs with salt rounds

## 📊 Logging

The application uses Winston for logging with different levels:
- `error`: Error messages
- `warn`: Warning messages
- `info`: Informational messages
- `http`: HTTP request logs
- `debug`: Debug messages

Logs are stored in the `logs/` directory:
- `all.log`: All logs
- `error.log`: Error logs only

## 🚢 Deployment

### Using PM2 (Production)
```bash
npm install -g pm2
pm2 start src/server.js --name nexusai-api
pm2 save
pm2 startup
```

### Using Docker
```bash
# Build image
docker build -t nexusai-api .

# Run container
docker run -p 5000:5000 --env-file .env nexusai-api
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- NexusAI Team

## 🆘 Support

For support, email support@nexusai.dev or join our Slack channel.

## 🔄 API Response Format

### Success Response
```json
{
  "status": "success",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error message here"
}
```

## 📈 Rate Limits

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 attempts per 15 minutes
- **Chat Messages**: 20 messages per minute

## 🔗 Related Projects

- [NexusAI Frontend](../chat-to-code-38) - React/TypeScript frontend application

## 📞 Contact

- Website: https://nexusai.dev
- Email: support@nexusai.dev
- Twitter: @nexusai_dev
