#!/bin/bash
# 简单的E2E测试脚本 - 测试正常图片上传功能

echo "======================================"
echo "🧪 AI皮肤分析 API 测试"
echo "======================================"
echo ""

# 检查测试图片是否存在
if [ ! -f "experiments/test-images/test1.jpg" ]; then
    echo "❌ 错误: 找不到测试图片 experiments/test-images/test1.jpg"
    exit 1
fi

echo "📋 测试配置:"
echo "   API地址: http://localhost:3000/api/analyze-skin"
echo "   测试图片: experiments/test-images/test1.jpg"
echo ""

echo "⏳ 发送请求中..."
echo ""

# 发送POST请求
response=$(curl -s -w "\n%{http_code}" -X POST \
  -F "file=@experiments/test-images/test1.jpg" \
  http://localhost:3000/api/analyze-skin)

# 分离HTTP状态码和响应体
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

echo "======================================"
echo "📊 测试结果"
echo "======================================"
echo ""
echo "HTTP状态码: $http_code"
echo ""

if [ "$http_code" = "200" ]; then
    echo "✅ 状态码正确 (200 OK)"
    echo ""
    echo "📦 返回数据:"
    echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
    echo ""

    # 检查关键字段是否存在
    if echo "$body" | grep -q "skinType"; then
        skin_type=$(echo "$body" | python3 -c "import sys, json; print(json.load(sys.stdin)['skinType'])" 2>/dev/null)
        confidence=$(echo "$body" | python3 -c "import sys, json; print(json.load(sys.stdin)['confidence'])" 2>/dev/null)

        echo "======================================"
        echo "✅ 测试通过！"
        echo "======================================"
        echo "皮肤类型: $skin_type"
        echo "置信度: $confidence"
        echo ""
    else
        echo "⚠️  警告: 返回数据中没有找到 skinType 字段"
    fi
else
    echo "❌ 测试失败！"
    echo "   期望状态码: 200"
    echo "   实际状态码: $http_code"
    echo ""
    echo "错误响应:"
    echo "$body"
    echo ""
fi

echo "======================================"
echo "提示:"
echo "  确保开发服务器正在运行: npm run dev"
echo "  确保 .env.local 中已配置 OPENAI_API_KEY"
echo "======================================"