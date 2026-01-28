# Stripe Subscription Setup Guide

This document explains how to set up Stripe subscriptions for DesignForge AI.

## Environment Variables

Add the following variables to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs (from Stripe Dashboard)
STRIPE_PRO_PRICE_ID=price_...
STRIPE_TEAM_PRICE_ID=price_...
```

## Stripe Dashboard Setup

### 1. Create Products and Prices

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Products** → **Add Product**
3. Create two products:

   **Product 1: Pro Plan**
   - Name: "DesignForge AI Pro"
   - Pricing: $19/month (recurring)
   - Copy the **Price ID** → Set as `STRIPE_PRO_PRICE_ID`

   **Product 2: Team Plan**
   - Name: "DesignForge AI Team"
   - Pricing: $49/month (recurring)
   - Copy the **Price ID** → Set as `STRIPE_TEAM_PRICE_ID`

### 2. Set Up Webhooks

1. Go to **Developers** → **Webhooks** → **Add endpoint**
2. Endpoint URL: `https://yourdomain.com/api/stripe/webhook`
3. For local development, use [Stripe CLI](https://stripe.com/docs/stripe-cli):
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. Copy the webhook signing secret → Set as `STRIPE_WEBHOOK_SECRET`
5. Select events to listen to:
   - `checkout.session.completed`
   - `invoice.paid`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`

### 3. Get API Keys

1. Go to **Developers** → **API keys**
2. Copy **Secret key** → Set as `STRIPE_SECRET_KEY`
3. Use test keys for development, live keys for production

## Testing

### Test Cards

Use these test card numbers in Stripe Checkout:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0027 6000 3184`

Any future expiry date and any CVC will work.

### Local Webhook Testing

1. Install Stripe CLI:
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. Login:
   ```bash
   stripe login
   ```

3. Forward webhooks:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. Trigger test events:
   ```bash
   stripe trigger checkout.session.completed
   ```

## Subscription Flow

1. User clicks "Upgrade to Pro/Team" on pricing page
2. If not authenticated → Redirect to `/signin`
3. If authenticated → Create Stripe Checkout Session
4. User completes payment on Stripe-hosted checkout
5. Webhook receives `checkout.session.completed`
6. User subscription status updated in database
7. User redirected to `/dashboard?success=true`

## Feature Gating

Premium features are gated based on subscription:

- **Free**: CSS variables export only, 5 generations/month
- **Pro**: All exports, unlimited generations
- **Team**: Everything in Pro + Figma tokens, team features

## Database Schema (TODO)

You'll need to store subscription data:

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  plan VARCHAR(10) NOT NULL, -- 'free', 'pro', 'team'
  status VARCHAR(20) NOT NULL, -- 'active', 'canceled', 'past_due', 'trialing'
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Production Deployment

1. Switch to live API keys in production
2. Update webhook endpoint URL in Stripe Dashboard
3. Ensure `STRIPE_WEBHOOK_SECRET` matches production webhook
4. Test subscription flow end-to-end
5. Monitor webhook events in Stripe Dashboard

## Troubleshooting

### Webhook Not Receiving Events

- Check webhook URL is correct
- Verify webhook secret matches
- Check Stripe Dashboard → Webhooks → Events for errors
- Use Stripe CLI for local testing

### Checkout Not Redirecting

- Verify `NEXTAUTH_URL` is set correctly
- Check Stripe Dashboard → Settings → Branding for redirect URLs
- Ensure success/cancel URLs are whitelisted

### Subscription Status Not Updating

- Check webhook handler logs
- Verify database connection
- Ensure webhook events are being received
- Check user ID mapping in metadata
