/**
 * Test script for Vercel Production API
 * Tests the deployed /api/analyze-skin endpoint with multiple images
 *
 * Usage:
 *   node experiments/test-production-api.js
 *   node experiments/test-production-api.js --url https://your-custom-url.vercel.app
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DEFAULT_VERCEL_URL = 'https://ai-skin-analyzer.vercel.app';
const API_ENDPOINT = '/api/analyze-skin';

// Parse command line arguments
const args = process.argv.slice(2);
const urlIndex = args.indexOf('--url');
const PRODUCTION_URL = urlIndex !== -1 && args[urlIndex + 1]
  ? args[urlIndex + 1]
  : DEFAULT_VERCEL_URL;

// Test configuration
const TEST_CONFIG = {
  testImages: [
    { path: 'experiments/test-images/test1.jpg', name: 'test1' }
  ],
  resultsDir: 'experiments/test-results',
  timestamp: new Date().toISOString().replace(/[:.]/g, '-')
};

/**
 * Test a single image against the production API
 */
async function testSingleImage(imagePath, imageName) {
  console.log(`\n📷 Testing image: ${imageName}`);
  console.log('  Path:', imagePath);

  // Read the file as buffer
  const imageBuffer = fs.readFileSync(imagePath);
  if (!imageBuffer) {
    return { success: false, error: 'Failed to load image' };
  }

  const startTime = Date.now();

  try {
    console.log(`  🌐 Calling API: ${PRODUCTION_URL}${API_ENDPOINT}`);

    // Create FormData with the file
    const formData = new FormData();
    const blob = new Blob([imageBuffer], {
      type: imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg'
    });
    formData.append('file', blob, path.basename(imagePath));

    const response = await fetch(`${PRODUCTION_URL}${API_ENDPOINT}`, {
      method: 'POST',
      body: formData
    });

    const responseTime = Date.now() - startTime;
    console.log(`  ⏱️  Response time: ${responseTime}ms`);

    const data = await response.json();

    if (!response.ok) {
      console.log(`  ❌ API Error (${response.status}):`, data.error || 'Unknown error');
      return {
        success: false,
        statusCode: response.status,
        error: data.error || 'Unknown error',
        responseTime
      };
    }

    console.log(`  ✅ Success! Skin type: ${data.skinType} (${Math.round(data.confidence * 100)}% confidence)`);

    return {
      success: true,
      statusCode: response.status,
      responseTime,
      data
    };

  } catch (error) {
    console.log(`  ❌ Request failed:`, error.message);
    return {
      success: false,
      error: error.message,
      responseTime: Date.now() - startTime
    };
  }
}

/**
 * Save test results to file
 */
function saveResults(results, filename) {
  const resultsPath = path.join(TEST_CONFIG.resultsDir, filename);

  // Ensure results directory exists
  if (!fs.existsSync(TEST_CONFIG.resultsDir)) {
    fs.mkdirSync(TEST_CONFIG.resultsDir, { recursive: true });
  }

  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`  💾 Results saved to: ${resultsPath}`);
  return resultsPath;
}

/**
 * Generate test summary
 */
function generateSummary(allResults) {
  const summary = {
    timestamp: TEST_CONFIG.timestamp,
    productionUrl: PRODUCTION_URL,
    endpoint: API_ENDPOINT,
    totalTests: allResults.length,
    successful: allResults.filter(r => r.success).length,
    failed: allResults.filter(r => !r.success).length,
    averageResponseTime: Math.round(
      allResults.reduce((sum, r) => sum + r.responseTime, 0) / allResults.length
    ),
    results: allResults.map(r => ({
      image: r.imageName,
      success: r.success,
      responseTime: r.responseTime,
      skinType: r.data?.skinType || null,
      confidence: r.data?.confidence || null,
      error: r.error || null
    }))
  };

  return summary;
}

/**
 * Main test function
 */
async function runTests() {
  console.log('🧪 Vercel Production API Test');
  console.log('================================');
  console.log(`📍 Production URL: ${PRODUCTION_URL}`);
  console.log(`🔗 API Endpoint: ${API_ENDPOINT}`);
  console.log(`📅 Timestamp: ${TEST_CONFIG.timestamp}`);
  console.log(`📷 Test images: ${TEST_CONFIG.testImages.length}`);

  const allResults = [];

  // Test each image
  for (const testImage of TEST_CONFIG.testImages) {
    const result = await testSingleImage(testImage.path, testImage.name);

    const fullResult = {
      ...result,
      imageName: testImage.name,
      imagePath: testImage.path
    };

    allResults.push(fullResult);

    // Save individual result
    if (result.success && result.data) {
      const filename = `production-api-${testImage.name}-${TEST_CONFIG.timestamp}.json`;
      saveResults(result.data, filename);
    }

    // Add delay between requests to avoid rate limiting
    if (TEST_CONFIG.testImages.indexOf(testImage) < TEST_CONFIG.testImages.length - 1) {
      console.log('  ⏳ Waiting 2 seconds before next test...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Generate and save summary
  console.log('\n📊 Test Summary');
  console.log('================');
  const summary = generateSummary(allResults);

  console.log(`✅ Successful: ${summary.successful}/${summary.totalTests}`);
  console.log(`❌ Failed: ${summary.failed}/${summary.totalTests}`);
  console.log(`⏱️  Average response time: ${summary.averageResponseTime}ms`);

  // Save summary
  const summaryFilename = `production-test-summary-${TEST_CONFIG.timestamp}.json`;
  saveResults(summary, summaryFilename);

  // Display detailed results
  console.log('\n📋 Detailed Results:');
  summary.results.forEach(r => {
    if (r.success) {
      console.log(`  ✅ ${r.image}: ${r.skinType} (${Math.round(r.confidence * 100)}% confidence) - ${r.responseTime}ms`);
    } else {
      console.log(`  ❌ ${r.image}: ${r.error} - ${r.responseTime}ms`);
    }
  });

  // Cost estimation (based on gpt-5-nano pricing from ADR-004)
  if (summary.successful > 0) {
    console.log('\n💰 Estimated API Costs (gpt-5-nano):');
    // Rough estimation based on typical token usage
    const estimatedTokensPerRequest = 2000; // Conservative estimate
    const totalTokens = estimatedTokensPerRequest * summary.successful;
    const estimatedCost = (totalTokens / 1000000) * 0.45; // Average of input + output costs
    console.log(`  Total successful requests: ${summary.successful}`);
    console.log(`  Estimated total cost: $${estimatedCost.toFixed(4)}`);
    console.log(`  Cost per request: $${(estimatedCost / summary.successful).toFixed(4)}`);
  }

  console.log('\n✨ Testing complete!');
}

/**
 * Quick connectivity test
 */
async function testConnectivity() {
  console.log('\n🔌 Testing connectivity to production...');
  try {
    const response = await fetch(PRODUCTION_URL, { method: 'HEAD' });
    if (response.ok || response.status < 500) {
      console.log(`✅ Successfully connected to ${PRODUCTION_URL}`);
      return true;
    } else {
      console.log(`⚠️  Server returned status ${response.status}`);
      return true; // Still proceed if server is responding
    }
  } catch (error) {
    console.error(`❌ Failed to connect to ${PRODUCTION_URL}`);
    console.error(`   Error: ${error.message}`);
    console.log('\n💡 Tips:');
    console.log('   1. Check if your Vercel deployment is active');
    console.log('   2. Verify the URL is correct');
    console.log('   3. Use --url flag to specify a different URL');
    console.log('   Example: node experiments/test-production-api.js --url https://your-app.vercel.app');
    return false;
  }
}

// Main execution
async function main() {
  // Test connectivity first
  const isConnected = await testConnectivity();
  if (!isConnected) {
    console.log('\n⚠️  Proceeding anyway... (API calls may fail)');
  }

  // Run tests
  await runTests();
}

// Run the tests
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});