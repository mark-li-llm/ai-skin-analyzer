# Database Schema

**Version**: 0.1
**Last Updated**: 2025-10-19
**Status**: NOT NEEDED FOR MVP

## MVP Decision: No Database

Per the PRD and Technical Spec, the MVP is **completely stateless**:
- ❌ No user accounts/authentication
- ❌ No analysis history
- ❌ No product catalog
- ❌ No saved recommendations
- ❌ No caching

Every request is independent: Upload → Analyze → Display → Done.

## Why No Database for MVP?

1. **Simplicity**: Focus on core value (skin analysis works)
2. **Speed**: Ship faster without database setup/migrations
3. **Cost**: No database hosting costs
4. **Validation**: Prove concept before investing in persistence

## Future Database Requirements (Post-MVP)

When we do add a database (v0.2+), we'll need:

### Core Entities
1. **Users** - Account management
2. **Analyses** - Skin analysis history
3. **Products** - Skincare catalog
4. **Recommendations** - Personalized suggestions

### Proposed Schema (Future)
```sql
-- Users (when we add accounts)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP
);

-- Analysis History (when we add persistence)
CREATE TABLE analyses (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  image_url TEXT,
  skin_type VARCHAR(20),
  confidence DECIMAL(3,2),
  analysis_data JSONB,
  created_at TIMESTAMP
);

-- Products (when we add catalog)
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  brand VARCHAR(100),
  category VARCHAR(50),
  skin_types TEXT[],
  ingredients JSONB,
  price DECIMAL(10,2),
  purchase_url TEXT
);
```

### Database Options (When Needed)
- **PostgreSQL**: If we need relational data, complex queries
- **MongoDB**: If we prioritize flexible schema, rapid iteration
- **SQLite**: If we want embedded, serverless simplicity

## Current Data Flow (MVP)

```
User uploads image
    ↓
API validates file
    ↓
Send to OpenAI Vision API
    ↓
Return JSON response
    ↓
Display results
    ↓
[Data discarded - no persistence]
```
