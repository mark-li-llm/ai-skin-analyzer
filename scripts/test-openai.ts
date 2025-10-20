/**
 * OpenAI Vision API Test Script
 *
 * Quick script to test OpenAI Vision API with sample images
 * Usage: ts-node scripts/test-openai.ts [image-url]
 */

// Uncomment when you have OpenAI SDK installed:
// import OpenAI from 'openai';

const SKIN_ANALYSIS_PROMPT = `
You are a professional skincare analyst. Analyze this facial photo and provide a detailed skin assessment.

Return ONLY valid JSON in this exact format:
{
  "skinType": "oily" | "dry" | "combination" | "normal" | "sensitive",
  "confidence": 0.0-1.0,
  "concerns": [
    {
      "type": "acne" | "dark_spots" | "fine_lines" | "redness" | "dullness" | "large_pores" | "dehydration",
      "severity": "mild" | "moderate" | "significant",
      "zones": ["forehead", "cheeks", "chin", "nose", "t-zone"],
      "confidence": 0.0-1.0
    }
  ],
  "explanation": "A clear explanation of findings in 2-3 sentences"
}

Focus on:
1. Overall skin type (oil production, pore size, texture)
2. Visible concerns (acne, discoloration, aging signs)
3. Areas of concern (T-zone, cheeks, etc.)

Do NOT provide medical diagnoses or product recommendations.
`;

async function testOpenAI(imageUrl: string) {
  console.log("🧪 Testing OpenAI Vision API...");
  console.log(`📸 Image: ${imageUrl}`);

  try {
    // TODO: Uncomment and configure when OpenAI SDK is installed
    /*
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const startTime = Date.now();

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: SKIN_ANALYSIS_PROMPT },
            { type: "image_url", image_url: { url: imageUrl } }
          ],
        },
      ],
      max_tokens: 800,
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const endTime = Date.now();
    const processingTime = endTime - startTime;

    console.log("\n✅ API Response:");
    console.log(JSON.stringify(JSON.parse(response.choices[0].message.content), null, 2));
    console.log(`\n⏱️  Processing time: ${processingTime}ms`);
    console.log(`💰 Tokens used: ${response.usage?.total_tokens}`);
    */

    // Placeholder response for testing without API
    console.log("\n⚠️  OpenAI SDK not configured yet.");
    console.log("Install dependencies:");
    console.log("  npm install openai");
    console.log("\nSet environment variable:");
    console.log("  export OPENAI_API_KEY='your-key-here'");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// Get image URL from command line argument
const imageUrl = process.argv[2] || "https://example.com/test-face.jpg";

testOpenAI(imageUrl)
  .then(() => {
    console.log("\n✨ Test complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
