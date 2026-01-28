# 🧪 Testing Guide: Design System Management UI

## Quick Test Checklist

### **Test 1: Dashboard Homepage**
```bash
# Prerequisites: User signed in with saved design systems

1. Navigate to /dashboard
2. Verify:
   - ✅ Welcome message shows user's first name
   - ✅ Credits card shows correct count
   - ✅ Design systems card shows count
   - ✅ Recent systems display (max 5)
   - ✅ "View All" button appears
   - ✅ Cards show color preview, name, date
   - ✅ Hover effects work
   - ✅ Click card opens detail page
```

### **Test 2: Empty State**
```bash
# Prerequisites: New user with no systems

1. Navigate to /dashboard
2. Verify:
   - ✅ Empty state shows
   - ✅ Message: "No design systems yet"
   - ✅ "Create Your First Design System" button
   - ✅ Button navigates to /generate
```

### **Test 3: All Systems Page**
```bash
1. Click "View All" from dashboard
2. Navigate to /dashboard/designs
3. Verify:
   - ✅ All systems load
   - ✅ Grid layout responsive
   - ✅ System count displayed
   - ✅ "Create New" button in header
   - ✅ Search bar present
   - ✅ Filter dropdown present
```

### **Test 4: Search Functionality**
```bash
1. On /dashboard/designs
2. Type in search bar: "Test"
3. Verify:
   - ✅ Grid filters in real-time
   - ✅ Only matching systems show
   - ✅ Empty state if no matches
   - ✅ Message: "No matching systems"
4. Clear search
5. Verify:
   - ✅ All systems return
```

### **Test 5: Filter Functionality**
```bash
1. On /dashboard/designs
2. Select "Public Only" from filter
3. Verify:
   - ✅ Only public systems show
   - ✅ Count updates
4. Select "Private Only"
5. Verify:
   - ✅ Only private systems show
6. Select "All Systems"
7. Verify:
   - ✅ All systems return
```

### **Test 6: Delete from Grid**
```bash
1. Hover over a system card
2. Verify:
   - ✅ Delete button appears (red)
3. Click delete button
4. Verify:
   - ✅ Confirmation dialog: "Delete [name]? Cannot be undone"
5. Click Cancel
6. Verify:
   - ✅ Card remains
7. Click delete again, then Confirm
8. Verify:
   - ✅ Card removed from grid
   - ✅ Grid refreshes
   - ✅ Count decreases
```

### **Test 7: Single System View**
```bash
1. Click on a system card
2. Navigate to /dashboard/designs/[id]
3. Verify:
   - ✅ Back button works
   - ✅ System name displays
   - ✅ Description shows (if any)
   - ✅ Large color preview
   - ✅ Version and date show
   - ✅ Colors section with shades
   - ✅ Typography section with fonts
   - ✅ Export button (disabled)
   - ✅ Delete button
```

### **Test 8: Delete from Detail Page**
```bash
1. On system detail page
2. Click "Delete" button
3. Verify:
   - ✅ Confirmation dialog appears
4. Click Confirm
5. Verify:
   - ✅ Button shows "Deleting..." with spinner
   - ✅ Redirects to /dashboard/designs
   - ✅ System no longer in list
```

### **Test 9: 404 Handling**
```bash
1. Navigate to /dashboard/designs/fake-id-123
2. Verify:
   - ✅ Error page shows
   - ✅ Message: "Design System Not Found"
   - ✅ "Back to Design Systems" button
   - ✅ Button works
```

### **Test 10: Responsive Design**
```bash
# Mobile (375px)
1. Resize to mobile width
2. Verify:
   - ✅ Single column grid
   - ✅ Search stacks vertically
   - ✅ Buttons stack vertically
   - ✅ Text readable
   - ✅ Touch targets large enough

# Tablet (768px)
1. Resize to tablet width
2. Verify:
   - ✅ 2 column grid
   - ✅ Search and filter side-by-side
   - ✅ Proper spacing

# Desktop (1024px+)
1. Resize to desktop width
2. Verify:
   - ✅ 3 column grid
   - ✅ Optimal layout
   - ✅ Hover effects smooth
```

---

## API Testing

### **Test API Endpoints**

**1. Get All Systems:**
```bash
curl http://localhost:3000/api/design-systems \
  -H "Cookie: __session=YOUR_CLERK_SESSION"

# Expected: { success: true, systems: [...] }
```

**2. Get Recent Systems (limit 5):**
```bash
curl http://localhost:3000/api/design-systems?limit=5 \
  -H "Cookie: __session=YOUR_CLERK_SESSION"

# Expected: { success: true, systems: [max 5 items] }
```

**3. Get Single System:**
```bash
curl http://localhost:3000/api/design-systems/SYSTEM_ID \
  -H "Cookie: __session=YOUR_CLERK_SESSION"

# Expected: { success: true, system: {...} }
```

**4. Delete System:**
```bash
curl -X DELETE http://localhost:3000/api/design-systems/SYSTEM_ID \
  -H "Cookie: __session=YOUR_CLERK_SESSION"

# Expected: { success: true, message: "..." }
```

---

## Database Verification

### **Check Database Records:**
```sql
-- Check design systems exist
SELECT 
  id,
  name,
  user_id,
  is_public,
  created_at
FROM design_systems
ORDER BY created_at DESC
LIMIT 10;

-- Count systems per user
SELECT 
  user_id,
  COUNT(*) as system_count
FROM design_systems
GROUP BY user_id;

-- Check deleted systems are gone
SELECT * FROM design_systems WHERE id = 'DELETED_ID';
-- Expected: 0 rows
```

---

## Performance Testing

### **Load Time Tests:**
```bash
# 1. Dashboard load time
- Navigate to /dashboard
- Measure time to fully loaded
- Expected: < 2 seconds

# 2. All systems page load time
- Navigate to /dashboard/designs
- Measure time to fully loaded
- Expected: < 3 seconds (depends on count)

# 3. Detail page load time
- Navigate to /dashboard/designs/[id]
- Measure time to fully loaded
- Expected: < 2 seconds

# 4. Search performance
- Type in search bar
- Measure filtering speed
- Expected: Instant (< 100ms)
```

### **Animation Performance:**
```bash
# Check for smooth 60fps animations
1. Open Chrome DevTools → Performance
2. Record while navigating
3. Check for dropped frames
4. Verify smooth animations
```

---

## Error Handling Tests

### **Test 1: Unauthorized Access**
```bash
1. Sign out
2. Try to access /dashboard/designs
3. Expected: Redirect to sign-in
```

### **Test 2: Network Error**
```bash
1. Open DevTools → Network
2. Enable "Offline" mode
3. Try to load systems
4. Expected: Error message shown
```

### **Test 3: Invalid System ID**
```bash
1. Navigate to /dashboard/designs/invalid-id
2. Expected: 404 error page
3. Verify "Back" button works
```

### **Test 4: Delete Failure**
```bash
1. Mock API to return 500 error
2. Try to delete system
3. Expected: Alert with error message
4. System remains in grid
```

---

## Accessibility Tests

### **Keyboard Navigation:**
```bash
1. Tab through dashboard
2. Verify:
   - ✅ All buttons focusable
   - ✅ Focus indicators visible
   - ✅ Enter key activates buttons
   - ✅ Escape closes dialogs
```

### **Screen Reader:**
```bash
1. Enable screen reader
2. Navigate through dashboard
3. Verify:
   - ✅ Buttons have labels
   - ✅ Images have alt text
   - ✅ Links descriptive
   - ✅ Headings hierarchical
```

### **Color Contrast:**
```bash
1. Use contrast checker tool
2. Verify:
   - ✅ Text contrast ratio >= 4.5:1
   - ✅ Button contrast sufficient
   - ✅ Focus indicators visible
```

---

## Browser Compatibility

### **Test Browsers:**
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

### **Test Features:**
- ✅ Grid layout
- ✅ Flexbox
- ✅ Animations
- ✅ Hover effects
- ✅ Click handlers
- ✅ Form inputs

---

## Console Error Check

### **Zero Console Errors:**
```bash
1. Open Chrome DevTools → Console
2. Navigate through all pages
3. Perform all actions
4. Verify:
   - ✅ No errors
   - ✅ No warnings
   - ✅ Only expected logs
```

---

## Success Criteria

### **All Tests Must Pass:**
- [x] ✅ Dashboard displays correctly
- [x] ✅ Empty states work
- [x] ✅ All systems page loads
- [x] ✅ Search filters correctly
- [x] ✅ Filter works
- [x] ✅ Delete with confirmation works
- [x] ✅ Detail page displays correctly
- [x] ✅ Responsive on all devices
- [x] ✅ No console errors
- [x] ✅ Smooth animations
- [x] ✅ Accessible
- [x] ✅ Fast performance

---

## Manual Test Execution

### **Step-by-Step Test Run:**

```bash
# 1. Fresh Start
npm run dev

# 2. Sign In
- Go to http://localhost:3000
- Click "Sign In"
- Use test credentials

# 3. Save Systems (if none exist)
- Go to /generate
- Generate 3+ design systems
- Save each one

# 4. Test Dashboard
- Go to /dashboard
- Verify recent systems show
- Verify stats are correct
- Click "View All"

# 5. Test All Systems Page
- Verify all systems load
- Test search: type "system"
- Test filter: try Public/Private
- Hover over card, test delete
- Click a card to view details

# 6. Test Detail Page
- Verify all sections display
- Test back button
- Test delete button

# 7. Test Responsive
- Resize browser
- Test on mobile device
- Test on tablet

# 8. Check Console
- No errors
- No warnings

# 9. ✅ PASS or ❌ FAIL
```

---

## Automated Test Script (Future)

```typescript
// Example Playwright test
import { test, expect } from '@playwright/test';

test('Dashboard shows recent systems', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Check header
  await expect(page.getByText('Welcome back')).toBeVisible();
  
  // Check stats
  await expect(page.getByText('AI Credits')).toBeVisible();
  
  // Check systems section
  await expect(page.getByText('Your Design Systems')).toBeVisible();
  
  // Check cards exist
  const cards = page.locator('[data-testid="design-system-card"]');
  expect(await cards.count()).toBeGreaterThan(0);
});
```

---

## 🎉 Testing Complete!

Once all tests pass, your Design System Management UI is production-ready! 🚀
