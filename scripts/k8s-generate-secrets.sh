#!/bin/bash

# Kubernetes Secrets Generator for NexusAI
# This script helps you create secure secrets for Kubernetes deployment

set -e

K8S_DIR="./infrastructure/k8s"
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    🔐 NexusAI Kubernetes Secrets Generator    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Function to encode to base64
encode_base64() {
    echo -n "$1" | base64 -w 0
}

# Function to generate random secret
generate_secret() {
    openssl rand -base64 32
}

echo -e "${YELLOW}⚠️  WARNING: Never commit actual secret files to Git!${NC}"
echo -e "${YELLOW}    They are already in .gitignore${NC}"
echo ""

# Check if secret files already exist
if [ -f "$K8S_DIR/mongodb-secret.yaml" ] || [ -f "$K8S_DIR/backend-secret.yaml" ]; then
    echo -e "${YELLOW}⚠️  Secret files already exist!${NC}"
    read -p "Do you want to overwrite them? (yes/no): " overwrite
    if [ "$overwrite" != "yes" ]; then
        echo "Cancelled."
        exit 0
    fi
    echo ""
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   MongoDB Credentials${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

read -p "Enter MongoDB username (default: nexusai): " MONGO_USER
MONGO_USER=${MONGO_USER:-nexusai}

read -sp "Enter MongoDB password (default: random): " MONGO_PASS
echo ""
if [ -z "$MONGO_PASS" ]; then
    MONGO_PASS=$(openssl rand -base64 16)
    echo -e "${GREEN}✓ Generated random password${NC}"
fi

MONGO_USER_B64=$(encode_base64 "$MONGO_USER")
MONGO_PASS_B64=$(encode_base64 "$MONGO_PASS")

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   Backend API Secrets${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# JWT Secret
echo -e "${YELLOW}Generating JWT secret...${NC}"
JWT_SECRET=$(generate_secret)
JWT_SECRET_B64=$(encode_base64 "$JWT_SECRET")
echo -e "${GREEN}✓ JWT secret generated${NC}"

# JWT Refresh Secret
echo -e "${YELLOW}Generating JWT refresh secret...${NC}"
JWT_REFRESH_SECRET=$(generate_secret)
JWT_REFRESH_SECRET_B64=$(encode_base64 "$JWT_REFRESH_SECRET")
echo -e "${GREEN}✓ JWT refresh secret generated${NC}"

echo ""

# Email configuration
read -p "Enter email address (or press Enter to skip): " EMAIL_USER
if [ -n "$EMAIL_USER" ]; then
    read -sp "Enter email app password: " EMAIL_PASS
    echo ""
    EMAIL_USER_B64=$(encode_base64 "$EMAIL_USER")
    EMAIL_PASS_B64=$(encode_base64 "$EMAIL_PASS")
else
    EMAIL_USER_B64=$(encode_base64 "placeholder@example.com")
    EMAIL_PASS_B64=$(encode_base64 "placeholder")
    echo -e "${YELLOW}⚠️  Skipped email configuration (placeholder values added)${NC}"
fi

echo ""

# Stripe configuration
read -p "Enter Stripe secret key (or press Enter to skip): " STRIPE_SECRET
if [ -n "$STRIPE_SECRET" ]; then
    read -p "Enter Stripe webhook secret: " STRIPE_WEBHOOK
    STRIPE_SECRET_B64=$(encode_base64 "$STRIPE_SECRET")
    STRIPE_WEBHOOK_B64=$(encode_base64 "$STRIPE_WEBHOOK")
else
    STRIPE_SECRET_B64=$(encode_base64 "placeholder")
    STRIPE_WEBHOOK_B64=$(encode_base64 "placeholder")
    echo -e "${YELLOW}⚠️  Skipped Stripe configuration (placeholder values added)${NC}"
fi

echo ""

# OpenAI configuration
read -p "Enter OpenAI API key (or press Enter to skip): " OPENAI_KEY
if [ -n "$OPENAI_KEY" ]; then
    OPENAI_KEY_B64=$(encode_base64 "$OPENAI_KEY")
else
    OPENAI_KEY_B64=$(encode_base64 "placeholder")
    echo -e "${YELLOW}⚠️  Skipped OpenAI configuration (placeholder value added)${NC}"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   Creating Secret Files...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Create MongoDB secret file
cat > "$K8S_DIR/mongodb-secret.yaml" << EOF
apiVersion: v1
kind: Secret
metadata:
  name: mongodb-secret
  namespace: nexusai
type: Opaque
data:
  mongodb-root-username: $MONGO_USER_B64
  mongodb-root-password: $MONGO_PASS_B64
EOF

echo -e "${GREEN}✓ Created $K8S_DIR/mongodb-secret.yaml${NC}"

# Create backend secret file
cat > "$K8S_DIR/backend-secret.yaml" << EOF
apiVersion: v1
kind: Secret
metadata:
  name: backend-secret
  namespace: nexusai
type: Opaque
data:
  JWT_SECRET: $JWT_SECRET_B64
  JWT_REFRESH_SECRET: $JWT_REFRESH_SECRET_B64
  EMAIL_USER: $EMAIL_USER_B64
  EMAIL_PASSWORD: $EMAIL_PASS_B64
  STRIPE_SECRET_KEY: $STRIPE_SECRET_B64
  STRIPE_WEBHOOK_SECRET: $STRIPE_WEBHOOK_B64
  OPENAI_API_KEY: $OPENAI_KEY_B64
EOF

echo -e "${GREEN}✓ Created $K8S_DIR/backend-secret.yaml${NC}"

echo ""
echo -e "${GREEN}════════════════════════════════════════════════${NC}"
echo -e "${GREEN}   ✓ Secrets generated successfully!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════${NC}"
echo ""

echo -e "${BLUE}📝 Your credentials (save these securely):${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "MongoDB Username: $MONGO_USER"
echo "MongoDB Password: $MONGO_PASS"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT:${NC}"
echo "1. These files are NOT committed to Git (in .gitignore)"
echo "2. Store credentials securely (password manager recommended)"
echo "3. Never share or commit these files"
echo "4. Update MongoDB URI in backend-configmap.yaml with your username/password"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Update k8s/backend-configmap.yaml with MongoDB connection string"
echo "2. Run: ./infrastructure/k8s/deploy.sh"
echo ""
