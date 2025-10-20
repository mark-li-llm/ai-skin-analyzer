# GPT-5 Vision Model Comparison

**Date**: 2025-10-19
**Status**: RESEARCHED - Ready for Testing
**Last Updated**: October 19, 2025

## Executive Summary

OpenAI's GPT-5 series (released August 2025) is the flagship multimodal model family for 2025. For skin analysis, choose based on your needs:

1. **GPT-5-nano** - Most cost-effective, best for MVP and high-volume applications
2. **GPT-5-mini** - Balanced performance and cost for production
3. **GPT-5** - Highest accuracy for premium applications

All models support native multimodal input (text, image, audio, video) and offer 90% cache discount for repeated inputs.

---

## GPT-5 Model Series (August 2025)

### GPT-5 (Standard/Flagship)
**Model**: `gpt-5`

**Pricing**:
- **Input**: $1.25 per 1M tokens ($0.00000125 per token)
- **Output**: $10.00 per 1M tokens ($0.00001 per token)
- **Cached Input**: $0.125 per 1M tokens (90% discount)
- **Images**: Same as text token pricing

**Context Limits**:
- **Input**: 272,000 tokens
- **Output**: 128,000 tokens

**Capabilities**:
- Native multimodal processing (text, image, audio, video)
- State-of-the-art vision understanding
- Advanced reasoning capabilities
- Highest accuracy for complex analysis tasks

**Best For**:
- Premium applications requiring highest accuracy
- Complex skin analysis with detailed recommendations
- Medical or professional-grade analysis
- Applications where accuracy > cost

**Pros**:
- Best-in-class performance
- 50% cheaper input than GPT-4o ($1.25 vs $2.50)
- Same output cost as GPT-4o ($10)
- Massive 272K context window
- 90% cache discount for repeated prompts

**Cons**:
- Higher cost than mini/nano variants
- May be overkill for simple classifications

---

### GPT-5-mini (Balanced)
**Model**: `gpt-5-mini`

**Pricing**:
- **Input**: $0.25 per 1M tokens ($0.00000025 per token)
- **Output**: $2.00 per 1M tokens ($0.000002 per token)
- **Cached Input**: $0.025 per 1M tokens (90% discount)
- **Images**: Same as text token pricing

**Context Limits**:
- **Input**: 272,000 tokens
- **Output**: 128,000 tokens

**Capabilities**:
- Native multimodal processing (text, image, audio, video)
- Strong vision understanding
- Good balance of speed and accuracy

**Best For**:
- Production applications
- Standard skin analysis and classification
- Moderate-volume applications
- Cost-conscious deployments with good accuracy needs

**Pros**:
- 80% cheaper than GPT-5 standard
- Same 272K context window
- 90% cache discount available
- Excellent price-to-performance ratio

**Cons**:
- Slightly lower accuracy than GPT-5 standard
- 5x more expensive than GPT-5-nano

---

### GPT-5-nano (Most Cost-Effective)
**Model**: `gpt-5-nano`

**Pricing**:
- **Input**: $0.05 per 1M tokens ($0.00000005 per token)
- **Output**: $0.40 per 1M tokens ($0.0000004 per token)
- **Cached Input**: $0.005 per 1M tokens (90% discount)
- **Images**: Same as text token pricing

**Context Limits**:
- **Input**: 272,000 tokens
- **Output**: 128,000 tokens

**Capabilities**:
- Native multimodal processing (text, image, audio, video)
- Efficient vision processing
- Fast response times

**Best For**:
- MVP development and testing
- High-volume applications (1000+ requests/day)
- Cost-sensitive deployments
- Quick prototyping and experimentation

**Pros**:
- Extremely cost-effective (96% cheaper than GPT-5)
- Same 272K context window as larger models
- 90% cache discount available
- Fast response times
- Perfect for MVP validation

**Cons**:
- Lower accuracy than mini/standard variants
- May require more prompt engineering
- Less suitable for complex analysis tasks

---

## Image Processing Details

### Limitations
- **Max images per request**: 10 images
- **Max image size**: 20 MB per image
- **Supported formats**: Common image formats (JPEG, PNG, etc.)

### Image Token Calculation
Images are converted to tokens and billed at standard text rates:

- **"detail": "low"** → 85 tokens (fixed)
- **"detail": "high"** → Variable based on image size
  - Image is scaled to fit in 2048×2048px square
  - Shortest side scaled to 768px
  - Each 512×512px tile = 170 tokens
  - Base cost: 85 tokens

**Examples**:
- 1024×1024px (high detail): 765 tokens (170×4 + 85)
- 2048×4096px (high detail): 1,105 tokens (170×6 + 85)

### Recommendations for Skin Analysis
- Use **"detail": "high"** for accurate skin analysis
- Resize images to 1024×1024px before upload to control costs (~765 tokens)
- Consider image preprocessing to standardize lighting/quality

## Testing Plan

### Test Dataset Needed

- [ ] Collect diverse skin type images
- [ ] Label ground truth for each image
- [ ] Include edge cases (lighting, angle, quality)

### Metrics to Measure

- [ ] Accuracy (% correct skin type)
- [ ] Consistency (same image, multiple calls)
- [ ] Response time
- [ ] Cost per request
- [ ] Token usage

## Experiments to Run

```javascript
// TODO: Write test scripts
// Test both models with same images
// Compare results
```

## Cost Analysis for Skin Analysis

### Assumptions
- Average prompt: ~200 tokens (instructions + output request)
- Average response: ~500 tokens (skin type analysis + recommendations)
- Image size: 1024×1024px at "high" detail = ~765 tokens
- **Total input tokens**: 965 (765 image + 200 text)
- **Total output tokens**: 500

### Cost Per Request

| Model | Input Cost | Output Cost | **Total/Request** | 100 req/day | 1000 req/day |
|-------|------------|-------------|-------------------|-------------|--------------|
| **gpt-5** | $0.00121 | $0.0050 | **$0.00621** | $0.62/day | $6.21/day |
| **gpt-5-mini** | $0.00024 | $0.0010 | **$0.00124** | $0.12/day | $1.24/day |
| **gpt-5-nano** | $0.00005 | $0.0002 | **$0.00025** | $0.025/day | $0.25/day |

### Cost Per Request (With 90% Cache Discount)
*Applies when using same/similar prompts within a few minutes*

| Model | Input Cost | Output Cost | **Total/Request** | 100 req/day | 1000 req/day |
|-------|------------|-------------|-------------------|-------------|--------------|
| **gpt-5** | $0.00012 | $0.0050 | **$0.00512** | $0.51/day | $5.12/day |
| **gpt-5-mini** | $0.000024 | $0.0010 | **$0.00102** | $0.10/day | $1.02/day |
| **gpt-5-nano** | $0.000005 | $0.0002 | **$0.00021** | $0.021/day | $0.21/day |

### Monthly Costs (30 days)

| Model | 100 req/day | 1000 req/day | 10,000 req/day |
|-------|-------------|--------------|----------------|
| **gpt-5** | $18.60 | $186 | $1,860 |
| **gpt-5-mini** | $3.72 | $37.20 | $372 |
| **gpt-5-nano** | $0.75 | $7.50 | $75 |

### Monthly Costs with Cache (30 days)

| Model | 100 req/day | 1000 req/day | 10,000 req/day |
|-------|-------------|--------------|----------------|
| **gpt-5** | $15.36 | $153.60 | $1,536 |
| **gpt-5-mini** | $3.06 | $30.60 | $306 |
| **gpt-5-nano** | $0.63 | $6.30 | $63 |

### Cost Comparison

- **gpt-5-mini** is 80% cheaper than **gpt-5**
- **gpt-5-nano** is 96% cheaper than **gpt-5**
- **gpt-5-nano** is 80% cheaper than **gpt-5-mini**
- With caching, costs reduced by ~17-18% across all models

---

## Recommendation

### For MVP Development
**Recommended**: Start with **gpt-5-nano**

**Rationale**:
1. **Extremely cost-effective**: Only $0.75/month for 100 requests/day
2. **Fast response times**: Improve development experience
3. **Same context window**: 272K tokens like all GPT-5 models
4. **Easy to upgrade**: Switch to mini/standard later if needed
5. **90% cache discount**: Further reduce costs during testing

**MVP Budget Example**:
- 100 requests/day = $0.75/month ($0.63 with cache)
- 1000 requests/day = $7.50/month ($6.30 with cache)

### For Production (After Testing)
**Test all three models**: gpt-5-nano vs gpt-5-mini vs gpt-5

**Decision Criteria**:

| Scenario | Recommended Model | Monthly Cost (1000 req/day) |
|----------|------------------|---------------------------|
| Accuracy > 90% with nano | **gpt-5-nano** | $7.50 |
| Nano accuracy < 90%, mini > 90% | **gpt-5-mini** | $37.20 |
| Need highest accuracy | **gpt-5** | $186 |
| Premium/medical app | **gpt-5** | $186 |

### Implementation Strategy

#### Phase 1: MVP (Weeks 1-2)
- Use **gpt-5-nano** exclusively
- Test with diverse skin types
- Measure accuracy, consistency, response time
- Gather user feedback
- Cost: ~$0.75-7.50/month

#### Phase 2: Testing (Weeks 3-4)
- Run A/B test with same images across all three models
- Compare accuracy, consistency, false positive/negative rates
- Measure user satisfaction differences
- Calculate cost vs accuracy tradeoff
- Cost: ~$30/month (testing all models)

#### Phase 3: Production Decision (Week 5)
Choose based on test results:
- **If nano accuracy ≥ 90%** → Use gpt-5-nano (massive cost savings)
- **If mini accuracy ≥ 95%** → Use gpt-5-mini (good balance)
- **If accuracy critical** → Use gpt-5 standard (best performance)

#### Phase 4: Scale & Optimize (Ongoing)
- Implement caching strategy (90% discount)
- Monitor accuracy over time
- Consider hybrid approach if needed

### Hybrid Approach (Advanced)

**Multi-tier Strategy**:
1. **First pass**: gpt-5-nano classifies all images
2. **Low confidence trigger**: If confidence < 80%, escalate to gpt-5-mini
3. **Critical cases**: If still uncertain, use gpt-5 standard
4. **Result**: ~70% handled by nano, ~25% by mini, ~5% by standard

**Cost Example** (1000 requests/day):
- 700 × gpt-5-nano = $0.175/day
- 250 × gpt-5-mini = $0.31/day
- 50 × gpt-5 = $0.31/day
- **Total**: $0.795/day = $23.85/month (vs $186 with gpt-5 only)

### Cache Optimization Strategy

**Maximize 90% cache discount**:
1. Use consistent prompt templates
2. Batch similar requests together
3. Reuse system prompts across requests
4. Structure prompts to maximize cacheable portions

**Example**:
- Standard cost: $7.50/month (1000 req/day, nano)
- With caching: $6.30/month (16% savings)
- With hybrid + caching: $20/month vs $186 (89% savings)

---

## Next Steps

### Immediate Actions
1. ✅ ~~Get OpenAI API pricing~~ - COMPLETED
2. ✅ ~~Research GPT-5 models~~ - COMPLETED
3. [ ] **Set up OpenAI API access** (get API key)
4. [ ] **Create test script for gpt-5-nano**
5. [ ] **Create test image dataset** (10-20 diverse skin types)
6. [ ] **Run initial experiments** with gpt-5-nano

### Phase 2 Actions
7. [ ] **Compare all three GPT-5 models** (nano vs mini vs standard)
8. [ ] **Measure accuracy, consistency, response time**
9. [ ] **Calculate actual token usage** (verify image token costs)
10. [ ] **Document results and make final decision** → Create ADR-004

### Phase 3 Actions
11. [ ] **Implement chosen model in MVP**
12. [ ] **Set up caching strategy** (maximize 90% discount)
13. [ ] **Monitor costs and performance**
14. [ ] **Consider hybrid approach** if needed

---

## API Usage Code Example

### Basic GPT-5 Vision Call

```javascript
// Example API call for skin analysis with GPT-5
const response = await openai.chat.completions.create({
  model: "gpt-5-nano", // or "gpt-5-mini", "gpt-5"
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Analyze this person's skin type and provide recommendations..."
        },
        {
          type: "image_url",
          image_url: {
            url: "https://example.com/skin-photo.jpg", // or base64
            detail: "high" // Use "high" for accurate skin analysis
          }
        }
      ]
    }
  ],
  max_tokens: 500
});

console.log(response.choices[0].message.content);
```

### With Caching (90% Discount)

```javascript
// Use consistent system prompt to maximize cache hits
const systemPrompt = `You are a professional skin analysis assistant.
Analyze skin images and classify them into one of these types:
- Normal
- Dry
- Oily
- Combination
- Sensitive

Provide confidence score and product recommendations.`;

const response = await openai.chat.completions.create({
  model: "gpt-5-nano",
  messages: [
    {
      role: "system",
      content: systemPrompt // This gets cached!
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Classify this skin type:"
        },
        {
          type: "image_url",
          image_url: {
            url: imageUrl,
            detail: "high"
          }
        }
      ]
    }
  ],
  max_tokens: 500
});
```

### Hybrid Approach Example

```javascript
async function analyzeSkin(imageUrl) {
  // Try nano first (cheapest)
  const nanoResponse = await openai.chat.completions.create({
    model: "gpt-5-nano",
    messages: [...],
    max_tokens: 500
  });

  const confidence = extractConfidence(nanoResponse);

  // If confidence low, escalate to mini
  if (confidence < 0.8) {
    const miniResponse = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [...],
      max_tokens: 500
    });

    const miniConfidence = extractConfidence(miniResponse);

    // If still low, use standard for best accuracy
    if (miniConfidence < 0.9) {
      return await openai.chat.completions.create({
        model: "gpt-5",
        messages: [...],
        max_tokens: 500
      });
    }

    return miniResponse;
  }

  return nanoResponse;
}
```

---

## References

- [OpenAI Vision API Documentation](https://platform.openai.com/docs/guides/vision)
- [OpenAI Pricing](https://openai.com/api/pricing/)
- [GPT-5 Announcement (August 2025)](https://openai.com/)
- [GPT-5 API Pricing Guide](https://pricepertoken.com/pricing-page/model/openai-gpt-5)

**Last Updated**: October 19, 2025
