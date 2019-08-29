#!/bin/sh
echo "Deploy to ECS"
aws ecs update-service --force-new-deployment --service $SERVICE_NAME --region eu-west-1
