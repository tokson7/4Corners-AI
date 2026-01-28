# 🔐 Authentication Fix Guide

## Problem: 401 Unauthorized Error

You're getting a 401 error because the API requires authentication, but you're not signed in.

---

## ✅ Solution 1: Sign In (Recommended)

### Step 1: Check Your Sign-In Status
1. Open: `http://localhost:3010`
2. Look at the top-right corner of the navbar
3. Do you see:
   - **"Sign In" button** → You're NOT signed in
   - **Your profile picture/name** → You ARE signed in

### Step 2: Sign In with Clerk
If you see "Sign In":
1. Click the "Sign In" button
2. Sign up or sign in with:
   - Email
   - Google
   - GitHub
   - Or any other provider
3. After signing in, you'll be redirected back

### Step 3: Try Generating Again
1. Go to: `http://localhost:3010/generate`
2. Select your tier (Basic, Professional, or Enterprise)
3. Enter brand description
4. Click "Generate"
5. Should work now! ✅

---

## 🧪 Solution 2: Bypass Auth for Testing (Temporary)

**Use this ONLY for testing the generation functionality.**

### File: `app/api/generate/colors/route.ts`

**Find lines 130-148 (the authentication block):**

```typescript
let user
try {
  user = await requireUser()
  console.log('✅ User authenticated:', user.id)
  console.log(`   Current credits: ${user.credits}`)
} catch (authError) {
  console.error('❌ Authentication failed:', authError)
  return NextResponse.json(
    {
      success: false,
      error: 'Authentication required',
      details: 'Please sign in to generate design systems',
    },
    { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}
```

**Replace with this mock user:**

```typescript
// TEMPORARY: Mock user for testing (REMOVE BEFORE PRODUCTION!)
const user = {
  id: 'test_user_id',
  clerkId: 'test_clerk_id',
  email: 'test@example.com',
  credits: 100, // Give yourself 100 credits for testing
  firstName: 'Test',
  lastName: 'User',
  plan: 'free',
  createdAt: new Date(),
  updatedAt: new Date(),
}
console.log('⚠️  [TEST MODE] Using mock user with 100 credits')

// let user
// try {
//   user = await requireUser()
//   console.log('✅ User authenticated:', user.id)
//   console.log(`   Current credits: ${user.credits}`)
// } catch (authError) {
//   console.error('❌ Authentication failed:', authError)
//   return NextResponse.json(
//     {
//       success: false,
//       error: 'Authentication required',
//       details: 'Please sign in to generate design systems',
//     },
//     { 
//       status: 401,
//       headers: { 'Content-Type': 'application/json' }
//     }
//   )
// }
```

**Also comment out credit deduction (lines ~192-205):**

```typescript
// Step 4.5: Deduct credits
console.log('💳 Step 4.5: Deducting credits...')
// try {
//   await deductCredits(user.id, tierConfig.credits)
//   const remainingCredits = user.credits - tierConfig.credits
//   console.log(`✅ Credits deducted: ${tierConfig.credits}`)
//   console.log(`   Remaining credits: ${remainingCredits}`)
// } catch (creditError) {
//   console.error('❌ Failed to deduct credits:', creditError)
//   // Log but don't fail - generation already succeeded
//   console.warn('⚠️  Generation succeeded but credit deduction failed')
// }
console.log('⚠️  [TEST MODE] Skipping credit deduction')
```

**Save the file and the server will auto-reload.**

Now you can test without signing in!

---

## 🔄 After Testing - Re-enable Auth

**IMPORTANT:** Once you've verified generation works, uncomment the authentication:

1. Remove the mock user object
2. Uncomment the `try/catch` block for `requireUser()`
3. Uncomment the credit deduction code
4. Save the file

---

## 🧪 Quick Test Script

Run this to test if you're authenticated:

```bash
curl -X POST http://localhost:3010/api/generate/colors \
  -H "Content-Type: application/json" \
  -d '{"brandDescription": "Test brand", "tier": "basic"}' \
  -v
```

**If you see:**
- `401 Unauthorized` → Not authenticated
- `200 OK` → Authenticated and working!
- `402 Payment Required` → Authenticated but out of credits

---

## 🎯 Recommended Approach

1. **Sign in properly** (Solution 1)
   - This tests the full flow including auth
   - You get real credits to work with
   - Everything works as in production

2. **Use mock user only if:**
   - Clerk setup is broken
   - You need to test generation logic only
   - You're debugging AI prompts

---

## 📝 Default User Credits

New users get **10 credits** when they sign up:
- Basic tier: 1 credit (10 generations)
- Professional tier: 2 credits (5 generations)
- Enterprise tier: 5 credits (2 generations)

---

## 🆘 Still Getting 401?

### Check Middleware:

**File:** `middleware.ts`

Make sure `/api/generate/colors` is NOT in `publicRoutes`:

```typescript
const publicRoutes = [
  '/',
  '/showcase',
  '/showcase/(.*)',
  '/api/showcase/(.*)',
  // '/api/generate/colors', // ❌ This should NOT be here
]
```

The route should be protected and require authentication.

---

## ✅ Verification Checklist

After fixing:
- [ ] Server running on port 3010
- [ ] Can access http://localhost:3010
- [ ] Can see Sign In button or profile
- [ ] After signing in, profile shows in navbar
- [ ] Can navigate to /generate page
- [ ] Can select tier
- [ ] Can click Generate without 401 error
- [ ] Generation completes successfully
- [ ] Credits deducted correctly

---

**Choose your approach:**
- ✅ **Production-like:** Sign in with Clerk (Solution 1)
- 🧪 **Quick test:** Use mock user (Solution 2)

Good luck! 🚀
