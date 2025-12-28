# 🚀 Quick Start: CI/CD with Helm

## ⚡ 1-Minute Setup

### 1. Set GitHub Secrets (Required)
Go to: **https://github.com/Mucrypt/devops-project/settings/secrets/actions**

Add these 4 secrets:
```
DOCKER_USERNAME = mucrypt
DOCKER_PASSWORD = your-docker-hub-token
AWS_ACCESS_KEY_ID = your-aws-key
AWS_SECRET_ACCESS_KEY = your-aws-secret
```

### 2. Deploy Now

```bash
# Deploy with latest images
cd infrastructure/helm
./deploy.sh dev latest latest

# Deploy with specific version
cd infrastructure/helm
./deploy.sh prod v1.0.0 v1.0.0

# Deploy with git commit
cd infrastructure/helm
./deploy.sh prod $(git rev-parse --short HEAD) $(git rev-parse --short HEAD)
```

### 3. Test CI/CD

```bash
# Make a change
echo "test" >> README.md
git add README.md
git commit -m "test: CI/CD"

# Push to develop (auto-deploys to dev)
git push origin develop

# Or push to main (auto-deploys to prod)
git push origin main

# Or create a version tag (auto-deploys to prod)
git tag v1.0.0
git push origin v1.0.0
```

## 🎯 What Happens Automatically

| Action | Image Tag | Deployment |
|--------|-----------|------------|
| Push to `develop` | `abc1234` | ✅ Dev |
| Push to `main` | `latest` | ✅ Prod |
| Tag `v1.0.0` | `v1.0.0` | ✅ Prod |
| Pull Request | `abc1234` | ❌ Build only |

## 📦 Image Tags Explained

```yaml
# In values.yaml
backend:
  image:
    repository: mucrypt/nexusai-backend
    tag: latest  # ← This gets overridden!

# Deploy script overrides it:
./deploy.sh prod v1.2.3 abc1234
# → Backend: mucrypt/nexusai-backend:v1.2.3
# → Frontend: mucrypt/nexusai-frontend:abc1234
```

## 🔍 Monitor Your Deployment

```bash
# Check what's running
kubectl get pods -n nexusai

# See which image tags are deployed
kubectl get deployment nexusai-backend -n nexusai -o jsonpath='{.spec.template.spec.containers[0].image}'
kubectl get deployment nexusai-frontend -n nexusai -o jsonpath='{.spec.template.spec.containers[0].image}'

# Watch live updates
kubectl get pods -n nexusai -w
```

## 🔄 Rollback in 10 Seconds

```bash
# Helm rollback
helm rollback nexusai -n nexusai

# Or Kubernetes rollback
kubectl rollout undo deployment/nexusai-backend -n nexusai
```

## 📚 Full Documentation

- 📖 [HELM-SETUP-COMPLETE.md](./HELM-SETUP-COMPLETE.md) - Complete setup guide
- 📖 [CI-CD-GUIDE.md](./CI-CD-GUIDE.md) - Detailed CI/CD reference
- 📖 [infrastructure/helm/README.md](../infrastructure/helm/README.md) - Helm chart documentation

## 🎉 That's It!

Your CI/CD pipeline is ready. Just add the GitHub Secrets and you're good to go! 🚀
