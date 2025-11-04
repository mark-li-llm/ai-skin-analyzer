#!/usr/bin/env node

// 查看单条日志的完整JSON数据
// Run: node scripts/view-single-log.js [username]

require('dotenv').config({ path: '.env.local' });
const { Redis } = require('@upstash/redis');

const targetUser = process.argv[2] || 'Mark';

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

async function viewSingleLog() {
    console.log(`\n🔍 Searching for logs from user: "${targetUser}"\n`);
    console.log('='.repeat(70));

    try {
        const today = new Date().toISOString().split('T')[0];
        const key = `logs:${today}`;

        const logs = await client.lrange(key, 0, -1);

        if (!logs || logs.length === 0) {
            console.log('\n⚠️  No logs found for today\n');
            return;
        }

        let found = false;

        for (let i = 0; i < logs.length; i++) {
            try {
                const log = typeof logs[i] === 'string' ? JSON.parse(logs[i]) : logs[i];

                if (log.user === targetUser) {
                    found = true;
                    console.log(`\n📝 Log Entry #${i + 1} - Complete Data:\n`);
                    console.log(JSON.stringify(log, null, 2));
                    console.log('\n' + '-'.repeat(70));
                    console.log('\n📊 Data Field Breakdown:\n');

                    // 逐字段展示
                    Object.keys(log).forEach(key => {
                        const value = log[key];
                        const type = typeof value;

                        console.log(`${key}:`);
                        console.log(`  Type: ${type}`);

                        if (type === 'object' && value !== null) {
                            console.log(`  Value: ${JSON.stringify(value, null, 4)}`);
                        } else {
                            console.log(`  Value: ${value}`);
                        }

                        console.log('');
                    });
                }
            } catch (e) {
                // Skip invalid logs
            }
        }

        if (!found) {
            console.log(`\n⚠️  No logs found for user "${targetUser}"\n`);
            console.log('Available users in logs:');

            const users = new Set();
            logs.forEach(logData => {
                try {
                    const log = typeof logData === 'string' ? JSON.parse(logData) : logData;
                    if (log.user) users.add(log.user);
                } catch (e) {}
            });

            users.forEach(user => console.log(`  - ${user}`));
            console.log('');
        }

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
}

viewSingleLog();
