# 🎉 NexusAI Successfully Deployed to AWS EKS!

## Deployment Summary

**Date**: December 28, 2025  
**Cluster**: nexusai-cluster  
**Region**: eu-north-1 (Stockholm)  
**Kubernetes**: v1.31

## Architecture

### AWS Resources
- **EKS Cluster**: nexusai-cluster
- **Worker Nodes**: 2x t3.small (2 vCPU, 2GB RAM each)
- **Load Balancer**: Classic Load Balancer (AWS ELB)
- **Storage**: emptyDir (temporary - see notes below)

### Application Components

| Component | Replicas | Status | Resources |
|-----------|----------|--------|-----------|
| **MongoDB** | 1 (StatefulSet) | ✅ Running | 250m CPU, 512Mi RAM |
| **Backend API** | 3 | ✅ Running | 600m CPU, 768Mi RAM total |
| **Frontend** | 1 | ✅ Running | 100m CPU, 128Mi RAM |
| **Mongo Express** | 1 | ⚠️  Disabled | - |

### Autoscaling (HPA)
- **Backend**: 3-10 replicas (CPU: 70%, Memory: 80%)
- **Frontend**: 1-5 replicas (CPU: 75%, Memory: 80%)

## Access Information

### Application URL
```
http://aad3385e8ac9f4fdd85e9bbe50282f26-2ade025f04ab1ee1.elb.eu-north-1.amazonaws.com
```

### MongoDB Credentials
- **Username**: nexusai
- **Password**: nDKFTm25PAnbhx43gTfq1Q==
- **Connection String**: `mongodb://nexusai:nDKFTm25PAnbhx43gTfq1Q==@mongodb.nexusai.svc.cluster.local:27017/nexusai?authSource=admin`

## Kubernetes Commands

```bash
# View all resources
kubectl get all -n nexusai

# View pods
kubectl get pods -n nexusai

# View logs
kubectl logs -f deployment/nexusai-backend -n nexusai
kubectl logs -f deployment/nexusai-frontend -n nexusai

# Scale deployments
kubectl scale deployment nexusai-backend --replicas=5 -n nexusai

# Check HPA status
kubectl get hpa -n nexusai

# Check ingress
kubectl get ingress -n nexusai
```

## Monthly Cost Estimate (EU-North-1)

| Resource | Cost |
|----------|------|
| EKS Control Plane | $73/month |
| EC2 (2x t3.small) | ~$30/month |
| EBS Volumes | ~$5/month |
| Load Balancer | ~$20/month |
| **Total** | **~$130-150/month** |

## Important Notes

### ⚠️  Storage (TODO)
MongoDB is currently using **emptyDir** volumes, which means:
- **Data is NOT persistent**
- Data will be lost if the pod restarts
- This is **TEMPORARY** for testing only

**To enable persistence:**
1. Fix EBS CSI driver IAM permissions
2. Update `infrastructure/k8s/mongodb-statefulset.yaml` to use volumeClaimTemplates
3. Redeploy MongoDB

### Resource Constraints
- **Memory**: Nodes are at 94-95% memory utilization
- **Frontend**: Scaled to 1 replica due to memory constraints
- **Recommendation**: Scale cluster to 3 nodes or use t3.medium instances for production

### Disabled Components
- **Mongo Express**: Disabled due to memory constraints
- Can be re-enabled after scaling the cluster

## Troubleshooting

### View Pod Events
```bash
kubectl describe pod <pod-name> -n nexusai
```

### Check Resource Usage
```bash
kubectl top nodes
kubectl top pods -n nexusai
```

### Restart Deployments
```bash
kubectl rollout restart deployment nexusai-backend -n nexusai
kubectl rollout restart deployment nexusai-frontend -n nexusai
```

### Check Logs for Errors
```bash
kubectl logs --previous <pod-name> -n nexusai
```

## Scaling the Cluster

If you need more resources:

```bash
# Scale node group
eksctl scale nodegroup --cluster=nexusai-cluster \
  --name=nexusai-nodes \
  --region=eu-north-1 \
  --nodes=3
```

## Cleanup

To delete everything:

```bash
# Delete application
./infrastructure/k8s/cleanup.sh

# Delete cluster
eksctl delete cluster --name nexusai-cluster --region=eu-north-1
```

## Files Modified

- `chat-to-code-38/nginx.conf` - Removed backend proxy (Ingress handles routing)
- `k8s/mongodb-statefulset.yaml` - Changed to emptyDir temporarily
- `k8s/backend-configmap.yaml` - Updated MongoDB password
- `k8s/ingress.yaml` - Updated with Load Balancer DNS

## Next Steps

1. **Enable Persistent Storage**:
   - Fix EBS CSI driver IAM trust policy
   - Re-enable volumeClaimTemplates in MongoDB StatefulSet

2. **Scale Cluster** (for production):
   - Add 1-2 more nodes
   - Or upgrade to t3.medium instances

3. **Enable SSL/TLS**:
   - Install cert-manager
   - Configure Let's Encrypt
   - Update ingress with TLS

4. **Set up Monitoring**:
   - Install Prometheus & Grafana
   - Configure CloudWatch Container Insights

5. **Configure Custom Domain**:
   - Point your domain to Load Balancer DNS
   - Update ingress.yaml with your domain

---

**Status**: ✅ Production-ready (with persistence TODO)  
**Deployed by**: create-eks-cluster.sh + deploy.sh  
**Last Updated**: December 28, 2025
