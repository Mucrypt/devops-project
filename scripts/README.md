# NexusAI Scripts Reference 📜

This directory contains all operational scripts for the NexusAI DevOps project. Each script is designed to automate specific tasks in the development, deployment, and management workflow.

## 📑 Table of Contents

- [Quick Reference](#quick-reference)
- [Backend Scripts](#backend-scripts)
- [Docker Scripts](#docker-scripts)
- [Kubernetes Scripts](#kubernetes-scripts)
- [AWS EKS Scripts](#aws-eks-scripts)
- [Helm Scripts](#helm-scripts)
- [Best Practices](#best-practices)

---

## 🚀 Quick Reference

| Script | Purpose | Common Usage |
|--------|---------|--------------|
| `backend-setup.sh` | Setup backend development environment | `./scripts/backend-setup.sh` |
| `docker-setup.sh` | Setup Docker environment for local dev | `./scripts/docker-setup.sh` |
| `docker-validate.sh` | Validate Docker configuration | `./scripts/docker-validate.sh` |
| `push-to-dockerhub.sh` | Push images to Docker Hub | `./scripts/push-to-dockerhub.sh` |
| `k8s-generate-secrets.sh` | Generate Kubernetes secrets | `./scripts/k8s-generate-secrets.sh` |
| `k8s-deploy.sh` | Deploy application to Kubernetes | `./scripts/k8s-deploy.sh` |
| `k8s-cleanup.sh` | Remove all K8s resources | `./scripts/k8s-cleanup.sh` |
| `eks-create-cluster.sh` | Create AWS EKS cluster | `./scripts/eks-create-cluster.sh` |
| `helm-deploy.sh` | Deploy using Helm with custom tags | `./scripts/helm-deploy.sh prod v1.0.0 v1.0.0` |

---

## 🔧 Backend Scripts

### `backend-setup.sh`

**Purpose:** Initialize and setup the backend development environment.

**What it does:**
- ✅ Checks Node.js version (requires v18+)
- ✅ Verifies MongoDB installation
- ✅ Installs npm dependencies
- ✅ Creates `.env` file from template if missing
- ✅ Runs database migrations
- ✅ Seeds initial data
- ✅ Validates the setup

**Usage:**
```bash
cd backend
../scripts/backend-setup.sh

# Or from project root
./scripts/backend-setup.sh
```

**Prerequisites:**
- Node.js 18+ installed
- MongoDB 7.0+ installed and running
- Git (for version checks)

**When to use:**
- First time setting up the project
- After cloning the repository
- When switching between branches with dependency changes
- After pulling major updates

---

## 🐳 Docker Scripts

### `docker-setup.sh`

**Purpose:** Complete Docker environment setup for local development.

**What it does:**
- ✅ Verifies Docker and Docker Compose installation
- ✅ Creates `.env` file if missing
- ✅ Validates all Dockerfiles exist
- ✅ Builds Docker images for backend and frontend
- ✅ Starts all containers (MongoDB, Backend, Frontend, Nginx)
- ✅ Waits for services to be healthy
- ✅ Displays service URLs and logs

**Usage:**
```bash
./scripts/docker-setup.sh

# The script will:
# 1. Check prerequisites
# 2. Build images
# 3. Start containers
# 4. Show access URLs
```

**Prerequisites:**
- Docker 20.10+ installed
- Docker Compose v2.0+ installed
- At least 4GB RAM available
- Ports 3000, 5173, 27017, 8081 available

**Expected Output:**
```
✅ Backend API: http://localhost:3000
✅ Frontend: http://localhost:5173
✅ MongoDB: mongodb://localhost:27017
✅ Mongo Express: http://localhost:8081
```

---

### `docker-validate.sh`

**Purpose:** Validate Docker setup and configuration files.

**What it does:**
- ✅ Checks for required files (Dockerfiles, docker-compose.yml)
- ✅ Validates Docker image builds
- ✅ Tests container startup
- ✅ Verifies network connectivity
- ✅ Checks environment variables
- ✅ Provides detailed validation report

**Usage:**
```bash
./scripts/docker-validate.sh
```

**When to use:**
- Before pushing to Docker Hub
- After modifying Dockerfiles
- Troubleshooting container issues
- CI/CD pipeline validation

**Exit Codes:**
- `0` - All validations passed
- `1` - One or more validations failed

---

### `push-to-dockerhub.sh`

**Purpose:** Build, tag, and push Docker images to Docker Hub registry.

**What it does:**
- ✅ Checks Docker Hub authentication
- ✅ Tags images with version and date
- ✅ Pushes backend image to `mucrypt/nexusai-backend`
- ✅ Pushes frontend image to `mucrypt/nexusai-frontend`
- ✅ Creates multi-arch manifests (optional)
- ✅ Provides push summary

**Usage:**
```bash
# Push with default 'latest' tag
./scripts/push-to-dockerhub.sh

# Push with specific version
VERSION=v1.2.3 ./scripts/push-to-dockerhub.sh

# Push with custom tag
TAG=dev ./scripts/push-to-dockerhub.sh
```

**Prerequisites:**
- Docker Hub account (username: mucrypt)
- Docker login completed: `docker login`
- Images built locally or pull from CI/CD

**Environment Variables:**
- `VERSION` - Image version tag (default: latest)
- `DOCKER_USERNAME` - Docker Hub username (default: mucrypt)

**When to use:**
- After building new images locally
- Manual deployment outside CI/CD
- Testing image builds before merging
- Creating release versions

---

## ☸️ Kubernetes Scripts

### `k8s-generate-secrets.sh`

**Purpose:** Generate secure Kubernetes secret manifests for the application.

**What it does:**
- 🔐 Generates random secure passwords and tokens
- 🔐 Creates base64-encoded secret values
- 🔐 Generates `mongodb-secret.yaml` with database credentials
- 🔐 Generates `backend-secret.yaml` with JWT secrets
- 🔐 Ensures secrets are excluded from Git (via .gitignore)
- 🔐 Provides interactive prompts for custom values

**Usage:**
```bash
# Interactive mode (recommended)
./scripts/k8s-generate-secrets.sh

# The script will prompt for:
# - MongoDB root password
# - MongoDB username
# - MongoDB password
# - Database name
# - JWT secret
# - Session secret
```

**Generated Files:**
- `infrastructure/k8s/mongodb-secret.yaml`
- `infrastructure/k8s/backend-secret.yaml`

**⚠️ Security Notes:**
- Never commit actual secret files to Git
- Use strong passwords (script generates 32-char random values)
- Rotate secrets regularly in production
- Store production secrets in a secret manager (AWS Secrets Manager, HashiCorp Vault)

**When to use:**
- First time deploying to a new cluster
- Rotating secrets for security
- Setting up dev/staging/prod environments
- After cluster recreation

---

### `k8s-deploy.sh`

**Purpose:** Deploy the entire NexusAI application stack to Kubernetes.

**What it does:**
- ✅ Validates Kubernetes cluster connectivity
- ✅ Checks for required secret files
- ✅ Creates namespace and resource quotas
- ✅ Applies secrets and ConfigMaps
- ✅ Deploys MongoDB StatefulSet
- ✅ Deploys Backend Deployment (3 replicas)
- ✅ Deploys Frontend Deployment
- ✅ Creates Services for all components
- ✅ Sets up Horizontal Pod Autoscalers (HPA)
- ✅ Configures Ingress with Load Balancer
- ✅ Applies Network Policies
- ✅ Waits for all pods to be ready
- ✅ Displays deployment status and URLs

**Usage:**
```bash
# Deploy everything
./scripts/k8s-deploy.sh

# The script deploys in this order:
# 1. Namespace & configs
# 2. Secrets
# 3. MongoDB
# 4. Backend
# 5. Frontend
# 6. Ingress & policies
```

**Prerequisites:**
- `kubectl` configured for target cluster
- Cluster running (EKS, GKE, minikube, etc.)
- Secrets generated: `./scripts/k8s-generate-secrets.sh`
- Sufficient cluster resources:
  - 4 vCPU minimum
  - 4 GB RAM minimum
  - 50 GB storage

**Deployed Components:**
- **Namespace:** nexusai
- **MongoDB:** 1 StatefulSet replica
- **Backend API:** 3 Deployment replicas
- **Frontend:** 1 Deployment replica
- **Services:** MongoDB, Backend, Frontend
- **Ingress:** NGINX Ingress Controller
- **HPA:** Auto-scaling for backend and frontend

**Post-Deployment:**
```bash
# Check deployment status
kubectl get all -n nexusai

# Get Ingress URL
kubectl get ingress -n nexusai

# View logs
kubectl logs -f deployment/nexusai-backend -n nexusai
kubectl logs -f deployment/nexusai-frontend -n nexusai
```

**When to use:**
- Initial deployment to cluster
- After updating manifest files
- Redeploying after cluster issues
- Manual deployment (outside CI/CD)

---

### `k8s-cleanup.sh`

**Purpose:** Remove all NexusAI resources from Kubernetes cluster.

**What it does:**
- 🗑️ Confirms deletion with user prompt
- 🗑️ Deletes resources in reverse dependency order:
  - Ingress rules
  - Network policies
  - HPAs (Horizontal Pod Autoscalers)
  - Services
  - Deployments
  - StatefulSets
  - ConfigMaps
  - Secrets
  - PVCs (Persistent Volume Claims)
  - Namespace
- 🗑️ Provides deletion progress feedback
- 🗑️ Ensures clean removal of all resources

**Usage:**
```bash
./scripts/k8s-cleanup.sh

# You'll be prompted:
# ⚠️  This will delete all NexusAI resources including data. Are you sure? (yes/no):
```

**⚠️ Warning:**
- This is a **DESTRUCTIVE** operation
- All data in MongoDB will be lost (if using emptyDir volumes)
- Cannot be undone
- Use with extreme caution in production

**When to use:**
- Cleaning up dev/test environments
- Before redeploying from scratch
- Cluster maintenance
- Removing old deployments
- Testing deployment scripts

**Safe Alternative:**
```bash
# Delete only the application, keep namespace
kubectl delete deployment,service,ingress -n nexusai -l app=nexusai

# Scale down instead of deleting
kubectl scale deployment nexusai-backend --replicas=0 -n nexusai
```

---

## ☁️ AWS EKS Scripts

### `eks-create-cluster.sh`

**Purpose:** Provision a production-ready AWS EKS Kubernetes cluster.

**What it does:**
- ☁️ Validates AWS CLI and eksctl installation
- ☁️ Checks AWS credentials and permissions
- ☁️ Prompts for cluster configuration:
  - Cluster name (default: nexusai-cluster)
  - AWS region (default: eu-north-1)
  - Node instance type (default: t3.small)
  - Number of nodes (default: 2, max: 4)
- ☁️ Creates eksctl configuration file
- ☁️ Provisions EKS cluster with:
  - OIDC provider for IAM integration
  - IAM service accounts for AWS Load Balancer Controller
  - IAM service accounts for EBS CSI Driver
  - Managed node group with auto-scaling
  - CloudWatch logging enabled
- ☁️ Installs add-ons:
  - VPC-CNI for networking
  - CoreDNS for service discovery
  - kube-proxy for networking
  - AWS EBS CSI Driver for persistent volumes
- ☁️ Installs NGINX Ingress Controller
- ☁️ Installs Metrics Server for HPA
- ☁️ Configures kubectl context
- ☁️ Saves cluster info to `infrastructure/eks-cluster-info.txt`
- ☁️ Provides next steps and commands

**Usage:**
```bash
# Interactive mode (recommended)
./scripts/eks-create-cluster.sh

# You'll be prompted for:
# - Cluster name
# - AWS region
# - Instance type
# - Node count

# Example session:
# Cluster name (nexusai-cluster): my-cluster
# AWS region (eu-north-1): us-east-1
# Instance type (t3.small): t3.medium
# Number of nodes (2): 3
```

**Prerequisites:**
- AWS CLI configured: `aws configure`
- AWS credentials with EKS permissions
- eksctl installed (v0.150.0+)
- kubectl installed (v1.28+)
- Helm installed (v3.0+)
- AWS account with sufficient limits:
  - VPC limit
  - Elastic IP limit
  - EKS cluster limit
  - EC2 instance limit

**AWS Costs:**
- EKS Control Plane: ~$0.10/hour ($73/month)
- 2x t3.small nodes: ~$0.0208/hour each (~$30/month each)
- EBS volumes: ~$0.10/GB/month
- Data transfer: varies
- **Estimated Total: $130-150/month**

**Cluster Specifications:**
```yaml
Region: eu-north-1 (Stockholm)
Kubernetes Version: 1.31
Instance Type: t3.small (2 vCPU, 2GB RAM)
Min Nodes: 2
Max Nodes: 4
Volume: 50GB gp3 SSD per node
Networking: Public subnets (privateNetworking: false)
```

**Post-Creation:**
```bash
# Verify cluster
kubectl get nodes
kubectl get pods -n kube-system

# Get cluster info
eksctl get cluster

# View cluster details
kubectl cluster-info

# Next steps displayed by script:
# 1. Generate secrets: ./scripts/k8s-generate-secrets.sh
# 2. Deploy application: ./scripts/k8s-deploy.sh
# 3. Get Load Balancer URL: kubectl get ingress -n nexusai
```

**When to use:**
- Creating production EKS cluster
- Setting up new environments (dev/staging/prod)
- Recreating cluster after issues
- Disaster recovery

**Cleanup:**
```bash
# Delete the cluster (will prompt for confirmation)
eksctl delete cluster --name nexusai-cluster --region eu-north-1

# Estimated time: 10-15 minutes
```

---

## ⎈ Helm Scripts

### `helm-deploy.sh`

**Purpose:** Deploy NexusAI application using Helm with parameterized image tags for CI/CD.

**What it does:**
- ⎈ Validates Helm and kubectl installation
- ⎈ Checks cluster connectivity
- ⎈ Accepts environment and image tag parameters
- ⎈ Deploys using appropriate values file (dev/prod)
- ⎈ Overrides image tags dynamically
- ⎈ Creates namespace if missing
- ⎈ Upgrades existing release or installs new one
- ⎈ Waits for all pods to be ready
- ⎈ Provides deployment status and URLs
- ⎈ Displays pod status and health checks

**Usage:**
```bash
# Deploy to dev with latest tags
cd infrastructure/helm
./deploy.sh dev latest latest

# Deploy to prod with specific version
cd infrastructure/helm
./deploy.sh prod v1.2.3 v1.2.3

# Deploy with git commit SHA
cd infrastructure/helm
./deploy.sh prod $(git rev-parse --short HEAD) $(git rev-parse --short HEAD)

# Deploy dev with different tags per service
cd infrastructure/helm
./deploy.sh dev abc123 def456
```

**Script from anywhere:**
```bash
# From project root
./scripts/helm-deploy.sh prod v1.0.0 v1.0.0

# From CI/CD pipeline
scripts/helm-deploy.sh $ENVIRONMENT $BACKEND_TAG $FRONTEND_TAG
```

**Parameters:**
1. **Environment** - `dev` or `prod` (default: dev)
2. **Backend Tag** - Docker image tag for backend (default: latest)
3. **Frontend Tag** - Docker image tag for frontend (default: latest)

**Examples:**
```bash
# Development deployment
./scripts/helm-deploy.sh dev latest latest

# Production release
./scripts/helm-deploy.sh prod v2.1.0 v2.1.0

# Hotfix deployment
./scripts/helm-deploy.sh prod v2.1.1-hotfix v2.1.0

# CI/CD (GitHub Actions)
./scripts/helm-deploy.sh prod ${{ github.sha }} ${{ github.sha }}
```

**What gets deployed:**
- **Dev Environment:**
  - Uses `values-dev.yaml`
  - Single replica for each service
  - Lower resource limits
  - Debug logging enabled
  
- **Prod Environment:**
  - Uses `values-prod.yaml`
  - Multiple replicas (3 backend, 1 frontend)
  - Production resource limits
  - Info-level logging
  - HPA enabled

**Helm Release Details:**
```bash
# View release info
helm list -n nexusai

# Get release values
helm get values nexusai -n nexusai

# View release history
helm history nexusai -n nexusai

# Rollback to previous version
helm rollback nexusai -n nexusai
```

**When to use:**
- CI/CD deployments with specific tags
- Manual deployments with version control
- Deploying hotfixes
- Testing different image versions
- Rolling back to previous versions

**Advantages over kubectl:**
- ✅ Version-controlled deployments
- ✅ Easy rollbacks
- ✅ Parameterized configurations
- ✅ Release management
- ✅ History tracking
- ✅ Atomic updates

---

## 📋 Best Practices

### Script Execution

1. **Always run from project root** (unless specified otherwise):
   ```bash
   ./scripts/script-name.sh
   ```

2. **Make scripts executable**:
   ```bash
   chmod +x scripts/*.sh
   ```

3. **Check prerequisites** before running:
   ```bash
   # For Docker scripts
   docker --version
   docker-compose --version
   
   # For K8s scripts
   kubectl version
   kubectl cluster-info
   
   # For AWS scripts
   aws --version
   eksctl version
   ```

### Development Workflow

```bash
# 1. Setup backend locally
./scripts/backend-setup.sh

# 2. Test with Docker
./scripts/docker-validate.sh
./scripts/docker-setup.sh

# 3. Push to Docker Hub (after testing)
./scripts/push-to-dockerhub.sh

# 4. Deploy to Kubernetes
./scripts/k8s-generate-secrets.sh  # First time only
./scripts/k8s-deploy.sh
```

### Production Deployment Workflow

```bash
# 1. Create EKS cluster (one time)
./scripts/eks-create-cluster.sh

# 2. Generate secrets (one time per environment)
./scripts/k8s-generate-secrets.sh

# 3. Deploy using Helm (repeatable)
./scripts/helm-deploy.sh prod v1.0.0 v1.0.0

# 4. Verify deployment
kubectl get pods -n nexusai
helm list -n nexusai
```

### CI/CD Integration

```yaml
# GitHub Actions example
- name: Deploy to Production
  run: |
    cd infrastructure/helm
    ./deploy.sh prod ${{ github.sha }} ${{ github.sha }}

# Or use the scripts folder
- name: Deploy with Script
  run: ./scripts/helm-deploy.sh prod $TAG $TAG
```

### Error Handling

All scripts include:
- ✅ Exit on error (`set -e`)
- ✅ Prerequisite checks
- ✅ Colored output for visibility
- ✅ Descriptive error messages
- ✅ Exit codes (0 = success, 1 = failure)

### Script Customization

Scripts use environment variables for easy customization:

```bash
# Docker Hub username
DOCKER_USERNAME=myusername ./scripts/push-to-dockerhub.sh

# Custom namespace
NAMESPACE=my-namespace ./scripts/k8s-deploy.sh

# Custom region
AWS_REGION=us-west-2 ./scripts/eks-create-cluster.sh
```

---

## 🔍 Troubleshooting

### Common Issues

**Issue:** "Permission denied" when running scripts
```bash
# Solution: Make scripts executable
chmod +x scripts/*.sh
```

**Issue:** "kubectl: command not found"
```bash
# Solution: Install kubectl
# macOS: brew install kubectl
# Linux: sudo apt-get install kubectl
```

**Issue:** "AWS credentials not configured"
```bash
# Solution: Configure AWS CLI
aws configure
```

**Issue:** Docker images not found
```bash
# Solution: Build images first
cd backend && docker build -t devops-project-backend .
cd chat-to-code-38 && docker build -t devops-project-frontend .
```

**Issue:** Kubernetes secrets missing
```bash
# Solution: Generate secrets
./scripts/k8s-generate-secrets.sh
```

**Issue:** Helm chart not found
```bash
# Solution: Scripts expect to be run from specific directories
# For helm-deploy.sh, run from infrastructure/helm/ or update CHART_PATH
cd infrastructure/helm
./deploy.sh prod v1.0.0 v1.0.0
```

---

## 📚 Additional Resources

### Official Documentation
- [Kubernetes Docs](https://kubernetes.io/docs/)
- [Helm Documentation](https://helm.sh/docs/)
- [AWS EKS User Guide](https://docs.aws.amazon.com/eks/)
- [Docker Documentation](https://docs.docker.com/)

### Project Documentation
- [Infrastructure README](../infrastructure/k8s/README.md)
- [Helm Chart README](../infrastructure/helm/README.md)
- [AWS EKS Guide](../infrastructure/k8s/AWS-EKS-GUIDE.md)
- [Security Guide](../infrastructure/k8s/SECURITY.md)
- [CI/CD Guide](../.github/workflows/CI-CD-GUIDE.md)

---

## 🆘 Support

If you encounter issues:

1. Check script logs for error messages
2. Verify prerequisites are installed
3. Review the troubleshooting section above
4. Check project documentation
5. Open an issue on GitHub: [Mucrypt/devops-project](https://github.com/Mucrypt/devops-project)

---

**Last Updated:** December 28, 2025  
**Project:** NexusAI DevOps  
**Maintainer:** Mucrypt
