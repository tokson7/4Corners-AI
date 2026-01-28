# 🧪 Enterprise Tier Testing Guide

**Date:** January 21, 2026  
**Version:** 1.0.0  
**Feature:** Multi-Tier AI Generation System

---

## 📋 Test Suite Overview

This document provides comprehensive testing procedures for the enterprise tier system, including basic, professional, and enterprise generation capabilities.

---

## ✅ Test 1: Basic Enterprise Generation

### Objective
Verify that enterprise tier generates complete design systems with 300 colors and 50 font pairings.

### Prerequisites
- User account with at least 5 credits
- Development server running (`npm run dev`)
- Browser open to `/generate` page

### Test Steps

1. **Navigate to Generator**
   ```
   URL: http://localhost:3000/generate
   ```

2. **Select Enterprise Tier**
   - Click on the "Enterprise" card
   - Verify it shows:
     - Crown icon (👑)
     - "5 Credits" badge
     - "15-25 seconds" time estimate
     - Purple highlight when selected

3. **Enter Test Prompt**
   ```
   Brand Description: "Modern tech startup focused on AI and machine learning"
   Industry: Technology & Software
   ```

4. **Click Generate Button**
   - Button should show: "Generate Enterprise Design System (5 credits)"
   - Loading state should show: "Generating enterprise tier... (15-25 seconds)"

5. **Monitor Console Logs**
   Check terminal for these logs:
   ```bash
   🎨 [AI GENERATOR] Tier: ENTERPRISE
   💳 [CREDITS] Check for user [userId]
      Tier: ENTERPRISE
      Required: 5
      Available: [current credits]
      Result: ✅ PASS
   🤖 Step 4: Generating design system with AI...
      Tier: ENTERPRISE
      Expected palettes: 20
      Expected fonts: 50
   ✅ [OPENAI] Generation complete in [time]ms
   💳 [CREDITS] Deducted 5 credits successfully
   ```

6. **Verify Generation Output**

   **Colors Check:**
   ```javascript
   // Open browser console
   console.log('Color Palettes:', Object.keys(data.designSystem.colors).length)
   // Expected: 20 palettes
   
   // Check shades per palette
   Object.entries(data.designSystem.colors).forEach(([name, palette]) => {
     console.log(`${name}:`, Object.keys(palette.shades || {}).length, 'shades')
   })
   // Expected: 15 shades each (25, 50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 850, 900, 950, 975)
   ```

   **Typography Check:**
   ```javascript
   console.log('Font Pairings:', data.designSystem.typography.fontPairs.length)
   // Expected: 50 font pairings
   
   console.log('Type Sizes:', Object.keys(data.designSystem.typography.typeScale).length)
   // Expected: 20 type sizes (2xs through 10xl + display variants)
   ```

### Success Criteria
- ✅ Generation completes in 15-25 seconds
- ✅ Returns 20 color palettes
- ✅ Each palette has 15 shades (300 total colors)
- ✅ Returns 50 font pairings
- ✅ Returns 20 type scale sizes
- ✅ 5 credits deducted from user account
- ✅ No errors in console
- ✅ UI displays all generated data

### Expected Result
```json
{
  "success": true,
  "designSystem": {
    "colors": {
      "primary": { "shades": { "25": "#...", "50": "#...", ... "975": "#..." } },
      "secondary": { ... },
      // ... 18 more palettes
    },
    "typography": {
      "fontPairs": [ /* 50 pairings */ ],
      "typeScale": { "2xs": "0.625rem", ... "display-xl": "12rem" }
    }
  },
  "tier": "enterprise",
  "credits": {
    "used": 5,
    "remaining": 95
  }
}
```

---

## 🎨 Test 2: Variety & Uniqueness Test

### Objective
Verify that AI generates unique, varied outputs for the same prompt.

### Test Steps

1. **Generate 5 Times with Same Prompt**
   - Prompt: "Modern tech startup"
   - Tier: Enterprise
   - Click Generate 5 times

2. **Record Primary Colors**
   ```javascript
   // After each generation
   const primary = data.designSystem.colors.primary.main
   console.log('Generation', i, 'Primary:', primary)
   ```

3. **Record First Font Pairing**
   ```javascript
   const firstFont = data.designSystem.typography.fontPairs[0]
   console.log('Generation', i, 'Font:', firstFont.heading.family, '/', firstFont.body.family)
   ```

4. **Verify Uniqueness**
   - Check that all 5 primary colors are different
   - Check that font pairings vary across generations
   - Verify creative seed changes each time

### Success Criteria
- ✅ All 5 generations have different primary colors
- ✅ Font pairings show variety (at least 3 different combinations)
- ✅ Each generation has unique creative seed
- ✅ All 5 complete successfully
- ✅ Total credits deducted: 25 (5 × 5)

### Expected Console Output
```bash
Generation 1 - Primary: #2D5F7E (Ocean Teal)
Generation 2 - Primary: #B83C3C (Crimson Red)
Generation 3 - Primary: #7A4E9D (Royal Purple)
Generation 4 - Primary: #E17A3F (Sunset Orange)
Generation 5 - Primary: #1A5F4C (Forest Green)
```

---

## 💳 Test 3: Credit Validation

### Objective
Verify that insufficient credit scenarios are handled correctly.

### Test Steps

1. **Create Test User with 3 Credits**
   ```sql
   -- In database
   UPDATE users SET credits = 3 WHERE clerk_id = 'test_user_id';
   ```

2. **Attempt Enterprise Generation**
   - Select Enterprise tier (requires 5 credits)
   - Enter any prompt
   - Click Generate

3. **Verify Error Response**
   ```javascript
   // Expected response
   {
     "success": false,
     "error": "Insufficient credits",
     "details": "You need 5 credits but only have 3",
     "required": 5,
     "available": 3,
     "tier": "enterprise"
   }
   ```

4. **Check Credits Not Deducted**
   ```sql
   -- Credits should still be 3
   SELECT credits FROM users WHERE clerk_id = 'test_user_id';
   ```

5. **Test with Professional Tier (2 credits)**
   - Should succeed (3 - 2 = 1 remaining)

### Success Criteria
- ✅ Enterprise generation blocked (402 Payment Required)
- ✅ Clear error message displayed
- ✅ No credits deducted
- ✅ Professional generation succeeds
- ✅ Credits correctly deducted for professional (3 → 1)

### Expected UI Behavior
```
❌ Error Alert:
"Insufficient credits. You need 5 credits but only have 3."

[Upgrade] button shown
[Try Professional Tier] button shown
```

---

## 🔍 Test 4: Output Validation

### Objective
Verify that enterprise tier generates complete, valid data structures.

### Test Steps

1. **Generate Enterprise Design System**
   - Prompt: "Enterprise fintech application"
   - Tier: Enterprise

2. **Validate Color Palettes**
   ```javascript
   const colors = data.designSystem.colors
   const paletteNames = Object.keys(colors)
   
   console.log('Total Palettes:', paletteNames.length)
   // Expected: 20
   
   const expectedPalettes = [
     'primary', 'secondary', 'tertiary', 'quaternary', 'accent',
     'success', 'error', 'warning', 'info',
     'neutral', 'interactive', 'disabled',
     'backgroundLight', 'backgroundDark',
     'textPrimary', 'textSecondary',
     'border', 'highlight', 'overlay', 'gradient'
   ]
   
   expectedPalettes.forEach(name => {
     console.assert(colors[name], `Missing palette: ${name}`)
   })
   ```

3. **Validate Shades**
   ```javascript
   const expectedShades = ['25', '50', '100', '150', '200', '300', '400', '500', '600', '700', '800', '850', '900', '950', '975']
   
   Object.entries(colors).forEach(([name, palette]) => {
     const shades = Object.keys(palette.shades || {})
     console.log(`${name}: ${shades.length} shades`)
     
     expectedShades.forEach(shade => {
       console.assert(palette.shades[shade], `${name} missing shade ${shade}`)
     })
   })
   ```

4. **Validate Font Pairings**
   ```javascript
   const fontPairs = data.designSystem.typography.fontPairs
   console.log('Font Pairings:', fontPairs.length)
   // Expected: 50
   
   // Validate structure
   fontPairs.forEach((pair, i) => {
     console.assert(pair.id, `Pair ${i} missing id`)
     console.assert(pair.name, `Pair ${i} missing name`)
     console.assert(pair.heading?.family, `Pair ${i} missing heading font`)
     console.assert(pair.body?.family, `Pair ${i} missing body font`)
     console.assert(pair.category, `Pair ${i} missing category`)
   })
   
   // Validate categories
   const categories = {
     modern: 0,
     editorial: 0,
     corporate: 0,
     creative: 0,
     luxury: 0,
     monospace: 0
   }
   
   fontPairs.forEach(pair => {
     categories[pair.category]++
   })
   
   console.log('Font Categories:', categories)
   // Expected: ~8-10 per category
   ```

5. **Validate Type Scale**
   ```javascript
   const typeScale = data.designSystem.typography.typeScale
   const expectedSizes = [
     '2xs', 'xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl',
     '6xl', '7xl', '8xl', '9xl', '10xl',
     'display-sm', 'display-md', 'display-lg', 'display-xl'
   ]
   
   console.log('Type Sizes:', Object.keys(typeScale).length)
   expectedSizes.forEach(size => {
     console.assert(typeScale[size], `Missing size: ${size}`)
   })
   ```

6. **Validate Advanced Tokens**
   ```javascript
   // Check for advanced design tokens (if included)
   if (data.designSystem.spacing) {
     console.log('Spacing tokens:', Object.keys(data.designSystem.spacing).length)
     // Expected: 16
   }
   
   if (data.designSystem.borderRadius) {
     console.log('Border radius tokens:', Object.keys(data.designSystem.borderRadius).length)
     // Expected: 8
   }
   
   if (data.designSystem.shadows) {
     console.log('Shadow tokens:', Object.keys(data.designSystem.shadows).length)
     // Expected: 6
   }
   ```

7. **Validate JSON Structure**
   ```javascript
   try {
     JSON.stringify(data.designSystem)
     console.log('✅ Valid JSON structure')
   } catch (e) {
     console.error('❌ Invalid JSON:', e)
   }
   ```

### Success Criteria
- ✅ 20 color palettes present with correct names
- ✅ Each palette has exactly 15 shades
- ✅ All 300 colors are valid hex codes
- ✅ 50 font pairings with complete data
- ✅ Font pairings distributed across 6 categories
- ✅ 20 type scale sizes present
- ✅ All data is valid JSON
- ✅ No null/undefined values in critical fields

---

## ⚡ Test 5: Performance Testing

### Objective
Verify system performance meets expected benchmarks.

### Test Steps

1. **Measure Generation Time**
   ```javascript
   const start = Date.now()
   // Click Generate
   // Wait for completion
   const duration = Date.now() - start
   console.log('Generation time:', duration, 'ms')
   ```

2. **Test Concurrent Generations**
   - Open 3 browser tabs
   - Start enterprise generation in all 3 simultaneously
   - Monitor server CPU and memory

3. **Test UI Responsiveness**
   - During generation:
     - Try scrolling the page
     - Try clicking other UI elements
     - Verify loading indicators animate smoothly

4. **Monitor Network**
   - Open DevTools → Network tab
   - Check request/response sizes
   - Verify no failed requests

5. **Check Memory Usage**
   - Open DevTools → Performance
   - Record during generation
   - Check for memory leaks

### Success Criteria
- ✅ Generation completes in 15-25 seconds (enterprise)
- ✅ No timeouts (30 second limit)
- ✅ UI remains responsive during generation
- ✅ Progress indicators work smoothly
- ✅ No memory leaks detected
- ✅ Server handles 3 concurrent requests
- ✅ Response size < 500KB

### Expected Timings
| Tier | Expected Time | Max Time |
|------|--------------|----------|
| Basic | 3-5s | 10s |
| Professional | 8-12s | 20s |
| Enterprise | 15-25s | 30s |

---

## 💾 Test 6: Save & Export Functionality

### Objective
Verify enterprise design systems can be saved and exported correctly.

### Test Steps

1. **Generate Enterprise Design System**
   - Complete generation successfully
   - Verify all data displayed

2. **Save to Database**
   - Click "Save Design System" button
   - Enter name: "Enterprise Test System"
   - Add description
   - Click Save

3. **Verify Database Entry**
   ```sql
   SELECT 
     id, name, tier, 
     jsonb_array_length(colors::jsonb) as color_count,
     created_at
   FROM design_systems
   WHERE name = 'Enterprise Test System';
   ```

4. **Check Tier Badge in Dashboard**
   - Navigate to `/dashboard`
   - Find saved system
   - Verify Enterprise badge (Crown icon, purple)

5. **Export as JSON**
   - Open saved design system
   - Click "Export JSON"
   - Download file

6. **Validate JSON Export**
   ```javascript
   const exported = JSON.parse(downloadedFile)
   
   // Count colors
   let totalColors = 0
   Object.values(exported.colors).forEach(palette => {
     totalColors += Object.keys(palette.shades).length
   })
   console.log('Total colors in export:', totalColors)
   // Expected: 300
   
   // Count fonts
   console.log('Total fonts in export:', exported.typography.fontPairs.length)
   // Expected: 50
   ```

7. **Export as CSS**
   - Click "Export CSS"
   - Download CSS file

8. **Validate CSS Export**
   ```css
   /* Check CSS file contains */
   :root {
     /* 300 color variables */
     --color-primary-25: #...;
     --color-primary-50: #...;
     /* ... */
     --color-gradient-975: #...;
     
     /* Font variables */
     --font-heading-1: "Font Name", sans-serif;
     /* ... */
     --font-heading-50: "Font Name", sans-serif;
     
     /* Type scale */
     --text-2xs: 0.625rem;
     /* ... */
     --text-display-xl: 12rem;
   }
   ```

### Success Criteria
- ✅ Design system saves successfully
- ✅ Tier field saved correctly (enterprise)
- ✅ Enterprise badge displays on card
- ✅ JSON export contains all 300 colors
- ✅ JSON export contains all 50 fonts
- ✅ CSS export generates correctly
- ✅ CSS contains 300+ CSS variables
- ✅ File sizes reasonable (JSON < 500KB, CSS < 200KB)

---

## 🐛 Known Issues & Limitations

### Current Limitations
1. **AI Model Constraints**
   - GPT-3.5-turbo may occasionally generate < 50 fonts
   - Validation warns but doesn't fail
   - RGB/HSL calculated client-side

2. **Performance**
   - Enterprise generation takes 15-25 seconds
   - No progress percentage (only time estimate)
   - Single-threaded generation

3. **Export Formats**
   - Only JSON and CSS currently supported
   - No Figma/Sketch plugins yet
   - No TypeScript type definitions export

### Workarounds
- If < 50 fonts generated, regenerate
- For faster prototyping, use Professional tier
- For custom exports, use JSON and transform client-side

---

## 📊 Test Results Template

```markdown
## Test Execution Report

**Date:** ___________  
**Tester:** ___________  
**Environment:** Development / Staging / Production

### Test 1: Basic Enterprise Generation
- [ ] PASS / FAIL
- Notes: ___________

### Test 2: Variety Test  
- [ ] PASS / FAIL
- Notes: ___________

### Test 3: Credit Check
- [ ] PASS / FAIL
- Notes: ___________

### Test 4: Output Validation
- [ ] PASS / FAIL
- Notes: ___________

### Test 5: Performance
- [ ] PASS / FAIL
- Generation Time: ___ seconds
- Notes: ___________

### Test 6: Save & Export
- [ ] PASS / FAIL
- Notes: ___________

### Overall Result
- [ ] ALL TESTS PASSED ✅
- [ ] SOME TESTS FAILED ❌

### Issues Found
1. ___________
2. ___________

### Recommendations
1. ___________
2. ___________
```

---

## 🚀 Automated Testing Script

```javascript
// test-enterprise-tier.js
const { chromium } = require('playwright');

async function testEnterpriseTier() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Test 1: Basic Generation
  await page.goto('http://localhost:3000/generate');
  
  // Select Enterprise tier
  await page.click('[data-tier="enterprise"]');
  
  // Enter prompt
  await page.fill('[name="brandDescription"]', 'Modern tech startup');
  
  // Start timer
  const start = Date.now();
  
  // Click generate
  await page.click('button[type="submit"]');
  
  // Wait for completion
  await page.waitForSelector('[data-testid="results"]', { timeout: 30000 });
  
  const duration = Date.now() - start;
  console.log(`✅ Generation completed in ${duration}ms`);
  
  // Validate output
  const colorCount = await page.evaluate(() => {
    return Object.keys(window.__DESIGN_SYSTEM__.colors).length;
  });
  
  console.assert(colorCount === 20, `Expected 20 palettes, got ${colorCount}`);
  
  await browser.close();
}

testEnterpriseTier().catch(console.error);
```

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue:** Generation timeout  
**Solution:** Check OpenAI API key, increase timeout to 60s

**Issue:** Incomplete color palettes  
**Solution:** Verify prompt instructions in design-generator.ts

**Issue:** Credits not deducting  
**Solution:** Check user-service.ts deductCredits function

### Debug Commands

```bash
# Check user credits
npx prisma studio
# Navigate to users table

# View generated systems
SELECT name, tier, created_at FROM design_systems ORDER BY created_at DESC LIMIT 10;

# Check API logs
# Terminal running npm run dev

# Test API directly
curl -X POST http://localhost:3000/api/generate/colors \
  -H "Content-Type: application/json" \
  -d '{"brandDescription": "Test", "tier": "enterprise"}'
```

---

## ✅ Testing Checklist Summary

- [ ] Test 1: Basic Enterprise Generation
- [ ] Test 2: Variety & Uniqueness
- [ ] Test 3: Credit Validation
- [ ] Test 4: Output Validation
- [ ] Test 5: Performance Testing
- [ ] Test 6: Save & Export

**All tests must pass before production deployment.**

---

**Last Updated:** January 21, 2026  
**Next Review:** After each major release
