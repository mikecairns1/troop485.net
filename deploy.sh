#!/bin/bash

# Exit on error
set -e

# Load environment variables
if [ -f .env ]; then
    source .env
else
    echo "Error: .env file not found"
    exit 1
fi

# Validate required environment variables
required_vars=(
    "AWS_ACCESS_KEY_ID"
    "AWS_SECRET_ACCESS_KEY"
    "AWS_REGION"
    "DOMAIN_NAME"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "Error: $var is not set"
        exit 1
    fi
done

# Set WAF configuration
ENABLE_WAF=${ENABLE_WAF:-false}
echo "WAF Protection: $ENABLE_WAF"

# Create SNS topic for alarms
echo "Creating SNS topic..."
SNS_TOPIC_ARN=$(aws sns create-topic --name "Troop485Alarms" --query 'TopicArn' --output text)

# Deploy CloudFormation stack
echo "Deploying CloudFormation stack..."
aws cloudformation deploy \
    --template-file infrastructure.yaml \
    --stack-name troop485-infrastructure \
    --parameter-overrides \
        DomainName=$DOMAIN_NAME \
        EnableWAF=$ENABLE_WAF \
    --capabilities CAPABILITY_IAM

# Get stack outputs
echo "Getting stack outputs..."
WEBSITE_URL=$(aws cloudformation describe-stacks \
    --stack-name troop485-infrastructure \
    --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
    --output text)
API_ENDPOINT=$(aws cloudformation describe-stacks \
    --stack-name troop485-infrastructure \
    --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
    --output text)
CLOUDFRONT_ID=$(aws cloudformation describe-stacks \
    --stack-name troop485-infrastructure \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
    --output text)

# Deploy WAF configuration only if enabled
if [ "$ENABLE_WAF" = "true" ]; then
    echo "Deploying WAF configuration..."
    aws wafv2 create-web-acl \
        --name Troop485WAF \
        --scope CLOUDFRONT \
        --default-action Allow={} \
        --rules file://waf-config.json \
        --visibility-config SampledRequestsEnabled=true,CloudWatchMetricsEnabled=true,MetricName=Troop485WAF
fi

# Create CloudWatch alarms
echo "Creating CloudWatch alarms..."
# Replace variables in cloudwatch-alarms.json
sed -i "s/\${CLOUDFRONT_DISTRIBUTION_ID}/$CLOUDFRONT_ID/g" cloudwatch-alarms.json
sed -i "s/\${SNS_TOPIC_ARN}/$SNS_TOPIC_ARN/g" cloudwatch-alarms.json
sed -i "s/\${API_NAME}/troop485-api/g" cloudwatch-alarms.json
sed -i "s/\${LAMBDA_FUNCTION_NAME}/troop485-events-function/g" cloudwatch-alarms.json

# Create alarms
aws cloudwatch put-metric-alarm \
    --cli-input-json file://cloudwatch-alarms.json

# Deploy website files
echo "Deploying website files..."
aws s3 sync . s3://$DOMAIN_NAME \
    --exclude "*.git*" \
    --exclude "README.md" \
    --exclude "deploy.sh" \
    --exclude "node_modules/*" \
    --exclude "infrastructure.yaml" \
    --exclude "waf-config.json" \
    --exclude "cloudwatch-alarms.json" \
    --exclude ".env" \
    --delete

# Invalidate CloudFront cache
echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
    --distribution-id $CLOUDFRONT_ID \
    --paths "/*"

echo "Deployment completed successfully!"
echo "Website URL: $WEBSITE_URL"
echo "API Endpoint: $API_ENDPOINT"
echo "CloudFront Distribution ID: $CLOUDFRONT_ID"
echo "WAF Protection: $ENABLE_WAF" 