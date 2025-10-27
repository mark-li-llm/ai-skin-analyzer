import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import type { SkinAnalysisResult, ApiError } from '../../../types/analysis';

// Environment
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];
const IMAGE_MAX_DIMENSION = 1024;
const JPEG_QUALITY = 85;
const OPENAI_MODEL = 'gpt-5-nano';
const OPENAI_TIMEOUT = 60000; // 60 seconds
const OPENAI_MAX_TOKENS = 3000;

// Production prompt from docs/05-prompt-engineering.md
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
 * Validates image magic number (file signature)
 */
function validateImageMagicNumber(buffer: Buffer): boolean {
  // JPEG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return true;
  }
  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 &&
      buffer[2] === 0x4E && buffer[3] === 0x47) {
    return true;
  }
  return false;
}

/**
 * Processes image according to contract requirements
 */
async function processImage(file: File): Promise<string> {
  // Convert File to Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Validate magic number (file signature)
  if (!validateImageMagicNumber(buffer)) {
    throw new Error('Invalid image format');
  }

  try {
    // Process with sharp (including all contract requirements)
    const processedBuffer = await sharp(buffer)
      .rotate()  // Auto-orient based on EXIF
      .resize(IMAGE_MAX_DIMENSION, IMAGE_MAX_DIMENSION, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toColorspace('srgb')  // Convert to sRGB color space
      .jpeg({
        quality: JPEG_QUALITY,
        mozjpeg: true  // Better compression
      })
      // IMPORTANT: By NOT calling .withMetadata(), sharp automatically strips
      // ALL metadata (EXIF, XMP, IPTC, ICC profile) from the output image.
      // This removes sensitive data including GPS coordinates, device info,
      // and timestamps. This is sharp's default security-conscious behavior.
      // Reference: https://sharp.pixelplumbing.com/api-output#withmetadata
      .toBuffer();

    // Convert to base64
    return processedBuffer.toString('base64');
  } catch (error) {
    console.error('Sharp processing error:', error);
    throw new Error('Invalid image format');
  }
}

/**
 * Parses OpenAI response, handles markdown-wrapped JSON
 */
function parseOpenAIResponse(content: string): any {
  // Remove markdown code blocks if present
  let cleaned = content.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  return JSON.parse(cleaned);
}

/**
 * Validates the analysis result structure
 */
function validateAnalysisResult(data: any): data is SkinAnalysisResult {
  return (
    data &&
    typeof data.skinType === 'string' &&
    ['oily', 'dry', 'combination', 'normal', 'sensitive'].includes(data.skinType) &&
    typeof data.confidence === 'number' &&
    data.confidence >= 0 && data.confidence <= 1 &&
    data.analysis &&
    Array.isArray(data.analysis.observedCharacteristics) &&
    data.analysis.observedCharacteristics.length > 0 &&
    typeof data.analysis.skinTypeExplanation === 'string' &&
    data.productRecommendation &&
    typeof data.productRecommendation.formulationType === 'string' &&
    typeof data.productRecommendation.formulationReasoning === 'string' &&
    Array.isArray(data.productRecommendation.specificProducts) &&
    data.productRecommendation.specificProducts.length >= 1 &&
    data.productRecommendation.specificProducts.length <= 2
  );
}

/**
 * Calls OpenAI Vision API
 */
async function analyzeWithOpenAI(imageBase64: string): Promise<SkinAnalysisResult> {
  // Check API key exists
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OPENAI_TIMEOUT);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
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
                  url: `data:image/jpeg;base64,${imageBase64}`,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_completion_tokens: OPENAI_MAX_TOKENS,
        // Note: gpt-5-nano only supports default temperature (1.0)
        // temperature: 0.5,
        response_format: { type: "json_object" }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error('OpenAI API error');
    }

    const data = await response.json();

    // Check response structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI response structure:', data);
      throw new Error('Invalid OpenAI response structure');
    }

    const content = data.choices[0].message.content;
    if (typeof content !== 'string') {
      console.error('Invalid OpenAI response content type:', typeof content);
      throw new Error('Invalid OpenAI response content');
    }

    // Parse JSON from response
    const analysis = parseOpenAIResponse(content);

    // Validate structure
    if (!validateAnalysisResult(analysis)) {
      console.error('Invalid analysis structure:', analysis);
      throw new Error('Invalid response structure');
    }

    return analysis;

  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error('Timeout');
    }
    throw error;
  }
}

/**
 * Error handler with proper status codes and headers
 */
function handleError(error: any): NextResponse<ApiError> {
  console.error('API Error:', {
    message: error.message,
    name: error.name,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });

  // Invalid image format (from magic number validation)
  if (error.message === 'Invalid image format') {
    return NextResponse.json<ApiError>(
      { error: 'InvalidImage' },
      {
        status: 400,
        headers: { 'Cache-Control': 'no-store' }
      }
    );
  }

  // Timeout error
  if (error.message === 'Timeout' || error.name === 'AbortError') {
    return NextResponse.json<ApiError>(
      { error: 'Timeout' },
      {
        status: 504,
        headers: { 'Cache-Control': 'no-store' }
      }
    );
  }

  // OpenAI error or parsing error
  return NextResponse.json<ApiError>(
    { error: 'OpenAIError' },
    {
      status: 500,
      headers: { 'Cache-Control': 'no-store' }
    }
  );
}

/**
 * Main POST handler for /api/analyze-skin
 */
export async function POST(request: NextRequest) {
  try {
    // Check API key first
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not configured in environment');
      return NextResponse.json<ApiError>(
        { error: 'OpenAIError', message: 'Service not configured' },
        {
          status: 500,
          headers: { 'Cache-Control': 'no-store' }
        }
      );
    }

    // Step 1: Parse FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    // Step 2: Validate file exists
    if (!file) {
      return NextResponse.json<ApiError>(
        { error: 'InvalidImage' },
        {
          status: 400,
          headers: { 'Cache-Control': 'no-store' }
        }
      );
    }

    // Check MIME type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json<ApiError>(
        { error: 'UnsupportedType' },
        {
          status: 415,
          headers: { 'Cache-Control': 'no-store' }
        }
      );
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json<ApiError>(
        { error: 'FileTooLarge' },
        {
          status: 413,
          headers: { 'Cache-Control': 'no-store' }
        }
      );
    }

    // Step 3: Process Image
    const processedImage = await processImage(file);

    // Step 4: Call OpenAI
    const analysis = await analyzeWithOpenAI(processedImage);

    // Step 5: Return Success with Cache-Control header
    return NextResponse.json<SkinAnalysisResult>(analysis, {
      headers: {
        'Cache-Control': 'no-store'
      }
    });

  } catch (error) {
    // Error handling
    return handleError(error);
  }
}