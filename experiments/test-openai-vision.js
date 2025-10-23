/**
 * Test script for OpenAI Vision API with skin analysis
 * Model: gpt-5-nano (as per ADR-004)
 *
 * Usage: node experiments/test-openai-vision.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Check for API key
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ Error: OPENAI_API_KEY not found in .env file');
  process.exit(1);
}

// The comprehensive prompt from our documentation
const SKIN_ANALYSIS_PROMPT = `
You are a skincare analysis expert specializing in skin type classification and sunscreen recommendations. Your task is to analyze the provided facial photograph and provide a comprehensive three-part assessment.

YOUR ANALYSIS MUST INCLUDE THREE DISTINCT PARTS:
1. SKIN TYPE: Identify the user's skin type (oily/dry/combination/normal/sensitive) based on visible characteristics
2. PRODUCT TYPE: Explain what kind of sunscreen formulation would work best for this skin type (e.g., gel-based, cream-based, mineral, chemical, mattifying, hydrating, etc.)
3. SPECIFIC RECOMMENDATION: Name 1-2 specific sunscreen products with brand names and SPF levels that match both the skin type and formulation needs

IMPORTANT INSTRUCTIONS:
- Base your analysis solely on observable features in the image
- Be specific in your product recommendations - include actual brand names and product names
- Choose widely available, reputable sunscreen products
- Explain the connection between the skin type observed and the product type needed
- This analysis is for cosmetic sunscreen selection only, not medical advice
- If image quality is insufficient, indicate low confidence but still provide recommendations based on what you can observe

SKIN ANALYSIS GUIDANCE:

Use your expertise to analyze the visible skin characteristics in the image. Consider examining different facial zones (T-zone, cheeks, around eyes) but rely on your professional judgment to determine skin type.

Key areas to consider in your analysis:
- Sebum production and shine patterns
- Pore visibility and size
- Skin texture and surface quality
- Signs of dryness or hydration levels
- Any visible sensitivity or irritation
- Overall skin balance and appearance

Trust your expertise to identify whether the skin appears:
- OILY: Typically shows excess sebum production
- DRY: Usually lacks moisture and natural oils
- COMBINATION: Often shows mixed characteristics in different zones
- NORMAL: Generally well-balanced
- SENSITIVE: May show signs of reactivity or irritation

Base your classification on the most prominent features you observe. You may notice characteristics that overlap between categories - use your professional judgment to determine the primary skin type.

Remember: Real skin rarely fits perfectly into one category. Make your best assessment based on the predominant characteristics you observe in the image.

CONFIDENCE ASSESSMENT:
Evaluate your confidence based on image quality and clarity of skin characteristics:
- HIGH CONFIDENCE: Clear image with easily observable skin features
- MEDIUM CONFIDENCE: Adequate visibility but some uncertainty in classification
- LOW CONFIDENCE: Poor image quality or ambiguous skin characteristics

OUTPUT REQUIREMENTS:

You must return your analysis in the following JSON format ONLY. Do not include any text outside of this JSON structure:

{
  "skinType": "oily" | "dry" | "combination" | "normal" | "sensitive",
  "confidence": 0.0-1.0,
  "analysis": {
    "observedCharacteristics": [
      "List specific features you observed in the image",
      "E.g., 'Visible shine on forehead and nose'",
      "E.g., 'Enlarged pores in T-zone area'"
    ],
    "skinTypeExplanation": "1-2 sentences explaining why you classified this skin type based on what you observed"
  },
  "productRecommendation": {
    "formulationType": "E.g., 'Oil-free gel-based' | 'Moisturizing cream' | 'Lightweight lotion' | 'Mineral-based' | 'Hybrid formula'",
    "formulationReasoning": "1-2 sentences explaining why this formulation type suits the identified skin type",
    "specificProducts": [
      {
        "brandName": "E.g., La Roche-Posay",
        "productName": "E.g., Anthelios Clear Skin",
        "spf": "E.g., 60",
        "keyBenefit": "E.g., Oil-free and mattifying for shine control"
      },
      {
        "brandName": "Second option brand",
        "productName": "Second option product",
        "spf": "SPF value",
        "keyBenefit": "Why this product suits their skin"
      }
    ]
  },
  "additionalNotes": "Optional field for any important observations about image quality, special considerations, or usage tips"
}

IMPORTANT:
- confidence: Use 0.8-1.0 for HIGH, 0.5-0.7 for MEDIUM, 0.2-0.4 for LOW confidence
- Always provide 2 specific product recommendations unless confidence is very low
- Ensure all JSON fields are properly formatted and valid
- Do not add any markdown formatting or code blocks around the JSON
`;

/**
 * Test the OpenAI Vision API
 * @param {string} imageUrl - URL or base64 of the image to analyze
 */
async function testVisionAPI(imageUrl) {
  console.log('🚀 Testing OpenAI Vision API...\n');
  console.log('📊 Configuration:');
  console.log('   Model: gpt-5-nano (cost-optimized as per ADR-004)');
  console.log('   Max tokens: 1000');
  console.log('   Temperature: 0.3 (for consistent results)\n');

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-5-nano',  // Using gpt-5-nano as per ADR-004
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: SKIN_ANALYSIS_PROMPT
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                  detail: 'high'  // Use high detail for skin analysis
                }
              }
            ]
          }
        ],
        max_completion_tokens: 3000  // Increased to allow for reasoning + actual output
        // Note: gpt-5-nano uses reasoning tokens internally before generating output
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ API Error:', data.error || data);
      return;
    }

    console.log('✅ API Response received!\n');

    // Debug: Log full response structure
    console.log('🔍 Full API Response:');
    console.log(JSON.stringify(data, null, 2));
    console.log('\n');

    console.log('📝 Raw Response:');
    console.log('-'.repeat(50));
    console.log(data.choices[0].message.content);
    console.log('-'.repeat(50));

    // Try to parse the JSON response
    try {
      const analysis = JSON.parse(data.choices[0].message.content);
      console.log('\n🎯 Parsed Analysis:');
      console.log(JSON.stringify(analysis, null, 2));

      // Display key findings
      console.log('\n🔍 Key Findings:');
      console.log(`   Skin Type: ${analysis.skinType}`);
      console.log(`   Confidence: ${(analysis.confidence * 100).toFixed(0)}%`);
      console.log(`   Formulation: ${analysis.productRecommendation.formulationType}`);

      if (analysis.productRecommendation.specificProducts) {
        console.log('\n💊 Product Recommendations:');
        analysis.productRecommendation.specificProducts.forEach((product, i) => {
          console.log(`   ${i + 1}. ${product.brandName} - ${product.productName} (SPF ${product.spf})`);
        });
      }
    } catch (parseError) {
      console.log('\n⚠️  Could not parse JSON response. The model may not have returned valid JSON.');
    }

    // Display usage stats
    if (data.usage) {
      console.log('\n📈 Token Usage:');
      console.log(`   Prompt tokens: ${data.usage.prompt_tokens}`);
      console.log(`   Completion tokens: ${data.usage.completion_tokens}`);
      console.log(`   Total tokens: ${data.usage.total_tokens}`);

      // Calculate cost based on gpt-5-nano pricing from ADR-004
      const inputCost = (data.usage.prompt_tokens / 1000000) * 0.05;  // $0.05 per 1M input tokens
      const outputCost = (data.usage.completion_tokens / 1000000) * 0.40;  // $0.40 per 1M output tokens
      const totalCost = inputCost + outputCost;

      console.log('\n💰 Estimated Cost (gpt-5-nano):');
      console.log(`   Input cost: $${inputCost.toFixed(6)}`);
      console.log(`   Output cost: $${outputCost.toFixed(6)}`);
      console.log(`   Total cost: $${totalCost.toFixed(6)}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('fetch')) {
      console.log('\n💡 Tip: Make sure you have Node.js 18+ for native fetch support,');
      console.log('   or install node-fetch: npm install node-fetch');
    }
  }
}

/**
 * Load image from file and convert to base64
 * @param {string} imagePath - Path to the image file
 */
function loadLocalImage(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64 = imageBuffer.toString('base64');
    const mimeType = path.extname(imagePath).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error(`❌ Could not load image from ${imagePath}:`, error.message);
    return null;
  }
}

// Main execution
async function main() {
  console.log('🧪 OpenAI Vision API Test Script');
  console.log('================================\n');

  // Check if a local image path was provided as argument
  const imagePath = process.argv[2];

  if (imagePath) {
    // Use local image
    console.log(`📷 Loading local image: ${imagePath}`);
    const imageData = loadLocalImage(imagePath);
    if (imageData) {
      await testVisionAPI(imageData);
    }
  } else {
    // Use a sample image URL (a stock photo for testing)
    console.log('📷 No image provided. Using sample image URL for testing.');
    console.log('   Usage: node experiments/test-openai-vision.js [path/to/image.jpg]\n');

    // Using a public sample face image for testing
    // This is a stock photo from Unsplash (free to use)
    const sampleImageUrl = 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800';
    console.log(`   Sample image: ${sampleImageUrl}\n`);

    await testVisionAPI(sampleImageUrl);
  }

  console.log('\n✨ Test complete!');
}

// Run the test
main().catch(console.error);