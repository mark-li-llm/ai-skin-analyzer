# Product Requirements Document (PRD)

**Product Name**: Skin Analysis App (Sunscreen Advisor MVP)
**Version**: 0.1 (MVP)
**Last Updated**: 2025-10-19 (Revised)

## Problem Statement
Consumers struggle to identify their skin type and find suitable skincare products, leading to wasted money on ineffective products and potential skin issues from using wrong formulations. Current solutions (dermatologist visits, trial-and-error) are either expensive, time-consuming, or unreliable.

**MVP Focus**: This initial version focuses specifically on **sunscreen recommendations only**, as sunscreen is:
- The most essential daily skincare product for all skin types
- Critical for preventing premature aging and skin damage
- Often incorrectly chosen, leading to breakouts or inadequate protection
- A good starting point to validate the skin analysis technology

## User Persona
- **Primary User**: Skincare-conscious consumers (25-40) who purchase products online but lack professional skincare knowledge
- **Pain Points**:
  - Confusion about actual skin type (oily, combination, sensitive?)
  - Product ingredients are overwhelming
  - Different products work for friends but not for them
  - Expensive mistakes with wrong products
  - Skin reactions from inappropriate products
- **Goals**:
  - Find products that actually work for their skin
  - Save money by buying right products first time
  - Understand their skin better
  - Build an effective routine
  - See visible improvements

## Core Features (MVP)
1. **Image Upload**: User uploads a photo of their face
2. **AI Analysis**: Send image to OpenAI Vision API for skin analysis focused on sunscreen selection
3. **Three-Part Sunscreen Recommendation Display**:
   - **Skin Type Classification**: Identify skin type (oily, dry, combination, normal, sensitive) with confidence score
   - **Sunscreen Formulation Guidance**: Explain what type of sunscreen formulation works best for this skin type
   - **Specific Sunscreen Recommendations**: Provide 1-2 specific sunscreen products with brand names, SPF levels, and key benefits

## Success Metrics
- [ ] User successfully uploads image (technical success)
- [ ] OpenAI API returns valid JSON in expected format
- [ ] Confidence score provided with analysis (0.0-1.0)
- [ ] 1-2 specific sunscreen products recommended with brand names
- [ ] Analysis includes observable characteristics explanation
- [ ] User views complete results (engagement)

## Output Specification
The system provides a structured three-part sunscreen recommendation analysis:

1. **Part 1 - Skin Type**:
   - Classification into one of five types: oily, dry, combination, normal, or sensitive
   - Confidence score (0.0-1.0) indicating certainty of analysis
   - List of observed characteristics that led to this classification

2. **Part 2 - Sunscreen Type Guidance**:
   - Explanation of what sunscreen formulation type suits the identified skin type
   - Reasoning for why this formulation works best (e.g., "oil-free gel sunscreen for oily skin to prevent clogged pores")

3. **Part 3 - Specific Recommendations**:
   - 1-2 specific sunscreen products with:
     - Brand name
     - Product name
     - SPF level
     - Key benefit for the user's skin type

## Out of Scope (for MVP)
- Other skincare products (cleansers, moisturizers, serums, etc.)
- Medical advice
- Prescription products
- Real-time camera analysis
- User accounts/login
- Saving analysis history
- Multiple photo angles
- Detailed product database
- Price comparison
- Skin progress tracking
- Social sharing features
- Mobile app (web only for MVP)
