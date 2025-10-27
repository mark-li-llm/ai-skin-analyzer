# Backend Implementation Design - /api/analyze-skin

**Version**: 1.0
**Date**: 2025-10-26
**Scope**: MVP Backend API Route
**Author**: Claude

---

## 📋 Executive Summary

Implementation of a single API endpoint `/api/analyze-skin` that receives an image, processes it, sends to OpenAI Vision API, and returns skin analysis with sunscreen recommendations.

**Principle**: Simplest possible implementation that meets CONTRACT-001-MVP.md requirements.

---

## 🎯 Goals & Non-Goals

### Goals
- Accept image upload via multipart/form-data
- Validate file type (JPEG/PNG) and size (≤5MB)
- Process image with sharp (resize to 1024px max)
- Call OpenAI Vision API with production prompt
- Return structured JSON matching types/analysis.ts
- Handle all specified error cases

### Non-Goals (Explicitly NOT doing)
- No authentication/authorization
- No rate limiting implementation
- No caching or deduplication
- No database operations
- No logging framework
- No retry logic
- No monitoring/metrics
- No code splitting (all in one file)

---

## 🏗️ Architecture

### File Structure
```
app/api/analyze-skin/
└── route.ts          # Single file containing all logic
```

### Request Flow
```
Client Request (multipart/form-data)
    ↓
1. Parse FormData
    ↓
2. Extract & Validate File
    - Check exists
    - Check MIME type
    - Check size
    ↓
3. Process with Sharp
    - Convert to Buffer
    - Validate magic number (file signature)
    - Auto-orient based on EXIF
    - Resize (max 1024px)
    - Convert to sRGB color space
    - Strip EXIF/metadata
    - Convert to JPEG (85% quality)
    - Output as base64
    ↓
4. Call OpenAI API
    - Construct messages array
    - Include prompt + image
    - Parse JSON response
    ↓
5. Return Response
    - Success: SkinAnalysisResult (with Cache-Control: no-store)
    - Error: ApiError (with Cache-Control: no-store)
```

---

## 📝 Implementation Details

### 1. Environment Setup
```typescript
// Read from process.env
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
```

### 2. Constants (Hardcoded)
```typescript
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];
const IMAGE_MAX_DIMENSION = 1024;
const JPEG_QUALITY = 85;
const OPENAI_MODEL = 'gpt-5-nano';
const OPENAI_TIMEOUT = 60000; // 60 seconds
const OPENAI_MAX_TOKENS = 3000;
```

### 3. Main Handler Structure
```typescript
export async function POST(request: Request) {
  try {
    // Step 1: Parse FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    // Step 2: Validate
    if (!file) {
      return NextResponse.json(
        { error: 'InvalidImage' },
        {
          status: 400,
          headers: { 'Cache-Control': 'no-store' }
        }
      );
    }

    // Check type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'UnsupportedType' },
        {
          status: 415,
          headers: { 'Cache-Control': 'no-store' }
        }
      );
    }

    // Check size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
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
    return NextResponse.json(analysis, {
      headers: {
        'Cache-Control': 'no-store'
      }
    });

  } catch (error) {
    // Error handling
    return handleError(error);
  }
}
```

### 4. Image Processing Function
```typescript
// Magic number validation helper
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

async function processImage(file: File): Promise<string> {
  // Convert File to Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Validate magic number (file signature)
  if (!validateImageMagicNumber(buffer)) {
    throw new Error('Invalid image format');
  }

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
    // IMPORTANT: Metadata stripping happens automatically by NOT calling .withMetadata()
    // Sharp's default behavior strips ALL metadata (EXIF, XMP, IPTC, ICC profile)
    // This removes sensitive data like GPS coordinates, device info, and timestamps
    // Reference: https://sharp.pixelplumbing.com/api-output#withmetadata
    .toBuffer();

  // Convert to base64
  return processedBuffer.toString('base64');
}
```

### 5. OpenAI API Call
```typescript
async function analyzeWithOpenAI(imageBase64: string): Promise<SkinAnalysisResult> {
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
        temperature: 0.7
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse JSON from response
    const analysis = JSON.parse(content);

    // Validate structure (basic check)
    if (!analysis.skinType || !analysis.confidence) {
      throw new Error('Invalid response structure');
    }

    return analysis as SkinAnalysisResult;

  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error('Timeout');
    }
    throw error;
  }
}
```

### 6. Error Handler
```typescript
function handleError(error: any): NextResponse {
  console.error('API Error:', error);

  // Invalid image format (from magic number validation)
  if (error.message === 'Invalid image format') {
    return NextResponse.json(
      { error: 'InvalidImage' },
      {
        status: 400,
        headers: { 'Cache-Control': 'no-store' }
      }
    );
  }

  // Timeout error
  if (error.message === 'Timeout' || error.name === 'AbortError') {
    return NextResponse.json(
      { error: 'Timeout' },
      {
        status: 504,
        headers: { 'Cache-Control': 'no-store' }
      }
    );
  }

  // OpenAI error or parsing error
  return NextResponse.json(
    { error: 'OpenAIError' },
    {
      status: 500,
      headers: { 'Cache-Control': 'no-store' }
    }
  );
}
```

### 7. Complete Prompt (Embedded)
```typescript
const SKIN_ANALYSIS_PROMPT = `[Full prompt from docs/05-prompt-engineering.md lines 102-188]`;
```

---

## 🧪 Testing Strategy

### Manual Testing with cURL
```bash
# Success case
curl -X POST -F "file=@test.jpg" http://localhost:3000/api/analyze-skin

# File too large
curl -X POST -F "file=@large.jpg" http://localhost:3000/api/analyze-skin

# Wrong type
curl -X POST -F "file=@test.pdf" http://localhost:3000/api/analyze-skin

# No file
curl -X POST http://localhost:3000/api/analyze-skin
```

### Expected Responses

#### Success
```json
{
  "skinType": "combination",
  "confidence": 0.78,
  "analysis": {
    "observedCharacteristics": ["T-zone shine", "Balanced cheeks"],
    "skinTypeExplanation": "..."
  },
  "productRecommendation": {
    "formulationType": "Oil-free gel",
    "formulationReasoning": "...",
    "specificProducts": [...]
  }
}
```

#### Error Cases
```json
{ "error": "InvalidImage" }     // 400 - No file
{ "error": "FileTooLarge" }      // 413 - >5MB
{ "error": "UnsupportedType" }   // 415 - Not JPEG/PNG
{ "error": "OpenAIError" }       // 500 - API/Parse fail
{ "error": "Timeout" }           // 504 - >60s
```

---

## ⚠️ Security Considerations

### What we're doing
- File type validation by MIME type
- **Magic number validation (file signature checking)**
- File size limit (5MB)
- Timeout on external API call (60s)
- No file system writes (memory only)
- EXIF metadata stripping (privacy protection)

### What we're NOT doing (MVP acceptable)
- Image content moderation
- Rate limiting
- API key rotation
- Request signing
- CSRF protection (Next.js handles basics)

---

## 🚦 Implementation Phases

### Phase 1: Stub Implementation (10 min)
- Create route.ts
- Return hardcoded mock response
- Verify route works

### Phase 2: File Handling (20 min)
- Parse FormData
- Validate file existence, type, size
- Return appropriate errors

### Phase 3: Image Processing (20 min)
- Integrate sharp
- Resize and convert
- Test with various image sizes

### Phase 4: OpenAI Integration (30 min)
- Add API call
- Parse response
- Handle timeout

### Phase 5: Error Handling (10 min)
- Test all error paths
- Ensure correct status codes
- Verify error response format

**Total Estimate**: ~90 minutes

---

## 📊 Success Criteria

- [x] Endpoint responds at /api/analyze-skin
- [x] Accepts JPEG/PNG ≤5MB
- [x] **Validates magic number (file signature) not just MIME type**
- [x] Rejects invalid files with correct errors
- [x] **Auto-orients images based on EXIF**
- [x] **Strips EXIF metadata and converts to sRGB** ✅ **VERIFIED** (see METADATA-STRIPPING-VERIFICATION.md)
- [x] Processes image to ≤1024px
- [x] Calls OpenAI with correct prompt
- [x] Returns valid JSON matching types/analysis.ts
- [x] **All responses include Cache-Control: no-store header**
- [x] Handles all 5 error cases correctly
- [ ] Response time <60s (typically <5s) - Not yet tested E2E

---

## 🔄 Rollback Plan

If implementation fails:
1. Return to mock data (copy from public/mocks/)
2. Log error for debugging
3. Frontend can continue with mocks

---

## 📝 Notes & Assumptions

1. **API Key**: Stored in .env.local, accessed via process.env
2. **Sharp**: Already installed and verified working on Vercel
3. **Types**: Import from '@/types/analysis' for type safety
4. **Magic Number Validation**: Validates JPEG (FF D8 FF) and PNG (89 50 4E 47) signatures
5. **Synchronous Processing**: No background jobs, direct response
6. **Single Prompt**: Using complete prompt from docs/05-prompt-engineering.md
7. **JSON Parsing**: Trust OpenAI returns valid JSON (with try/catch)
8. **Cache Control**: All responses include Cache-Control: no-store header
9. **Image Processing**: Auto-orient, sRGB conversion, metadata stripping as per contract

---

## 🔗 References

- Contract: `docs/CONTRACT-001-MVP.md`
- Types: `types/analysis.ts`
- Prompt: `docs/05-prompt-engineering.md`
- Mock Data: `public/mocks/analysis-success.json`
- ADR-004: OpenAI model selection
- ADR-005: Sharp image processing
- ADR-006: File upload handling

---

## ✅ Approval Checklist

Before implementation:
- [x] OpenAI API key in .env.local
- [x] Confirm sharp dependency installed
- [x] Review error handling approach
- [x] Confirm no additional features needed
- [x] Approve single-file approach
- [x] **VERIFIED: Metadata stripping works correctly** (see METADATA-STRIPPING-VERIFICATION.md)

**Ready for implementation?** ✅ Yes / ⬜ No

---

*End of Implementation Design v1.0*