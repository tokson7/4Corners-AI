# 🚀 Quick Testing Guide - Enterprise Tier

## Quick Start (2 minutes)

### 1. Run Automated Tests
```bash
node scripts/test-enterprise.js
```

This will validate:
- ✅ Server running
- ✅ Tier configs correct
- ✅ Database schema updated
- ✅ AI generator configured
- ✅ Credit system working
- ✅ API endpoints ready
- ✅ UI components updated

### 2. Manual Test (5 minutes)

```bash
# Start server
npm run dev

# Open browser
open http://localhost:3000/generate
```

**Test Steps:**
1. Select **Enterprise** tier (Crown icon, purple)
2. Enter: `"Modern AI-powered healthcare platform"`
3. Click **Generate** (shows "5 credits")
4. Wait **15-25 seconds**
5. Verify results:
   - 20 color palettes visible
   - Multiple font pairings
   - No errors

### 3. Quick Validation Checks

**Browser Console:**
```javascript
// Check color count
Object.keys(data.designSystem.colors).length
// Expected: 20

// Check total colors
let total = 0;
Object.values(data.designSystem.colors).forEach(p => {
  total += Object.keys(p.shades || {}).length;
});
console.log('Total colors:', total);
// Expected: 300

// Check fonts
data.designSystem.typography.fontPairs.length
// Expected: 50
```

**Terminal Logs:**
```bash
🎨 [AI GENERATOR] Tier: ENTERPRISE
💳 [CREDITS] Deducting 5 credits
✅ [OPENAI] Generation complete
📊 [STATS] Colors: 300, Fonts: 50
```

---

## Common Issues & Fixes

### Issue: "Insufficient credits"
```bash
# Check user credits
npx prisma studio
# Navigate to users → check credits field
# Update if needed
```

### Issue: "Generation timeout"
```bash
# Increase timeout in API route
# app/api/generate/colors/route.ts
# Change: setTimeout(() => controller.abort(), 60000)
```

### Issue: "Invalid tier"
```bash
# Verify TIER_CONFIGS
node -e "console.log(require('./types/design-system').TIER_CONFIGS)"
```

---

## Test Results Checklist

### Basic Tier (1 credit, 3-5s)
- [ ] 8 palettes × 11 shades = 88 colors
- [ ] 10 font pairings
- [ ] Generation < 10 seconds

### Professional Tier (2 credits, 8-12s)
- [ ] 15 palettes × 15 shades = 225 colors
- [ ] 20 font pairings
- [ ] Generation < 20 seconds

### Enterprise Tier (5 credits, 15-25s)
- [ ] 20 palettes × 15 shades = 300 colors
- [ ] 50 font pairings
- [ ] 20 type sizes
- [ ] Generation < 30 seconds
- [ ] Advanced tokens included

---

## Performance Benchmarks

| Tier | Credits | Time | Colors | Fonts |
|------|---------|------|--------|-------|
| Basic | 1 | 3-5s | 88 | 10 |
| Professional | 2 | 8-12s | 225 | 20 |
| **Enterprise** | **5** | **15-25s** | **300** | **50** |

---

## Full Test Suite

For comprehensive testing, see:
- 📄 `ENTERPRISE_TIER_TESTING.md` - Detailed test procedures
- 🧪 `scripts/test-enterprise.js` - Automated validation

---

## Success Criteria

✅ All automated tests pass  
✅ Enterprise generates 300 colors  
✅ Enterprise generates 50 fonts  
✅ Credits deducted correctly  
✅ Tier badges display  
✅ No console errors  
✅ Performance within limits  

---

## Next Steps After Testing

1. **Production Deploy**
   ```bash
   git add .
   git commit -m "feat: Add enterprise tier with 300 colors + 50 fonts"
   git push origin main
   ```

2. **Monitor Usage**
   - Track enterprise tier adoption
   - Monitor generation times
   - Watch for errors

3. **User Feedback**
   - Collect feedback on enterprise features
   - Identify most-used tiers
   - Plan tier adjustments

---

**Quick Reference:**
- 📖 Full docs: `ENTERPRISE_TIER_TESTING.md`
- 🧪 Auto test: `node scripts/test-enterprise.js`
- 🌐 Test URL: `http://localhost:3000/generate`
- 💳 Default credits: 10 (new users)
