# Production API Testing Guide

## Quick Start

### 1. Basic Test (Using Default Vercel URL)
```bash
# Run this from the project root
./test-production.sh
```

### 2. Test with Custom URL
```bash
# If your deployment URL is different
./test-production.sh https://your-custom-deployment.vercel.app
```

### 3. Direct Node.js Execution
```bash
# Run the test script directly
node experiments/test-production-api.js

# With custom URL
node experiments/test-production-api.js --url https://your-app.vercel.app
```

## What the Test Does

1. **Connectivity Check**: Verifies connection to the Vercel deployment
2. **Multiple Image Testing**: Tests with all images in `experiments/test-images/`
3. **Response Validation**: Checks API response format and data
4. **Performance Metrics**: Measures response times
5. **Cost Estimation**: Estimates OpenAI API costs (gpt-5-nano)
6. **Result Storage**: Saves all results to `experiments/test-results/`

## Test Output Files

After running tests, you'll find these files in `experiments/test-results/`:

- **Individual Results**: `production-api-{image-name}-{timestamp}.json`
  - Contains the full API response for each successful test
  - Same format as your `production-api-success.json` example

- **Test Summary**: `production-test-summary-{timestamp}.json`
  - Contains overview of all tests
  - Success/failure counts
  - Average response times
  - All test results in one file

## Test Images

Current test images in `experiments/test-images/`:
- `test1.jpg` - Sample test image
- `harsha.jpeg` - Named test image

To add more test images:
1. Add images to `experiments/test-images/`
2. Update the `TEST_CONFIG.testImages` array in `test-production-api.js`

## Expected API Response Format

```json
{
  "skinType": "oily|dry|combination|normal|sensitive",
  "confidence": 0.0-1.0,
  "analysis": {
    "observedCharacteristics": ["array of observations"],
    "skinTypeExplanation": "explanation text"
  },
  "productRecommendation": {
    "formulationType": "type description",
    "formulationReasoning": "reasoning text",
    "specificProducts": [
      {
        "brandName": "brand",
        "productName": "product",
        "spf": "value",
        "keyBenefit": "benefit description"
      }
    ]
  },
  "additionalNotes": "optional notes"
}
```

## Troubleshooting

### Connection Failed
- Verify your Vercel deployment is active
- Check the URL (should be `https://your-app.vercel.app`)
- Ensure the `/api/analyze-skin` endpoint exists

### API Errors
- Check your `.env` file on Vercel has `OPENAI_API_KEY`
- Verify API key has sufficient credits
- Check Vercel function logs for detailed errors

### Image Issues
- Ensure test images are valid JPEG/PNG files
- Check file permissions
- Verify image paths are correct

## Monitoring Results

### Success Indicators
- ✅ 200 status code
- Valid JSON response
- Skin type classification present
- Confidence score between 0-1
- Product recommendations included

### Performance Metrics
- Good: < 3000ms response time
- Acceptable: 3000-5000ms
- Slow: > 5000ms (may need optimization)

## Cost Analysis

The test script estimates costs based on gpt-5-nano pricing:
- Input: $0.05 per 1M tokens
- Output: $0.40 per 1M tokens
- Typical request: ~2000 tokens (~$0.001 per request)

## Advanced Testing

### Stress Testing
To test multiple requests in parallel, modify the test script:
```javascript
// In test-production-api.js, reduce or remove the delay:
await new Promise(resolve => setTimeout(resolve, 500)); // Reduced from 2000ms
```

### Custom Test Cases
Add specific test scenarios by modifying `TEST_CONFIG`:
```javascript
testImages: [
  { path: 'path/to/oily-skin.jpg', name: 'oily-test' },
  { path: 'path/to/dry-skin.jpg', name: 'dry-test' },
  // Add more test cases
]
```

## Vercel Deployment Verification

To verify your deployment:
1. Check deployment status: `vercel list`
2. View function logs: `vercel logs`
3. Check environment variables: `vercel env ls`

## Example Test Run

```bash
$ ./test-production.sh

🚀 AI Skin Analyzer - Production API Test
=========================================

📍 Using default URL: https://ai-skin-analyzer.vercel.app

🧪 Starting production API tests...

🔌 Testing connectivity to production...
✅ Successfully connected to https://ai-skin-analyzer.vercel.app

🧪 Vercel Production API Test
================================
📍 Production URL: https://ai-skin-analyzer.vercel.app
🔗 API Endpoint: /api/analyze-skin
📅 Timestamp: 2024-10-27T10-30-00-000Z
📷 Test images: 2

📷 Testing image: test1
  Path: experiments/test-images/test1.jpg
  🌐 Calling API: https://ai-skin-analyzer.vercel.app/api/analyze-skin
  ⏱️  Response time: 2847ms
  ✅ Success! Skin type: combination (85% confidence)
  💾 Results saved to: experiments/test-results/production-api-test1-2024-10-27T10-30-00-000Z.json

📊 Test Summary
================
✅ Successful: 2/2
❌ Failed: 0/2
⏱️  Average response time: 2650ms

✨ Testing complete!
```