# ADR-005: Image Processing Library Selection

**Status**: Accepted ✅
**Date**: 2025-10-23
**Accepted**: 2025-10-25
**Deciders**: Development Team
**Technical Story**: API endpoint `/api/analyze-skin` implementation

---

## Context and Problem Statement

Need to process uploaded images (resize to 1024×1024px, convert to JPEG, encode as base64) before sending to OpenAI Vision API. Solution must work with Next.js 14 App Router and Vercel serverless deployment, processing <500ms for good UX.

---

## Decision Drivers

* **Performance**: Fast processing (<500ms) directly impacts user experience
* **Vercel compatibility**: Must work reliably in serverless environment (1024MB memory, 10s timeout)
* **Production readiness**: Battle-tested, actively maintained
* **Cost efficiency**: Faster execution = lower serverless costs

---

## Considered Options

1. **sharp** - High-performance native module (libvips)
   - Pros: 10-20x faster, memory-efficient, used by Next.js internally
   - Cons: Native dependencies require verification

2. **jimp** - Pure JavaScript library
   - Pros: Zero dependencies, guaranteed compatibility
   - Cons: 13x slower (~2000ms vs ~150ms)

3. **node-canvas** - Canvas API (Cairo)
   - Verdict: Not suitable (deployment issues, not optimized for server-side)

4. **Vercel Image Optimization**
   - Verdict: Not applicable (designed for frontend `<Image>`, not API-to-API)

**Detailed comparison**: `research/adr005-image-processing-comparison.md`

---

## Decision Outcome

**Chosen option: sharp**, because:
- Performance critical for UX (37ms actual vs 500ms target)
- Cost efficiency (13x faster = 93% lower serverless costs)
- Production-proven (Next.js uses sharp on Vercel)
- Industry standard (Cloudinary, Imgix use sharp)

### Consequences

**Good**:
- ✅ Excellent UX with near-instant processing (37ms on Vercel)
- ✅ Lower costs (~$0.03/month vs ~$0.40/month for 1K requests)
- ✅ Production-grade reliability

**Bad** (accepted trade-offs):
- ⚠️ Larger bundle (~9MB vs ~3MB for jimp)
- ⚠️ Native dependencies (mitigated: verified on Vercel)

---

## Validation

**Status**: ✅ **COMPLETE** (2025-10-25)

**Results**:
- [x] Vercel deployment: ✅ No errors
- [x] Performance: ✅ 37ms (13.5x faster than 500ms target)
- [x] Cross-platform: ✅ macOS arm64 (10ms) + Linux x64 (37ms)

**Test results**: `experiments/adr005-sharp-test-results.md`

---

## Fallback Plan

If sharp fails in production: Switch to jimp (~10 lines code change, 1-2 hour migration). Accept slower processing and higher costs.

---

## Revisit Conditions

This decision should be revisited if:
* Processing time consistently >1 second
* sharp causes recurring Vercel failures
* Image processing costs >$10/month
* Scale exceeds 10,000 requests/day

---

## Links

**Research**:
- `research/adr005-image-processing-comparison.md` - Detailed technical analysis
- `experiments/adr005-sharp-vercel-verification.md` - Validation plan
- `experiments/adr005-sharp-test-results.md` - Test results

**Related**:
- ADR-006 (File upload handling)
- [sharp docs](https://sharp.pixelplumbing.com/)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)

---

## Notes

Image processing isolated in `lib/image-processing.ts` for easy library swapping. sharp chosen over image CDN services (Cloudinary/Imgix) because we need server-to-server processing before OpenAI API, not browser delivery.

---

**Status Log**:
- 2025-10-23: Created (Proposed, Pending Verification)
- 2025-10-25: Accepted (Verified: macOS 10ms, Vercel 37ms)
