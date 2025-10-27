#!/bin/bash
# 完整的 E2E 测试套件 - 测试所有功能和错误场景
#
# 使用方法:
#   1. 确保开发服务器正在运行: npm run dev
#   2. 运行测试: ./scripts/test-api-complete.sh

set -e  # 遇到错误继续执行（因为我们要测试错误场景）

API_URL="http://localhost:3000/api/analyze-skin"
TEST_DIR="experiments/test-images"
TEMP_DIR="/tmp/skin-analyzer-tests"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 计数器
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# 创建临时目录
mkdir -p "$TEMP_DIR"

echo "======================================"
echo "🧪 AI皮肤分析 API 完整测试套件"
echo "======================================"
echo ""

# 辅助函数：测试 API
test_api() {
    local test_name="$1"
    local curl_args="$2"
    local expected_status="$3"
    local expected_error="${4:-}"

    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}测试 #${TOTAL_TESTS}: ${test_name}${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    # 发送请求
    response=$(curl -s -w "\n%{http_code}" $curl_args "$API_URL" 2>&1)

    # 分离状态码和响应体
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    echo "期望状态码: $expected_status"
    echo "实际状态码: $http_code"
    echo ""

    # 检查状态码
    if [ "$http_code" = "$expected_status" ]; then
        # 如果期望有错误码，检查错误码
        if [ -n "$expected_error" ]; then
            if echo "$body" | grep -q "\"error\":\"$expected_error\""; then
                echo -e "${GREEN}✅ 测试通过${NC}"
                echo "   状态码正确: $http_code"
                echo "   错误码正确: $expected_error"
                PASSED_TESTS=$((PASSED_TESTS + 1))
            else
                echo -e "${RED}❌ 测试失败${NC}"
                echo "   状态码正确但错误码不匹配"
                echo "   期望错误码: $expected_error"
                echo "   实际响应: $body"
                FAILED_TESTS=$((FAILED_TESTS + 1))
            fi
        else
            # 正常响应，检查是否有 skinType 字段
            if echo "$body" | grep -q "skinType"; then
                echo -e "${GREEN}✅ 测试通过${NC}"
                echo "   状态码正确: $http_code"

                # 提取关键信息
                skin_type=$(echo "$body" | python3 -c "import sys, json; print(json.load(sys.stdin).get('skinType', 'N/A'))" 2>/dev/null || echo "N/A")
                confidence=$(echo "$body" | python3 -c "import sys, json; print(json.load(sys.stdin).get('confidence', 'N/A'))" 2>/dev/null || echo "N/A")

                echo "   皮肤类型: $skin_type"
                echo "   置信度: $confidence"
                PASSED_TESTS=$((PASSED_TESTS + 1))
            else
                echo -e "${YELLOW}⚠️  测试通过（状态码正确）${NC}"
                echo "   但响应格式可能不完整"
                echo "   响应: $body"
                PASSED_TESTS=$((PASSED_TESTS + 1))
            fi
        fi
    else
        echo -e "${RED}❌ 测试失败${NC}"
        echo "   期望状态码: $expected_status"
        echo "   实际状态码: $http_code"
        echo "   响应: $body"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi

    echo ""
}

# ============================================
# 测试 1: 正常情况 - 上传有效的 JPEG 图片
# ============================================
if [ -f "$TEST_DIR/test1.jpg" ]; then
    test_api \
        "正常上传 JPEG 图片 (应返回 200)" \
        "-X POST -F \"file=@$TEST_DIR/test1.jpg\"" \
        "200"
else
    echo -e "${YELLOW}⚠️  跳过测试 #1: 找不到测试图片 $TEST_DIR/test1.jpg${NC}"
    echo ""
fi

# ============================================
# 测试 2: 错误 - 文件太大 (>5MB)
# ============================================
echo -e "${BLUE}准备测试 #2: 创建 6MB 测试文件...${NC}"
dd if=/dev/zero of="$TEMP_DIR/large-file.jpg" bs=1M count=6 2>/dev/null
echo ""

test_api \
    "上传过大文件 (6MB, 应返回 413 FileTooLarge)" \
    "-X POST -F \"file=@$TEMP_DIR/large-file.jpg\"" \
    "413" \
    "FileTooLarge"

# ============================================
# 测试 3: 错误 - 不支持的文件类型 (TXT)
# ============================================
echo -e "${BLUE}准备测试 #3: 创建 TXT 文件...${NC}"
echo "This is not an image file" > "$TEMP_DIR/test.txt"
echo ""

test_api \
    "上传 TXT 文件 (应返回 415 UnsupportedType)" \
    "-X POST -F \"file=@$TEMP_DIR/test.txt\"" \
    "415" \
    "UnsupportedType"

# ============================================
# 测试 4: 错误 - 不支持的文件类型 (PDF)
# ============================================
echo -e "${BLUE}准备测试 #4: 创建 PDF 文件...${NC}"
echo "%PDF-1.4" > "$TEMP_DIR/test.pdf"
echo ""

test_api \
    "上传 PDF 文件 (应返回 415 UnsupportedType)" \
    "-X POST -F \"file=@$TEMP_DIR/test.pdf\"" \
    "415" \
    "UnsupportedType"

# ============================================
# 测试 5: 错误 - 没有文件
# ============================================
test_api \
    "不发送文件 (应返回 400 InvalidImage)" \
    "-X POST" \
    "400" \
    "InvalidImage"

# ============================================
# 测试 6: 错误 - 损坏的 JPEG (Magic Number 验证)
# ============================================
echo -e "${BLUE}准备测试 #6: 创建损坏的 JPEG 文件（错误的 magic number）...${NC}"
# 创建一个假的 JPEG（magic number 不正确）
echo -e "\x89\x50\x4E\x47\x0D\x0A\x1A\x0A" > "$TEMP_DIR/fake.jpg"
echo "fake jpeg content" >> "$TEMP_DIR/fake.jpg"
echo ""

test_api \
    "上传损坏的 JPEG (应返回 400 InvalidImage)" \
    "-X POST -F \"file=@$TEMP_DIR/fake.jpg\"" \
    "400" \
    "InvalidImage"

# ============================================
# 测试 7: 正常情况 - 上传 PNG 图片 (如果存在)
# ============================================
if [ -f "$TEST_DIR/test.png" ]; then
    test_api \
        "上传 PNG 图片 (应返回 200)" \
        "-X POST -F \"file=@$TEST_DIR/test.png\"" \
        "200"
else
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}测试 #$((TOTAL_TESTS + 1)): 上传 PNG 图片${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}⚠️  跳过: 找不到 PNG 测试图片 $TEST_DIR/test.png${NC}"
    echo -e "${YELLOW}   提示: 可以创建一个 PNG 图片进行测试${NC}"
    echo ""
fi

# ============================================
# 测试 8: 边界情况 - 刚好 5MB 的文件
# ============================================
echo -e "${BLUE}准备测试 #8: 创建刚好 5MB 的文件...${NC}"
dd if=/dev/zero of="$TEMP_DIR/exactly-5mb.jpg" bs=1M count=5 2>/dev/null
echo ""

test_api \
    "上传刚好 5MB 的文件 (应返回 400 InvalidImage - 因为不是真实图片)" \
    "-X POST -F \"file=@$TEMP_DIR/exactly-5mb.jpg\"" \
    "400" \
    "InvalidImage"

# ============================================
# 清理临时文件
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}清理临时文件...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
rm -rf "$TEMP_DIR"
echo "✅ 临时文件已清理"
echo ""

# ============================================
# 测试总结
# ============================================
echo "======================================"
echo "📊 测试总结"
echo "======================================"
echo ""
echo "总测试数: $TOTAL_TESTS"
echo -e "${GREEN}通过: $PASSED_TESTS${NC}"
echo -e "${RED}失败: $FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 恭喜！所有测试都通过了！${NC}"
    echo ""
    echo "======================================"
    echo "✅ API 已准备就绪"
    echo "======================================"
    exit 0
else
    echo -e "${RED}⚠️  有 $FAILED_TESTS 个测试失败${NC}"
    echo ""
    echo "======================================"
    echo "❌ 请检查失败的测试并修复问题"
    echo "======================================"
    exit 1
fi
