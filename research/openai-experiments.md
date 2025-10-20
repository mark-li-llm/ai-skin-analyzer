# OpenAI Vision Experiments

## Experiment Log

### Experiment 1 - Initial Prompt Test
**Date**: [TBD]
**Model**: gpt-4o
**Prompt**:
```
Analyze this skin image and tell me the skin type.
```

**Results**:
- Accuracy: TBD
- Response time: TBD
- Issues: TBD

**Learnings**:
-

**Next**:
-

---

### Experiment 2 - Structured JSON Output
**Date**: [TBD]
**Model**: gpt-4o
**Prompt**:
```
Analyze this facial skin and return JSON:
{
  "skinType": "oily|dry|combination|normal|sensitive",
  "concerns": ["acne", "dark_spots"],
  "confidence": 0.85
}
```

**Results**:
- Accuracy: TBD
- JSON parsing: TBD

**Learnings**:
-

---

### Experiment 3 - Confidence Scores
**Date**: [TBD]
**Focus**: Getting the model to express uncertainty

**Results**:
-

---

## Test Image Dataset

### Test Set 1: Diverse Skin Types
- [ ] Oily skin (5 images)
- [ ] Dry skin (5 images)
- [ ] Combination skin (5 images)
- [ ] Normal skin (5 images)
- [ ] Sensitive skin (5 images)

### Test Set 2: Lighting Conditions
- [ ] Natural daylight
- [ ] Indoor lighting
- [ ] Low light
- [ ] Flash photography

### Test Set 3: Edge Cases
- [ ] With makeup
- [ ] Partial face
- [ ] Poor quality/blurry
- [ ] Extreme close-up

---

## Accuracy Tracking

| Image ID | Actual Skin Type | AI Prediction | Confidence | Correct? |
|----------|------------------|---------------|------------|----------|
| IMG-001  | Oily             | Oily          | 0.89       | ✅        |
| IMG-002  | Combination      | Oily          | 0.72       | ❌        |
| IMG-003  | Dry              | Dry           | 0.91       | ✅        |

**Target Accuracy**: >80%
**Current Accuracy**: TBD

---

## Cost Analysis

### OpenAI Pricing (gpt-4o Vision)
- Input: ~$10/1M tokens
- Output: ~$30/1M tokens
- Average cost per image: TBD

### Budget Projections
- 100 analyses/day = $X/month
- 1000 analyses/day = $X/month

---

## Prompt Versions

### v1.0 - Basic
```typescript
const prompt = "Analyze this skin and identify skin type.";
```

### v2.0 - Structured (Current)
```typescript
const prompt = `
You are a professional skincare analyst. Analyze this facial photo.

Return ONLY valid JSON:
{
  "skinType": "oily" | "dry" | "combination" | "normal" | "sensitive",
  "confidence": 0.0-1.0,
  "concerns": [
    {
      "type": "acne" | "dark_spots" | "fine_lines" | "redness" | "dullness",
      "severity": "mild" | "moderate" | "significant",
      "zones": ["forehead", "cheeks", "chin"]
    }
  ],
  "explanation": "Brief explanation"
}
`;
```

### v3.0 - Enhanced (Future)
- Add few-shot examples
- Specify confidence thresholds
- Handle edge cases explicitly

---

## Open Questions
- [ ] How does image quality affect accuracy?
- [ ] Can it detect makeup vs bare skin?
- [ ] Does skin tone affect accuracy?
- [ ] How to handle multiple faces in image?
- [ ] Optimal image resolution?
