# Kubernetes Quick Reference - NexusAI

## 📁 Manifest Files Overview

| File | Purpose | Type |
|------|---------|------|
| `namespace.yaml` | Create nexusai namespace | Namespace |
| `mongodb-secret.yaml` | MongoDB credentials | Secret |
| `mongodb-statefulset.yaml` | MongoDB database | StatefulSet |
| `mongodb-service.yaml` | MongoDB internal service | Service |
| `backend-secret.yaml` | Backend API secrets (JWT, Keys) | Secret |
| `backend-configmap.yaml` | Backend environment config | ConfigMap |
| `backend-deployment.yaml` | Backend API (3 replicas) | Deployment |
| `backend-service.yaml` | Backend internal service | Service |
| `backend-hpa.yaml` | Backend autoscaling (3-10) | HPA |
| `frontend-deployment.yaml` | Frontend Nginx (2 replicas) | Deployment |
| `frontend-service.yaml` | Frontend internal service | Service |
| `frontend-hpa.yaml` | Frontend autoscaling (2-5) | HPA |
| `ingress.yaml` | External access & routing | Ingress |
| `network-policy.yaml` | Pod network restrictions | NetworkPolicy |
| `resource-quota.yaml` | Namespace resource limits | ResourceQuota |
| `mongo-express-deployment.yaml` | MongoDB UI (optional) | Deployment |

## 🚀 Quick Commands

### Deploy
```bash
./k8s/deploy.sh                          # Deploy everything
kubectl apply -f k8s/namespace.yaml      # Just namespace
kubectl apply -f k8s/                    # All manifests
```

### Status
```bash
kubectl get all -n nexusai               # All resources
kubectl get pods -n nexusai -w           # Watch pods
kubectl get hpa -n nexusai               # Autoscaling status
kubectl get ingress -n nexusai           # Ingress IP/domain
```

### Logs
```bash
kubectl logs -f deployment/nexusai-backend -n nexusai
kubectl logs -f deployment/nexusai-frontend -n nexusai
kubectl logs mongodb-0 -n nexusai
```

### Scale
```bash
kubectl scale deployment nexusai-backend --replicas=5 -n nexusai
kubectl scale deployment nexusai-frontend --replicas=3 -n nexusai
```

### Port Forward (Local Testing)
```bash
kubectl port-forward -n nexusai svc/nexusai-frontend 8080:80
kubectl port-forward -n nexusai svc/nexusai-backend 5000:5000
kubectl port-forward -n nexusai svc/mongo-express 8082:8081
```

### Updates
```bash
# Update image
kubectl set image deployment/nexusai-backend backend=mucrypt/nexusai-backend:v2.0 -n nexusai

# Rollback
kubectl rollout undo deployment/nexusai-backend -n nexusai

# Restart
kubectl rollout restart deployment/nexusai-backend -n nexusai
```

### Debug
```bash
kubectl describe pod <pod-name> -n nexusai
kubectl exec -it <pod-name> -n nexusai -- sh
kubectl get events -n nexusai --sort-by='.lastTimestamp'
```

### Cleanup
```bash
./k8s/cleanup.sh                         # Remove everything
kubectl delete namespace nexusai         # Delete namespace only
```

## 🔐 Update Secrets Before Deploy

```bash
# Encode new secrets
echo -n 'my-jwt-secret-key' | base64

# Edit files
nano k8s/backend-secret.yaml
nano k8s/mongodb-secret.yaml
```

## 🌍 Configure Your Domain

Edit `k8s/ingress.yaml`:
```yaml
host: your-domain.com  # Change this!
```

## 📊 Resource Allocation

| Component | CPU Request | Memory Request | CPU Limit | Memory Limit |
|-----------|-------------|----------------|-----------|--------------|
| Backend | 200m | 256Mi | 500m | 512Mi |
| Frontend | 100m | 128Mi | 200m | 256Mi |
| MongoDB | 250m | 512Mi | 500m | 1Gi |
| Mongo Express | 50m | 128Mi | 100m | 256Mi |

## 🎯 Production Checklist

- [ ] Update secrets in `backend-secret.yaml`
- [ ] Update domain in `ingress.yaml`
- [ ] Configure SSL/TLS certificates
- [ ] Set up monitoring solution
- [ ] Configure MongoDB backups
- [ ] Review resource limits for your workload
- [ ] Test autoscaling behavior
- [ ] Set up alerts for failures

## 🆘 Common Issues

**Pods Pending**
```bash
kubectl describe pod <pod-name> -n nexusai  # Check events
kubectl get nodes                            # Check node capacity
```

**ImagePullBackOff**
```bash
# Verify image exists
docker pull mucrypt/nexusai-backend:latest
```

**CrashLoopBackOff**
```bash
kubectl logs <pod-name> -n nexusai --previous
```

**Service Not Reachable**
```bash
kubectl get endpoints -n nexusai             # Check endpoints
kubectl get svc -n nexusai                   # Check services
```

## 📚 Cloud-Specific Notes

**AWS EKS**
- Change storageClassName to `gp2` or `gp3`
- Use ALB Ingress Controller for production

**GCP GKE**
- Change storageClassName to `standard-rwo`
- Use GCE Ingress Controller or NGINX

**Azure AKS**
- Change storageClassName to `managed-premium`
- Use Azure Application Gateway or NGINX

## 🔗 Useful Links

- Full docs: `k8s/README.md`
- Deploy script: `k8s/deploy.sh`
- Cleanup script: `k8s/cleanup.sh`
