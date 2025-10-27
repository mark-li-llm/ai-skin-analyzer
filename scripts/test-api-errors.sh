#!/bin/bash
# 快速错误测试套件 - 只测试错误场景（不调用 OpenAI，速度快）

API_URL="http://localhost:3000/api/analyze-skin"
TEMP_DIR="/tmp/skin-analyzer-tests"

# 创建临时目录
mkdir -p "$TEMP_DIR"

echo "======================================"
echo "⚡ 快速错误测试套件 (不调用 OpenAI)"
echo "======================================"
echo ""

# 计数器
TOTAL=0
PASSED=0

# 测试函数
test_error() {
    local name="$1"
    local curl_cmd="$2"
    local expected_code="$3"
    local expected_error="$4"

    TOTAL=$((TOTAL + 1))
    echo "[$TOTAL] $name"

    response=$(curl -s -w "\n%{http_code}" $curl_cmd "$API_URL")
    code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [ "$code" = "$expected_code" ]; then
        if echo "$body" | grep -q "\"error\":\"$expected_error\""; then
            echo "    ✅ 通过: $code $expected_error"
            PASSED=$((PASSED + 1))
        else
            echo "    ❌ 失败: 状态码对但错误码错: $body"
        fi
    else
        echo "    ❌ 失败: 期望 $expected_code，实际 $code"
    fi
    echo ""
}

# 准备测试文件
echo "准备测试文件..."
dd if=/dev/zero of="$TEMP_DIR/large-file.jpg" bs=1M count=6 2>/dev/null
echo "This is text" > "$TEMP_DIR/test.txt"
echo "%PDF-1.4" > "$TEMP_DIR/test.pdf"
echo -e "\x89\x50\x4E\x47" > "$TEMP_DIR/fake.jpg"
echo ""

echo "开始测试..."
echo ""

# 测试 1: 文件太大
test_error \
    "文件太大 (6MB)" \
    "-X POST -F \"file=@$TEMP_DIR/large-file.jpg\"" \
    "413" \
    "FileTooLarge"

# 测试 2: 不支持的类型 - TXT
test_error \
    "TXT 文件" \
    "-X POST -F \"file=@$TEMP_DIR/test.txt\"" \
    "415" \
    "UnsupportedType"

# 测试 3: 不支持的类型 - PDF
test_error \
    "PDF 文件" \
    "-X POST -F \"file=@$TEMP_DIR/test.pdf\"" \
    "415" \
    "UnsupportedType"

# 测试 4: 没有文件
test_error \
    "没有文件" \
    "-X POST" \
    "400" \
    "InvalidImage"

# 测试 5: 损坏的图片 (Magic Number)
test_error \
    "损坏的 JPEG (错误 magic number)" \
    "-X POST -F \"file=@$TEMP_DIR/fake.jpg\"" \
    "400" \
    "InvalidImage"

# 清理
rm -rf "$TEMP_DIR"

echo "======================================"
echo "📊 测试结果: $PASSED/$TOTAL 通过"
echo "======================================"

if [ $PASSED -eq $TOTAL ]; then
    echo "🎉 所有错误处理测试通过！"
    exit 0
else
    echo "❌ 有测试失败"
    exit 1
fi
