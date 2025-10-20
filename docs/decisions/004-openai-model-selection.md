# ADR-004: OpenAI Vision Model Selection

**Status**: Accepted
**Date**: 2025-10-19
**Deciders**: Product & Engineering Team
**Technical Story**: OpenAI Vision API integration for skin type analysis

## Context and Problem Statement

The MVP requires an AI vision model to analyze user-uploaded facial photos and classify skin types (oily/dry/combination/normal). We need to select an OpenAI vision model that balances accuracy, cost, and performance for our initial launch.

## Decision Drivers

* **Cost efficiency** - MVP has limited budget, need to optimize per-request costs
* **Accuracy** - Must reliably classify skin types with reasonable confidence
* **Speed** - Response time should be fast for good user experience
* **Scalability** - Model should handle growth from 100 to 1000+ requests/day
* **Context window** - Sufficient token capacity for images + prompts
* **Future-proofing** - Ability to upgrade to better models if needed

## Considered Options

### 1. **gpt-5** (Standard/Flagship)
- **Pricing**: $1.25 per 1M input tokens, $10 per 1M output tokens
- **Cost per request**: ~$0.00621 (with 1024×1024 image)
- **Monthly cost**: $186 at 1000 requests/day
- **Pros**:
  - Highest accuracy and performance
  - State-of-the-art vision understanding
  - Best for complex analysis tasks
  - 272K context window
  - 90% cache discount available
- **Cons**:
  - Most expensive option
  - Overkill for simple skin type classification
  - 25x more expensive than nano

### 2. **gpt-5-mini** (Balanced)
- **Pricing**: $0.25 per 1M input tokens, $2 per 1M output tokens
- **Cost per request**: ~$0.00124
- **Monthly cost**: $37.20 at 1000 requests/day
- **Pros**:
  - Good balance of cost and accuracy
  - 80% cheaper than standard
  - Strong vision capabilities
  - 272K context window
  - 90% cache discount available
- **Cons**:
  - 5x more expensive than nano
  - May be more than needed for MVP

### 3. **gpt-5-nano** (Most Cost-Effective)
- **Pricing**: $0.05 per 1M input tokens, $0.40 per 1M output tokens
- **Cost per request**: ~$0.00025
- **Monthly cost**: $7.50 at 1000 requests/day
- **Pros**:
  - Extremely cost-effective (96% cheaper than standard)
  - Fast response times
  - Same 272K context window as larger models
  - 90% cache discount available
  - Easy to upgrade later if accuracy insufficient
  - Perfect for MVP validation and testing
- **Cons**:
  - Lower accuracy than mini/standard
  - May require more prompt engineering
  - Untested for our specific use case

## Decision Outcome

Chosen option: **gpt-5-nano**, because:

1. **MVP-first approach**: Start with the most cost-effective option and validate the product concept
2. **Low financial risk**: $7.50/month is negligible for testing with real users
3. **Easy upgrade path**: Can switch to gpt-5-mini or gpt-5 if accuracy is insufficient
4. **Same context window**: 272K tokens means no limitations vs larger models
5. **Fast iteration**: Lower costs enable more experimentation during development
6. **Validation strategy**: We can test accuracy first, then decide if upgrade needed

### Consequences

* **Good**: Minimal API costs during MVP phase (~$7.50/month)
* **Good**: Fast response times improve user experience
* **Good**: Low barrier to experimentation and testing
* **Good**: Can leverage 90% cache discount for cost optimization
* **Bad**: May need to upgrade if accuracy is below 90% (accepted trade-off)
* **Bad**: Requires accuracy testing to validate suitability
* **Neutral**: Easy to switch models later via configuration change

## Validation

We will validate this decision through:

1. **Accuracy testing**: Test with 20-30 diverse skin type images, measure classification accuracy
2. **Consistency testing**: Same image multiple times, check for consistent results
3. **User feedback**: Collect subjective feedback on recommendation quality
4. **Success threshold**: If accuracy ≥ 90%, continue with nano; if < 90%, upgrade to mini

**Timeline**: Complete validation within 2 weeks of API integration

## Revisit Conditions

This decision should be revisited if:

* Accuracy testing shows < 90% correct skin type classification
* User feedback indicates poor recommendation quality
* We receive funding and budget constraints are removed
* OpenAI releases new, more cost-effective models
* Traffic exceeds 10,000 requests/day (may benefit from hybrid approach)
* We pivot to medical-grade analysis requiring highest accuracy

## Links

* Research: `/research/model-comparison.md` - Detailed model comparison and cost analysis
* Technical Spec: `/docs/02-technical-spec.md` - Implementation details
* OpenAI Pricing: https://openai.com/api/pricing/

## Notes

**Image Processing Decision**: Images will be resized to 1024×1024px maximum (maintaining aspect ratio) before sending to API. This provides sufficient resolution for skin analysis while keeping token costs predictable at ~765 tokens per image.

**Cache Optimization**: We plan to use consistent system prompts to maximize the 90% cache discount, which can reduce costs by ~17% over time.

**Hybrid Approach Consideration**: If needed, we can implement a multi-tier strategy where nano handles most requests, escalating to mini/standard only for low-confidence results.
