# Random Thoughts & Ideas 🧠

## 2024-10-19 - Project Kickoff
- Starting with comprehensive docs structure - want to vibe code but stay organized
- Key challenge: How accurate can OpenAI Vision be for skin analysis?
- Concern: Medical/legal implications - need strong disclaimers
- Idea: What if we partnered with actual dermatologists to validate?

## Technical Thoughts
- **Image quality matters**: Need to handle various phone cameras, lighting
- **Caching strategy**: Same image analyzed twice should be instant (hash-based cache?)
- **Confidence scores**: Should we show when AI is uncertain?
- **Fallback handling**: What if OpenAI API is down?

## Product Ideas
- Tiered recommendations: drugstore, mid-range, luxury
- Season-aware suggestions (winter vs summer routines)
- Budget filters
- Ingredient preference tracking (vegan, fragrance-free, etc.)

## Competitors to Study
- [ ] SkinVision (focuses on skin cancer detection)
- [ ] YouCam Makeup (has skin analysis)
- [ ] Proven Skincare (quiz-based)
- [ ] Curology (prescription focus)

## Links to Check Later
- [OpenAI Vision API docs](https://platform.openai.com/docs/guides/vision)
- [Skin type classification research papers]
- [Paula's Choice ingredient dictionary](https://www.paulaschoice.com/ingredient-dictionary)
- [Reddit r/SkincareAddiction wiki](https://www.reddit.com/r/SkincareAddiction/wiki/index)

## Code Snippets to Try

### Image Hash for Caching
```typescript
import crypto from 'crypto';

const generateImageHash = (buffer: Buffer): string => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

const cacheKey = `skin_analysis_${generateImageHash(imageBuffer)}`;
```

### OpenAI Vision Quick Test
```typescript
const analyzeImage = async (imageUrl: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [{
      role: "user",
      content: [
        { type: "text", text: "Analyze this skin. Return JSON with skin type, concerns, and confidence." },
        { type: "image_url", image_url: { url: imageUrl } }
      ]
    }],
    max_tokens: 500
  });
  return response.choices[0].message.content;
};
```

## Questions to Explore
- How do professional skin analyzers work? (Korean beauty stores have them)
- What's the Fitzpatrick scale and should we use it?
- How to detect makeup vs. bare skin?
- Can we detect skin conditions (acne, rosacea) vs just skin type?

## Random Observations
- People take selfies with different angles/lighting - consistency is hard
- Most skin apps require quiz questions + photo - is photo alone enough?
- Trust is huge - need to explain WHY we recommend something
