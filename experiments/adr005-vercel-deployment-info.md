# ADR-005 Vercel Deployment Information

**Deployment Date**: 2025-10-25
**Project**: agent-b1
**Related ADR**: docs/decisions/005-image-processing-library.md

---

## 🚀 Deployment Details

### Project Information
- **Project Name**: agent-b1
- **Scope**: marks-projects-d8edd726
- **Vercel CLI Version**: 48.6.0

### URLs

**Production URL**:
```
https://agent-b1-kuqb056oo-marks-projects-d8edd726.vercel.app
```

**Inspect Dashboard**:
```
https://vercel.com/marks-projects-d8edd726/agent-b1/44vbhsU2nnkcd3fUGjnV4dLQAr15
```

**Project Settings**:
```
https://vercel.com/marks-projects-d8edd726/agent-b1/settings
```

---

## 📋 Test Endpoints

### Sharp Test API
```bash
curl -X POST https://agent-b1-kuqb056oo-marks-projects-d8edd726.vercel.app/api/test-sharp \
  -F "image=@experiments/test-images/test1.jpg"
```

### Health Check
```bash
curl https://agent-b1-kuqb056oo-marks-projects-d8edd726.vercel.app/api/test-sharp
```

---

## 🔧 Detected Configuration

**Framework**: Next.js
- **Build Command**: `next build`
- **Development Command**: `next dev --port $PORT`
- **Install Command**: `yarn install`, `pnpm install`, `npm install`, or `bun install`
- **Output Directory**: Next.js default

**Settings Modified**: No (used auto-detected settings)

---

## 📝 Next Steps

1. [ ] Test sharp API endpoint on Vercel
2. [ ] Verify Linux x64 environment compatibility
3. [ ] Record performance metrics
4. [ ] Update ADR-005 status based on results

---

## 🔗 Quick Links

- **Live Site**: https://agent-b1-kuqb056oo-marks-projects-d8edd726.vercel.app
- **Dashboard**: https://vercel.com/marks-projects-d8edd726/agent-b1
- **Deployment Logs**: Check Inspect URL above