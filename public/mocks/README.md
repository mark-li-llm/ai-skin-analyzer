# Mock Data for Frontend Development

This directory contains mock JSON files to unblock frontend development while backend is being implemented.

## Files

- **analysis-success.json** - Successful skin analysis response (combination skin, 78% confidence)
- **analysis-error-file-too-large.json** - Error response for oversized files

## Usage

### Enable Mock Mode

```bash
# Create or edit .env.local
echo "NEXT_PUBLIC_USE_MOCKS=1" >> .env.local

# Start dev server
npm run dev
```

### Frontend Code Example

```typescript
const handleSubmit = async (file: File) => {
  if (process.env.NEXT_PUBLIC_USE_MOCKS === '1') {
    // Mock mode: fetch static JSON
    const data = await fetch('/mocks/analysis-success.json').then(r => r.json());
    setResult(data);
  } else {
    // Real mode: call API
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/analyze-skin', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    setResult(data);
  }
};
```

### Disable Mock Mode

```bash
# Remove from .env.local or set to 0
NEXT_PUBLIC_USE_MOCKS=0
```

## Notes

- Mock data matches the contract specification in `docs/CONTRACT-001-MVP.md`
- Types are defined in `types/analysis.ts`
- For testing error flows, manually switch to `analysis-error-file-too-large.json` in your code
