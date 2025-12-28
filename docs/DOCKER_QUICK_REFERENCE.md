# 🚀 NexusAI Docker Quick Reference

## ⚡ Quick Start
```bash
./docker-setup.sh          # Automated setup
# OR
docker-compose up -d       # Manual start
```

## 🔗 Access URLs
- **Frontend**: http://localhost
- **Backend**: http://localhost:5000
- **Health**: http://localhost:5000/health
- **MongoDB**: mongodb://nexusai:nexusai123@localhost:27017/nexusai

## 📦 Essential Commands

### Start & Stop
```bash
docker-compose up -d              # Start all services (detached)
docker-compose up -d --build      # Rebuild and start
docker-compose down               # Stop all services
docker-compose down -v            # Stop and remove volumes
docker-compose restart            # Restart all services
docker-compose restart backend    # Restart specific service
```

### Logs & Monitoring
```bash
docker-compose logs -f            # Follow all logs
docker-compose logs -f backend    # Follow backend logs
docker-compose logs --tail=100    # Last 100 lines
docker-compose ps                 # List containers
docker stats                      # Resource usage
```

### Execute Commands
```bash
docker-compose exec backend sh           # Access backend shell
docker-compose exec frontend sh          # Access frontend shell
docker-compose exec mongodb mongosh      # MongoDB shell
```

### Database Operations
```bash
# Connect to MongoDB
docker-compose exec mongodb mongosh -u nexusai -p nexusai123 --authenticationDatabase admin

# Backup database
docker-compose exec mongodb mongodump --uri="mongodb://nexusai:nexusai123@localhost:27017/nexusai?authSource=admin" --out=/tmp/backup

# Restore database
docker-compose exec mongodb mongorestore --uri="mongodb://nexusai:nexusai123@localhost:27017/nexusai?authSource=admin" /tmp/backup
```

### Development Workflow
```bash
# 1. Make code changes
# 2. Rebuild specific service
docker-compose up -d --build backend

# 3. View logs
docker-compose logs -f backend

# 4. Test
curl http://localhost:5000/health
```

### Cleanup
```bash
docker-compose down -v              # Remove volumes
docker system prune -a              # Clean everything (careful!)
docker volume prune                 # Remove unused volumes
docker image prune -a               # Remove unused images
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process
sudo lsof -i :80
sudo lsof -i :5000
sudo lsof -i :27017

# Kill process
sudo kill -9 <PID>
```

### Service Won't Start
```bash
# Check logs
docker-compose logs <service-name>

# Remove and recreate
docker-compose down
docker-compose up -d --build
```

### Fresh Start
```bash
docker-compose down -v --remove-orphans
docker-compose up -d --build
```

### Check Service Health
```bash
# All services
docker-compose ps

# Specific health check
curl http://localhost:5000/health
curl http://localhost/
```

## 📊 Environment Variables

Edit `.env` file:
```bash
cp .env.example .env
nano .env

# Then restart
docker-compose down
docker-compose up -d
```

## 🔐 Security Checklist

- [ ] Change `JWT_SECRET` in `.env`
- [ ] Change MongoDB password in `docker-compose.yml` and `.env`
- [ ] Update email credentials
- [ ] Never commit `.env` to git
- [ ] Use HTTPS in production
- [ ] Enable firewall rules
- [ ] Regular backups

## 📈 Production Deployment

```bash
# 1. Update .env for production
NODE_ENV=production

# 2. Use production Docker Compose (optional)
docker-compose -f docker-compose.prod.yml up -d

# 3. Enable HTTPS with Let's Encrypt
# 4. Set up regular backups
# 5. Configure monitoring
```

## 🔄 Updates

```bash
# Update code
git pull

# Rebuild and restart
docker-compose up -d --build

# Or rebuild specific service
docker-compose up -d --build backend
```

## 📝 Common Issues

**Q: MongoDB connection failed**
```bash
# Check MongoDB is running
docker-compose ps mongodb
docker-compose logs mongodb

# Restart if needed
docker-compose restart mongodb
```

**Q: Backend not responding**
```bash
# Check build
docker-compose logs backend

# Rebuild
docker-compose up -d --build backend
```

**Q: Frontend shows 502 Bad Gateway**
```bash
# Backend might not be ready
docker-compose logs backend

# Check network
docker network ls
```

## 🎯 Performance Tips

1. Use Docker BuildKit:
   ```bash
   DOCKER_BUILDKIT=1 docker-compose build
   ```

2. Prune regularly:
   ```bash
   docker system prune -a --volumes
   ```

3. Limit resources in production:
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '1'
         memory: 1G
   ```

## 📚 Useful Links

- Docker Docs: https://docs.docker.com/
- Compose Docs: https://docs.docker.com/compose/
- MongoDB Docs: https://docs.mongodb.com/
- Nginx Docs: https://nginx.org/en/docs/

---

**Quick Command Summary:**
```bash
./docker-setup.sh              # Initial setup
docker-compose up -d           # Start
docker-compose logs -f         # Monitor
docker-compose down            # Stop
docker-compose ps              # Status
```

🎉 **Happy Dockering!**
