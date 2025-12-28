#!/bin/bash

# NexusAI Domain Setup Script
# Usage: ./setup-domain.sh your-domain.com

set -e

if [ -z "$1" ]; then
    echo "❌ Error: Domain name required"
    echo "Usage: ./setup-domain.sh your-domain.com"
    exit 1
fi

DOMAIN=$1
echo "========================================="
echo "🌐 Setting up domain: $DOMAIN"
echo "========================================="

# Verify DNS is configured
echo "🔍 Checking DNS configuration..."
if ! host $DOMAIN > /dev/null 2>&1; then
    echo "⚠️  Warning: DNS not resolving yet. Please configure DNS first:"
    echo ""
    echo "Add these CNAME records in Hostinger:"
    echo "  @ -> aad3385e8ac9f4fdd85e9bbe50282f26-2ade025f04ab1ee1.elb.eu-north-1.amazonaws.com"
    echo "  www -> aad3385e8ac9f4fdd85e9bbe50282f26-2ade025f04ab1ee1.elb.eu-north-1.amazonaws.com"
    echo "  api -> aad3385e8ac9f4fdd85e9bbe50282f26-2ade025f04ab1ee1.elb.eu-north-1.amazonaws.com"
    echo ""
    echo "Wait 5-10 minutes for DNS propagation, then run this script again."
    exit 1
fi

echo "✅ DNS is configured!"

# Update values-prod.yaml
echo "📝 Updating Helm values..."
sed -i "s|nexusai.example.com|$DOMAIN|g" infrastructure/helm/nexusai-chart/values-prod.yaml

# Upgrade Helm release
echo "🚀 Deploying with new domain..."
helm upgrade nexusai ./infrastructure/helm/nexusai-chart \
    -n nexusai \
    --values ./infrastructure/helm/nexusai-chart/values.yaml \
    --values ./infrastructure/helm/nexusai-chart/values-prod.yaml \
    --set backend.image.tag=latest \
    --set frontend.image.tag=latest

echo ""
echo "✅ Domain setup complete!"
echo ""
echo "🌐 Your application is now accessible at:"
echo "   http://$DOMAIN"
echo "   http://www.$DOMAIN"
echo "   http://api.$DOMAIN"
echo ""
echo "📝 Next steps:"
echo "1. Test the domain: curl http://$DOMAIN"
echo "2. Setup SSL/TLS (optional): ./setup-ssl.sh $DOMAIN"
echo ""
