# NexusAI Kubernetes Deployment Guide

Complete enterprise-ready Kubernetes manifests for deploying NexusAI on any Kubernetes cluster.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Scaling](#scaling)
- [Monitoring](#monitoring)
- [Security](#security)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

### Required Tools
- `kubectl` (v1.24+)
- Kubernetes cluster (v1.24+)
  - Local: Minikube, Kind, Docker Desktop
  - Cloud: GKE, EKS, AKS
- Ingress Controller (NGINX recommended)
- Metrics Server (for HPA)

### Cloud Provider Setup

**Google Kubernetes Engine (GKE)**
```bash
gcloud container clusters create nexusai-cluster \
  --zone us-central1-a \
  --num-nodes 3 \
  --machine-type n1-standard-2 \
  --enable-autoscaling \
  --min-nodes 3 \
  --max-nodes 10
```

**Amazon EKS**
```bash
eksctl create cluster \
  --name nexusai-cluster \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 3 \
  --nodes-max 10 \
  --managed
```

**Azure AKS**
```bash
az aks create \
  --resource-group nexusai-rg \
  --name nexusai-cluster \
  --node-count 3 \
  --enable-addons monitoring \
  --generate-ssh-keys
```

### Install NGINX Ingress Controller
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.9.4/deploy/static/provider/cloud/deploy.yaml
```

### Install Metrics Server (for autoscaling)
```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

## ⚡ Quick Start

### 1. Clone and Configure
```bash
cd /home/mukulah/devops-project
chmod +x k8s/deploy.sh k8s/cleanup.sh
```

### 2. Update Secrets (IMPORTANT!)
Edit `k8s/backend-secret.yaml` and replace base64 encoded values:
```bash
# Encode your values
echo -n 'your-actual-jwt-secret' | base64
echo -n 'your-email@gmail.com' | base64
echo -n 'your-email-password' | base64
```

### 3. Update Ingress Domain
Edit `k8s/ingress.yaml`:
```yaml
spec:
  rules:
  - host: your-domain.com  # Change this!
```

### 4. Deploy
```bash
./infrastructure/k8s/deploy.sh
```

### 5. Verify Deployment
```bash
kubectl get all -n nexusai
kubectl get pods -n nexusai -w
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Ingress                             │
│                    (nexusai.example.com)                    │
└───────────────┬─────────────────────┬───────────────────────┘
                │                     │
        ┌───────▼──────┐      ┌──────▼────────┐
        │   Frontend   │      │    Backend    │
        │   (Nginx)    │      │   (Node.js)   │
        │  Replicas: 2 │      │  Replicas: 3  │
        │   Port: 80   │      │  Port: 5000   │
        └──────────────┘      └───────┬────────┘
                                      │
                              ┌───────▼────────┐
                              │    MongoDB     │
                              │  StatefulSet   │
                              │  Replicas: 1   │
                              │  Port: 27017   │
                              │  Persistent    │
                              └────────────────┘
```

### Components

| Component | Type | Replicas | Resources | Autoscaling |
|-----------|------|----------|-----------|-------------|
| Frontend | Deployment | 2 | 128Mi/100m | 2-5 |
| Backend | Deployment | 3 | 256Mi/200m | 3-10 |
| MongoDB | StatefulSet | 1 | 512Mi/250m | No |
| Mongo Express | Deployment | 1 | 128Mi/50m | No |

## ⚙️ Configuration

### Environment Variables

**Backend ConfigMap** (`backend-configmap.yaml`)
- `NODE_ENV`: production
- `MONGODB_URI`: Connection string
- `JWT_EXPIRES_IN`: Token expiration
- `RATE_LIMIT_MAX_REQUESTS`: API rate limit

**Backend Secrets** (`backend-secret.yaml`)
- `JWT_SECRET`: JWT signing key
- `EMAIL_USER`: SMTP username
- `EMAIL_PASSWORD`: SMTP password
- `STRIPE_SECRET_KEY`: Stripe API key
- `OPENAI_API_KEY`: OpenAI API key

### Storage Configuration

**StorageClass Options:**
- AWS EKS: `gp2` or `gp3`
- GKE: `standard-rwo` or `ssd-rwo`
- AKS: `managed-premium`
- Local: `standard` or `hostpath`

Update in `mongodb-statefulset.yaml`:
```yaml
volumeClaimTemplates:
  - metadata:
      name: mongodb-data
    spec:
      storageClassName: gp3  # Change this
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi
```

## 🚀 Deployment

### Deploy All Resources
```bash
./infrastructure/k8s/deploy.sh
```

### Deploy Individual Components
```bash
# Namespace and configs
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/mongodb-secret.yaml
kubectl apply -f k8s/backend-secret.yaml
kubectl apply -f k8s/backend-configmap.yaml

# MongoDB
kubectl apply -f k8s/mongodb-statefulset.yaml
kubectl apply -f k8s/mongodb-service.yaml

# Backend
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/backend-hpa.yaml

# Frontend
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl apply -f k8s/frontend-hpa.yaml

# Ingress
kubectl apply -f k8s/ingress.yaml
```

### Rolling Updates
```bash
# Update to new image version
kubectl set image deployment/nexusai-backend backend=mucrypt/nexusai-backend:v2.0 -n nexusai
kubectl set image deployment/nexusai-frontend frontend=mucrypt/nexusai-frontend:v2.0 -n nexusai

# Rollback if needed
kubectl rollout undo deployment/nexusai-backend -n nexusai
```

## 📈 Scaling

### Horizontal Pod Autoscaling

**Backend HPA**
- Min: 3 replicas
- Max: 10 replicas
- Trigger: 70% CPU, 80% Memory

**Frontend HPA**
- Min: 2 replicas
- Max: 5 replicas
- Trigger: 75% CPU, 80% Memory

### Manual Scaling
```bash
# Scale backend
kubectl scale deployment nexusai-backend --replicas=5 -n nexusai

# Scale frontend
kubectl scale deployment nexusai-frontend --replicas=3 -n nexusai
```

### Check Autoscaling Status
```bash
kubectl get hpa -n nexusai
kubectl describe hpa nexusai-backend-hpa -n nexusai
```

## 🔍 Monitoring

### Check Status
```bash
# All resources
kubectl get all -n nexusai

# Pods
kubectl get pods -n nexusai -o wide

# Services
kubectl get svc -n nexusai

# Ingress
kubectl get ingress -n nexusai
```

### View Logs
```bash
# Backend logs
kubectl logs -f deployment/nexusai-backend -n nexusai

# Frontend logs
kubectl logs -f deployment/nexusai-frontend -n nexusai

# MongoDB logs
kubectl logs -f statefulset/mongodb -n nexusai

# Previous container logs
kubectl logs deployment/nexusai-backend -n nexusai --previous
```

### Resource Usage
```bash
# Node usage
kubectl top nodes

# Pod usage
kubectl top pods -n nexusai

# Container usage
kubectl top pods nexusai-backend-xxxx -n nexusai --containers
```

### Events
```bash
# All events
kubectl get events -n nexusai --sort-by='.lastTimestamp'

# Specific deployment events
kubectl describe deployment nexusai-backend -n nexusai
```

## 🔒 Security

### Network Policies
Implemented policies restrict traffic:
- Frontend → Backend only
- Backend → MongoDB only
- MongoDB → Backend only

### Secrets Management

**Create from literals:**
```bash
kubectl create secret generic backend-secret \
  --from-literal=JWT_SECRET='your-secret' \
  --from-literal=EMAIL_PASSWORD='your-password' \
  -n nexusai
```

**Create from files:**
```bash
kubectl create secret generic tls-cert \
  --from-file=tls.crt=./cert.crt \
  --from-file=tls.key=./cert.key \
  -n nexusai
```

### RBAC (Role-Based Access Control)
```bash
# Create service account
kubectl create serviceaccount nexusai-sa -n nexusai

# Bind role
kubectl create rolebinding nexusai-admin \
  --clusterrole=admin \
  --serviceaccount=nexusai:nexusai-sa \
  -n nexusai
```

### SSL/TLS with Cert-Manager

1. Install cert-manager:
```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
```

2. Create Let's Encrypt issuer:
```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
```

3. Uncomment TLS section in `ingress.yaml`

## 🧪 Testing

### Port Forwarding (Local Testing)
```bash
# Frontend
kubectl port-forward -n nexusai svc/nexusai-frontend 8080:80

# Backend
kubectl port-forward -n nexusai svc/nexusai-backend 5000:5000

# MongoDB
kubectl port-forward -n nexusai svc/mongodb 27017:27017

# Mongo Express
kubectl port-forward -n nexusai svc/mongo-express 8082:8081
```

### Health Checks
```bash
# Backend health
kubectl exec -it deployment/nexusai-backend -n nexusai -- curl localhost:5000/health

# Frontend health
kubectl exec -it deployment/nexusai-frontend -n nexusai -- curl localhost:80
```

### Database Connection Test
```bash
kubectl exec -it mongodb-0 -n nexusai -- mongosh \
  -u nexusai \
  -p nexusai123 \
  --authenticationDatabase admin \
  --eval "db.adminCommand('ping')"
```

## 🐛 Troubleshooting

### Pod Not Starting
```bash
# Check pod status
kubectl describe pod <pod-name> -n nexusai

# Check events
kubectl get events -n nexusai --field-selector involvedObject.name=<pod-name>

# Check logs
kubectl logs <pod-name> -n nexusai
```

### ImagePullBackOff
```bash
# Check image pull secrets
kubectl get secrets -n nexusai

# Describe pod to see error
kubectl describe pod <pod-name> -n nexusai

# Manually pull image to verify
docker pull mucrypt/nexusai-backend:latest
```

### CrashLoopBackOff
```bash
# Check logs from crashed container
kubectl logs <pod-name> -n nexusai --previous

# Describe pod
kubectl describe pod <pod-name> -n nexusai
```

### Pending PVCs
```bash
# Check PVC status
kubectl get pvc -n nexusai

# Check storage classes
kubectl get storageclass

# Describe PVC
kubectl describe pvc mongodb-data-mongodb-0 -n nexusai
```

### Service Not Accessible
```bash
# Check service endpoints
kubectl get endpoints -n nexusai

# Check pod labels match service selector
kubectl get pods -n nexusai --show-labels

# Test from within cluster
kubectl run -it --rm debug --image=busybox --restart=Never -n nexusai -- sh
wget -O- http://nexusai-backend:5000/health
```

### DNS Issues
```bash
# Test DNS resolution
kubectl run -it --rm debug --image=busybox --restart=Never -n nexusai -- sh
nslookup nexusai-backend.nexusai.svc.cluster.local
```

## 🗑️ Cleanup

### Delete All Resources
```bash
./infrastructure/k8s/cleanup.sh
```

### Delete Specific Resources
```bash
# Delete deployments
kubectl delete deployment nexusai-backend nexusai-frontend -n nexusai

# Delete services
kubectl delete svc nexusai-backend nexusai-frontend -n nexusai

# Delete namespace (deletes everything)
kubectl delete namespace nexusai
```

## 📚 Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/)
- [Cert-Manager Docs](https://cert-manager.io/docs/)
- [HPA Guide](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)

## 🎯 Production Checklist

- [ ] Update all secrets with production values
- [ ] Configure SSL/TLS certificates
- [ ] Set up monitoring (Prometheus/Grafana)
- [ ] Configure backup for MongoDB
- [ ] Set up log aggregation (ELK/Loki)
- [ ] Configure alerts
- [ ] Review resource limits
- [ ] Test disaster recovery
- [ ] Document runbooks
- [ ] Set up CI/CD pipeline

---

**Support:** For issues, please open a GitHub issue at Mucrypt/chat-to-code-38
