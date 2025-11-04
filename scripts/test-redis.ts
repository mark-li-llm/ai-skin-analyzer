// Test Redis connection
// Run with: npx tsx scripts/test-redis.ts

import dotenv from 'dotenv';

// IMPORTANT: Load environment variables BEFORE importing logging module
// Try .env.local first, then fall back to .env.development.local
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.development.local' });

// Now import logging module (which initializes Redis)
import { testRedisConnection, logAnalysis, getRecentLogs, getUserStats } from '../lib/logging';

async function runTests() {
  console.log('🚀 Testing Redis Connection...\n');

  // Test 1: Connection
  const isConnected = await testRedisConnection();
  if (!isConnected) {
    console.error('❌ Redis connection failed. Check your environment variables.');
    process.exit(1);
  }

  console.log('\n📝 Testing Log Creation...\n');

  // Test 2: Create a test log
  await logAnalysis({
    user: 'test-user',
    action: 'analyze',
    imageHash: 'test-hash-123',
    analysisResult: {
      skinType: 'combination',
      confidence: 0.85,
      issues: ['dark spots', 'uneven tone'],
      recommendations: ['Use SPF 50', 'Vitamin C serum'],
    },
    duration: 1234,
    status: 'success',
    userAgent: 'test-script',
  });

  console.log('✅ Test log created\n');

  // Test 3: Fetch recent logs
  console.log('📊 Fetching recent logs...\n');
  const recentLogs = await getRecentLogs(10);
  console.log(`Found ${recentLogs.length} recent logs`);
  if (recentLogs.length > 0) {
    console.log('Latest log:', JSON.stringify(recentLogs[0], null, 2));
  }

  // Test 4: Get user stats
  console.log('\n👥 Fetching user statistics...\n');
  const stats = await getUserStats();
  console.log(`Found stats for ${stats.length} users`);
  if (stats.length > 0) {
    console.log('User stats:', JSON.stringify(stats, null, 2));
  }

  console.log('\n✅ All tests passed!');
}

runTests().catch(console.error);