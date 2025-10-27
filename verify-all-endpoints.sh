#!/bin/bash

# Verify all API endpoints after deployment

BASE_URL="https://ai-skin-analyzer-git-agent-b1-mark-lis-projects-06c93730.vercel.app"

echo "🔍 Verifying all API endpoints on Vercel..."
echo "============================================"
echo ""

endpoints=(
  "/api/test-sharp:POST"
  "/api/analyze-skin:POST"
)

success_count=0
total_count=0

for endpoint_method in "${endpoints[@]}"; do
  endpoint="${endpoint_method%:*}"
  method="${endpoint_method#*:}"

  echo "Testing $method $BASE_URL$endpoint"

  if [ "$method" == "POST" ]; then
    response=$(curl -s -X POST -w "\n%{http_code}" "$BASE_URL$endpoint")
  else
    response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
  fi

  http_code=$(echo "$response" | tail -n 1)
  body=$(echo "$response" | head -n -1)

  echo "  Status: $http_code"

  if [ "$http_code" != "404" ] && [ "$http_code" != "405" ]; then
    echo "  ✅ SUCCESS - Endpoint recognized!"
    ((success_count++))
  else
    echo "  ❌ FAIL - Endpoint not found"
  fi

  ((total_count++))
  echo ""
done

echo "============================================"
echo "📊 Results: $success_count/$total_count endpoints working"

if [ "$success_count" == "$total_count" ]; then
  echo "🎉 All endpoints are now recognized by Vercel!"
else
  echo "⚠️  Some endpoints are still not recognized"
  echo ""
  echo "Please check Vercel Dashboard Functions list"
fi