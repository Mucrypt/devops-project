# AWS EKS Deployment Guide for NexusAI

Complete guide to deploy NexusAI on AWS EKS (Elastic Kubernetes Service).

## 📋 Prerequisites

### 1. Install Required Tools

**AWS CLI**
```bash
# Linux/macOS
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Verify
aws --version
```

**eksctl**
```bash
# Linux
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin

# Verify
eksctl version
```

**kubectl**
```bash
# Linux
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# Verify
kubectl version --client
```

**Helm** (for AWS Load Balancer Controller)
```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Verify
helm version
```

### 2. Configure AWS Credentials

```bash
aws configure
```

Enter:
- AWS Access Key ID
- AWS Secret Access Key
- Default region (e.g., `us-east-1`)
- Output format: `json`

Verify:
```bash
aws sts get-caller-identity
```

## 🚀 Quick Start

### Step 1: Create EKS Cluster

```bash
cd /home/mukulah/devops-project
./k8s/create-eks-cluster.sh
```

This script will:
- ✅ Check prerequisites
- ✅ Create EKS cluster (15-20 minutes)
- ✅ Install NGINX Ingress Controller
- ✅ Install Metrics Server (for autoscaling)
- ✅ Install AWS Load Balancer Controller
- ✅ Configure kubectl

**Configuration Options:**
- Cluster name: `nexusai-cluster` (or custom)
- Region: `us-east-1` (or any AWS region)
- Node type: `t3.medium` (2 vCPU, 4GB RAM)
- Nodes: 2-5 (min-max), 3 desired

### Step 2: Update Ingress with Load Balancer DNS

After cluster creation, you'll get a Load Balancer DNS like:
```
a1234567890abcdef-1234567890.us-east-1.elb.amazonaws.com
```

Update `k8s/ingress.yaml`:
```yaml
spec:
  rules:
  - host: a1234567890abcdef-1234567890.us-east-1.elb.amazonaws.com
```

Or use your own domain with CNAME:
```
nexusai.yourdomain.com  CNAME  a1234567890abcdef-1234567890.us-east-1.elb.amazonaws.com
```

### Step 3: Update Storage Class

Update `k8s/mongodb-statefulset.yaml` to use AWS EBS:
```yaml
volumeClaimTemplates:
  - metadata:
      name: mongodb-data
    spec:
      storageClassName: gp3  # AWS EBS gp3
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi
```

### Step 4: Generate Secrets

```bash
./infrastructure/k8s/generate-secrets.sh
```

### Step 5: Deploy NexusAI

```bash
./infrastructure/k8s/deploy.sh
```

### Step 6: Get Application URL

```bash
# Get ingress address
kubectl get ingress -n nexusai

# Get load balancer URL
kubectl get svc ingress-nginx-controller -n ingress-nginx
```

## 📊 Cluster Details

### Default Configuration

| Component | Specification |
|-----------|---------------|
| Kubernetes Version | 1.31 |
| Node Type | t3.medium (2 vCPU, 4GB RAM) |
| Min Nodes | 2 |
| Max Nodes | 5 |
| Desired Nodes | 3 |
| Volume Size | 50GB gp3 per node |
| Region | us-east-1 (configurable) |

### Estimated Monthly Cost

**For default configuration (us-east-1):**
- EC2 Instances (3x t3.medium): ~$90/month
- EKS Control Plane: $73/month
- EBS Volumes: ~$15/month
- Load Balancer: ~$20/month
- Data Transfer: Variable

**Total: ~$200-250/month** (varies by usage)

**Cost Optimization Tips:**
1. Use Spot Instances for non-production (50-90% savings)
2. Right-size instance types based on actual usage
3. Enable cluster autoscaler to scale down during low traffic
4. Use S3 for backups instead of EBS snapshots

## 🛠️ Management Commands

### View Cluster

```bash
eksctl get cluster --name nexusai-cluster --region us-east-1
kubectl get nodes
kubectl cluster-info
```

### View Resources

```bash
# All resources in nexusai namespace
kubectl get all -n nexusai

# Pods with details
kubectl get pods -n nexusai -o wide

# Services and endpoints
kubectl get svc,endpoints -n nexusai

# Ingress and load balancer
kubectl get ingress -n nexusai
kubectl get svc -n ingress-nginx
```

### View Logs

```bash
# Backend logs
kubectl logs -f deployment/nexusai-backend -n nexusai

# Frontend logs
kubectl logs -f deployment/nexusai-frontend -n nexusai

# MongoDB logs
kubectl logs -f mongodb-0 -n nexusai

# Ingress controller logs
kubectl logs -f -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx
```

### Scale Resources

```bash
# Manual scaling
kubectl scale deployment nexusai-backend --replicas=5 -n nexusai

# Check autoscaler status
kubectl get hpa -n nexusai
kubectl describe hpa nexusai-backend-hpa -n nexusai
```

### Update Application

```bash
# Update to new image version
kubectl set image deployment/nexusai-backend backend=mucrypt/nexusai-backend:v2.0 -n nexusai

# Check rollout status
kubectl rollout status deployment/nexusai-backend -n nexusai

# Rollback if needed
kubectl rollout undo deployment/nexusai-backend -n nexusai
```

### Troubleshooting

```bash
# Describe pod to see events
kubectl describe pod <pod-name> -n nexusai

# Get pod events
kubectl get events -n nexusai --sort-by='.lastTimestamp'

# Check node resources
kubectl top nodes
kubectl describe node <node-name>

# Check pod resources
kubectl top pods -n nexusai

# Shell into pod
kubectl exec -it <pod-name> -n nexusai -- sh
```

## 🔐 Security Best Practices

### 1. Enable IAM Roles for Service Accounts (IRSA)

Already configured in cluster setup. Allows pods to assume IAM roles.

### 2. Enable Secrets Encryption

```bash
# Create KMS key
aws kms create-key --description "EKS Secret Encryption"

# Enable encryption on cluster
aws eks associate-encryption-config \
  --cluster-name nexusai-cluster \
  --encryption-config resources=secrets,provider.keyArn=arn:aws:kms:REGION:ACCOUNT:key/KEY_ID
```

### 3. Network Policies

Already configured in `k8s/network-policy.yaml`.

### 4. Pod Security Standards

```bash
# Enable Pod Security Standards
kubectl label namespace nexusai pod-security.kubernetes.io/enforce=restricted
```

### 5. Regular Updates

```bash
# Update node group
eksctl upgrade nodegroup \
  --cluster=nexusai-cluster \
  --name=nexusai-nodes \
  --region=us-east-1

# Update cluster
eksctl upgrade cluster --name=nexusai-cluster --region=us-east-1
```

## 📈 Monitoring & Logging

### CloudWatch Container Insights

Already enabled via cluster logging.

View in AWS Console:
1. Go to CloudWatch
2. Container Insights
3. Select cluster: nexusai-cluster

### Prometheus & Grafana (Optional)

```bash
# Install Prometheus
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring --create-namespace

# Access Grafana
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80
# Username: admin, Password: prom-operator
```

### Application Logs

```bash
# Stream all logs
kubectl logs -f -n nexusai --all-containers=true --max-log-requests=10

# View in CloudWatch
# AWS Console > CloudWatch > Log Groups > /aws/eks/nexusai-cluster
```

## 🌐 Domain & SSL Setup

### Option 1: Route 53 + ACM (Recommended for AWS)

1. **Create hosted zone in Route 53:**
```bash
aws route53 create-hosted-zone --name yourdomain.com --caller-reference $(date +%s)
```

2. **Request SSL certificate in ACM:**
```bash
aws acm request-certificate \
  --domain-name nexusai.yourdomain.com \
  --validation-method DNS \
  --region us-east-1
```

3. **Add CNAME record for validation**

4. **Update ingress to use ALB:**
```yaml
annotations:
  kubernetes.io/ingress.class: alb
  alb.ingress.kubernetes.io/scheme: internet-facing
  alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:REGION:ACCOUNT:certificate/CERT_ID
```

### Option 2: cert-manager + Let's Encrypt

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create Let's Encrypt issuer (see k8s/README.md for details)
```

## 💰 Cost Management

### View Current Costs

```bash
# Using AWS Cost Explorer API
aws ce get-cost-and-usage \
  --time-period Start=2025-01-01,End=2025-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=DIMENSION,Key=SERVICE
```

### Enable Cluster Autoscaler

Already configured with node labels. Automatically scales nodes based on pod resource requests.

```bash
# Check autoscaler status
kubectl logs -f -n kube-system -l app=cluster-autoscaler
```

### Set Resource Quotas

Already configured in `k8s/resource-quota.yaml` to prevent runaway costs.

## 🗑️ Cleanup

### Delete Application

```bash
./infrastructure/k8s/cleanup.sh
```

### Delete EKS Cluster

```bash
eksctl delete cluster --name nexusai-cluster --region us-east-1
```

This will:
- Delete all node groups
- Delete the control plane
- Clean up associated resources (VPC, subnets, etc.)
- **Takes 10-15 minutes**

**Important:** This deletes everything! Make sure to backup data first.

### Verify Cleanup

```bash
# Check for remaining resources
aws eks list-clusters --region us-east-1

# Check CloudFormation stacks
aws cloudformation list-stacks --region us-east-1 --stack-status-filter CREATE_COMPLETE
```

## 🔧 Advanced Configuration

### Enable Cluster Autoscaler

```bash
# Deploy cluster autoscaler
kubectl apply -f https://raw.githubusercontent.com/kubernetes/autoscaler/master/cluster-autoscaler/cloudprovider/aws/examples/cluster-autoscaler-autodiscover.yaml

# Patch deployment
kubectl patch deployment cluster-autoscaler \
  -n kube-system \
  -p '{"spec":{"template":{"metadata":{"annotations":{"cluster-autoscaler.kubernetes.io/safe-to-evict":"false"}}}}}'

# Edit to add cluster name
kubectl edit deployment cluster-autoscaler -n kube-system
# Add: --node-group-auto-discovery=asg:tag=k8s.io/cluster-autoscaler/enabled,k8s.io/cluster-autoscaler/nexusai-cluster
```

### Use Spot Instances (Cost Savings)

Update `infrastructure/eks-cluster-config.yaml`:
```yaml
managedNodeGroups:
  - name: nexusai-spot-nodes
    instanceType: t3.medium
    spot: true
    minSize: 1
    maxSize: 3
    labels:
      instance-type: spot
```

### Multiple Node Groups

Mix on-demand and spot:
```yaml
managedNodeGroups:
  - name: on-demand-nodes
    instanceType: t3.medium
    minSize: 1
    maxSize: 3
  - name: spot-nodes
    instanceType: t3.medium
    spot: true
    minSize: 1
    maxSize: 5
```

## 📚 Additional Resources

- [EKS Best Practices Guide](https://aws.github.io/aws-eks-best-practices/)
- [EKS Workshop](https://www.eksworkshop.com/)
- [AWS EKS Documentation](https://docs.aws.amazon.com/eks/)
- [eksctl Documentation](https://eksctl.io/)

## 🆘 Support

For issues:
1. Check CloudWatch logs
2. Review EKS cluster events
3. Check AWS Service Health Dashboard
4. Open issue on GitHub: Mucrypt/chat-to-code-38

---

**Ready to deploy? Start with:** `./infrastructure/k8s/create-eks-cluster.sh`
