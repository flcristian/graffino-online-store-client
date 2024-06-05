#!/bin/bash

# Ensure mandatory environment variables are set
: "${USERNAME:?USERNAME not set or empty}"
: "${REPO:?REPO not set or empty}"
: "${TAG:?TAG not set or empty}"


echo "Building Docker image..."
docker build -f Dockerfile -t ${REPO}:${TAG} .

echo "Getting the new image ID..."
IMAGE_ID=$(docker images -q ${REPO}:${TAG})
echo "New image ID: $IMAGE_ID"

echo "Tagging the image..."
docker tag ${REPO}:${TAG} ${USERNAME}/${REPO}:${TAG}

echo "Pushing the tagged image..."
docker push ${USERNAME}/${REPO}:${TAG}

echo "Script completed."