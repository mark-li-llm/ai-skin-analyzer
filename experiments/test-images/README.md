# Test Images

This folder is for storing test images to validate the OpenAI Vision API.

## Usage

1. **Add your test photos here** (JPG or PNG format)
2. **Run the test script**:
   ```bash
   node experiments/test-openai-vision.js experiments/test-images/your-photo.jpg
   ```

## Privacy

✅ This folder is **gitignored** - your personal photos will NOT be committed to the repository.

## Recommended Test Images

For comprehensive testing, try images with:
- Different skin types (oily, dry, combination, normal, sensitive)
- Various lighting conditions
- Different image qualities
- Close-up face shots with clear skin visibility

## Example

```bash
# Test with a specific image
node experiments/test-openai-vision.js experiments/test-images/face-sample-1.jpg

# Or use default sample from Unsplash
node experiments/test-openai-vision.js
```
