#!/bin/bash

# NexusAI SSL/TLS Setup with Let's Encrypt
# Usage: ./setup-ssl.sh your-domain.com

set -e

if [ -z "$1" ]; then
    echo "❌ Error: Domain name required"
    echo "Usage: ./setup-ssl.sh your-domain.com"
    exit 1
fi

DOMAIN=$1
echo "========================================="
echo "🔒 Setting up SSL/TLS for: $DOMAIN"
echo "========================================="

# Check if cert-manager is installed
echo "🔍 Checking cert-manager..."
if ! kubectl get namespace cert-manager > /dev/null 2>&1; then
    echo "📦 Installing cert-manager..."
    kubectl create namespace cert-manager
    kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
    
    echo "⏳ Waiting for cert-manager to be ready..."
    kubectl wait --for=condition=Ready pods --all -n cert-manager --timeout=300s
fi

echo "✅ cert-manager is ready!"

# Create ClusterIssuer for Let's Encrypt
echo "📝 Creating Let's Encrypt issuer..."
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@$DOMAIN
    privateKeySecretRef:
      name: letsencrypt-prod-key
    solvers:
    - http01:
        ingress:
          class: nginx
EOF

echo "✅ ClusterIssuer created!"

# Update ingress to enable TLS
echo "🔒 Enabling TLS in ingress..."
sed -i 's|ssl-redirect: "false"|ssl-redirect: "true"|g' infrastructure/helm/nexusai-chart/values-prod.yaml
sed -i 's|force-ssl-redirect: "false"|force-ssl-redirect: "true"|g' infrastructure/helm/nexusai-chart/values-prod.yaml
sed -i 's|# cert-manager.io/cluster-issuer:|cert-manager.io/cluster-issuer:|g' infrastructure/helm/nexusai-chart/values-prod.yaml

# Upgrade Helm release with TLS
echo "🚀 Deploying with TLS..."
helm upgrade nexusai ./infrastructure/helm/nexusai-chart \
    -n nexusai \
    --values ./infrastructure/helm/nexusai-chart/values.yaml \
    --values ./infrastructure/helm/nexusai-chart/values-prod.yaml \
    --set backend.image.tag=latest \
    --set frontend.image.tag=latest

echo ""
echo "✅ SSL/TLS setup complete!"
echo ""
echo "🔒 Your application is now secured with HTTPS:"
echo "   https://$DOMAIN"
echo "   https://www.$DOMAIN"
echo ""
echo "⏳ Certificate issuance may take 2-5 minutes."
echo "   Monitor status: kubectl get certificate -n nexusai"
echo ""
echo "📝 Test HTTPS: curl https://$DOMAIN"
echo ""
