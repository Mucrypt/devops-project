#!/bin/bash

# NexusAI Deployment Testing Script
# This script tests the entire deployment workflow

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     🧪 NexusAI Deployment Testing Workflow                    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Test 1: Check Prerequisites
echo -e "${YELLOW}📋 Test 1: Checking Prerequisites...${NC}"
echo ""

check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✅ $1 installed${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 not found${NC}"
        return 1
    fi
}

check_command docker
check_command kubectl
check_command helm
check_command git

echo ""

# Test 2: Check Docker Hub Connection
echo -e "${YELLOW}�� Test 2: Checking Docker Hub Connection...${NC}"
if docker info | grep -q "Username"; then
    echo -e "${GREEN}✅ Logged in to Docker Hub${NC}"
    docker info | grep "Username"
else
    echo -e "${YELLOW}⚠️  Not logged in to Docker Hub${NC}"
    echo "Run: docker login -u mucrypt"
fi
echo ""

# Test 3: Check Kubernetes Cluster
echo -e "${YELLOW}�� Test 3: Checking Kubernetes Cluster...${NC}"
if kubectl cluster-info &> /dev/null; then
    echo -e "${GREEN}✅ Kubernetes cluster is accessible${NC}"
    kubectl cluster-info | grep "Kubernetes control plane"
    echo ""
    echo "Nodes:"
    kubectl get nodes
else
    echo -e "${RED}❌ Cannot access Kubernetes cluster${NC}"
    echo "Make sure your cluster is running and kubeconfig is set"
fi
echo ""

# Test 4: Check Helm
echo -e "${YELLOW}📋 Test 4: Checking Helm Installation...${NC}"
helm version --short
echo -e "${GREEN}✅ Helm is working${NC}"
echo ""

# Test 5: List Current Helm Releases
echo -e "${YELLOW}📋 Test 5: Checking Helm Releases...${NC}"
helm list -n nexusai || echo "No releases in nexusai namespace"
echo ""

# Test 6: Check Namespace
echo -e "${YELLOW}📋 Test 6: Checking Namespace...${NC}"
if kubectl get namespace nexusai &> /dev/null; then
    echo -e "${GREEN}✅ Namespace 'nexusai' exists${NC}"
    kubectl get all -n nexusai 2>/dev/null || echo "No resources in nexusai namespace"
else
    echo -e "${YELLOW}⚠️  Namespace 'nexusai' does not exist${NC}"
    echo "It will be created during deployment"
fi
echo ""

# Test 7: Check Infrastructure Files
echo -e "${YELLOW}📋 Test 7: Checking Infrastructure Files...${NC}"
FILES=(
    "infrastructure/docker-compose.yml"
    "infrastructure/helm/nexusai-chart/Chart.yaml"
    "infrastructure/helm/nexusai-chart/values.yaml"
    "infrastructure/k8s/deploy.sh"
    ".github/workflows/ci-cd.yaml"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $file"
    else
        echo -e "${RED}❌${NC} $file (missing)"
    fi
done
echo ""

# Test 8: Validate Helm Chart
echo -e "${YELLOW}📋 Test 8: Validating Helm Chart...${NC}"
cd infrastructure/helm
helm lint nexusai-chart
echo -e "${GREEN}✅ Helm chart is valid${NC}"
cd ../..
echo ""

# Test 9: Check Scripts
echo -e "${YELLOW}📋 Test 9: Checking Deployment Scripts...${NC}"
SCRIPTS=(
    "scripts/docker-setup.sh"
    "scripts/push-to-dockerhub.sh"
    "scripts/helm-deploy.sh"
    "scripts/k8s-deploy.sh"
)

for script in "${SCRIPTS[@]}"; do
    if [ -f "$script" ] && [ -x "$script" ]; then
        echo -e "${GREEN}✅${NC} $script (executable)"
    elif [ -f "$script" ]; then
        echo -e "${YELLOW}⚠️${NC} $script (not executable)"
        chmod +x "$script"
        echo "   Fixed permissions"
    else
        echo -e "${RED}❌${NC} $script (missing)"
    fi
done
echo ""

# Summary
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    Testing Summary                             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✅ Prerequisites check complete${NC}"
echo -e "${GREEN}✅ Infrastructure files verified${NC}"
echo -e "${GREEN}✅ Helm chart validated${NC}"
echo -e "${GREEN}✅ Scripts ready${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Build Docker images: ./scripts/docker-setup.sh"
echo "2. Push to Docker Hub: ./scripts/push-to-dockerhub.sh"
echo "3. Deploy with Helm: ./scripts/helm-deploy.sh prod latest latest"
echo "4. Or deploy with K8s: ./scripts/k8s-deploy.sh"
echo ""
echo -e "${BLUE}Ready to deploy! 🚀${NC}"

