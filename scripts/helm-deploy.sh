#!/bin/bash

# Helm deployment script with tag override support
# Usage: ./deploy.sh [environment] [backend-tag] [frontend-tag]
# Example: ./deploy.sh dev v1.2.3 v1.2.3
# Example: ./deploy.sh prod v2.0.0 v2.0.0
# Example: ./deploy.sh prod $(git rev-parse --short HEAD) $(git rev-parse --short HEAD)

set -e

ENVIRONMENT=${1:-dev}
BACKEND_TAG=${2:-latest}
FRONTEND_TAG=${3:-latest}
NAMESPACE="nexusai"
CHART_PATH="./infrastructure/helm/nexusai-chart"
RELEASE_NAME="nexusai"

# Get the project root directory (parent of scripts folder)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

echo "========================================="
echo "🚀 Deploying NexusAI Application"
echo "========================================="
echo "Environment: $ENVIRONMENT"
echo "Backend Tag: $BACKEND_TAG"
echo "Frontend Tag: $FRONTEND_TAG"
echo "Namespace: $NAMESPACE"
echo "========================================="

# Check if Helm is installed
if ! command -v helm &> /dev/null; then
    echo "❌ Helm is not installed. Please install Helm first."
    exit 1
fi

# Check if kubectl is configured
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ kubectl is not configured. Please configure kubectl first."
    exit 1
fi

# Validate environment
if [[ "$ENVIRONMENT" != "dev" && "$ENVIRONMENT" != "prod" ]]; then
    echo "❌ Invalid environment. Use 'dev' or 'prod'."
    exit 1
fi

# Create namespace if it doesn't exist
echo "📦 Ensuring namespace exists..."
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Check if Helm release exists
if helm status $RELEASE_NAME -n $NAMESPACE &> /dev/null; then
    echo "🔄 Helm release exists, upgrading..."
    HELM_ACTION="upgrade"
else
    echo "🆕 Helm release doesn't exist, installing..."
    # Delete any manually created resources that would conflict with Helm
    echo "🧹 Cleaning up non-Helm managed resources..."
    
    # Delete secrets
    kubectl delete secret backend-secret -n $NAMESPACE --ignore-not-found=true
    kubectl delete secret mongodb-secret -n $NAMESPACE --ignore-not-found=true
    
    # Delete configmaps
    kubectl delete configmap backend-config -n $NAMESPACE --ignore-not-found=true
    
    # Delete deployments and services
    kubectl delete deployment nexusai-backend -n $NAMESPACE --ignore-not-found=true
    kubectl delete deployment nexusai-frontend -n $NAMESPACE --ignore-not-found=true
    kubectl delete deployment mongo-express -n $NAMESPACE --ignore-not-found=true
    kubectl delete service nexusai-backend -n $NAMESPACE --ignore-not-found=true
    kubectl delete service nexusai-frontend -n $NAMESPACE --ignore-not-found=true
    kubectl delete service mongo-express -n $NAMESPACE --ignore-not-found=true
    kubectl delete service mongodb -n $NAMESPACE --ignore-not-found=true
    
    # Delete statefulsets
    kubectl delete statefulset mongodb -n $NAMESPACE --ignore-not-found=true
    
    # Delete HPAs
    kubectl delete hpa nexusai-backend-hpa -n $NAMESPACE --ignore-not-found=true
    kubectl delete hpa nexusai-frontend-hpa -n $NAMESPACE --ignore-not-found=true
    
    # Delete ingress
    kubectl delete ingress nexusai-ingress -n $NAMESPACE --ignore-not-found=true
    
    echo "⏳ Waiting for resources to be deleted..."
    sleep 10
    
    HELM_ACTION="install"
fi

# Deploy with Helm
echo "🎯 Deploying with Helm..."
helm upgrade --install $RELEASE_NAME $CHART_PATH \
    --namespace $NAMESPACE \
    --create-namespace \
    --values $CHART_PATH/values.yaml \
    --values $CHART_PATH/values-$ENVIRONMENT.yaml \
    --set backend.image.tag=$BACKEND_TAG \
    --set frontend.image.tag=$FRONTEND_TAG \
    --wait \
    --timeout 5m

echo ""
echo "✅ Deployment successful!"
echo ""
echo "📊 Current deployment status:"
kubectl get pods -n $NAMESPACE
echo ""
kubectl get svc -n $NAMESPACE
echo ""
kubectl get ingress -n $NAMESPACE

echo ""
echo "🔍 To view logs:"
echo "  Backend:  kubectl logs -n $NAMESPACE -l app=nexusai-backend -f"
echo "  Frontend: kubectl logs -n $NAMESPACE -l app=nexusai-frontend -f"
echo ""
echo "🌐 To get the ingress URL:"
echo "  kubectl get ingress -n $NAMESPACE"
