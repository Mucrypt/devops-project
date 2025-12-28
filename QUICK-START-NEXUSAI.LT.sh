#!/bin/bash
# Quick deployment script for nexusai.lt
# Run this after DNS is configured and propagated

echo "========================================="
echo "🚀 NexusAI.lt Quick Setup"
echo "========================================="
echo ""
echo "This will:"
echo "  1. Update Kubernetes ingress with nexusai.lt"
echo "  2. Deploy your application"
echo "  3. Setup HTTPS with Let's Encrypt"
echo ""
read -p "Press ENTER to continue or Ctrl+C to cancel..."

# Check DNS first
echo ""
echo "🔍 Checking DNS configuration..."
if ! host nexusai.lt > /dev/null 2>&1; then
    echo "❌ DNS not configured yet!"
    echo ""
    echo "Please add these CNAME records in Hostinger first:"
    echo "  @ -> aad3385e8ac9f4fdd85e9bbe50282f26-2ade025f04ab1ee1.elb.eu-north-1.amazonaws.com"
    echo "  www -> aad3385e8ac9f4fdd85e9bbe50282f26-2ade025f04ab1ee1.elb.eu-north-1.amazonaws.com"
    echo "  api -> aad3385e8ac9f4fdd85e9bbe50282f26-2ade025f04ab1ee1.elb.eu-north-1.amazonaws.com"
    echo ""
    echo "Then wait 10-15 minutes and run this script again."
    exit 1
fi

echo "✅ DNS is configured!"
echo ""

# Step 1: Deploy with domain
echo "📝 Step 1/2: Deploying with nexusai.lt..."
./setup-domain.sh nexusai.lt

if [ $? -eq 0 ]; then
    echo "✅ Domain setup complete!"
else
    echo "❌ Domain setup failed. Check errors above."
    exit 1
fi

echo ""
echo "⏳ Waiting 30 seconds for deployment to stabilize..."
sleep 30

# Step 2: Setup SSL
echo ""
echo "🔒 Step 2/2: Setting up HTTPS..."
./setup-ssl.sh nexusai.lt

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================="
    echo "✅ SUCCESS! Your app is live!"
    echo "========================================="
    echo ""
    echo "🌐 Your URLs:"
    echo "   https://nexusai.lt"
    echo "   https://www.nexusai.lt"
    echo "   https://nexusai.lt/api"
    echo ""
    echo "🎉 Share with your friends!"
    echo ""
else
    echo ""
    echo "⚠️  HTTPS setup had issues, but HTTP is working!"
    echo ""
    echo "Your app is accessible at:"
    echo "   http://nexusai.lt"
    echo ""
    echo "You can retry HTTPS setup later with:"
    echo "   ./setup-ssl.sh nexusai.lt"
    echo ""
fi
