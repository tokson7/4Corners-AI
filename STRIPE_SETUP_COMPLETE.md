# Stripe Payment System - Complete Setup Guide

## ✅ Phase 1: Environment Setup (COMPLETED)

### 1.1 Environment Variables Added
- ✅ `.env.local` updated with Stripe test keys
- ✅ `.env` updated with Stripe production keys placeholders

### 1.2 Packages Installed
```bash
npm install stripe @stripe/stripe-js @stripe/react-stripe-js
```
**Status:** ✅ Installed successfully

## ✅ Phase 2: Core Files Created (COMPLETED)

### 2.1 Stripe Configuration
**File:** `/lib/stripe.ts`
- ✅ Stripe client instance configured
- ✅ API version: 2024-12-18.acacia
- ✅ Plan configuration with credits and features

### 2.2 Checkout API Route
**File:** `/app/api/stripe/checkout/route.ts` (ALREADY EXISTS)
- ✅ Creates checkout sessions for subscriptions
- ✅ Handles customer creation
- ✅ Integrates with Clerk authentication

### 2.3 Webhook Handler
**File:** `/app/api/webhooks/stripe/route.ts` (NEWLY CREATED)
- ✅ Handles subscription lifecycle events
- ✅ Updates user plan and credits
- ✅ Manages payment success/failure

### 2.4 Pricing Page
**File:** `/app/pricing/page.tsx` (ALREADY EXISTS)
- ✅ Beautiful pricing cards
- ✅ Feature comparison table
- ✅ FAQs section

## 📋 Phase 3: Stripe Dashboard Setup (ACTION REQUIRED)

### Step 1: Get Your Stripe Account
1. Go to [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Create account or sign in
3. Stay in **TEST MODE** (toggle in top right)

### Step 2: Get API Keys
1. Go to **Developers → API keys**
2. Copy your keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### Step 3: Update `.env.local`
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY_HERE
```

### Step 4: Create Products & Prices
1. Go to **Products → Add Product**

#### Basic Plan ($9/month)
- **Name:** Basic Plan
- **Description:** 50 generations per month with advanced features
- **Pricing:**
  - Recurring: Monthly
  - Price: $9.00 USD
- **Click Save** → Copy the **Price ID** (starts with `price_`)
- Update `.env.local`: `STRIPE_PRICE_ID_BASIC=price_YOUR_PRICE_ID`

#### Professional Plan ($29/month)
- **Name:** Professional Plan
- **Description:** 200 generations per month with premium features
- **Pricing:**
  - Recurring: Monthly
  - Price: $29.00 USD
- **Click Save** → Copy the **Price ID**
- Update `.env.local`: `STRIPE_PRICE_ID_PRO=price_YOUR_PRICE_ID`

#### Enterprise Plan ($99/month)
- **Name:** Enterprise Plan
- **Description:** 1000 generations per month with all features
- **Pricing:**
  - Recurring: Monthly
  - Price: $99.00 USD
- **Click Save** → Copy the **Price ID**
- Update `.env.local`: `STRIPE_PRICE_ID_ENTERPRISE=price_YOUR_PRICE_ID`

### Step 5: Set Up Webhook
1. Go to **Developers → Webhooks**
2. Click **Add endpoint**
3. **Endpoint URL:**
   - For local development: Use [ngrok](https://ngrok.com/) or similar
     ```bash
     ngrok http 3000
     # Use the HTTPS URL: https://YOUR-ID.ngrok.io/api/webhooks/stripe
     ```
   - For production: `https://yourdomain.com/api/webhooks/stripe`

4. **Events to select:**
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

5. **Click Add endpoint**
6. **Copy Signing Secret** (starts with `whsec_`)
7. Update `.env.local`: `STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET`

## 🧪 Phase 4: Testing (RECOMMENDED)

### Test 1: Checkout Flow
1. Start dev server: `npm run dev`
2. Go to `http://localhost:3000/pricing`
3. Sign in with Clerk
4. Click "Upgrade to Professional"
5. Use test card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

### Test 2: Webhook Testing
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
```

### Test 3: Subscription Management
1. Check user plan in database
2. Verify credits were updated
3. Test subscription cancellation
4. Confirm downgrade to free plan

## 📊 Database Schema Verification

Your Prisma schema should already include:
```prisma
model User {
  id                  String   @id @default(cuid())
  clerkId             String   @unique
  email               String
  plan                String   @default("free")
  credits             Int      @default(10)
  stripeCustomerId    String?  @unique
  stripeSubscriptionId String? @unique
  subscriptionStatus  String?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}
```

## 🚀 Going Live (Production Checklist)

### Before Launch:
- [ ] Switch Stripe to **Live Mode**
- [ ] Update `.env` with live API keys
- [ ] Create products/prices in live mode
- [ ] Update webhook endpoint to production URL
- [ ] Test full checkout flow in live mode
- [ ] Set up Stripe Radar for fraud protection
- [ ] Configure email receipts in Stripe settings
- [ ] Set up billing portal for customers

### URLs to Update:
```env
# Production environment
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_KEY
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_LIVE_SECRET
```

## 🔧 Troubleshooting

### "Webhook signature verification failed"
- Check that `STRIPE_WEBHOOK_SECRET` is set correctly
- Ensure you're using the secret for the correct webhook endpoint

### "Price ID not configured"
- Verify all Price IDs are set in `.env.local`
- Check that IDs start with `price_`

### "User not found"
- Ensure user is signed in with Clerk
- Check that Clerk `userId` matches database `clerkId`

### Subscription not updating
- Check webhook logs in Stripe Dashboard
- Verify webhook endpoint is reachable
- Check server logs for errors

## 📞 Support Resources

- **Stripe Documentation:** https://stripe.com/docs
- **Stripe API Reference:** https://stripe.com/docs/api
- **Testing Cards:** https://stripe.com/docs/testing
- **Webhook Testing:** https://stripe.com/docs/webhooks/test

## 🎉 Summary

**Completed:**
✅ Stripe packages installed
✅ Configuration files created
✅ Checkout API route (already existed)
✅ Webhook handler created
✅ Pricing page (already existed)
✅ Environment variables template added

**Next Steps:**
1. Add your actual Stripe API keys to `.env.local`
2. Create products and prices in Stripe Dashboard
3. Set up webhook endpoint
4. Test with Stripe test cards
5. Go live when ready!

## 🔒 Security Notes

- ✅ Stripe Secret Key is **NEVER** exposed to client
- ✅ Webhook signatures are verified
- ✅ All sensitive operations require authentication
- ✅ Customer IDs are securely stored in database
- ✅ Environment variables are git-ignored

---

**Your Stripe payment system is now fully configured!** 🎉

Follow the steps in Phase 3 to complete the Stripe Dashboard setup and start accepting payments.
