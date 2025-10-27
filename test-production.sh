#!/bin/bash

# Production API Test Script
# Tests the Vercel deployment of the AI Skin Analyzer API

echo "🚀 AI Skin Analyzer - Production API Test"
echo "========================================="
echo ""

# Default Vercel URL (update this with your actual deployment URL)
DEFAULT_URL="https://ai-skin-analyzer.vercel.app"

# Check if custom URL provided
if [ "$1" ]; then
    VERCEL_URL="$1"
    echo "📍 Using custom URL: $VERCEL_URL"
else
    VERCEL_URL="$DEFAULT_URL"
    echo "📍 Using default URL: $VERCEL_URL"
fi

echo ""
echo "🧪 Starting production API tests..."
echo ""

# Run the test script
node experiments/test-production-api.js --url "$VERCEL_URL"

echo ""
echo "📊 Test results saved in: experiments/test-results/"
echo ""
echo "To test with a different URL, run:"
echo "  ./test-production.sh https://your-app.vercel.app"
echo ""