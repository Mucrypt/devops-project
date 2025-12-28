#!/bin/bash

# Kubernetes Deployment Script for NexusAI
# This script deploys the entire NexusAI stack to Kubernetes

set -e

NAMESPACE="nexusai"
K8S_DIR="./infrastructure/k8s"

echo "🚀 NexusAI Kubernetes Deployment"
echo "=================================="
echo ""

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Check if cluster is accessible
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Cannot access Kubernetes cluster. Please check your kubeconfig."
    exit 1
fi

echo "✅ Kubernetes cluster is accessible"
echo ""

# Check if secret files exist
if [ ! -f "$K8S_DIR/mongodb-secret.yaml" ] || [ ! -f "$K8S_DIR/backend-secret.yaml" ]; then
    echo "❌ Secret files not found!"
    echo ""
    echo "Please generate secrets first by running:"
    echo "   ./scripts/k8s-generate-secrets.sh"
    echo ""
    echo "Or manually create from templates:"
    echo "   cp infrastructure/k8s/mongodb-secret.yaml.example infrastructure/k8s/mongodb-secret.yaml"
    echo "   cp infrastructure/k8s/backend-secret.yaml.example infrastructure/k8s/backend-secret.yaml"
    echo "   # Then edit and add your actual secrets"
    exit 1
fi

echo "✅ Secret files found"
echo ""

# Create namespace
echo "📦 Creating namespace..."
kubectl apply -f $K8S_DIR/namespace.yaml

# Apply resource quotas and limits
echo "🔒 Applying resource quotas and limits..."
kubectl apply -f $K8S_DIR/resource-quota.yaml

# Create secrets
echo "🔐 Creating secrets..."
kubectl apply -f $K8S_DIR/mongodb-secret.yaml
kubectl apply -f $K8S_DIR/backend-secret.yaml

# Create ConfigMaps
echo "⚙️  Creating ConfigMaps..."
kubectl apply -f $K8S_DIR/backend-configmap.yaml

# Deploy MongoDB
echo "🗄️  Deploying MongoDB StatefulSet..."
kubectl apply -f $K8S_DIR/mongodb-statefulset.yaml
kubectl apply -f $K8S_DIR/mongodb-service.yaml

echo "⏳ Waiting for MongoDB to be ready..."
kubectl wait --for=condition=ready pod -l app=mongodb -n $NAMESPACE --timeout=300s

# Deploy Mongo Express (optional)
echo "📊 Deploying Mongo Express..."
kubectl apply -f $K8S_DIR/mongo-express-deployment.yaml

# Deploy Backend
echo "⚡ Deploying Backend API..."
kubectl apply -f $K8S_DIR/backend-deployment.yaml
kubectl apply -f $K8S_DIR/backend-service.yaml
kubectl apply -f $K8S_DIR/backend-hpa.yaml

echo "⏳ Waiting for Backend to be ready..."
kubectl wait --for=condition=available deployment/nexusai-backend -n $NAMESPACE --timeout=300s

# Deploy Frontend
echo "🌐 Deploying Frontend..."
kubectl apply -f $K8S_DIR/frontend-deployment.yaml
kubectl apply -f $K8S_DIR/frontend-service.yaml
kubectl apply -f $K8S_DIR/frontend-hpa.yaml

echo "⏳ Waiting for Frontend to be ready..."
kubectl wait --for=condition=available deployment/nexusai-frontend -n $NAMESPACE --timeout=300s

# Apply Network Policies
echo "🔒 Applying Network Policies..."
kubectl apply -f $K8S_DIR/network-policy.yaml

# Deploy Ingress
echo "🌍 Deploying Ingress..."
kubectl apply -f $K8S_DIR/ingress.yaml

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📊 Deployment Status:"
echo "===================="
kubectl get all -n $NAMESPACE
echo ""

echo "🔍 To check pod status:"
echo "   kubectl get pods -n $NAMESPACE"
echo ""

echo "📝 To check logs:"
echo "   kubectl logs -f deployment/nexusai-backend -n $NAMESPACE"
echo "   kubectl logs -f deployment/nexusai-frontend -n $NAMESPACE"
echo ""

echo "🌐 To access the application:"
echo "   1. Get the Ingress IP:"
echo "      kubectl get ingress -n $NAMESPACE"
echo "   2. Add to /etc/hosts:"
echo "      <INGRESS-IP> nexusai.example.com"
echo "   3. Access: http://nexusai.example.com"
echo ""

echo "🔧 To port-forward (for local testing):"
echo "   Frontend: kubectl port-forward -n $NAMESPACE svc/nexusai-frontend 8080:80"
echo "   Backend:  kubectl port-forward -n $NAMESPACE svc/nexusai-backend 5000:5000"
echo "   MongoDB:  kubectl port-forward -n $NAMESPACE svc/mongodb 27017:27017"
echo "   Mongo-Express: kubectl port-forward -n $NAMESPACE svc/mongo-express 8082:8081"
