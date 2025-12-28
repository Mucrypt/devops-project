#!/bin/bash

# Kubernetes Cleanup Script for NexusAI
# This script removes all NexusAI resources from Kubernetes

set -e

NAMESPACE="nexusai"
K8S_DIR="./infrastructure/k8s"

echo "🗑️  NexusAI Kubernetes Cleanup"
echo "=============================="
echo ""

read -p "⚠️  This will delete all NexusAI resources including data. Are you sure? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Cleanup cancelled."
    exit 0
fi

echo ""
echo "🗑️  Deleting all resources in namespace: $NAMESPACE"
echo ""

# Delete in reverse order
kubectl delete -f $K8S_DIR/ingress.yaml --ignore-not-found=true
kubectl delete -f $K8S_DIR/network-policy.yaml --ignore-not-found=true
kubectl delete -f $K8S_DIR/frontend-hpa.yaml --ignore-not-found=true
kubectl delete -f $K8S_DIR/frontend-service.yaml --ignore-not-found=true
kubectl delete -f $K8S_DIR/frontend-deployment.yaml --ignore-not-found=true
kubectl delete -f $K8S_DIR/backend-hpa.yaml --ignore-not-found=true
kubectl delete -f $K8S_DIR/backend-service.yaml --ignore-not-found=true
kubectl delete -f $K8S_DIR/backend-deployment.yaml --ignore-not-found=true
kubectl delete -f $K8S_DIR/mongo-express-deployment.yaml --ignore-not-found=true
kubectl delete -f $K8S_DIR/mongodb-service.yaml --ignore-not-found=true
kubectl delete -f $K8S_DIR/mongodb-statefulset.yaml --ignore-not-found=true
kubectl delete -f $K8S_DIR/backend-configmap.yaml --ignore-not-found=true
kubectl delete -f $K8S_DIR/backend-secret.yaml --ignore-not-found=true
kubectl delete -f $K8S_DIR/mongodb-secret.yaml --ignore-not-found=true
kubectl delete -f $K8S_DIR/resource-quota.yaml --ignore-not-found=true

# Delete PVCs
echo "🗑️  Deleting PersistentVolumeClaims..."
kubectl delete pvc --all -n $NAMESPACE --ignore-not-found=true

# Delete namespace
echo "🗑️  Deleting namespace..."
kubectl delete namespace $NAMESPACE --ignore-not-found=true

echo ""
echo "✅ Cleanup complete!"
