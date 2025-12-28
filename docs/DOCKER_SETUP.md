# 🐳 NexusAI - Docker Setup

Complete Docker configuration for NexusAI application stack.

## 📦 Stack Components

- **Frontend**: React + Vite + TypeScript (Nginx)
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB 7.0

## 🚀 Quick Start

### Prerequisites
- Docker >= 20.10
- Docker Compose >= 2.0

### 1. Clone and Setup

```bash
cd /home/mukulah/devops-project

# Copy environment file
cp .env.example .env

# Edit .env with your settings
nano .env
```

### 2. Build and Start

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### 3. Access Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- **MongoDB**: localhost:27017

## 🛠️ Docker Commands

### Start Services
```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d frontend
docker-compose up -d backend
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Rebuild Services
```bash
# Rebuild all services
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build backend
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Execute Commands
```bash
# Access backend container
docker-compose exec backend sh

# Access MongoDB shell
docker-compose exec mongodb mongosh -u nexusai -p nexusai123

# Access frontend container
docker-compose exec frontend sh
```

### Check Status
```bash
# List running containers
docker-compose ps

# Check health status
docker-compose ps --format json | jq '.[].Health'
```

## 📁 Service Details

### Frontend Container
- **Port**: 80
- **Image**: nginx:alpine
- **Build**: Multi-stage (Node.js builder + Nginx)
- **Features**:
  - Production optimized
  - Gzip compression
  - Security headers
  - Static asset caching
  - Client-side routing support
  - API proxy to backend

### Backend Container
- **Port**: 5000
- **Image**: node:20-alpine
- **Features**:
  - TypeScript compiled
  - Health checks
  - Log persistence
  - MongoDB connection
  - Environment variables

### MongoDB Container
- **Port**: 27017
- **Image**: mongo:7.0
- **Credentials**:
  - Username: nexusai
  - Password: nexusai123
  - Database: nexusai
- **Volumes**:
  - Data: mongodb_data
  - Config: mongodb_config

## 🔧 Configuration

### Environment Variables

Edit `.env` file:

```env
# JWT
JWT_SECRET=your-super-secret-key

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Optional APIs
STRIPE_SECRET_KEY=sk_test_xxx
OPENAI_API_KEY=sk-xxx
```

### MongoDB Connection

From host machine:
```bash
mongosh "mongodb://nexusai:nexusai123@localhost:27017/nexusai?authSource=admin"
```

From backend container:
```bash
mongosh "mongodb://nexusai:nexusai123@mongodb:27017/nexusai?authSource=admin"
```

## 🔍 Health Checks

All services have health checks configured:

```bash
# Check all services health
docker-compose ps

# Manual health check
curl http://localhost:5000/health
curl http://localhost/
```

## 📊 Monitoring

### View Resource Usage
```bash
# All containers
docker stats

# Specific container
docker stats nexusai-backend
```

### Check Logs Size
```bash
docker-compose logs --tail=1000 | wc -l
```

## 🛡️ Security

### Production Recommendations

1. **Change Default Credentials**
   ```bash
   # Generate secure MongoDB password
   openssl rand -base64 32
   
   # Generate secure JWT secret
   openssl rand -base64 64
   ```

2. **Update docker-compose.yml**
   - Remove port mappings for MongoDB (internal only)
   - Use Docker secrets for sensitive data
   - Enable TLS/SSL

3. **Use Environment Files**
   ```bash
   # Never commit .env to git
   echo ".env" >> .gitignore
   ```

## 🐛 Troubleshooting

### Service Won't Start
```bash
# Check logs
docker-compose logs backend

# Restart service
docker-compose restart backend

# Rebuild from scratch
docker-compose down -v
docker-compose up -d --build
```

### MongoDB Connection Issues
```bash
# Check MongoDB is healthy
docker-compose ps mongodb

# View MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Port Already in Use
```bash
# Find process using port 80
sudo lsof -i :80
sudo lsof -i :5000
sudo lsof -i :27017

# Kill process
sudo kill -9 <PID>
```

### Clear Everything and Start Fresh
```bash
# Stop and remove all containers, networks, volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Rebuild and start
docker-compose up -d --build
```

## 📈 Scaling

### Scale Backend
```bash
# Run 3 backend instances
docker-compose up -d --scale backend=3

# Note: You'll need a load balancer for multiple backends
```

## 🔄 Updates

### Update Images
```bash
# Pull latest images
docker-compose pull

# Restart with new images
docker-compose up -d
```

### Update Code
```bash
# Rebuild after code changes
docker-compose up -d --build
```

## 💾 Backup

### Backup MongoDB
```bash
# Create backup
docker-compose exec mongodb mongodump \
  --uri="mongodb://nexusai:nexusai123@localhost:27017/nexusai?authSource=admin" \
  --out=/data/backup

# Copy backup to host
docker cp nexusai-mongodb:/data/backup ./backup
```

### Restore MongoDB
```bash
# Copy backup to container
docker cp ./backup nexusai-mongodb:/data/backup

# Restore
docker-compose exec mongodb mongorestore \
  --uri="mongodb://nexusai:nexusai123@localhost:27017/nexusai?authSource=admin" \
  /data/backup
```

## 🚢 Production Deployment

### Using Docker Swarm
```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml nexusai

# Check services
docker stack services nexusai
```

### Using Kubernetes
```bash
# Convert to Kubernetes
kompose convert -f docker-compose.yml

# Apply manifests
kubectl apply -f .
```

## 📝 Network

### Internal Network
- Name: nexusai-network
- Type: bridge
- Services can communicate using service names:
  - backend → mongodb
  - frontend → backend

### External Access
- Frontend: Port 80 → Container 80
- Backend: Port 5000 → Container 5000
- MongoDB: Port 27017 → Container 27017

## 🎯 Best Practices

1. ✅ Use `.env` for sensitive data
2. ✅ Never commit secrets to git
3. ✅ Use named volumes for persistence
4. ✅ Implement health checks
5. ✅ Use multi-stage builds
6. ✅ Minimize image size
7. ✅ Set resource limits in production
8. ✅ Use specific image tags (not `latest`)
9. ✅ Regular backups
10. ✅ Monitor logs and metrics

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)
- [Nginx Docker Hub](https://hub.docker.com/_/nginx)

---

**Ready to run! Execute: `docker-compose up -d`** 🚀
