# MVP Integration Contract v1 (SPRINT-001)

> **📌 Status**: AUTHORITATIVE - This is the single source of truth for API implementation.
>
> Supersedes: `docs/04-api-documentation.md` (deprecated 2025-10-24)
>
> Related:
> - [types/analysis.ts](../types/analysis.ts) - TypeScript type definitions
> - [SPRINT-001-MVP.md](./completed/SPRINT-001-MVP.md) - Sprint task checklist (completed)

---

**Audience**: Backend and frontend developers working in parallel on the MVP.
**Scope**: Minimal, developer-facing requirements extracted from the PRD and tech spec.
**Language**: All API text/fields are in English. Low-confidence threshold = 0.5.
**Last updated**: 2025-10-24

## 1) Route and Request Protocol
- Method/Path: POST `/api/analyze-skin`
- Content-Type: `multipart/form-data`
- Field name: `file` (single file only)
- Max size: 5 MiB (5,242,880 bytes)
- Accepted types: `image/jpeg`, `image/png` (server must magic-number sniff, not just rely on extension)
- No files are written to disk; all processing is in-memory.

Examples
- cURL:
  `curl -X POST -F "file=@/path/to/photo.jpg" http://localhost:3000/api/analyze-skin`
- Browser (fetch):
  ```ts
  const form = new FormData();
  form.append('file', file); // a File from input or drag-drop
  const res = await fetch('/api/analyze-skin', { method: 'POST', body: form });
  ```

## 2) Server-side Image Preprocessing (Contract)
- Auto-orient based on EXIF
- Resize to max 1024 px on the longest edge
- Preserve aspect ratio; never upscale
- Strip EXIF/metadata; convert to sRGB
- Encode as JPEG at quality ~85–90%

Rationale: stable latency and predictable OpenAI token cost; aligns with docs/02-technical-spec.md.

## 3) OpenAI Call (Contract)
- Model: `gpt-5-nano`
- Image detail: `high`
- Use `max_completion_tokens` (not `max_tokens`)
- Timeout: 60s (requests exceeding this should be aborted)
- Prompt: production prompt from `docs/05-prompt-engineering.md`

If the model returns non-JSON or invalid shape, treat as server error (see errors below).

## 4) Success Response Shape (Authoritative)
Returned JSON must match the shared types in `types/analysis.ts`.
- Top-level fields:
  - `skinType`: one of `oily | dry | combination | normal | sensitive`
  - `confidence`: number in [0, 1] (recommend 2 decimal places)
  - `analysis`: {
    - `observedCharacteristics`: string[] (≥ 1)
    - `skinTypeExplanation`: string
    }
  - `productRecommendation`: {
    - `formulationType`: string
    - `formulationReasoning`: string
    - `specificProducts`: Array<{ brandName, productName, spf, keyBenefit }> (1–2 items)
    }
  - `additionalNotes?`: string (optional)

Sample (English)
```json
{
  "skinType": "combination",
  "confidence": 0.78,
  "analysis": {
    "observedCharacteristics": [
      "Noticeable T-zone shine",
      "Cheeks appear more balanced"
    ],
    "skinTypeExplanation": "Oil production is more visible in the T-zone while cheeks look balanced, suggesting combination skin."
  },
  "productRecommendation": {
    "formulationType": "Oil-free gel, mattifying finish",
    "formulationReasoning": "Controls T-zone shine without overburdening drier areas.",
    "specificProducts": [
      {"brandName":"Neutrogena","productName":"Ultra Sheer Dry-Touch","spf":"55","keyBenefit":"Lightweight, non-greasy, good for shine control"}
    ]
  },
  "additionalNotes": "Consider applying 15 minutes before sun exposure."
}
```

## 5) Error Response Contract
Always return `application/json` with a concise code and optional message.

- 400 Bad Request → `{ "error": "InvalidImage" }` (missing/empty/corrupt image)
- 413 Payload Too Large → `{ "error": "FileTooLarge" }`
- 415 Unsupported Media Type → `{ "error": "UnsupportedType" }`
- 500 Internal Server Error → `{ "error": "OpenAIError" }`
- 504 Gateway Timeout → `{ "error": "Timeout" }`
- 429 Too Many Requests (reserved for later) → `{ "error": "RateLimited" }`

Examples
```json
{ "error": "FileTooLarge" }
```
```json
{ "error": "UnsupportedType", "message": "Only JPEG and PNG are supported." }
```

## 6) Headers and Caching
- `Content-Type: application/json`
- `Cache-Control: no-store`

## 7) Frontend Display Rules (Minimum)
- Pre-check file type and size before submitting (client-side)
- Require user to accept disclaimers before enabling submit (see `legal/disclaimers.md`)
- Low confidence hint: if `confidence < 0.5`, show guidance like "Try a clearer, well-lit photo or retake"
- Render all success fields; for errors, show clear inline messaging with retry option

## 8) Single Source of Truth and Mocks
- Types: import `@/types/analysis` in both FE and BE. This file is the single source of truth for shapes and codes.
- Mocks: place sample payloads under `public/mocks/` (e.g., `analysis-success.json`, `analysis-error-file-too-large.json`) for FE development before BE is ready.

## 9) Acceptance (Definition of Done)
- [ ] Upload of a valid JPEG/PNG (≤ 5MB) succeeds
- [ ] Backend sends OpenAI request and receives a response
- [ ] Response validates against the contract and returns JSON described above
- [ ] UI renders all three sections with confidence; error paths show useful guidance

## 10) Non-Goals (Out of Scope for MVP)
- Accounts, persistence, databases, history
- Additional product categories beyond sunscreen
- Real-time camera capture
- Rate limiting implementation (error path reserved only)
- Internationalization framework

## 11) Change Control
Any change to this contract requires in the same commit:
- Update `types/analysis.ts`
- Update this file (`planning/CONTRACT-MVP-v1.md`)
- Update mock files (if present)
- Notify both FE and BE branches to re-align before merging

```text
Minor (non-breaking): adding optional fields, clarifying text
Breaking: renaming/removing fields, changing types/enums, changing HTTP or form field names
```

File references:
- Types: `types/analysis.ts`
- Prompt: `docs/05-prompt-engineering.md`
- Spec: `docs/02-technical-spec.md`
- PRD: `docs/01-prd.md`
- Disclaimers: `legal/disclaimers.md`

