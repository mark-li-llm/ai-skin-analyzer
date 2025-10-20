# Technical Specification

**Version**: 0.1
**Last Updated**: 2025-10-19

## System Overview
An MVP web application that:
1. Accepts user-uploaded facial photos
2. Analyzes skin characteristics using OpenAI Vision API
3. Returns skin type classification (oily/dry/combination/normal/sensitive) with observed characteristics
4. Provides sunscreen formulation guidance and 2 specific product recommendations with brand names

No user accounts, no product database, no history tracking - just simple upload → analyze → display results.

## Technology Stack
- **Frontend & Backend**: Next.js 14 with API Routes
- **AI**: OpenAI Vision API 
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Hosting**: Vercel (everything in one place)
- **Database**: None (stateless MVP as per PRD)

## API Design

### Single Endpoint
`POST /api/analyze-skin`

Request:
- Body: multipart/form-data with image file
- Max file size: 5MB
- Accepted formats: jpg, jpeg, png

Response:
```json
{
  "skinType": "oily" | "dry" | "combination" | "normal" | "sensitive",
  "confidence": 0.0-1.0,
  "analysis": {
    "observedCharacteristics": [
      "List specific features observed in the image",
      "E.g., 'Visible shine on forehead and nose'",
      "E.g., 'Enlarged pores in T-zone area'"
    ],
    "skinTypeExplanation": "1-2 sentences explaining why this skin type was classified based on observed features"
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
```

**Confidence Score Ranges:**
- `0.8-1.0`: HIGH confidence - Clear image with easily observable skin features
- `0.5-0.7`: MEDIUM confidence - Adequate visibility but some uncertainty in classification
- `0.2-0.4`: LOW confidence - Poor image quality or ambiguous skin characteristics

Error Response:
```json
{
  "error": "Invalid image" | "API error" | "File too large"
}
```

## Data Flow & Architecture

### Happy Path
Client → Next.js Frontend → API Route → OpenAI Vision → Format Response → Display

### Error Handling
- File validation: Client-side + server-side duplicate check
- OpenAI timeout: 60s timeout, return user-friendly error
- Rate limiting: 10 requests per minute per IP
- Image processing: Resize to 1024×1024px max, maintain aspect ratio (see OpenAI Integration Details below)

### Architecture Pattern
- Stateless request/response
- No caching (for MVP)
- No session management
- Direct API calls (no queue)

## Performance Requirements

### Success Criteria (MVP)
- [ ] Image upload completes successfully
- [ ] OpenAI API request is sent
- [ ] OpenAI returns a valid response
- [ ] Results are displayed to user

### Definition of Success
All four checkpoints must be "Yes" for the system to be considered working.

## OpenAI Integration Details

### Model Selection
- **Model**: `gpt-5-nano`
- **Decision**: See ADR-004 for rationale and alternatives considered
- **Cost**: ~$0.00025 per request (~$7.50/month at 1000 requests/day)

### Image Processing
- **Resize**: Yes, to **1024×1024px maximum**
- **Aspect Ratio**: Maintain original (no stretching/distortion)
- **Upscaling**: No - if image is smaller than 1024×1024, keep original size
- **Quality**: JPEG 85-90%
- **Detail Parameter**: "high" (required for accurate skin analysis)
- **Token Cost**: ~765 tokens per image at 1024×1024 high detail
- **Rationale**:
  - Sufficient resolution for skin texture/pore analysis
  - 31% token savings vs larger images
  - Faster upload and processing
  - Predictable, consistent costs

### Prompt Engineering
- **Complete**: See `docs/05-prompt-engineering.md` for the full production prompt
- **Structure**: Three-part prompt covering role definition, skin analysis criteria, and JSON output requirements
- **Key Features**:
  - Skin type classification with confidence assessment
  - Observable characteristics documentation
  - Formulation type reasoning
  - Specific product recommendations (2 products with brand names)

### Response Format
- **Format**: Structured JSON (see Response schema above in API Design section)
- **Validation**: OpenAI instructed to return valid JSON only, no markdown formatting
- **Fields**: 5 top-level fields (skinType, confidence, analysis, productRecommendation, additionalNotes)