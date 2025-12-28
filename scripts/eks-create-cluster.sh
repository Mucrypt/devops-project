#!/bin/bash

# AWS EKS Cluster Setup Script for NexusAI
# This script creates a production-ready EKS cluster

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    🚀 NexusAI EKS Cluster Setup (AWS)         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"
echo ""

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed${NC}"
    echo "Install: https://aws.amazon.com/cli/"
    exit 1
fi
echo -e "${GREEN}✓ AWS CLI installed${NC}"

# Check eksctl
if ! command -v eksctl &> /dev/null; then
    echo -e "${RED}❌ eksctl is not installed${NC}"
    echo "Install: https://eksctl.io/installation/"
    exit 1
fi
echo -e "${GREEN}✓ eksctl installed${NC}"

# Check kubectl
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}❌ kubectl is not installed${NC}"
    echo "Install: https://kubernetes.io/docs/tasks/tools/"
    exit 1
fi
echo -e "${GREEN}✓ kubectl installed${NC}"

echo ""

# Check AWS credentials
echo -e "${YELLOW}Checking AWS credentials...${NC}"
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured${NC}"
    echo "Run: aws configure"
    exit 1
fi

AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=$(aws configure get region || echo "us-east-1")
echo -e "${GREEN}✓ AWS Account: $AWS_ACCOUNT${NC}"
echo -e "${GREEN}✓ AWS Region: $AWS_REGION${NC}"
echo ""

# Get configuration
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   Cluster Configuration${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

read -p "Enter cluster name (default: nexusai-cluster): " CLUSTER_NAME
CLUSTER_NAME=${CLUSTER_NAME:-nexusai-cluster}

read -p "Enter AWS region (default: $AWS_REGION): " INPUT_REGION
REGION=${INPUT_REGION:-$AWS_REGION}

read -p "Enter node instance type (default: t3.small, alternatives: t3.medium/t3a.medium): " NODE_TYPE
NODE_TYPE=${NODE_TYPE:-t3.small}

read -p "Enter minimum number of nodes (default: 2): " MIN_NODES
MIN_NODES=${MIN_NODES:-2}

read -p "Enter maximum number of nodes (default: 4): " MAX_NODES
MAX_NODES=${MAX_NODES:-4}

read -p "Enter desired number of nodes (default: 2): " DESIRED_NODES
DESIRED_NODES=${DESIRED_NODES:-2}

echo ""
echo -e "${YELLOW}Cluster Configuration:${NC}"
echo "  Name: $CLUSTER_NAME"
echo "  Region: $REGION"
echo "  Node Type: $NODE_TYPE"
echo "  Nodes: $MIN_NODES - $MAX_NODES (desired: $DESIRED_NODES)"
echo ""

read -p "Proceed with cluster creation? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   Creating EKS Cluster (this takes 15-20 min)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Create cluster config file
cat > ../eks-cluster-config.yaml << EOF
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
  name: ${CLUSTER_NAME}
  region: ${REGION}
  version: "1.31"

# IAM settings
iam:
  withOIDC: true
  serviceAccounts:
  - metadata:
      name: aws-load-balancer-controller
      namespace: kube-system
    wellKnownPolicies:
      awsLoadBalancerController: true
  - metadata:
      name: ebs-csi-controller-sa
      namespace: kube-system
    wellKnownPolicies:
      ebsCSIController: true

# Managed node groups
managedNodeGroups:
  - name: nexusai-nodes
    instanceType: ${NODE_TYPE}
    minSize: ${MIN_NODES}
    maxSize: ${MAX_NODES}
    desiredCapacity: ${DESIRED_NODES}
    volumeSize: 50
    volumeType: gp3
    privateNetworking: false
    ssh:
      allow: false
    labels:
      role: worker
      environment: production
    tags:
      k8s.io/cluster-autoscaler/enabled: "true"
      k8s.io/cluster-autoscaler/${CLUSTER_NAME}: "owned"
    iam:
      withAddonPolicies:
        imageBuilder: true
        autoScaler: true
        externalDNS: true
        certManager: true
        appMesh: true
        ebs: true
        fsx: true
        efs: true
        albIngress: true
        xRay: true
        cloudWatch: true

# CloudWatch logging
cloudWatch:
  clusterLogging:
    enableTypes: ["api", "audit", "authenticator", "controllerManager", "scheduler"]
    logRetentionInDays: 7

# Add-ons
addons:
  - name: vpc-cni
    version: latest
  - name: coredns
    version: latest
  - name: kube-proxy
    version: latest
  - name: aws-ebs-csi-driver
    version: latest
    serviceAccountRoleARN: arn:aws:iam::${AWS_ACCOUNT}:role/AmazonEKS_EBS_CSI_DriverRole
EOF

echo -e "${YELLOW}Creating cluster with eksctl...${NC}"
exsctl create cluster -f ../eks-cluster-config.yaml

# Update kubeconfig
echo ""
echo -e "${GREEN}✓ Cluster created successfully!${NC}"
echo -e "${YELLOW}Updating kubeconfig...${NC}"
aws eks update-kubeconfig --region $REGION --name $CLUSTER_NAME

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   Installing NGINX Ingress Controller${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Install NGINX Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.9.4/deploy/static/provider/aws/deploy.yaml

echo "Waiting for ingress controller to be ready..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=300s

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   Installing Metrics Server (for HPA)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Install Metrics Server
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   Installing AWS Load Balancer Controller${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Install AWS Load Balancer Controller
helm repo add eks https://aws.github.io/eks-charts
helm repo update

helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=$CLUSTER_NAME \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller

echo ""
echo -e "${GREEN}════════════════════════════════════════════════${NC}"
echo -e "${GREEN}   ✓ EKS Cluster Setup Complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════${NC}"
echo ""

# Display cluster info
echo -e "${BLUE}📊 Cluster Information:${NC}"
echo "─────────────────────────────────────────────────"
kubectl cluster-info
echo ""

echo -e "${BLUE}📦 Nodes:${NC}"
echo "─────────────────────────────────────────────────"
kubectl get nodes
echo ""

echo -e "${BLUE}🌐 Ingress Load Balancer:${NC}"
echo "─────────────────────────────────────────────────"
kubectl get svc -n ingress-nginx
echo ""

echo -e "${YELLOW}⏳ Waiting for Load Balancer DNS to be ready...${NC}"
sleep 30
INGRESS_HOST=$(kubectl get svc ingress-nginx-controller -n ingress-nginx -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')

if [ -n "$INGRESS_HOST" ]; then
    echo -e "${GREEN}✓ Load Balancer DNS: $INGRESS_HOST${NC}"
    echo ""
    echo -e "${YELLOW}📝 Next Steps:${NC}"
    echo "1. Update infrastructure/k8s/ingress.yaml with this domain:"
    echo "   host: $INGRESS_HOST"
    echo ""
    echo "2. Generate secrets:"
    echo "   ./infrastructure/k8s/generate-secrets.sh"
    echo ""
    echo "3. Deploy NexusAI:"
    echo "   ./infrastructure/k8s/deploy.sh"
    echo ""
    echo "4. Get Ingress IP after deployment:"
    echo "   kubectl get ingress -n nexusai"
    echo ""
else
    echo -e "${YELLOW}⚠️  Load Balancer DNS not ready yet. Check with:${NC}"
    echo "   kubectl get svc -n ingress-nginx"
fi

echo ""
    echo -e "${BLUE}💾 Cluster configuration saved to: infrastructure/eks-cluster-config.yaml${NC}"
echo ""

# Save cluster info
cat > eks-cluster-info.txt << EOF
EKS Cluster Information
=======================
Cluster Name: $CLUSTER_NAME
Region: $REGION
AWS Account: $AWS_ACCOUNT
Node Type: $NODE_TYPE
Min Nodes: $MIN_NODES
Max Nodes: $MAX_NODES
Desired Nodes: $DESIRED_NODES

Kubeconfig: ~/.kube/config
Context: $(kubectl config current-context)

Ingress Load Balancer: $INGRESS_HOST

Created: $(date)

Useful Commands:
- View cluster: eksctl get cluster --name $CLUSTER_NAME --region $REGION
- Delete cluster: eksctl delete cluster --name $CLUSTER_NAME --region $REGION
- Update kubeconfig: aws eks update-kubeconfig --region $REGION --name $CLUSTER_NAME
- View nodes: kubectl get nodes
- View pods: kubectl get pods --all-namespaces
EOF

echo -e "${GREEN}✓ Cluster info saved to: eks-cluster-info.txt${NC}"
echo ""
echo -e "${GREEN}🎉 Your EKS cluster is ready!${NC}"
