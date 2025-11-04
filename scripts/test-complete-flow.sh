#!/bin/bash

# 完整端到端测试脚本
# 测试用户识别 + Logging功能

echo "🧪 Complete Flow Test - Step 1 Implementation"
echo "================================================"
echo ""

# 创建临时测试图片
echo "📸 Creating test image..."
cat > /tmp/test-image.txt << 'EOF'
R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=
EOF
base64 -d /tmp/test-image.txt > /tmp/test.jpg 2>/dev/null || echo -n "fake-image-data" > /tmp/test.jpg

echo "✅ Test image created"
echo ""

# 测试1: 带用户名的上传
echo "📝 Test 1: Upload with username"
echo "----------------------------------------"

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:3000/api/analyze-skin \
  -F "file=@/tmp/test.jpg" \
  -F "userId=AutoTest-User-001" \
  -H "Cookie: auth-token=test" 2>&1)

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | head -n -1)

echo "HTTP Status: $HTTP_CODE"

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "401" ]; then
    echo "✅ API endpoint responding"
    if echo "$BODY" | grep -q "skinType"; then
        echo "✅ Analysis result returned"
        echo "   $(echo "$BODY" | head -c 100)..."
    elif echo "$BODY" | grep -q "error"; then
        echo "⚠️  API returned error (may need login cookie)"
        echo "   Error: $(echo "$BODY" | head -c 100)"
    fi
else
    echo "❌ API call failed"
fi

echo ""
echo "🔍 Checking Redis for logged data..."
echo "----------------------------------------"

# 使用之前的Redis测试脚本查看数据
node -e "
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

// 手动初始化Redis client
const { Redis } = require('@upstash/redis');

const redisUrl = process.env.LOGS_REDIS_URL;
if (!redisUrl) {
    console.log('❌ LOGS_REDIS_URL not configured');
    process.exit(1);
}

const match = redisUrl.match(/rediss?:\/\/default:([^@]+)@([^:]+):(\d+)/);
if (!match) {
    console.log('❌ Invalid LOGS_REDIS_URL format');
    process.exit(1);
}

const [, token, host] = match;
const client = new Redis({
    url: \`https://\${host}\`,
    token: token
});

async function checkLogs() {
    try {
        // 获取今天的日期key
        const today = new Date().toISOString().split('T')[0];
        const key = \`logs:\${today}\`;

        console.log(\`📊 Checking key: \${key}\`);

        // 获取最新的3条日志
        const logs = await client.lrange(key, 0, 2);

        if (logs && logs.length > 0) {
            console.log(\`✅ Found \${logs.length} log entries\`);
            console.log('');

            logs.forEach((log, i) => {
                try {
                    const parsed = JSON.parse(log);
                    console.log(\`📝 Log #\${i + 1}:\`);
                    console.log(\`   User: \${parsed.user}\`);
                    console.log(\`   Action: \${parsed.action}\`);
                    console.log(\`   Status: \${parsed.status}\`);
                    console.log(\`   Timestamp: \${parsed.timestamp}\`);
                    if (parsed.imageHash) {
                        console.log(\`   Image Hash: \${parsed.imageHash}\`);
                    }
                    if (parsed.duration) {
                        console.log(\`   Duration: \${parsed.duration}ms\`);
                    }
                    console.log('');
                } catch (e) {
                    console.log(\`   Raw: \${log.substring(0, 100)}...\`);
                }
            });
        } else {
            console.log('⚠️  No logs found for today');
            console.log('   This is normal if you haven\\'t uploaded an image yet.');
        }

        // 获取用户统计
        console.log('👥 User Statistics:');
        console.log('----------------------------------------');
        const userKeys = await client.keys('stats:user:*');

        if (userKeys && userKeys.length > 0) {
            console.log(\`✅ Found \${userKeys.length} users\`);
            for (const key of userKeys.slice(0, 5)) {
                const stats = await client.hgetall(key);
                const userName = key.replace('stats:user:', '');
                console.log(\`   • \${userName}: \${stats.count || 0} analyses\`);
            }
        } else {
            console.log('⚠️  No user statistics found yet');
        }

    } catch (error) {
        console.error('❌ Error checking Redis:', error.message);
    }
}

checkLogs();
"

echo ""
echo "================================================"
echo "✅ Test Complete!"
echo ""
echo "💡 Next Steps:"
echo "   1. Open browser: http://localhost:3000"
echo "   2. Login with password: test123"
echo "   3. Enter a name and upload an image"
echo "   4. Run this script again to see the logged data:"
echo "      bash scripts/test-complete-flow.sh"
echo ""
