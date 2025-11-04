#!/usr/bin/env node

// 查看Redis中的日志数据
// Run: node scripts/view-logs.js

require('dotenv').config({ path: '.env.local' });
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
    url: `https://${host}`,
    token: token
});

async function viewLogs() {
    console.log('📊 Usage Tracking Dashboard - Current Data\n');
    console.log('='.repeat(60));

    try {
        // 获取今天的日期
        const today = new Date().toISOString().split('T')[0];
        const key = `logs:${today}`;

        console.log(`\n📅 Date: ${today}`);
        console.log(`🔑 Redis Key: ${key}\n`);

        // 获取所有今天的日志
        const logs = await client.lrange(key, 0, -1);

        if (!logs || logs.length === 0) {
            console.log('⚠️  No logs found for today');
            console.log('\n💡 To create logs:');
            console.log('   1. Visit http://localhost:3000');
            console.log('   2. Login with password: test123');
            console.log('   3. Enter a name and upload an image\n');
            return;
        }

        console.log(`✅ Found ${logs.length} log entries:\n`);
        console.log('─'.repeat(60));

        logs.forEach((logData, i) => {
            try {
                const log = typeof logData === 'string' ? JSON.parse(logData) : logData;

                console.log(`\n📝 Log #${i + 1}`);
                console.log(`   User: ${log.user || 'N/A'}`);
                console.log(`   Action: ${log.action || 'N/A'}`);
                console.log(`   Status: ${log.status || 'N/A'}`);
                console.log(`   Time: ${log.timestamp || 'N/A'}`);

                if (log.imageHash) {
                    console.log(`   Image Hash: ${log.imageHash}`);
                }

                if (log.duration) {
                    console.log(`   Duration: ${log.duration}ms`);
                }

                if (log.analysisResult) {
                    console.log(`   Skin Type: ${log.analysisResult.skinType || 'N/A'}`);
                    console.log(`   Confidence: ${log.analysisResult.confidence || 'N/A'}`);
                }

                if (log.errorDetails) {
                    console.log(`   Error: ${log.errorDetails}`);
                }

                if (log.ip) {
                    console.log(`   IP: ${log.ip}`);
                }
            } catch (e) {
                console.log(`\n⚠️  Log #${i + 1}: Unable to parse`);
                console.log(`   Raw data: ${JSON.stringify(logData).substring(0, 100)}...`);
            }
        });

        // 用户统计
        console.log('\n' + '='.repeat(60));
        console.log('\n👥 User Statistics:\n');

        const userKeys = await client.keys('stats:user:*');

        if (!userKeys || userKeys.length === 0) {
            console.log('⚠️  No user statistics found yet');
            return;
        }

        console.log(`✅ Found ${userKeys.length} users:\n`);

        for (const key of userKeys) {
            const stats = await client.hgetall(key);
            const userName = key.replace('stats:user:', '');

            console.log(`   👤 ${userName}`);
            console.log(`      Total Analyses: ${stats.count || 0}`);
            console.log(`      Last Used: ${stats.lastUsed || 'N/A'}`);
            console.log(`      Avg Duration: ${stats.avgDuration || 0}ms\n`);
        }

        console.log('='.repeat(60));
        console.log('\n✅ Data retrieval complete!\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
    }
}

viewLogs();
