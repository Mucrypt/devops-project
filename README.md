# NexusAI - DevOps Project

Complete full-stack application with Docker orchestration.

## 🏗️ Project Structure

```
devops-project/
├── backend/                 # Node.js + Express + TypeScript API
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── chat-to-code-38/        # React + Vite frontend
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml      # Docker orchestration
├── docker-setup.sh         # Automated setup script
├── .env.example           # Environment variables template
└── DOCKER_SETUP.md        # Detailed Docker documentation
```

## 🚀 Quick Start with Docker

### Prerequisites
- Docker >= 20.10
- Docker Compose >= 2.0

### 1. One-Command Setup
```bash
cd /home/mukulah/devops-project
./docker-setup.sh
```

### 2. Manual Setup
```bash
# Copy environment file
cp .env.example .env
# Edit .env with your settings

# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

## 📦 Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 80 | React app with Nginx |
| Backend | 5000 | Express TypeScript API |
| MongoDB | 27017 | Database |

## 🔗 Access Points

- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- **MongoDB**: mongodb://nexusai:nexusai123@localhost:27017/nexusai

## 🛠️ Development

### Backend Development
```bash
cd backend
npm install
npm run dev
```

### Frontend Development
```bash
cd chat-to-code-38
npm install
npm run dev
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild services
docker-compose up -d --build

# Check status
docker-compose ps
```

## 📚 Documentation

- [Docker Setup Guide](docs/DOCKER_SETUP.md) - Comprehensive Docker documentation
- [Backend Documentation](backend/README.md) - Backend API details
- [Backend TypeScript Guide](backend/TYPESCRIPT_COMPLETE.md) - TypeScript implementation

## 🏗️ Architecture

```
┌─────────────┐
│   Nginx     │ :80
│  (Frontend) │
└──────┬──────┘
       │
       │ proxy /api
       ↓
┌─────────────┐
│   Express   │ :5000
│  (Backend)  │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   MongoDB   │ :27017
│  (Database) │
└─────────────┘
```

## 🔐 Security

1. Change default credentials in `.env`
2. Never commit `.env` to git
3. Use strong JWT secrets
4. Enable HTTPS in production
5. Regularly update dependencies

## 📊 Stack

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Shadcn/ui components

### Backend
- Node.js 20
- Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Winston Logger

### DevOps
- Docker
- Docker Compose
- Nginx
- Multi-stage builds

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker
5. Submit a pull request

## 📝 License

MIT

## 👥 Authors

NexusAI Team

---

**Ready to deploy! Run: `./docker-setup.sh`** 🚀
