# Stripe Payment Setup Guide

## Overview
Your Stripe payment integration is complete but requires configuration before it can accept payments.

## Current Status
❌ **Stripe keys not configured** - Using placeholder values  
❌ **Price IDs not created** - Need to create products in Stripe Dashboard  
✅ **API routes created** - All endpoints ready  
✅ **Database schema updated** - Ready to store subscription data  
✅ **Frontend integrated** - Pricing page and dashboard ready  

---

## Step-by-Step Setup

### 1. Create a Stripe Account
1. Go to [https://stripe.com](https://stripe.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your API Keys
1. Go to [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
2. You'll see two keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`) - Click "Reveal test key"
3. Keep these safe - you'll need them in step 5

### 3. Create Products in Stripe Dashboard

#### Basic Plan ($9/month)
1. Go to [https://dashboard.stripe.com/test/products](https://dashboard.stripe.com/test/products)
2. Click "Add product"
3. Fill in:
   - **Name**: Basic Plan
   - **Description**: 50 AI generations per month
   - **Pricing**: Recurring → Monthly → $9.00 USD
4. Click "Save product"
5. **Copy the Price ID** (starts with `price_`) - you'll need this

#### Professional Plan ($29/month)
1. Click "Add product" again
2. Fill in:
   - **Name**: Professional Plan
   - **Description**: 200 AI generations per month
   - **Pricing**: Recurring → Monthly → $29.00 USD
3. Click "Save product"
4. **Copy the Price ID**

#### Enterprise Plan ($99/month)
1. Click "Add product" again
2. Fill in:
   - **Name**: Enterprise Plan
   - **Description**: 1000 AI generations per month
   - **Pricing**: Recurring → Monthly → $99.00 USD
3. Click "Save product"
4. **Copy the Price ID**

### 4. Set Up Webhook (For subscription events)
1. Go to [https://dashboard.stripe.com/test/webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click "Add endpoint"
3. **Endpoint URL**: `https://your-domain.com/api/stripe/webhook`
   - Replace `your-domain.com` with your actual domain
   - For ngrok: `https://your-ngrok-url.ngrok-free.dev/api/stripe/webhook`
4. **Events to listen to**:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`
5. Click "Add endpoint"
6. **Copy the Signing secret** (starts with `whsec_`)

### 5. Update Environment Variables

Open your `.env.local` file and replace the placeholder values:

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_SECRET_HERE

# Stripe Price IDs
STRIPE_PRICE_ID_BASIC=price_YOUR_BASIC_PRICE_ID
STRIPE_PRICE_ID_PRO=price_YOUR_PRO_PRICE_ID
STRIPE_PRICE_ID_ENTERPRISE=price_YOUR_ENTERPRISE_PRICE_ID
```

### 6. Restart Your Server
```bash
# Stop the server (Ctrl+C)
# Clear Next.js cache
rm -rf .next

# Start again
npm run dev
```

---

## Testing Your Setup

### Test Payment Flow
1. Go to http://localhost:3000/pricing
2. Click "Subscribe" on any plan
3. Use Stripe test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/34)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)
4. Complete payment
5. You should be redirected to dashboard with success message

### Verify Subscription
1. Go to [https://dashboard.stripe.com/test/subscriptions](https://dashboard.stripe.com/test/subscriptions)
2. You should see your test subscription
3. Check your database - user should have:
   - `stripeCustomerId`
   - `stripeSubscriptionId`
   - `stripePriceId`
   - Updated `credits`

### Test Webhook
1. Trigger a test event in Stripe Dashboard
2. Check [https://dashboard.stripe.com/test/webhooks](https://dashboard.stripe.com/test/webhooks)
3. You should see successful webhook deliveries

---

## Common Issues & Solutions

### Issue: "Stripe payment is not configured yet"
**Solution**: You still have placeholder values in `.env.local`. Follow steps 2-5 above.

### Issue: "No checkout URL received"
**Solution**: 
- Check that all Stripe keys are properly set
- Ensure Price IDs start with `price_` (not `price_YOUR_`)
- Restart your development server after updating env vars

### Issue: Webhook not working
**Solution**:
- Make sure your app is publicly accessible (use ngrok for local dev)
- Verify webhook URL is correct
- Check that all 3 events are selected in Stripe Dashboard
- Verify webhook secret is correct

### Issue: Payment succeeds but credits not added
**Solution**:
- Check webhook is receiving events
- View webhook logs in Stripe Dashboard
- Check your server logs for errors
- Verify database has Stripe fields (run `npx prisma db push`)

---

## Going Live (Production)

When ready to accept real payments:

1. **Activate your Stripe account**
   - Complete business verification in Stripe Dashboard

2. **Create production products**
   - Switch to "Live mode" in Stripe Dashboard
   - Create the same 3 products with production Price IDs

3. **Get production keys**
   - Get live API keys (start with `pk_live_` and `sk_live_`)
   - Create production webhook with live secret

4. **Update production environment**
   - Add live keys to your production `.env` file
   - Update `NEXT_PUBLIC_APP_URL` to production domain
   - Update webhook URL to production domain

5. **Test thoroughly**
   - Use real card (small amount)
   - Verify full flow works
   - Test subscription management
   - Test cancellations

---

## Support

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Testing**: https://stripe.com/docs/testing
- **Stripe Webhooks**: https://stripe.com/docs/webhooks

---

## Current Error Analysis

The error "No checkout URL received" occurs because:

1. ❌ `.env.local` has placeholder Stripe keys (`pk_test_YOUR_PUBLISHABLE_KEY_HERE`)
2. ❌ Price IDs are placeholders (`price_YOUR_BASIC_PRICE_ID`)
3. ❌ When Stripe API is called with invalid config, it fails
4. ❌ No URL is returned from the API
5. ❌ Frontend shows "No checkout URL received"

**Fix**: Follow steps 2-6 above to configure real Stripe keys and Price IDs.

---

## Quick Test (Development Mode)

If you just want to test locally without real Stripe:

1. Create a free Stripe test account
2. Get test keys (takes 2 minutes)
3. Create test products (takes 5 minutes)
4. Update `.env.local` (takes 1 minute)
5. Restart server
6. Use test card `4242 4242 4242 4242`

**Total time**: ~10 minutes to have fully working payments!
