# ✅ Helm Chart & CI/CD Setup Complete!

## 📦 What Was Created

### 1. Helm Chart Structure (`infrastructure/helm/nexusai-chart/`)
- ✅ **Chart.yaml** - Chart metadata and version
- ✅ **values.yaml** - Default configuration with parameterized image tags
- ✅ **values-dev.yaml** - Development environment overrides
- ✅ **values-prod.yaml** - Production environment overrides
- ✅ **templates/** - 15 Kubernetes manifest templates
  - Backend: Deployment, Service, HPA, ConfigMap, Secret
  - Frontend: Deployment, Service, HPA
  - MongoDB: StatefulSet, Service, Secret
  - Ingress: Routing configuration

### 2. Deployment Scripts
- ✅ **infrastructure/helm/deploy.sh** - Automated deployment script with tag override
- ✅ **CI-CD-GUIDE.md** - Quick reference for CI/CD workflows

### 3. GitHub Actions Pipeline (`.github/workflows/ci-cd.yaml`)
- ✅ **Build & Push** - Docker images with dynamic tags
- ✅ **Deploy to Dev** - Automatic deployment on `develop` branch
- ✅ **Deploy to Prod** - Automatic deployment on `main` branch or version tags
- ✅ **Smoke Tests** - Post-deployment health checks

## 🎯 Key Features

### Parameterized Image Tags
```yaml
backend:
  image:
    repository: mucrypt/nexusai-backend
    tag: latest  # ← Override this in CI/CD!

frontend:
  image:
    repository: mucrypt/nexusai-frontend
    tag: latest  # ← Override this in CI/CD!
```

### CI/CD Tag Override Examples

#### 1. Development Deployment
```bash
cd infrastructure/helm
./deploy.sh dev abc1234 abc1234
```

#### 2. Production Deployment with Version
```bash
cd infrastructure/helm
./deploy.sh prod v1.0.0 v1.0.0
```

#### 3. Production Deployment with Git SHA
```bash
cd infrastructure/helm
./deploy.sh prod $(git rev-parse --short HEAD) $(git rev-parse --short HEAD)
```

#### 4. Helm Direct Command
```bash
helm upgrade --install nexusai ./infrastructure/helm/nexusai-chart \
  --namespace nexusai \
  --set backend.image.tag=v1.2.3 \
  --set frontend.image.tag=v1.2.3 \
  --wait
```

## 🚀 GitHub Actions Workflow

### Automatic Tagging Strategy

| Branch/Tag | Image Tag | Environment | Auto Deploy |
|------------|-----------|-------------|-------------|
| `develop` | `commit-sha` | Development | ✅ Yes |
| `main` | `latest` | Production | ✅ Yes |
| `v*` (tags) | `version` | Production | ✅ Yes |
| PR | `commit-sha` | None | ❌ Build only |

### Example Workflow

```bash
# 1. Make changes and commit
git add .
git commit -m "feat: add new feature"

# 2. Push to develop (triggers dev deployment)
git push origin develop
# → Builds images with tag: abc1234 (commit SHA)
# → Deploys to development cluster

# 3. Merge to main (triggers prod deployment)
git checkout main
git merge develop
git push origin main
# → Builds images with tag: latest
# → Deploys to production cluster

# 4. Create release tag (triggers prod deployment with version)
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
# → Builds images with tag: v1.0.0
# → Deploys to production cluster
```

## 🔐 Required GitHub Secrets

Add these in **Settings → Secrets and variables → Actions**:

```
DOCKER_USERNAME          # Your Docker Hub username (mucrypt)
DOCKER_PASSWORD          # Docker Hub password or access token
AWS_ACCESS_KEY_ID        # AWS access key for EKS
AWS_SECRET_ACCESS_KEY    # AWS secret key for EKS
```

### How to Create Docker Hub Access Token
1. Go to https://hub.docker.com/settings/security
2. Click "New Access Token"
3. Name: `github-actions-nexusai`
4. Permissions: Read, Write, Delete
5. Copy the token and add to GitHub Secrets as `DOCKER_PASSWORD`

### How to Get AWS Credentials
```bash
# Using AWS CLI (if you have credentials configured)
aws configure get aws_access_key_id
aws configure get aws_secret_access_key

# Or create a new IAM user with EKS permissions
# Add these credentials to GitHub Secrets
```

## 📊 Current Deployment Status

Your application is currently running with kubectl-deployed manifests:

```
✅ Backend:  3/3 pods running (image: mucrypt/nexusai-backend:latest)
✅ Frontend: 1/1 pods running (image: mucrypt/nexusai-frontend:latest)
✅ MongoDB:  1/1 pods running (image: mongo:7.0)
✅ Ingress:  Active with Load Balancer
```

## 🔄 Migration to Helm (Optional)

If you want to migrate your current deployment to Helm management:

### Option 1: Keep Current Deployment (Recommended for now)
- Continue using `kubectl apply -f infrastructure/k8s/` for manual deployments
- Use Helm for future deployments when you're ready
- Both approaches work; Helm adds versioning and easier rollbacks

### Option 2: Migrate to Helm (Requires downtime)
```bash
# 1. Delete existing resources
kubectl delete all,configmap,secret,ingress,hpa,pvc -n nexusai

# 2. Deploy with Helm
cd helm
./deploy.sh prod latest latest

# 3. Verify
kubectl get pods -n nexusai
```

### Option 3: Adopt Resources into Helm (Advanced)
```bash
# Label existing resources for Helm adoption
kubectl label -n nexusai deployment/nexusai-backend app.kubernetes.io/managed-by=Helm
# ... repeat for all resources
# This is complex and not recommended unless necessary
```

## 🎓 Next Steps

### 1. Test Helm Chart (Local)
```bash
# Dry run to see what will be deployed
cd infrastructure/helm
helm template nexusai ./nexusai-chart \
  --set backend.image.tag=test \
  --set frontend.image.tag=test \
  --debug

# Validate chart
helm lint nexusai-chart
```

### 2. Set Up GitHub Secrets
1. Go to your repository on GitHub
2. Navigate to **Settings → Secrets and variables → Actions**
3. Click **New repository secret**
4. Add all 4 required secrets

### 3. Test CI/CD Pipeline
```bash
# Create a test branch
git checkout -b test/ci-cd

# Make a small change
echo "# Test" >> README.md
git add README.md
git commit -m "test: CI/CD pipeline"

# Push to trigger build (won't deploy, just build)
git push origin test/ci-cd

# Check GitHub Actions tab for build status
```

### 4. Create First Release
```bash
# After testing, create your first release
git checkout main
git tag -a v1.0.0 -m "Initial release"
git push origin v1.0.0

# This will:
# - Build images with tag v1.0.0
# - Push to Docker Hub
# - Deploy to production with version tag
```

## 📚 Documentation

- 📖 **[CI-CD-GUIDE.md](../CI-CD-GUIDE.md)** - Quick reference for CI/CD
- 📖 **[helm/README.md](./README.md)** - Detailed Helm documentation
- 📖 **[k8s/AWS-EKS-GUIDE.md](../k8s/AWS-EKS-GUIDE.md)** - AWS EKS setup guide
- 📖 **[k8s/SECURITY.md](../k8s/SECURITY.md)** - Security best practices

## 🛠️ Useful Commands

### Check Deployment
```bash
# List Helm releases
helm list -n nexusai

# Check pods
kubectl get pods -n nexusai

# View deployed image tags
kubectl get deployment nexusai-backend -n nexusai -o jsonpath='{.spec.template.spec.containers[0].image}'
kubectl get deployment nexusai-frontend -n nexusai -o jsonpath='{.spec.template.spec.containers[0].image}'
```

### Manual Deployment
```bash
# Deploy with specific tags
cd infrastructure/helm
./deploy.sh prod v1.2.3 v1.2.3

# Or with Helm directly
helm upgrade --install nexusai ./infrastructure/helm/nexusai-chart \
  --namespace nexusai \
  --set backend.image.tag=v1.2.3 \
  --set frontend.image.tag=v1.2.3
```

### Rollback
```bash
# View history
helm history nexusai -n nexusai

# Rollback to previous version
helm rollback nexusai -n nexusai

# Rollback to specific revision
helm rollback nexusai 3 -n nexusai
```

## 🎉 Success Indicators

You'll know your CI/CD is working when:

1. ✅ Pushing to `develop` automatically deploys to dev environment
2. ✅ Pushing to `main` automatically deploys to production
3. ✅ Creating a tag `v*` creates a versioned release
4. ✅ Images are automatically built and pushed to Docker Hub
5. ✅ Deployments use the correct image tags
6. ✅ Health checks pass after deployment
7. ✅ You can rollback easily with Helm

## 🆘 Troubleshooting

### CI/CD Pipeline Fails
```bash
# Check GitHub Actions logs
# Go to: Repository → Actions → Select workflow run → View logs

# Common issues:
# - Missing GitHub Secrets → Add them in Settings
# - Docker Hub authentication → Check DOCKER_PASSWORD
# - AWS credentials → Verify AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
# - EKS cluster not accessible → Check AWS permissions
```

### Deployment Fails
```bash
# Check Helm status
helm status nexusai -n nexusai

# Check pod logs
kubectl logs -n nexusai -l app=nexusai-backend

# Check events
kubectl get events -n nexusai --sort-by='.lastTimestamp'
```

### Image Pull Errors
```bash
# Verify image exists on Docker Hub
docker pull mucrypt/nexusai-backend:v1.0.0

# Check if tag was pushed
docker images | grep nexusai
```

---

## 🎯 Summary

✅ **Helm chart created** with parameterized image tags  
✅ **Deployment scripts** ready for manual or automated use  
✅ **GitHub Actions pipeline** configured for CI/CD  
✅ **Environment-specific values** (dev, prod)  
✅ **Comprehensive documentation** with examples  
✅ **Current deployment** still running and functional  

**You're ready for CI/CD! 🚀**

Next: Set up GitHub Secrets and test the pipeline!
