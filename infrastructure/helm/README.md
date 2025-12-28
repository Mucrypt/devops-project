# NexusAI Helm Chart

This Helm chart deploys the NexusAI application with backend, frontend, and MongoDB on Kubernetes.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.0+
- kubectl configured to access your cluster

## Installation

### Install Helm (if not already installed)

```bash
# Linux
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# macOS
brew install helm

# Verify installation
helm version
```

### Deploy the application

#### Development Environment

```bash
cd infrastructure/helm
./deploy.sh dev latest latest
```

#### Production Environment

```bash
cd helm
./deploy.sh prod v1.0.0 v1.0.0
```

#### With specific image tags (CI/CD)

```bash
cd helm
./deploy.sh prod $(git rev-parse --short HEAD) $(git rev-parse --short HEAD)
```

## Manual Helm Commands

### Install/Upgrade with default values

```bash
helm upgrade --install nexusai ./nexusai-chart \
  --namespace nexusai \
  --create-namespace \
  --wait
```

### Install with custom image tags

```bash
helm upgrade --install nexusai ./nexusai-chart \
  --namespace nexusai \
  --set backend.image.tag=v1.2.3 \
  --set frontend.image.tag=v1.2.3 \
  --wait
```

### Install dev environment

```bash
helm upgrade --install nexusai ./nexusai-chart \
  --namespace nexusai \
  -f nexusai-chart/values-dev.yaml \
  --set backend.image.tag=dev-abc123 \
  --set frontend.image.tag=dev-abc123 \
  --wait
```

### Install prod environment

```bash
helm upgrade --install nexusai ./nexusai-chart \
  --namespace nexusai \
  -f nexusai-chart/values-prod.yaml \
  --set backend.image.tag=v2.0.0 \
  --set frontend.image.tag=v2.0.0 \
  --wait
```

## Configuration

### Key Configuration Values

| Parameter | Description | Default |
|-----------|-------------|---------|
| `backend.image.tag` | Backend Docker image tag | `latest` |
| `frontend.image.tag` | Frontend Docker image tag | `latest` |
| `backend.replicaCount` | Number of backend replicas | `3` |
| `frontend.replicaCount` | Number of frontend replicas | `1` |
| `mongodb.persistence.enabled` | Enable persistent storage for MongoDB | `false` |
| `ingress.enabled` | Enable ingress | `true` |
| `ingress.className` | Ingress class name | `nginx` |

### Override Values

Create a custom `values-custom.yaml` file:

```yaml
backend:
  image:
    tag: my-custom-tag
  replicaCount: 5

frontend:
  image:
    tag: my-custom-tag
  replicaCount: 3
```

Apply it:

```bash
helm upgrade --install nexusai ./nexusai-chart \
  -f nexusai-chart/values-custom.yaml
```

## CI/CD Integration

### GitHub Actions

The `.github/workflows/ci-cd.yaml` automatically:

1. Builds and pushes Docker images with appropriate tags
2. Deploys to dev environment on push to `develop` branch
3. Deploys to prod environment on push to `main` branch or version tags

### Required GitHub Secrets

- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub password or access token
- `AWS_ACCESS_KEY_ID` - AWS access key for EKS access
- `AWS_SECRET_ACCESS_KEY` - AWS secret key

### Tagging Strategy

- `main` branch → `latest` tag + deploy to production
- `develop` branch → commit SHA tag + deploy to development
- Git tags (`v*`) → version tag + deploy to production

Example:
```bash
# Tag a new version
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# CI/CD will automatically build and deploy with tag v1.0.0
```

## Useful Commands

### Check deployment status

```bash
helm list -n nexusai
kubectl get pods -n nexusai
kubectl get svc -n nexusai
kubectl get ingress -n nexusai
```

### View Helm values

```bash
helm get values nexusai -n nexusai
```

### Upgrade with new image tags

```bash
helm upgrade nexusai ./nexusai-chart \
  --namespace nexusai \
  --reuse-values \
  --set backend.image.tag=v1.2.4 \
  --set frontend.image.tag=v1.2.4
```

### Rollback deployment

```bash
# List revisions
helm history nexusai -n nexusai

# Rollback to previous version
helm rollback nexusai -n nexusai

# Rollback to specific revision
helm rollback nexusai 3 -n nexusai
```

### Uninstall

```bash
helm uninstall nexusai -n nexusai
kubectl delete namespace nexusai
```

### Debug Helm template

```bash
helm template nexusai ./nexusai-chart \
  --namespace nexusai \
  --set backend.image.tag=test \
  --debug
```

## Troubleshooting

### Check pod logs

```bash
kubectl logs -n nexusai -l app=nexusai-backend -f
kubectl logs -n nexusai -l app=nexusai-frontend -f
```

### Describe resources

```bash
kubectl describe pod -n nexusai nexusai-backend-xxx
kubectl describe ingress -n nexusai nexusai-ingress
```

### Get events

```bash
kubectl get events -n nexusai --sort-by='.lastTimestamp'
```

## Support

For issues and questions, please open an issue on the GitHub repository.
