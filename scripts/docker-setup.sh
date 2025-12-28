#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐳 NexusAI Docker Setup Script${NC}\n"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}\n"

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ .env file created${NC}"
        echo -e "${YELLOW}⚠️  Please edit .env file with your actual values before continuing${NC}"
        read -p "Press Enter when ready to continue..."
    else
        echo -e "${RED}❌ .env.example not found${NC}"
        exit 1
    fi
fi

# Stop existing containers if any
echo -e "${BLUE}🧹 Checking for existing containers...${NC}"
if docker ps -a --filter "name=nexusai-" --format "{{.Names}}" | grep -q "nexusai"; then
    echo -e "${YELLOW}⚠️  Found existing NexusAI containers. Stopping and removing...${NC}"
    docker-compose -f infrastructure/docker-compose.yml down 2>/dev/null || true
    docker stop $(docker ps -a --filter "name=nexusai-" --format "{{.Names}}") 2>/dev/null || true
    docker rm $(docker ps -a --filter "name=nexusai-" --format "{{.Names}}") 2>/dev/null || true
    echo -e "${GREEN}✅ Cleanup complete${NC}\n"
else
    echo -e "${GREEN}✅ No existing containers found${NC}\n"
fi

echo -e "${BLUE}📦 Building Docker images...${NC}\n"
docker-compose -f infrastructure/docker-compose.yml build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "\n${GREEN}✅ Build successful${NC}\n"

echo -e "${BLUE}🚀 Starting services...${NC}\n"
docker-compose -f infrastructure/docker-compose.yml up -d

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to start services${NC}"
    exit 1
fi

echo -e "\n${GREEN}✅ Services started successfully${NC}\n"

# Wait for services to be healthy
echo -e "${BLUE}⏳ Waiting for services to be healthy...${NC}\n"
sleep 10

# Check service status
echo -e "${BLUE}📊 Service Status:${NC}\n"
docker-compose -f infrastructure/docker-compose.yml ps

echo -e "\n${BLUE}🔍 Health Checks:${NC}\n"

# Check backend health
echo -n "Backend API: "
if curl -s http://localhost:5000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Healthy${NC}"
else
    echo -e "${RED}❌ Not responding${NC}"
fi

# Check frontend
echo -n "Frontend: "
if curl -s http://localhost/ > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Healthy${NC}"
else
    echo -e "${RED}❌ Not responding${NC}"
fi

# Check MongoDB
echo -n "MongoDB: "
if docker-compose -f infrastructure/docker-compose.yml exec -T mongodb mongosh --quiet --eval "db.runCommand('ping').ok" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Healthy${NC}"
else
    echo -e "${RED}❌ Not responding${NC}"
fi

echo -e "\n${GREEN}🎉 NexusAI is now running!${NC}\n"
echo -e "${BLUE}Access points:${NC}"
echo -e "  Frontend: ${GREEN}http://localhost${NC}"
echo -e "  Backend API: ${GREEN}http://localhost:5000${NC}"
echo -e "  API Health: ${GREEN}http://localhost:5000/health${NC}"
echo -e "  MongoDB: ${GREEN}mongodb://nexusai:nexusai123@localhost:27017/nexusai${NC}\n"

echo -e "${BLUE}Useful commands:${NC}"
echo -e "  View logs: ${YELLOW}docker-compose -f infrastructure/docker-compose.yml logs -f${NC}"
echo -e "  Stop services: ${YELLOW}docker-compose -f infrastructure/docker-compose.yml down${NC}"
echo -e "  Restart services: ${YELLOW}docker-compose -f infrastructure/docker-compose.yml restart${NC}"
echo -e "  Check status: ${YELLOW}docker-compose -f infrastructure/docker-compose.yml ps${NC}\n"

echo -e "${BLUE}📚 For more information, see DOCKER_SETUP.md${NC}\n"
