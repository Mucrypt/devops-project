# CI/CD Quick Reference Guide

## 🎯 Overview

This project uses **Helm** for Kubernetes deployments with **parameterized image tags** for CI/CD automation.

## 📦 Helm Chart Structure

```
helm/
├── nexusai-chart/              # Main Helm chart
│   ├── Chart.yaml              # Chart metadata
│   ├── values.yaml             # Default values
│   ├── values-dev.yaml         # Development overrides
│   ├── values-prod.yaml        # Production overrides
│   └── templates/              # Kubernetes manifests
├── deploy.sh                   # Deployment script
└── README.md                   # Detailed documentation
```

## 🚀 Quick Start

### 1. Manual Deployment with Tag Override

```bash
# Development with specific tags
cd infrastructure/helm
./deploy.sh dev v1.2.3 v1.2.3

# Production with git commit SHA
cd helm
./deploy.sh prod $(git rev-parse --short HEAD) $(git rev-parse --short HEAD)

# Production with version tag
cd helm
./deploy.sh prod v2.0.0 v2.0.0
```

### 2. Direct Helm Commands

```bash
# Install/upgrade with custom tags
helm upgrade --install nexusai ./infrastructure/helm/nexusai-chart \
  --namespace nexusai \
  --set backend.image.tag=abc123 \
  --set frontend.image.tag=abc123 \
  --wait

# Install dev environment with specific tags
helm upgrade --install nexusai ./infrastructure/helm/nexusai-chart \
  -f infrastructure/helm/nexusai-chart/values-dev.yaml \
  --set backend.image.tag=dev-$(git rev-parse --short HEAD) \
  --set frontend.image.tag=dev-$(git rev-parse --short HEAD)
```

## 🔄 GitHub Actions CI/CD

### Workflow Triggers

- **Push to `develop`** → Build & Deploy to Development
- **Push to `main`** → Build & Deploy to Production (tag: `latest`)
- **Git tags `v*`** → Build & Deploy to Production (tag: version)
- **Pull Requests** → Build only (no deployment)

### Required GitHub Secrets

Configure these in **Settings → Secrets and variables → Actions**:

```
DOCKER_USERNAME          # Docker Hub username (mucrypt)
DOCKER_PASSWORD          # Docker Hub password or access token
AWS_ACCESS_KEY_ID        # AWS access key for EKS
AWS_SECRET_ACCESS_KEY    # AWS secret key for EKS
```

### Tagging Strategy

```bash
# Create and push a release tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# CI/CD automatically:
# 1. Builds images with tag: v1.0.0
# 2. Pushes to Docker Hub: mucrypt/nexusai-backend:v1.0.0
# 3. Deploys to production with tag: v1.0.0
```

### Image Tagging Logic

| Git Ref | Image Tag | Deployment |
|---------|-----------|------------|
| `develop` branch | `commit-sha` (e.g., `abc1234`) | Development |
| `main` branch | `latest` | Production |
| `v*` tags | version (e.g., `v1.0.0`) | Production |

## 🛠️ Common CI/CD Commands

### Build and Push Manually

```bash
# Build with specific tag
docker build -t mucrypt/nexusai-backend:v1.2.3 ./backend
docker build -t mucrypt/nexusai-frontend:v1.2.3 ./chat-to-code-38

# Push to Docker Hub
docker push mucrypt/nexusai-backend:v1.2.3
docker push mucrypt/nexusai-frontend:v1.2.3

# Deploy with Helm
cd helm
./deploy.sh prod v1.2.3 v1.2.3
```

### Deploy Specific Commit

```bash
# Get commit SHA
COMMIT_SHA=$(git rev-parse --short HEAD)

# Build images
docker build -t mucrypt/nexusai-backend:$COMMIT_SHA ./backend
docker build -t mucrypt/nexusai-frontend:$COMMIT_SHA ./chat-to-code-38

# Push images
docker push mucrypt/nexusai-backend:$COMMIT_SHA
docker push mucrypt/nexusai-frontend:$COMMIT_SHA

# Deploy
cd helm
./deploy.sh prod $COMMIT_SHA $COMMIT_SHA
```

## 📊 Monitoring Deployments

### Check Helm Release Status

```bash
helm list -n nexusai
helm status nexusai -n nexusai
helm history nexusai -n nexusai
```

### Check Running Pods

```bash
kubectl get pods -n nexusai
kubectl get pods -n nexusai -l app=nexusai-backend
kubectl get pods -n nexusai -l app=nexusai-frontend
```

### View Deployed Image Tags

```bash
# Backend
kubectl get deployment nexusai-backend -n nexusai -o jsonpath='{.spec.template.spec.containers[0].image}'

# Frontend
kubectl get deployment nexusai-frontend -n nexusai -o jsonpath='{.spec.template.spec.containers[0].image}'
```

### View Logs

```bash
kubectl logs -n nexusai -l app=nexusai-backend -f
kubectl logs -n nexusai -l app=nexusai-frontend -f
```

## 🔙 Rollback Strategies

### Helm Rollback

```bash
# View revision history
helm history nexusai -n nexusai

# Rollback to previous version
helm rollback nexusai -n nexusai

# Rollback to specific revision
helm rollback nexusai 3 -n nexusai
```

### Kubernetes Rollback

```bash
# Rollback backend
kubectl rollout undo deployment/nexusai-backend -n nexusai

# Rollback frontend
kubectl rollout undo deployment/nexusai-frontend -n nexusai
```

### Redeploy with Previous Tag

```bash
# Redeploy with specific version
cd helm
./deploy.sh prod v1.0.0 v1.0.0
```

## 🔧 Customization

### Override Specific Values

```bash
# Scale replicas
helm upgrade nexusai ./infrastructure/helm/nexusai-chart \
  --reuse-values \
  --set backend.replicaCount=5 \
  --set frontend.replicaCount=3

# Change resource limits
helm upgrade nexusai ./infrastructure/helm/nexusai-chart \
  --reuse-values \
  --set backend.resources.limits.memory=1Gi

# Enable persistence
helm upgrade nexusai ./infrastructure/helm/nexusai-chart \
  --reuse-values \
  --set mongodb.persistence.enabled=true
```

### Create Custom Values File

```yaml
# values-staging.yaml
backend:
  image:
    tag: staging-abc123
  replicaCount: 2

frontend:
  image:
    tag: staging-abc123
  replicaCount: 2
```

Deploy:
```bash
helm upgrade --install nexusai ./infrastructure/helm/nexusai-chart \
  -f infrastructure/helm/nexusai-chart/values-staging.yaml
```

## 🧪 Testing

### Dry Run

```bash
helm upgrade --install nexusai ./infrastructure/helm/nexusai-chart \
  --namespace nexusai \
  --set backend.image.tag=test \
  --set frontend.image.tag=test \
  --dry-run --debug
```

### Template Validation

```bash
helm lint infrastructure/helm/nexusai-chart
helm template nexusai ./infrastructure/helm/nexusai-chart --debug
```

### Smoke Test After Deployment

```bash
# Get ingress URL
INGRESS_URL=$(kubectl get ingress nexusai-ingress -n nexusai -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')

# Test backend health
curl http://$INGRESS_URL/health

# Test frontend
curl http://$INGRESS_URL/

# Test API
curl http://$INGRESS_URL/api/auth
```

## 📝 Best Practices

1. **Always use semantic versioning** for production releases (v1.0.0, v1.1.0, etc.)
2. **Use commit SHAs** for development/testing deployments
3. **Tag images with both version and latest** in CI/CD
4. **Test in dev environment** before promoting to production
5. **Keep Helm values files** in version control
6. **Use separate values files** for each environment
7. **Monitor deployments** using `kubectl` and Helm status
8. **Set up health checks** for automated rollback
9. **Document all secret variables** in README
10. **Use GitHub Environments** for approval workflows in production

## 🆘 Troubleshooting

### Image Pull Errors

```bash
# Check if image exists in Docker Hub
docker pull mucrypt/nexusai-backend:v1.0.0

# Check pod events
kubectl describe pod <pod-name> -n nexusai
```

### Deployment Stuck

```bash
# Check rollout status
kubectl rollout status deployment/nexusai-backend -n nexusai

# Check pod logs
kubectl logs -n nexusai -l app=nexusai-backend --tail=50

# Restart deployment
kubectl rollout restart deployment/nexusai-backend -n nexusai
```

### Helm Install Fails

```bash
# Debug with dry-run
helm upgrade --install nexusai ./infrastructure/helm/nexusai-chart --dry-run --debug

# Check Kubernetes events
kubectl get events -n nexusai --sort-by='.lastTimestamp'

# Uninstall and reinstall
helm uninstall nexusai -n nexusai
helm install nexusai ./infrastructure/helm/nexusai-chart -n nexusai
```

## 📚 Additional Resources

- [Helm Documentation](https://helm.sh/docs/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Hub](https://hub.docker.com/u/mucrypt)

---

**Quick Links:**
- 📖 [Full Helm Documentation](../infrastructure/helm/README.md)
- 🔐 [Security Guide](../infrastructure/k8s/SECURITY.md)
- 🚀 [AWS EKS Guide](../infrastructure/k8s/AWS-EKS-GUIDE.md)
- 📋 [Deployment Checklist](../docs/DEPLOYMENT_CHECKLIST.md)
