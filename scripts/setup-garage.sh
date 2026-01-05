#!/bin/bash
# Garage S3 Setup Script
# This script initializes Garage with a bucket and API keys

set -e

ADMIN_TOKEN="sante-vitalite-admin-token-dev"
GARAGE_ADMIN="http://localhost:3902"
BUCKET_NAME="sante-vitalite-media"
KEY_NAME="sante-vitalite-key"

echo "🚀 Setting up Garage S3..."

# Wait for Garage to be ready
echo "⏳ Waiting for Garage to start..."
for i in {1..30}; do
    if curl -s -H "Authorization: Bearer $ADMIN_TOKEN" "$GARAGE_ADMIN/v1/health" > /dev/null 2>&1; then
        echo "✅ Garage is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Timeout waiting for Garage to start"
        exit 1
    fi
    sleep 1
done

# Get node ID from status endpoint
echo "📋 Getting node information..."
STATUS_RESPONSE=$(curl -s -H "Authorization: Bearer $ADMIN_TOKEN" "$GARAGE_ADMIN/v1/status")
NODE_ID=$(echo "$STATUS_RESPONSE" | tr -d '\n ' | grep -o '"node":"[^"]*"' | cut -d'"' -f4)

if [ -z "$NODE_ID" ]; then
    echo "❌ Could not get node ID"
    echo "Response: $STATUS_RESPONSE"
    exit 1
fi

echo "   Node ID: ${NODE_ID:0:16}..."

# Check current layout version
LAYOUT_RESPONSE=$(curl -s -H "Authorization: Bearer $ADMIN_TOKEN" "$GARAGE_ADMIN/v1/layout")
LAYOUT_VERSION=$(echo "$LAYOUT_RESPONSE" | grep -o '"version":[0-9]*' | cut -d':' -f2)
STAGING_HASH=$(echo "$LAYOUT_RESPONSE" | grep -o '"stagedRoleChanges":\[[^]]*\]' | head -1)

echo "   Current layout version: $LAYOUT_VERSION"

# Apply layout (assign all storage to this node) - 1GB capacity
echo "🔧 Applying cluster layout..."
LAYOUT_UPDATE=$(curl -s -X POST -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d "[{\"id\": \"$NODE_ID\", \"zone\": \"dc1\", \"capacity\": 1073741824, \"tags\": []}]" \
    "$GARAGE_ADMIN/v1/layout")

echo "   Layout staged"

# Get new layout version for apply
LAYOUT_RESPONSE=$(curl -s -H "Authorization: Bearer $ADMIN_TOKEN" "$GARAGE_ADMIN/v1/layout")
LAYOUT_VERSION=$(echo "$LAYOUT_RESPONSE" | grep -o '"version":[0-9]*' | cut -d':' -f2)

# Apply layout changes
APPLY_RESULT=$(curl -s -X POST -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"version\": $((LAYOUT_VERSION + 1))}" \
    "$GARAGE_ADMIN/v1/layout/apply")

echo "✅ Layout applied"

# Create bucket
echo "🪣 Creating bucket: $BUCKET_NAME..."
BUCKET_RESULT=$(curl -s -X POST -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"globalAlias\": \"$BUCKET_NAME\"}" \
    "$GARAGE_ADMIN/v1/bucket" 2>/dev/null || echo "")

BUCKET_ID=$(echo "$BUCKET_RESULT" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$BUCKET_ID" ]; then
    # Bucket might already exist, try to get it by alias
    echo "   Bucket may already exist, looking it up..."
    BUCKET_LIST=$(curl -s -H "Authorization: Bearer $ADMIN_TOKEN" "$GARAGE_ADMIN/v1/bucket?alias=$BUCKET_NAME")
    BUCKET_ID=$(echo "$BUCKET_LIST" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
fi

if [ -z "$BUCKET_ID" ]; then
    echo "❌ Could not create or find bucket"
    exit 1
fi

echo "   Bucket ID: ${BUCKET_ID:0:16}..."

# Create API key
echo "🔑 Creating API key: $KEY_NAME..."
KEY_RESULT=$(curl -s -X POST -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"$KEY_NAME\"}" \
    "$GARAGE_ADMIN/v1/key" 2>/dev/null || echo "")

ACCESS_KEY=$(echo "$KEY_RESULT" | grep -o '"accessKeyId":"[^"]*"' | cut -d'"' -f4)
SECRET_KEY=$(echo "$KEY_RESULT" | grep -o '"secretAccessKey":"[^"]*"' | cut -d'"' -f4)

if [ -z "$ACCESS_KEY" ]; then
    # Key might already exist, find it
    echo "   Key may already exist, looking it up..."
    KEYS_LIST=$(curl -s -H "Authorization: Bearer $ADMIN_TOKEN" "$GARAGE_ADMIN/v1/key")
    ACCESS_KEY=$(echo "$KEYS_LIST" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    if [ -n "$ACCESS_KEY" ]; then
        echo "   Using existing key: $ACCESS_KEY"
        echo ""
        echo "⚠️  Secret key is not available for existing keys."
        echo "   Delete the key and run this again if you need the secret."
        
        # Still grant permissions
        echo "🔐 Granting permissions..."
        curl -s -X POST -H "Authorization: Bearer $ADMIN_TOKEN" \
            -H "Content-Type: application/json" \
            -d "{\"bucketId\": \"$BUCKET_ID\", \"accessKeyId\": \"$ACCESS_KEY\", \"permissions\": {\"read\": true, \"write\": true, \"owner\": true}}" \
            "$GARAGE_ADMIN/v1/bucket/allow" > /dev/null 2>&1 || true
        
        echo ""
        echo "========================================="
        echo "✅ Garage S3 Setup Complete!"
        echo "========================================="
        echo ""
        echo "Note: Key already existed. Check api/.env for existing config."
        exit 0
    fi
    
    echo "❌ Could not create or find key"
    exit 1
fi

echo "   Access Key: $ACCESS_KEY"

# Grant permissions
echo "🔐 Granting permissions..."
curl -s -X POST -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"bucketId\": \"$BUCKET_ID\", \"accessKeyId\": \"$ACCESS_KEY\", \"permissions\": {\"read\": true, \"write\": true, \"owner\": true}}" \
    "$GARAGE_ADMIN/v1/bucket/allow" > /dev/null

echo ""
echo "========================================="
echo "✅ Garage S3 Setup Complete!"
echo "========================================="
echo ""
echo "Add these to your api/.env file:"
echo ""
echo "S3_ENDPOINT=http://localhost:3900"
echo "S3_REGION=garage"
echo "S3_ACCESS_KEY=$ACCESS_KEY"
echo "S3_SECRET_KEY=$SECRET_KEY"
echo "S3_BUCKET=$BUCKET_NAME"
echo ""
echo "========================================="

# Save to a temp file for easy copy
echo "S3_ENDPOINT=http://localhost:3900" > /tmp/garage-env
echo "S3_REGION=garage" >> /tmp/garage-env
echo "S3_ACCESS_KEY=$ACCESS_KEY" >> /tmp/garage-env
echo "S3_SECRET_KEY=$SECRET_KEY" >> /tmp/garage-env
echo "S3_BUCKET=$BUCKET_NAME" >> /tmp/garage-env
echo ""
echo "Saved to /tmp/garage-env for easy copy"
