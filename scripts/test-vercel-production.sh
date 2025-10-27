#!/bin/bash
# Vercel生产环境测试脚本

VERCEL_URL="https://agent-b1.vercel.app"
API_ENDPOINT="$VERCEL_URL/api/analyze-skin"

echo "======================================"
echo "🚀 Vercel 生产环境测试"
echo "======================================"
echo ""
echo "🌍 部署URL: $VERCEL_URL"
echo "📍 API端点: $API_ENDPOINT"
echo ""

# 颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "======================================"
echo "测试 1: 正常功能测试"
echo "======================================"
echo "📤 上传测试图片..."
echo ""

# 检查测试图片
if [ ! -f "experiments/test-images/test1.jpg" ]; then
    echo -e "${RED}❌ 错误: 找不到测试图片${NC}"
    exit 1
fi

# 发送请求到生产环境
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST \
  -F "file=@experiments/test-images/test1.jpg" \
  "$API_ENDPOINT")

# 提取HTTP状态码
http_code=$(echo "$response" | grep "HTTP_CODE:" | cut -d: -f2)
body=$(echo "$response" | sed '/HTTP_CODE:/d')

echo "状态码: $http_code"
echo ""

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ 测试通过！${NC}"
    echo ""
    echo "返回数据:"
    echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"

    # 提取关键信息
    if echo "$body" | grep -q "skinType"; then
        skin_type=$(echo "$body" | python3 -c "import sys, json; print(json.load(sys.stdin).get('skinType', 'N/A'))" 2>/dev/null || echo "N/A")
        confidence=$(echo "$body" | python3 -c "import sys, json; print(json.load(sys.stdin).get('confidence', 'N/A'))" 2>/dev/null || echo "N/A")

        echo ""
        echo "======================================"
        echo -e "${GREEN}✅ 生产环境验证成功！${NC}"
        echo "======================================"
        echo "皮肤类型: $skin_type"
        echo "置信度: $confidence"
    fi
else
    echo -e "${RED}❌ 测试失败！${NC}"
    echo "期望状态码: 200"
    echo "实际状态码: $http_code"
    echo ""
    echo "错误响应:"
    echo "$body"
fi

echo ""
echo "======================================"
echo "测试 2: 错误处理测试"
echo "======================================"
echo ""

# 测试没有文件
echo "2.1 测试缺少文件 (应返回 400)..."
error_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$API_ENDPOINT")
error_code=$(echo "$error_response" | grep "HTTP_CODE:" | cut -d: -f2)
error_body=$(echo "$error_response" | sed '/HTTP_CODE:/d')

if [ "$error_code" = "400" ]; then
    echo -e "    ${GREEN}✅ 通过${NC} - 返回 400 InvalidImage"
else
    echo -e "    ${RED}❌ 失败${NC} - 期望 400，实际 $error_code"
    echo "    响应: $error_body"
fi

# 测试文件太大
echo "2.2 测试文件太大 (应返回 413)..."
dd if=/dev/zero of=/tmp/test-large.jpg bs=1M count=6 2>/dev/null
large_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST \
  -F "file=@/tmp/test-large.jpg" "$API_ENDPOINT")
large_code=$(echo "$large_response" | grep "HTTP_CODE:" | cut -d: -f2)

if [ "$large_code" = "413" ]; then
    echo -e "    ${GREEN}✅ 通过${NC} - 返回 413 FileTooLarge"
else
    echo -e "    ${RED}❌ 失败${NC} - 期望 413，实际 $large_code"
fi
rm /tmp/test-large.jpg

# 测试不支持的文件类型
echo "2.3 测试错误文件类型 (应返回 415)..."
echo "test" > /tmp/test.txt
type_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST \
  -F "file=@/tmp/test.txt" "$API_ENDPOINT")
type_code=$(echo "$type_response" | grep "HTTP_CODE:" | cut -d: -f2)

if [ "$type_code" = "415" ]; then
    echo -e "    ${GREEN}✅ 通过${NC} - 返回 415 UnsupportedType"
else
    echo -e "    ${RED}❌ 失败${NC} - 期望 415，实际 $type_code"
fi
rm /tmp/test.txt

echo ""
echo "======================================"
echo "📊 生产环境测试总结"
echo "======================================"
echo ""
echo "🌍 部署URL: $VERCEL_URL"
echo "📍 API端点: $API_ENDPOINT"
echo ""

if [ "$http_code" = "200" ] && [ "$error_code" = "400" ] && [ "$large_code" = "413" ] && [ "$type_code" = "415" ]; then
    echo -e "${GREEN}🎉 所有测试通过！生产环境工作正常！${NC}"
    echo ""
    echo "✅ 正常功能: 通过"
    echo "✅ 错误处理: 通过"
    echo "✅ OpenAI集成: 正常"
    echo ""
    echo "======================================"
    echo -e "${GREEN}✨ 恭喜！后端API已成功部署到生产环境！${NC}"
    echo "======================================"
else
    echo -e "${RED}⚠️ 部分测试失败，请检查配置${NC}"
    echo ""
    echo "可能的问题:"
    echo "1. OPENAI_API_KEY 未正确配置"
    echo "2. 部署还未完全就绪"
    echo "3. 网络连接问题"
fi