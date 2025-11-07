#!/usr/bin/env node

/**
 * Clear rate limiting records from Redis
 */

require('dotenv').config({ path: '.env.local' });
const { Redis } = require('@upstash/redis');

async function clearRateLimit() {
  console.log('🧹 Clearing rate limit records from Redis...');

  try {
    // Parse LOGS_REDIS_URL
    const redisUrl = process.env.LOGS_REDIS_URL;
    if (!redisUrl) {
      throw new Error('LOGS_REDIS_URL not found in environment');
    }

    // Extract credentials from URL
    const match = redisUrl.match(/rediss:\/\/default:([^@]+)@([^:]+):(\d+)/);
    if (!match) {
      throw new Error('Invalid LOGS_REDIS_URL format');
    }

    const [, token, host, port] = match;

    const client = new Redis({
      url: `https://${host}`,
      token: token,
    });

    // Get all login attempt keys
    const keys = await client.keys('login-attempts:*');

    console.log(`Found ${keys.length} rate limit records`);

    if (keys.length > 0) {
      // Delete all keys
      for (const key of keys) {
        await client.del(key);
        console.log(`  ✓ Deleted: ${key}`);
      }
      console.log('✅ All rate limit records cleared!');
    } else {
      console.log('✅ No rate limit records to clear');
    }

    console.log('\n🎉 You can now try logging in again!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

clearRateLimit();
