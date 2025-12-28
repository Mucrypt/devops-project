#!/bin/bash

# Docker Hub Push Script for NexusAI Project
# Run this script to push your images to Docker Hub

set -e

DOCKER_USERNAME="mucrypt"
BACKEND_IMAGE="nexusai-backend"
FRONTEND_IMAGE="nexusai-frontend"
VERSION="latest"

echo "🐳 NexusAI - Docker Hub Push Script"
echo "===================================="
echo ""

# Check if logged in
if ! docker info | grep -q "Username"; then
    echo "📝 Please login to Docker Hub first..."
    docker login -u $DOCKER_USERNAME
    echo ""
fi

# Tag images with version
echo "🏷️  Tagging images..."
docker tag devops-project-backend:latest $DOCKER_USERNAME/$BACKEND_IMAGE:$VERSION
docker tag devops-project-frontend:latest $DOCKER_USERNAME/$FRONTEND_IMAGE:$VERSION

# Optional: Also tag with date version
DATE_TAG=$(date +%Y%m%d)
docker tag devops-project-backend:latest $DOCKER_USERNAME/$BACKEND_IMAGE:$DATE_TAG
docker tag devops-project-frontend:latest $DOCKER_USERNAME/$FRONTEND_IMAGE:$DATE_TAG

echo "✅ Images tagged successfully"
echo ""

# Push images
echo "📤 Pushing backend image to Docker Hub..."
docker push $DOCKER_USERNAME/$BACKEND_IMAGE:$VERSION
docker push $DOCKER_USERNAME/$BACKEND_IMAGE:$DATE_TAG
echo ""

echo "📤 Pushing frontend image to Docker Hub..."
docker push $DOCKER_USERNAME/$FRONTEND_IMAGE:$VERSION
docker push $DOCKER_USERNAME/$FRONTEND_IMAGE:$DATE_TAG
echo ""

echo "🎉 Successfully pushed images to Docker Hub!"
echo ""
echo "📋 Your images are now available at:"
echo "   - https://hub.docker.com/r/$DOCKER_USERNAME/$BACKEND_IMAGE"
echo "   - https://hub.docker.com/r/$DOCKER_USERNAME/$FRONTEND_IMAGE"
echo ""
echo "🚀 To pull and use these images on any machine:"
echo "   docker pull $DOCKER_USERNAME/$BACKEND_IMAGE:$VERSION"
echo "   docker pull $DOCKER_USERNAME/$FRONTEND_IMAGE:$VERSION"
echo ""
echo "   Or use the date-tagged versions:"
echo "   docker pull $DOCKER_USERNAME/$BACKEND_IMAGE:$DATE_TAG"
echo "   docker pull $DOCKER_USERNAME/$FRONTEND_IMAGE:$DATE_TAG"
