# Product Mapping Strategy

## How to Match Skin → Products

### Skin Type Mapping

#### Oily Skin
**Cleansers**: Foaming, gel-based, salicylic acid
**Moisturizers**: Lightweight, oil-free, gel-based
**Treatments**: Niacinamide, BHA, retinol
**SPF**: Oil-free, mattifying

**Example Products**:
- CeraVe Foaming Cleanser
- The Ordinary Niacinamide 10% + Zinc 1%
- Neutrogena Hydro Boost Water Gel

---

#### Dry Skin
**Cleansers**: Creamy, hydrating, no sulfates
**Moisturizers**: Rich creams, occlusives
**Treatments**: Hyaluronic acid, ceramides, oils
**SPF**: Moisturizing formulas

**Example Products**:
- CeraVe Hydrating Cleanser
- La Roche-Posay Toleriane Double Repair
- The Ordinary Natural Moisturizing Factors

---

#### Combination Skin
**Cleansers**: Gentle foaming or balancing
**Moisturizers**: Lightweight but hydrating
**Treatments**: Multi-use (niacinamide, gentle acids)
**SPF**: Balanced formulas

---

### Concern-Based Mapping

#### Acne
**Key Ingredients**: Salicylic acid, benzoyl peroxide, niacinamide, retinol
**Product Types**: Spot treatments, exfoliants, gentle cleansers

#### Dark Spots
**Key Ingredients**: Vitamin C, niacinamide, alpha arbutin, retinol, AHAs
**Product Types**: Serums, exfoliants, brightening treatments

#### Aging/Fine Lines
**Key Ingredients**: Retinol, peptides, vitamin C, AHAs
**Product Types**: Serums, night creams, eye creams

#### Sensitivity/Redness
**Key Ingredients**: Centella, niacinamide, ceramides, azelaic acid
**Product Types**: Soothing serums, barrier repair creams

---

## Product Database Structure

### Categories
1. **Cleanser** (morning/night)
2. **Exfoliant** (AHA/BHA)
3. **Toner** (optional)
4. **Serum/Treatment** (active ingredients)
5. **Moisturizer** (day/night)
6. **SPF** (daytime essential)
7. **Spot Treatment** (as needed)
8. **Mask** (weekly)

### Essential Routine (MVP Focus)
1. Cleanser
2. Treatment/Serum
3. Moisturizer
4. SPF

---

## Recommendation Algorithm (v1)

```
1. Filter products by skin type compatibility
2. Weight products by concern relevance
   - Primary concern: 3x weight
   - Secondary concerns: 1x weight
3. Sort by:
   - Concern match score
   - User rating
   - Price (within budget filter)
4. Select top 3 per category
```

---

## Product Data Sources

### Manual Curation (MVP)
- Research popular products per category
- 5-10 products per skin type/concern combo
- Total: ~50-100 products for MVP

### Future APIs/Integrations
- [ ] SkinCarisma API (ingredient database)
- [ ] Amazon Affiliate API
- [ ] Sephora/Ulta product feeds
- [ ] Reddit r/SkincareAddiction recommendations scraper

---

## Ingredient Reference

### Hydrating
- Hyaluronic Acid
- Glycerin
- Ceramides

### Exfoliating
- AHAs (glycolic, lactic acid)
- BHAs (salicylic acid)
- Retinol

### Brightening
- Vitamin C
- Niacinamide
- Alpha Arbutin

### Anti-Aging
- Retinol
- Peptides
- Antioxidants

### Soothing
- Centella Asiatica
- Aloe Vera
- Green Tea
