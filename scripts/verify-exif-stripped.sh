#!/bin/bash
# 验证 EXIF 元数据是否被正确删除
#
# 需要安装: exiftool (用于读取 EXIF 数据)
#   macOS: brew install exiftool
#   Linux: apt-get install libimage-exiftool-perl

echo "======================================"
echo "🔍 EXIF 元数据删除验证"
echo "======================================"
echo ""

# 检查是否安装了 exiftool
if ! command -v exiftool &> /dev/null; then
    echo "❌ 错误: 需要安装 exiftool"
    echo ""
    echo "安装方法:"
    echo "  macOS:  brew install exiftool"
    echo "  Linux:  apt-get install libimage-exiftool-perl"
    exit 1
fi

TEST_IMAGE="experiments/test-images/test1.jpg"
OUTPUT_DIR="/tmp/exif-test"
OUTPUT_IMAGE="$OUTPUT_DIR/processed.jpg"

# 检查测试图片是否存在
if [ ! -f "$TEST_IMAGE" ]; then
    echo "❌ 错误: 找不到测试图片 $TEST_IMAGE"
    exit 1
fi

# 创建输出目录
mkdir -p "$OUTPUT_DIR"

echo "📋 测试步骤:"
echo "  1. 检查原始图片的 EXIF 数据"
echo "  2. 通过 API 处理图片"
echo "  3. 检查处理后图片的 EXIF 数据"
echo "  4. 对比验证"
echo ""

# Step 1: 检查原始图片
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  原始图片 EXIF 数据"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
exiftool -s -G "$TEST_IMAGE" | head -20
echo ""

# 统计原始 EXIF 标签数量
original_count=$(exiftool "$TEST_IMAGE" | grep -v "^File Name\|^Directory\|^File Size\|^File Modification Date\|^File Access Date\|^File Inode Change Date\|^File Permissions" | wc -l | tr -d ' ')
echo "原始图片 EXIF 标签数量: $original_count"
echo ""

# Step 2: 通过 API 处理
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  通过 API 处理图片..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 注意: 这里我们只测试图片处理，不调用完整的 OpenAI API
# 我们可以创建一个测试端点，或者用 Sharp 直接测试

echo "⏳ 使用 Sharp 直接处理（模拟 API 处理流程）..."

node <<'EOF'
const sharp = require('sharp');
const fs = require('fs');

const IMAGE_MAX_DIMENSION = 1024;
const JPEG_QUALITY = 85;

async function testSharpProcessing() {
  try {
    const inputBuffer = fs.readFileSync('experiments/test-images/test1.jpg');

    // 完全相同的 Sharp 处理流程（从 route.ts 复制）
    const processedBuffer = await sharp(inputBuffer)
      .rotate()  // Auto-orient based on EXIF
      .resize(IMAGE_MAX_DIMENSION, IMAGE_MAX_DIMENSION, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toColorspace('srgb')  // Convert to sRGB color space
      .jpeg({
        quality: JPEG_QUALITY,
        mozjpeg: true  // Better compression
      })
      // IMPORTANT: By NOT calling .withMetadata(), sharp automatically strips
      // ALL metadata (EXIF, XMP, IPTC, ICC profile) from the output image.
      .toBuffer();

    // 保存处理后的图片
    fs.writeFileSync('/tmp/exif-test/processed.jpg', processedBuffer);

    console.log('✅ 处理完成');
  } catch (error) {
    console.error('❌ 处理失败:', error.message);
    process.exit(1);
  }
}

testSharpProcessing();
EOF

echo ""

# Step 3: 检查处理后的图片
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  处理后图片 EXIF 数据"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
exiftool -s -G "$OUTPUT_IMAGE" | head -20
echo ""

# 统计处理后 EXIF 标签数量
processed_count=$(exiftool "$OUTPUT_IMAGE" | grep -v "^File Name\|^Directory\|^File Size\|^File Modification Date\|^File Access Date\|^File Inode Change Date\|^File Permissions" | wc -l | tr -d ' ')
echo "处理后图片 EXIF 标签数量: $processed_count"
echo ""

# Step 4: 对比验证
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  验证结果"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 检查敏感 EXIF 字段
echo "检查敏感数据字段:"
echo ""

check_field() {
    local field="$1"
    local description="$2"

    if exiftool "$OUTPUT_IMAGE" | grep -q "$field"; then
        echo "  ❌ $description 仍然存在！"
        return 1
    else
        echo "  ✅ $description 已删除"
        return 0
    fi
}

all_passed=true

check_field "GPS" "GPS 坐标" || all_passed=false
check_field "Make" "设备制造商" || all_passed=false
check_field "Model" "设备型号" || all_passed=false
check_field "Software" "软件信息" || all_passed=false
check_field "Date/Time Original" "拍摄时间" || all_passed=false
check_field "XMP" "XMP 元数据" || all_passed=false
check_field "IPTC" "IPTC 元数据" || all_passed=false

echo ""
echo "EXIF 标签数量对比:"
echo "  原始: $original_count 个标签"
echo "  处理后: $processed_count 个标签"
echo ""

if [ "$processed_count" -lt 10 ]; then
    echo "  ✅ 大部分元数据已删除（只剩基本图片信息）"
else
    echo "  ⚠️  仍有较多元数据残留"
    all_passed=false
fi

echo ""
echo "======================================"

if [ "$all_passed" = true ]; then
    echo "🎉 测试通过！EXIF 元数据已正确删除"
    echo "======================================"
    echo ""
    echo "✅ 隐私保护: GPS 坐标、设备信息等敏感数据已删除"
    echo "✅ 合规性: 符合 CONTRACT-001-MVP.md 要求"
    echo ""
    # 清理
    rm -rf "$OUTPUT_DIR"
    exit 0
else
    echo "❌ 测试失败！部分敏感数据仍然存在"
    echo "======================================"
    echo ""
    echo "⚠️  需要检查 Sharp 配置"
    echo ""
    # 保留文件用于调试
    echo "处理后的文件保存在: $OUTPUT_IMAGE"
    exit 1
fi
