# Sharp + Vercel Compatibility Verification Plan

**Related ADR**: `docs/decisions/005-image-processing-library.md`
**Purpose**: Validate that the `sharp` library works correctly in Vercel's serverless environment before accepting ADR-005
**Status**: 📋 Not Started
**Created**: 2025-10-23

---

## 🎯 Verification Goals

Answer these critical questions:
1. ✅ Can `sharp` be installed and deployed on Vercel without errors?
2. ✅ Does `sharp` run successfully in Vercel's Node.js serverless functions?
3. ✅ Is the performance (speed + memory) acceptable for our use case?

---

## 📊 Success Criteria

| Metric | Target | Critical? |
|--------|--------|-----------|
| **Installation** | No build errors | ✅ Yes |
| **Processing time** | <500ms for 5MB image | ✅ Yes |
| **Memory usage** | <150MB peak | ⚠️ Nice-to-have |
| **Cold start time** | <3 seconds | ⚠️ Nice-to-have |
| **Output quality** | Base64 encoding works | ✅ Yes |

**Decision Logic**:
- If ALL critical criteria pass → ✅ Accept `sharp` (Update ADR-005 to "Accepted")
- If ANY critical criteria fail → ❌ Use fallback `jimp` (Update ADR-005 with decision rationale)

---

## 🔧 Prerequisites

### 1. Vercel Account
```bash
# Sign up at https://vercel.com (free tier is sufficient)
# Recommended: Use GitHub login for easier integration
```

### 2. Vercel CLI
```bash
# Install globally
npm install -g vercel

# Login (opens browser)
vercel login

# Verify installation
vercel --version
```

### 3. Test Image
```bash
# Use existing test image
ls experiments/test-images/test1.jpg
# Should exist from previous OpenAI testing
```

---

## 📋 Step-by-Step Verification Process

### **Step 1: Install Sharp** (2 minutes)

```bash
# In project root directory
npm install sharp

# Verify installation
npm list sharp
# Should show: sharp@x.x.x
```

**What this does**: Downloads sharp and its native dependencies (libvips) for your local OS.

---

### **Step 2: Create Test API Route** (5 minutes)

Create file: `app/api/test-sharp/route.ts`

```typescript
/**
 * POC: Test sharp library compatibility on Vercel
 * This minimal API verifies sharp works in serverless environment
 */

import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const startTime = Date.now();

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Convert to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process with sharp
    const processStart = Date.now();
    const processedBuffer = await sharp(buffer)
      .resize(1024, 1024, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 90 })
      .toBuffer();
    const processTime = Date.now() - processStart;

    // Get output metadata
    const metadata = await sharp(processedBuffer).metadata();

    // Test base64 conversion (for OpenAI API)
    const base64 = processedBuffer.toString('base64');

    const totalTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      message: 'Sharp is working! ✅',
      metrics: {
        originalSizeBytes: file.size,
        processedSizeBytes: processedBuffer.length,
        processingTimeMs: processTime,
        totalTimeMs: totalTime,
        outputDimensions: {
          width: metadata.width,
          height: metadata.height,
          format: metadata.format,
        },
        base64Length: base64.length,
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    message: 'Sharp test API is live',
    endpoint: 'POST /api/test-sharp',
    instructions: 'Send image as multipart/form-data with field name "image"'
  });
}
```

---

### **Step 3: Local Testing** (5 minutes)

```bash
# Start Next.js dev server
npm run dev

# In another terminal, test the API
curl -X POST http://localhost:3000/api/test-sharp \
  -F "image=@experiments/test-images/test1.jpg"
```

**Expected output**:
```json
{
  "success": true,
  "message": "Sharp is working! ✅",
  "metrics": {
    "originalSizeBytes": 2456789,
    "processedSizeBytes": 156234,
    "processingTimeMs": 120,
    "totalTimeMs": 145,
    "outputDimensions": {
      "width": 1024,
      "height": 768,
      "format": "jpeg"
    },
    "base64Length": 208312
  }
}
```

**✅ If successful**: Proceed to Step 4
**❌ If failed**: Check error message, verify sharp installation

---

### **Step 4: Deploy to Vercel** (10 minutes)

```bash
# Initialize Vercel project (first time only)
vercel

# Follow prompts:
# ? Set up and deploy? Yes
# ? Which scope? [Your account]
# ? Link to existing project? No
# ? What's your project's name? ai-skin-analyzer
# ? In which directory is your code located? ./
# ? Want to override settings? No

# Vercel will:
# 1. Build your Next.js app
# 2. Deploy to a preview URL
# 3. Show deployment URL in terminal
```

**What to watch for**:
- ✅ Build logs should show "Installing sharp..."
- ✅ No errors related to native modules
- ⚠️ Warning about package size is OK (Vercel handles it)

**Save the deployment URL**: `https://ai-skin-analyzer-xxx.vercel.app`

---

### **Step 5: Test on Vercel** (5 minutes)

```bash
# Replace YOUR_URL with actual Vercel deployment URL
curl -X POST https://YOUR_URL.vercel.app/api/test-sharp \
  -F "image=@experiments/test-images/test1.jpg"
```

**Check these metrics**:
- `processingTimeMs`: Should be <500ms
- `success`: Should be `true`
- `outputDimensions`: Should match input (scaled to 1024px max)

---

### **Step 6: Record Results** (5 minutes)

Create file: `experiments/adr005-sharp-test-results.md`

```markdown
# ADR-005 Verification Results

**Test Date**: YYYY-MM-DD
**Tester**: [Your name]
**Related ADR**: docs/decisions/005-image-processing-library.md
**Test Plan**: experiments/adr005-sharp-vercel-verification.md

## Environment
- Vercel Deployment URL: https://...
- Next.js Version: 14.x.x
- Sharp Version: x.x.x
- Node.js Version: 20.x

## Test Results

### Local Environment
- ✅/❌ Installation: [PASS/FAIL]
- ✅/❌ Processing: [time]ms
- ✅/❌ Base64 conversion: [PASS/FAIL]

### Vercel Environment
- ✅/❌ Deployment: [PASS/FAIL]
- ✅/❌ Processing: [time]ms
- ✅/❌ Memory usage: [amount]MB (if measurable)
- ✅/❌ Cold start: [time]s

## Raw Output
[Paste JSON response here]

## Decision
- ✅ Accept sharp (all criteria met)
- ❌ Reject sharp, use jimp instead (reason: ...)

## Next Steps
- [ ] Update ADR-005 status to "Accepted"/"Rejected"
- [ ] If accepted: Continue with API implementation
- [ ] If rejected: Create ADR-005.1 documenting jimp decision
```

---

## 🚨 Troubleshooting

### Issue: "Cannot find module 'sharp'"
```bash
# Solution: Reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Error: 'linux-x64' binaries" on Vercel
```bash
# Solution: Add to package.json
{
  "optionalDependencies": {
    "@img/sharp-linux-x64": "latest"
  }
}
```

### Issue: Deployment timeout
```bash
# Solution: Increase function timeout in vercel.json
{
  "functions": {
    "app/api/test-sharp/route.ts": {
      "maxDuration": 10
    }
  }
}
```

---

## 🔄 Cleanup (After Testing)

```bash
# Remove test API route
rm -rf app/api/test-sharp

# Optionally uninstall sharp (if test failed)
npm uninstall sharp

# Delete Vercel preview deployment
vercel remove ai-skin-analyzer --yes
```

---

## 📎 References

- Sharp documentation: https://sharp.pixelplumbing.com/
- Vercel serverless functions: https://vercel.com/docs/functions
- Next.js Image Optimization (uses sharp): https://nextjs.org/docs/app/building-your-application/optimizing/images

---

## ✅ Verification Checklist

Before updating ADR-005:
- [ ] All commands executed successfully
- [ ] Local test passed
- [ ] Vercel deployment succeeded
- [ ] Vercel test passed
- [ ] Performance metrics recorded
- [ ] Test results documented
- [ ] Cleanup completed (if needed)

---

**Status**: Update this after completing verification
- 📋 Not Started
- 🔄 In Progress
- ✅ Completed - Sharp works
- ❌ Completed - Sharp failed, using jimp
