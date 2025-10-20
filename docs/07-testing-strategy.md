# Testing Strategy

**Version**: 0.1
**Last Updated**: 2025-10-19

## Testing Objective

Verify the MVP meets the success criteria defined in technical specification:

1. Image upload completes successfully
2. OpenAI API request is sent
3. OpenAI returns a valid response
4. Results are displayed to user

## MVP Testing Approach

**Manual testing** to validate core functionality works end-to-end.

No automated tests for initial MVP validation.

## What to Test

### 1. Image Upload
- Valid file formats (jpg, jpeg, png) are accepted
- Files under 5MB upload successfully
- Files over 5MB are rejected with error
- Invalid file types are rejected with error

### 2. OpenAI API Integration
- API request is sent with uploaded image
- Request includes proper authentication
- Image is resized to 1024×1024px max before sending
- Response is received within timeout (60s)

### 3. Response Validation
- OpenAI returns structured JSON response
- Response contains required fields: skinType, sunscreenRecommendation, confidence
- skinType is one of: oily, dry, combination, normal
- Error handling works when API fails

### 4. Results Display
- Analysis results are shown to user
- All response fields are rendered correctly
- User can understand the recommendation

## Test Images Needed

Manual testing requires diverse test images:

- Different skin types (oily, dry, combination, normal)
- Various skin tones
- Different lighting conditions
- Edge cases (with makeup, blurry photos, non-face images)

## Implementation Status

**Not yet implemented** - No code or tests written yet.

### Pending Decisions (TBD)
- Test framework selection (if any)
- Automated testing strategy
- Test coverage requirements
- CI/CD integration approach
