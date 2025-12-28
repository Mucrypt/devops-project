# 🚀 NexusAI Deployment Checklist

## ✅ Pre-Deployment

### 1. Environment Setup
- [ ] Copy `.env.example` to `.env`
- [ ] Set strong `JWT_SECRET` (64+ random characters)
- [ ] Configure MongoDB credentials
- [ ] Set up email credentials (SMTP)
- [ ] Add API keys (Stripe, OpenAI, etc.)
- [ ] Set `NODE_ENV=production`

### 2. Security
- [ ] Review and update MongoDB password in `docker-compose.yml`
- [ ] Ensure `.env` is in `.gitignore`
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure firewall rules
- [ ] Set up rate limiting values
- [ ] Review CORS allowed origins

### 3. Code & Dependencies
- [ ] All tests passing (`npm test`)
- [ ] TypeScript compiles without errors (`npm run typecheck`)
- [ ] Dependencies up to date
- [ ] No known security vulnerabilities (`npm audit`)

### 4. Docker Validation
- [ ] Run `./validate-docker.sh`
- [ ] Test Docker Compose config: `docker-compose config`
- [ ] Verify Dockerfiles build: `docker-compose build`

## 🏗️ Development Deployment

### Local Testing
```bash
# 1. Validate setup
./validate-docker.sh

# 2. Start services
./docker-setup.sh

# 3. Check health
curl http://localhost:5000/health
curl http://localhost/

# 4. Monitor logs
docker-compose logs -f
```

### Verify Services
- [ ] Frontend loads at http://localhost
- [ ] Backend responds at http://localhost:5000/health
- [ ] MongoDB connection successful
- [ ] API endpoints working
- [ ] Email service configured

## 🌐 Production Deployment

### 1. Server Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER
```

### 2. Clone & Configure
```bash
# Clone repository
git clone <your-repo-url>
cd devops-project

# Setup environment
cp .env.example .env
nano .env  # Edit with production values
```

### 3. Domain & SSL
- [ ] Point domain to server IP
- [ ] Install Certbot for Let's Encrypt
- [ ] Generate SSL certificates
- [ ] Update nginx.conf for HTTPS
- [ ] Configure auto-renewal

### 4. Deploy
```bash
# Build and start
docker-compose up -d --build

# Verify
docker-compose ps
docker-compose logs -f

# Test endpoints
curl https://yourdomain.com/api/health
```

### 5. Post-Deployment
- [ ] Set up monitoring (Prometheus, Grafana)
- [ ] Configure log aggregation
- [ ] Set up automated backups
- [ ] Configure alerts
- [ ] Document deployment

## 🔒 Security Hardening

### Firewall Rules
```bash
# Allow only necessary ports
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### Docker Security
- [ ] Don't expose MongoDB port externally
- [ ] Use Docker secrets for sensitive data
- [ ] Run containers as non-root user
- [ ] Enable Docker Content Trust
- [ ] Regular security scans

### Application Security
- [ ] Strong JWT secret (64+ characters)
- [ ] Secure session management
- [ ] Input validation enabled
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Security headers enabled (Helmet)

## 📊 Monitoring Setup

### Health Checks
```bash
# Script for monitoring
cat > /usr/local/bin/health-check.sh << 'EOF'
#!/bin/bash
curl -f http://localhost:5000/health || exit 1
curl -f http://localhost/ || exit 1
EOF

chmod +x /usr/local/bin/health-check.sh

# Add to crontab
*/5 * * * * /usr/local/bin/health-check.sh
```

### Log Management
```bash
# Setup log rotation
sudo nano /etc/docker/daemon.json
```
```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

## 💾 Backup Strategy

### Automated Backups
```bash
# Backup script
cat > /usr/local/bin/backup-mongodb.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/mongodb/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

docker-compose exec -T mongodb mongodump \
  --uri="mongodb://nexusai:nexusai123@localhost:27017/nexusai?authSource=admin" \
  --out="$BACKUP_DIR"

# Cleanup old backups (keep last 7 days)
find /backups/mongodb -type d -mtime +7 -exec rm -rf {} +
EOF

chmod +x /usr/local/bin/backup-mongodb.sh

# Daily backup at 2 AM
0 2 * * * /usr/local/bin/backup-mongodb.sh
```

### Backup Checklist
- [ ] Database backups automated
- [ ] Backup verification process
- [ ] Off-site backup storage
- [ ] Backup restoration tested
- [ ] Disaster recovery plan

## 🔄 Update Procedure

### Rolling Updates
```bash
# 1. Pull latest code
git pull

# 2. Backup database
./backup-mongodb.sh

# 3. Build new images
docker-compose build

# 4. Update services (zero downtime)
docker-compose up -d --no-deps --build backend
docker-compose up -d --no-deps --build frontend

# 5. Verify
docker-compose ps
curl http://localhost:5000/health
```

## 📈 Performance Optimization

### Docker Optimization
- [ ] Multi-stage builds implemented
- [ ] Minimize layer count
- [ ] Use .dockerignore
- [ ] Optimize image size
- [ ] Enable BuildKit

### Application Optimization
- [ ] Enable gzip compression
- [ ] Static asset caching
- [ ] Database indexing
- [ ] Connection pooling
- [ ] Response caching

### Nginx Optimization
- [ ] Enable HTTP/2
- [ ] Configure worker processes
- [ ] Set keepalive connections
- [ ] Enable browser caching
- [ ] Configure buffer sizes

## 🧪 Testing

### Pre-Production Tests
```bash
# API health
curl http://localhost:5000/health

# Authentication
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"Test1234!"}'

# Load testing (optional)
ab -n 1000 -c 10 http://localhost:5000/health
```

### Checklist
- [ ] All API endpoints responding
- [ ] Authentication working
- [ ] Database queries optimized
- [ ] Error handling tested
- [ ] Load testing completed

## 📱 Post-Deployment

### Monitoring
- [ ] Set up uptime monitoring
- [ ] Configure error alerting
- [ ] Monitor resource usage
- [ ] Track API performance
- [ ] Set up log analysis

### Documentation
- [ ] Update deployment docs
- [ ] Document any issues
- [ ] Update runbooks
- [ ] Share with team

### Maintenance
- [ ] Schedule regular updates
- [ ] Plan backup restoration tests
- [ ] Review security logs
- [ ] Monitor performance metrics

## ✅ Go-Live Checklist

### Final Checks
- [ ] All environment variables set
- [ ] SSL certificates valid
- [ ] Firewall configured
- [ ] Backups automated
- [ ] Monitoring active
- [ ] Logs accessible
- [ ] DNS configured
- [ ] Load testing completed
- [ ] Security scan passed
- [ ] Documentation updated

### Launch
```bash
# Final deployment
docker-compose down
docker-compose up -d --build

# Verify everything
./validate-deployment.sh
```

### Post-Launch
- [ ] Monitor for 24 hours
- [ ] Check error logs
- [ ] Verify backups running
- [ ] Test all critical paths
- [ ] Gather user feedback

## 🆘 Rollback Plan

### Emergency Rollback
```bash
# 1. Stop current version
docker-compose down

# 2. Restore from backup
docker-compose exec mongodb mongorestore /backup/path

# 3. Deploy previous version
git checkout <previous-tag>
docker-compose up -d --build

# 4. Verify
curl http://localhost:5000/health
```

---

**Deployment Date**: _________________
**Deployed By**: _________________
**Version**: _________________
**Notes**: _________________
