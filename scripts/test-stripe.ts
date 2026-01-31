/**
 * Test Stripe Configuration
 * Run with: npx tsx scripts/test-stripe.ts
 */

import { STRIPE_PLANS } from '../lib/stripe/config';

console.log('\n🔍 Testing Stripe Configuration...\n');

// Check environment variables
console.log('Environment Variables:');
console.log('✓ STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 
  (process.env.STRIPE_SECRET_KEY.startsWith('sk_test_YOUR_') ? '❌ PLACEHOLDER' : '✅ SET') : 
  '❌ MISSING');
console.log('✓ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 
  (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith('pk_test_YOUR_') ? '❌ PLACEHOLDER' : '✅ SET') : 
  '❌ MISSING');
console.log('✓ STRIPE_WEBHOOK_SECRET:', process.env.STRIPE_WEBHOOK_SECRET ? 
  (process.env.STRIPE_WEBHOOK_SECRET.startsWith('whsec_YOUR_') ? '❌ PLACEHOLDER' : '✅ SET') : 
  '❌ MISSING');

console.log('\nStripe Plans Configuration:');
Object.entries(STRIPE_PLANS).forEach(([key, plan]) => {
  const priceIdStatus = plan.priceId.startsWith('price_YOUR_') || plan.priceId === '' 
    ? '❌ PLACEHOLDER' 
    : '✅ SET';
  console.log(`\n${plan.name} Plan:`);
  console.log(`  Price ID: ${priceIdStatus}`);
  console.log(`  Price: $${plan.price}/month`);
  console.log(`  Credits: ${plan.credits}`);
});

console.log('\n' + '='.repeat(60));

// Check if configuration is ready
const secretKeyOk = process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.startsWith('sk_test_YOUR_');
const publishableKeyOk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith('pk_test_YOUR_');
const allPriceIdsOk = Object.values(STRIPE_PLANS).every(plan => 
  plan.priceId && !plan.priceId.startsWith('price_YOUR_')
);

if (secretKeyOk && publishableKeyOk && allPriceIdsOk) {
  console.log('\n✅ Stripe is FULLY CONFIGURED and ready to accept payments!');
} else {
  console.log('\n❌ Stripe is NOT CONFIGURED YET');
  console.log('\nTo configure Stripe:');
  console.log('1. Read STRIPE_SETUP_GUIDE.md');
  console.log('2. Create Stripe account and products');
  console.log('3. Update .env.local with real keys');
  console.log('4. Restart your development server');
}

console.log('\n');
