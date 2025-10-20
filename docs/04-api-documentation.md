# API Documentation

**Version**: 0.1
**Last Updated**: 2025-10-19
**Base URL**: `/api`

## Overview

Single endpoint API for skin analysis using OpenAI Vision API. Stateless, no authentication required.

## Endpoints

### `POST /api/analyze-skin`

Analyzes uploaded facial photo to determine skin type (oily/dry/combination/normal/sensitive) and provide personalized sunscreen recommendations with specific product suggestions.

#### Request

- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Body**: Image file
  - Max size: 5MB
  - Formats: jpg, jpeg, png

#### Response

**Success (200 OK)**
```json
{
  "skinType": "oily" | "dry" | "combination" | "normal" | "sensitive",
  "confidence": 0.0-1.0,
  "analysis": {
    "observedCharacteristics": [
      "Visible shine on forehead and nose",
      "Enlarged pores in T-zone area",
      "Smooth texture on cheeks"
    ],
    "skinTypeExplanation": "The skin shows characteristics of combination type with visible oil production in the T-zone while the cheek areas appear more balanced."
  },
  "productRecommendation": {
    "formulationType": "Oil-free gel-based",
    "formulationReasoning": "Gel-based formulations work best for combination skin as they provide sun protection without adding excess oil to the T-zone while remaining light enough for the drier areas.",
    "specificProducts": [
      {
        "brandName": "La Roche-Posay",
        "productName": "Anthelios Clear Skin",
        "spf": "60",
        "keyBenefit": "Oil-free and mattifying for shine control"
      },
      {
        "brandName": "Neutrogena",
        "productName": "Ultra Sheer Dry-Touch",
        "spf": "55",
        "keyBenefit": "Lightweight gel formula that won't clog pores"
      }
    ]
  },
  "additionalNotes": "Image quality is good. Consider applying sunscreen 15 minutes before sun exposure for best results."
}
```

**Response Fields:**
- `skinType` (string): One of five skin type classifications
- `confidence` (number): Analysis confidence score
  - `0.8-1.0`: HIGH - Clear image with easily observable features
  - `0.5-0.7`: MEDIUM - Adequate visibility with some uncertainty
  - `0.2-0.4`: LOW - Poor image quality or ambiguous characteristics
- `analysis` (object): Detailed skin analysis
  - `observedCharacteristics` (array): Specific features visible in the image
  - `skinTypeExplanation` (string): 1-2 sentences explaining the classification
- `productRecommendation` (object): Sunscreen guidance
  - `formulationType` (string): Recommended formulation type
  - `formulationReasoning` (string): Why this formulation suits the skin type
  - `specificProducts` (array): 2 specific product recommendations
    - `brandName` (string): Product brand
    - `productName` (string): Product name
    - `spf` (string): SPF level
    - `keyBenefit` (string): Why this product is recommended
- `additionalNotes` (string, optional): Additional observations or usage tips

**Error Responses**
```json
{
  "error": "Invalid image" | "API error" | "File too large"
}
```

## Technical Details

### Rate Limiting
- 10 requests per minute per IP address

### Image Processing
- Images resized to 1024×1024px maximum
- Aspect ratio maintained
- Quality: JPEG 85-90%

### OpenAI Configuration
- Model: `gpt-5-nano` (per ADR-004)
- Detail parameter: "high"
- Estimated cost: ~$0.00025 per request

## Implementation Status

**Not yet implemented** - This documentation reflects planned functionality from technical specification.

### Completed Planning
- ✅ Prompt engineering complete (see `docs/05-prompt-engineering.md`)
- ✅ Response format defined (JSON schema documented above)
- ✅ OpenAI model selected: `gpt-5-nano` (see `docs/decisions/004-openai-model-selection.md`)

### Ready for Implementation
All technical specifications and prompt engineering work is complete. API can now be implemented following the schema defined above.