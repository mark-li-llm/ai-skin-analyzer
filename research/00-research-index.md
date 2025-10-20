# Research Index

**Last Updated**: 2025-10-19
**Purpose**: Central tracking for all research activities and decisions needed

## Research Areas

### ✅ Completed Research

- just model-comparison was completed others are scaffolding

### 🔄 In Progress

- None yet

### 📋 Pending Research (All need to be done)

- [ ] Competitor analysis (`competitor-analysis.md` - scaffolding exists)
- [ ] Product mapping (`product-mapping.md` - scaffolding exists)
- [ ] Skin types classification (`skin-types.md` - scaffolding exists)
- [ ] OpenAI experiments (`openai-experiments.md` - scaffolding exists)
- [ ] OpenAI model comparison (`model-comparison.md` - needs creation)
- [ ] API integration decisions (`api-decisions.md` - needs creation)
- [ ] Cost analysis (`cost-analysis.md` - needs creation)
- [ ] Image preprocessing requirements
- [ ] Optimal prompt engineering
- [ ] Error handling strategies
- [ ] Rate limiting approach
- [ ] Sunscreen recommendation logic

## Key Questions to Answer

### Immediate (for MVP)
1. **Which OpenAI model?** → `model-comparison.md`
   - gpt-4o vs gpt-4o-mini
   - Accuracy vs cost tradeoff
   - Speed requirements

2. **Image requirements?** → `api-decisions.md`
   - Max file size
   - Supported formats
   - Resolution needs
   - Preprocessing required?

3. **Cost per analysis?** → `cost-analysis.md`
   - Per-request cost
   - Monthly projections
   - Free tier limits

### Future Considerations
- Database choice (when needed)
- User authentication method
- Product recommendation engine
- Multi-image analysis

## Decisions Needed → ADRs

| Research | Decision Needed | ADR | Status |
|----------|----------------|-----|--------|
| model-comparison.md | OpenAI model choice | ADR-004 | Not created |
| api-decisions.md | Image size/format limits | ADR-005 | Not created |
| cost-analysis.md | Pricing model | ADR-006 | Not created |

## Research → Implementation Flow

```
1. Research documented in research/
2. Decision made → Create ADR
3. Update technical spec
4. Implement based on spec
```

## Quick Links
- [OpenAI Vision Pricing](https://openai.com/api/pricing/)
- [Vision API Docs](https://platform.openai.com/docs/guides/vision)
- [Image Best Practices](https://platform.openai.com/docs/guides/vision/uploading-base-64-encoded-images)