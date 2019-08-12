#!/bin/sh
echo "Login to ECR Repository"
$(aws ecr get-login --no-include-email --region eu-west-1)
echo "Preparation task"
echo "Build Docker Image for $SERVICE_NAME"
docker build -t $SERVICE_NAME .
echo "Push to ECR Repository"
docker tag $AWS_ECS_REPO_NAME:latest $AWS_ECR_REPOSITORY/$AWS_ECS_REPO_NAME:latest
docker push $AWS_ECR_REPOSITORY/$AWS_ECS_REPO_NAME:latest