#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔍 Validating Docker Setup..."
echo ""

# Check files
checks_passed=0
checks_failed=0

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1"
        ((checks_passed++))
    else
        echo -e "${RED}❌${NC} $1 (missing)"
        ((checks_failed++))
    fi
}

echo "📁 Required Files:"
check_file "docker-compose.yml"
check_file ".env.example"
check_file "docker-setup.sh"
check_file "backend/Dockerfile"
check_file "backend/.dockerignore"
check_file "chat-to-code-38/Dockerfile"
check_file "chat-to-code-38/.dockerignore"
check_file "chat-to-code-38/nginx.conf"

echo ""
echo "📦 Backend Structure:"
check_file "backend/package.json"
check_file "backend/tsconfig.json"
check_file "backend/src/server.ts"

echo ""
echo "🎨 Frontend Structure:"
check_file "chat-to-code-38/package.json"
check_file "chat-to-code-38/vite.config.ts"
check_file "chat-to-code-38/src/main.tsx"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "Results: ${GREEN}${checks_passed} passed${NC}, ${RED}${checks_failed} failed${NC}"

if [ $checks_failed -eq 0 ]; then
    echo -e "${GREEN}✅ All files are in place!${NC}"
    echo ""
    echo "Ready to build! Run:"
    echo "  ./docker-setup.sh"
    echo "or"
    echo "  docker-compose up -d --build"
    exit 0
else
    echo -e "${RED}❌ Some files are missing${NC}"
    exit 1
fi
