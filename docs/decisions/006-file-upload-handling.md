# ADR-006: File Upload Handling Strategy

**Status**: Accepted
**Date**: 2025-10-23
**Deciders**: Engineering Team
**Technical Story**: API endpoint `/api/analyze-skin` implementation

## Context and Problem Statement

Need to handle user-uploaded facial photos (≤5MB, JPG/PNG) for skin analysis. Files must be validated and converted to base64 for OpenAI Vision API. Solution must work with Next.js 14 App Router and Vercel serverless deployment.

## Decision Drivers

* Next.js 14 App Router compatibility (Web standards)
* Vercel serverless constraints (1024MB memory, 10s timeout)
* Code simplicity for MVP
* Performance (<200ms processing for 5MB files)
* Security (file type/size validation)

## Considered Options

1. **Next.js Native `Request.formData()`** - Built-in Web API, zero dependencies
   - Pros: Official approach, type-safe, zero config
   - Cons: Manual validation (~15 lines)

2. **formidable** - Node.js file upload library
   - Pros: Feature-rich, built-in validation
   - Cons: Needs adapter for Next.js Request API

3. **multer** - Express middleware
   - Pros: Industry standard
   - Cons: Incompatible with App Router

4. **busboy** - Low-level stream parser
   - Pros: Maximum control
   - Cons: Complex (~60 lines), steep learning curve

## Decision Outcome

Chosen option: **Next.js Native `Request.formData()`**, because:
- Official Next.js App Router pattern
- Adequate performance (<200ms, 17MB memory vs 1024MB limit)
- YAGNI: Don't need streaming for 5MB files
- Zero dependencies, simple to maintain

### Consequences

* Good: Simple code (~20 lines), zero dependencies, type-safe
* Good: Zero-config Vercel deployment
* Bad: Manual validation (accepted: well-tested, only 15 lines)
* Bad: No streaming (accepted: unnecessary for 5MB limit)

## Validation

Success criteria:
- 99% requests complete <5s
- Memory <500MB per invocation
- Zero OOM errors in production

## Revisit Conditions

This decision should be revisited if:
* File size requirements exceed 10MB
* Memory usage in production exceeds 500MB
* Requirements expand to video uploads

## Links

* Research: [/research/adr006-file-upload-comparison.md](/research/adr006-file-upload-comparison.md)
* Next.js Docs: [Route Handlers - FormData](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#request-body-formdata)
* Related: ADR-005 (Image Processing)

## Notes

5MB limit makes streaming unnecessary (17MB << 1024MB serverless limit). Easy migration to formidable if future needs change.
