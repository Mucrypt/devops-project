#!/bin/bash
# Quick test deployment for chatbuilds.com

echo "========================================="
echo "🚀 Deploying to chatbuilds.com"
echo "========================================="

# Check DNS
echo "🔍 Checking DNS for chatbuilds.com..."
if ! host chatbuilds.com > /dev/null 2>&1; then
    echo "⚠️  Warning: DNS not resolving yet"
    echo "Make sure CNAME records are added for:"
    echo "  @ -> aad3385e8ac9f4fdd85e9bbe50282f26-2ade025f04ab1ee1.elb.eu-north-1.amazonaws.com"
    echo "  www -> aad3385e8ac9f4fdd85e9bbe50282f26-2ade025f04ab1ee1.elb.eu-north-1.amazonaws.com"
    echo ""
    echo "Continuing anyway..."
else
    echo "✅ DNS is configured!"
fi

echo ""
echo "📝 Deploying application..."
helm upgrade nexusai ./infrastructure/helm/nexusai-chart \
    -n nexusai \
    --values ./infrastructure/helm/nexusai-chart/values.yaml \
    --values ./infrastructure/helm/nexusai-chart/values-prod.yaml \
    --set backend.image.tag=latest \
    --set frontend.image.tag=latest

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your application should be accessible at:"
echo "   http://chatbuilds.com"
echo "   http://www.chatbuilds.com"
echo ""
echo "📝 Test with: curl http://chatbuilds.com"
echo ""
