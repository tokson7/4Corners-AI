# 🧪 Testing Guide: Design System Save Feature

## Quick Test Flow

### **Test 1: Successful Save (Happy Path)**

**Prerequisites:**
- User is signed in
- User has at least 1 credit

**Steps:**
1. Navigate to `/generate`
2. Enter brand description: "Modern SaaS platform for productivity"
3. Click "Generate Design System"
4. Wait for AI to generate colors and typography
5. Scroll down to see "Love this design system?" section
6. Click "Save to Dashboard (1 Credit)"
7. Observe:
   - Button changes to "Saving..." with spinner
   - Button is disabled
   - Success message appears (green checkmark)
   - After 1.5 seconds, redirects to `/dashboard`
8. On dashboard, verify:
   - New design system appears in list
   - Credits decreased by 1

**Expected Result:** ✅ Design system saved, credits deducted, redirected to dashboard

---

### **Test 2: Insufficient Credits**

**Prerequisites:**
- User is signed in
- User has 0 credits

**Steps:**
1. Set user credits to 0 in database:
   ```sql
   UPDATE users SET credits = 0 WHERE clerk_id = 'user_xxx';
   ```
2. Navigate to `/generate`
3. Generate a design system
4. Click "Save to Dashboard (1 Credit)"
5. Observe:
   - Error message appears (red alert)
   - Message: "Insufficient credits. Please upgrade your plan..."
   - No redirect
   - Button becomes enabled again

**Expected Result:** ✅ Error shown, no save, no redirect

---

### **Test 3: Not Authenticated**

**Prerequisites:**
- User is signed out

**Steps:**
1. Sign out
2. Try to navigate to `/generate`
3. Observe:
   - Middleware redirects to `/sign-in`
   - Cannot access generator page

**Expected Result:** ✅ Redirected to sign-in page

---

### **Test 4: Network Error Handling**

**Prerequisites:**
- User is signed in
- User has credits

**Steps:**
1. Open browser DevTools
2. Go to Network tab
3. Enable "Offline" mode
4. Navigate to `/generate`
5. Generate a design system
6. Click "Save to Dashboard"
7. Observe:
   - Error message appears
   - Message: "Failed to save design system"
   - Button becomes enabled again
   - Can retry

**Expected Result:** ✅ Error handled gracefully, can retry

---

### **Test 5: Race Condition (Double Click)**

**Prerequisites:**
- User is signed in
- User has at least 2 credits

**Steps:**
1. Navigate to `/generate`
2. Generate a design system
3. Click "Save to Dashboard" button rapidly multiple times
4. Observe:
   - Button disabled after first click
   - Only one save request sent
   - Only one design system created
   - Only 1 credit deducted (not 2+)

**Expected Result:** ✅ No duplicate saves, no double deduction

---

## Database Verification

### **Check Design System Created:**
```sql
SELECT 
  id,
  name,
  description,
  user_id,
  created_at,
  version
FROM design_systems
WHERE user_id = 'your_user_id'
ORDER BY created_at DESC
LIMIT 1;
```

### **Check Credit Deducted:**
```sql
SELECT 
  id,
  email,
  credits,
  updated_at
FROM users
WHERE id = 'your_user_id';
```

### **Check Usage Metric Logged:**
```sql
SELECT 
  id,
  user_id,
  action,
  credits_used,
  success,
  design_system_id,
  created_at,
  metadata
FROM usage_metrics
WHERE user_id = 'your_user_id'
AND action = 'save_design_system'
ORDER BY created_at DESC
LIMIT 1;
```

---

## Console Logs to Watch

### **Frontend (Browser Console):**
```
💾 [Client] Saving design system to database...
✅ [Client] Design system saved: ds_xxx
💳 [Client] Credits remaining: 9
```

### **Backend (Server Console):**
```
✅ Design system saved: {
  id: 'ds_xxx',
  name: 'Modern SaaS platform for productivity',
  userId: 'user_xxx',
  creditsRemaining: 9
}
```

---

## Error Scenarios

### **401 Unauthorized:**
```json
{
  "error": "Unauthorized"
}
```
**Cause:** User not signed in or invalid session

---

### **402 Payment Required:**
```json
{
  "error": "Insufficient credits",
  "message": "You need at least 1 credit to save a design system"
}
```
**Cause:** User has 0 credits

---

### **400 Bad Request:**
```json
{
  "error": "Missing required fields",
  "details": "colors, typography, and components are required"
}
```
**Cause:** Invalid data sent to API

---

### **500 Server Error:**
```json
{
  "error": "Failed to save design system",
  "details": "Database connection error"
}
```
**Cause:** Database or server issue

---

## API Testing (cURL)

### **Save Design System:**
```bash
curl -X POST http://localhost:3000/api/design-systems \
  -H "Content-Type: application/json" \
  -H "Cookie: __session=YOUR_CLERK_SESSION" \
  -d '{
    "name": "Test Design System",
    "description": "Testing save functionality",
    "colors": {
      "primary": { "main": "#6366F1", "name": "Indigo" },
      "secondary": { "main": "#8B5CF6", "name": "Purple" },
      "accent": { "main": "#EC4899", "name": "Pink" }
    },
    "typography": {
      "fonts": {
        "heading": "Space Grotesk",
        "body": "Inter",
        "mono": "JetBrains Mono"
      },
      "personality": "modern"
    },
    "components": []
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "system": {
    "id": "ds_xxx",
    "name": "Test Design System",
    "description": "Testing save functionality",
    "createdAt": "2026-01-16T...",
    "version": "1.0.0"
  },
  "creditsRemaining": 9,
  "message": "Design system saved successfully"
}
```

---

## Performance Testing

### **Load Test:**
```bash
# Test 10 concurrent saves
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/design-systems \
    -H "Content-Type: application/json" \
    -d '{"name":"Test '$i'","colors":{...},"typography":{...},"components":[]}' &
done
wait
```

**Expected:** All requests handled correctly, no race conditions

---

## Checklist

Before marking as complete, verify:

- [ ] ✅ Save button appears after generation
- [ ] ✅ Button shows loading state when clicked
- [ ] ✅ Success message appears on successful save
- [ ] ✅ Redirects to dashboard after save
- [ ] ✅ Design system appears in dashboard
- [ ] ✅ Credits deducted correctly (atomic)
- [ ] ✅ Usage metric logged
- [ ] ✅ Error handling works (0 credits)
- [ ] ✅ Error handling works (network error)
- [ ] ✅ No duplicate saves on double-click
- [ ] ✅ No TypeScript errors
- [ ] ✅ No linter errors
- [ ] ✅ Console logs helpful
- [ ] ✅ UI responsive on mobile
- [ ] ✅ Accessible (keyboard navigation)

---

## Common Issues & Solutions

### **Issue: Button not appearing**
**Solution:** Check that both `state.palette` and `state.typography` are not null

### **Issue: "Insufficient credits" but user has credits**
**Solution:** Check database connection, verify user record exists

### **Issue: Redirect not working**
**Solution:** Check `useRouter` import from `next/navigation` (not `next/router`)

### **Issue: Credits not deducting**
**Solution:** Verify transaction is completing, check for errors in console

### **Issue: Design system not appearing in dashboard**
**Solution:** Check `userId` matches, verify database query in dashboard page

---

## Success Criteria

✅ **All tests pass**
✅ **No console errors**
✅ **Smooth user experience**
✅ **Data integrity maintained**
✅ **Credits tracked accurately**

**Your save feature is ready for production! 🎉**
