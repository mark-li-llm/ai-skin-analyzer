#!/usr/bin/env node

/**
 * Test script to verify admin dashboard performance improvements
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Helper function to make HTTP requests
function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const client = url.protocol === 'https:' ? https : http;

    const startTime = Date.now();

    const req = client.request(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const duration = Date.now() - startTime;
        let parsedData = null;

        // Try to parse as JSON, but don't fail if it's not JSON
        if (data && res.headers['content-type']?.includes('application/json')) {
          try {
            parsedData = JSON.parse(data);
          } catch (e) {
            // Not JSON, leave as string
            parsedData = data;
          }
        }

        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: parsedData,
          rawData: data,
          duration: duration,
        });
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

async function runPerformanceTest() {
  log('\n=== Admin Dashboard Performance Test ===', 'blue');

  try {
    // First login with admin credentials
    log('\n1. Logging in as admin...', 'yellow');
    const loginRes = await makeRequest('/api/login', {
      method: 'POST',
      body: { password: 'admin123' },
    });

    if (loginRes.status === 200 && loginRes.data.success) {
      log(`✅ Admin login successful (${loginRes.duration}ms)`, 'green');

      const cookieHeader = loginRes.headers['set-cookie'];
      const authToken = cookieHeader?.find(c => c.startsWith('auth-token='));

      if (authToken) {
        // Now test admin dashboard load time
        log('\n2. Testing admin dashboard load time...', 'yellow');

        // Warm up (first load might be slower due to compilation)
        log('   Warming up...', 'yellow');
        const warmupRes = await makeRequest('/admin', {
          headers: {
            'Cookie': authToken.split(';')[0],
          },
        });

        // Actual test (multiple runs)
        const runs = 3;
        const durations = [];

        log(`\n3. Running ${runs} performance tests...`, 'yellow');

        for (let i = 1; i <= runs; i++) {
          const res = await makeRequest('/admin', {
            headers: {
              'Cookie': authToken.split(';')[0],
            },
          });

          durations.push(res.duration);

          if (res.status === 200) {
            log(`   Run ${i}: ${res.duration}ms`, res.duration < 1000 ? 'green' : 'yellow');
          } else {
            log(`   Run ${i}: Failed (status ${res.status})`, 'red');
          }

          // Wait a bit between runs
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Calculate statistics
        const avgDuration = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);
        const minDuration = Math.min(...durations);
        const maxDuration = Math.max(...durations);

        log('\n=== Performance Results ===', 'blue');
        log(`Average load time: ${avgDuration}ms`, avgDuration < 1000 ? 'green' : 'yellow');
        log(`Minimum load time: ${minDuration}ms`, minDuration < 1000 ? 'green' : 'yellow');
        log(`Maximum load time: ${maxDuration}ms`, maxDuration < 1000 ? 'green' : 'yellow');

        // Performance assessment
        log('\n=== Assessment ===', 'blue');
        if (avgDuration < 500) {
          log('🚀 EXCELLENT: Admin dashboard loads in under 0.5 seconds!', 'green');
        } else if (avgDuration < 1000) {
          log('✅ GOOD: Admin dashboard loads in under 1 second', 'green');
        } else if (avgDuration < 3000) {
          log('⚠️ OK: Admin dashboard loads in 1-3 seconds', 'yellow');
        } else {
          log('❌ SLOW: Admin dashboard takes over 3 seconds to load', 'red');
          log('   Optimization may not be working correctly', 'red');
        }

        // Compare to previous performance
        log('\n=== Optimization Impact ===', 'blue');
        const previousAvg = 6500; // Previous average was 6-7 seconds
        const improvement = Math.round(((previousAvg - avgDuration) / previousAvg) * 100);

        if (improvement > 0) {
          log(`Performance improved by ${improvement}%!`, 'green');
          log(`Previous: ~${previousAvg}ms → Now: ${avgDuration}ms`, 'green');
        } else {
          log('No performance improvement detected', 'red');
        }

      } else {
        log('❌ No auth token received', 'red');
      }
    } else {
      log(`❌ Admin login failed: ${loginRes.data?.error || 'Unknown error'}`, 'red');
      log('   Make sure ADMIN_PASSWORD=admin123 is set in .env.local', 'yellow');
    }
  } catch (err) {
    log(`\n❌ Error: ${err.message}`, 'red');
  }
}

// Run the test
runPerformanceTest().catch(err => {
  log(`\nFatal error: ${err.message}`, 'red');
  process.exit(1);
});