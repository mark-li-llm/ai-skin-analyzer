# Admin Dashboard UI Mockup

## Visual Layout Preview

```
┌─────────────────────────────────────────────────────────────────┐
│  Admin Dashboard                            [Logout Button]      │
│  Last updated: 2 minutes ago                                     │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 📊           │  │ 👥           │  │ 🖼️           │  │ 🔄           │
│ 1,234        │  │ 89           │  │ 856          │  │ 378 (31%)    │
│ Total        │  │ Unique       │  │ Unique       │  │ Duplicate    │
│ Analyses     │  │ Users        │  │ Images       │  │ Images       │
│              │  │              │  │              │  │              │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘

─────────────────────────────────────────────────────────────────────

User Statistics
┌───────────────────────────────────────────────────────────────────┐
│ User              Type        Analyses    Last Used               │
├───────────────────────────────────────────────────────────────────┤
│ john_doe          [Named]         45     Nov 7, 2025, 2:30 PM    │
│ anon-A1B2C3       [Anon]          23     Nov 7, 2025, 1:15 PM    │
│ sarah             [Named]         12     Nov 6, 2025, 5:45 PM    │
└───────────────────────────────────────────────────────────────────┘

─────────────────────────────────────────────────────────────────────

Recent Logs
┌─────────────────────────────────────────────────────────────────────┐
│ Time              User        Type    Confidence  Duration  Status  │
├─────────────────────────────────────────────────────────────────────┤
│ Nov 7, 2:30 PM   john_doe    Oily    [███ 92%]   1234ms   Success │
│ Nov 7, 1:15 PM   anon-123    Dry     [██░ 78%]   1567ms   Success │
│ Nov 7, 12:45 PM  sarah       Normal  [█░░ 45%]   2341ms   Success │
│                               ▼ Show JSON                           │
└─────────────────────────────────────────────────────────────────────┘
```

## Design Changes

### 1. Summary Stats Cards
**Current:** Plain text list
```html
<p><strong>Total Analyses:</strong> 1,234</p>
```

**New:** Card grid with visual hierarchy
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-3xl font-bold text-gray-900">1,234</p>
        <p className="text-sm text-gray-600 mt-1">Total Analyses</p>
      </div>
      <div className="text-4xl">📊</div>
    </div>
  </div>
  <!-- More cards... -->
</div>
```

### 2. Modern Tables
**Current:** Heavy borders
```tsx
<table className="border-collapse border border-gray-300">
  <tr className="bg-gray-100">
    <th className="border border-gray-300 px-4 py-2">...</th>
```

**New:** Clean, modern design
```tsx
<div className="bg-white rounded-lg shadow overflow-hidden">
  <table className="w-full">
    <thead className="bg-gray-50">
      <tr className="border-b border-gray-200">
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          User
        </th>
```

### 3. Status Badges
**Current:** Plain text "success"
```tsx
<td className="border border-gray-300 px-4 py-2">{log.status}</td>
```

**New:** Colored badges
```tsx
<td className="px-6 py-4">
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
    ✓ Success
  </span>
</td>
```

### 4. Confidence Visual
**Current:** Plain percentage "92%"
```tsx
{Math.round(log.analysisResult.confidence * 100)}%
```

**New:** Progress bar with color coding
```tsx
<div className="flex items-center gap-2">
  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
    <div
      className="h-full bg-green-500"
      style={{width: '92%'}}
    />
  </div>
  <span className="text-sm font-medium">92%</span>
</div>
```

### 5. User Type Badges
**Current:** Plain text "Anonymous" / "Named"
```tsx
{stat.user.startsWith('anon-') ? 'Anonymous' : 'Named'}
```

**New:** Icon badges
```tsx
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
  <svg>👤</svg> Named
</span>

<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
  <svg>🎭</svg> Anon
</span>
```

## Color Palette Suggestion

```
Primary:   Blue (#3B82F6)
Success:   Green (#10B981)
Warning:   Yellow (#F59E0B)
Error:     Red (#EF4444)
Gray:      Slate (#64748B)

Backgrounds:
- Cards: White (#FFFFFF)
- Page: Light Gray (#F9FAFB)
- Table Header: Gray 50 (#F9FAFB)
```

## Key Visual Improvements

1. ✨ **Depth**: Shadows and rounded corners
2. 🎨 **Color**: Meaningful color coding (green=good, red=error)
3. 📏 **Spacing**: More white space, better breathing room
4. 🎯 **Hierarchy**: Large numbers, small labels
5. 🔄 **Consistency**: Same design language throughout

---

**File location:** This mockup file will be deleted after you approve the design.
