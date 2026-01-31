/**
 * Create Stripe Products Helper
 * 
 * This script helps you create the required products in Stripe Dashboard
 * and shows you what Price IDs to add to your .env.local file
 */

console.log('\n' + '='.repeat(70));
console.log('📦 STRIPE PRODUCTS SETUP GUIDE');
console.log('='.repeat(70) + '\n');

console.log('You need to create 3 products in your Stripe Dashboard:\n');

console.log('1️⃣  BASIC PLAN ($9/month)');
console.log('   ─────────────────────────────────────────────────');
console.log('   📍 Go to: https://dashboard.stripe.com/test/products/create');
console.log('   ');
console.log('   Product details:');
console.log('   • Name: Basic Plan');
console.log('   • Description: 50 AI-powered design generations per month');
console.log('   ');
console.log('   Pricing:');
console.log('   • Pricing model: Standard pricing');
console.log('   • Price: $9.00 USD');
console.log('   • Billing period: Monthly');
console.log('   • Payment type: Recurring');
console.log('   ');
console.log('   ✅ After creating, COPY the Price ID (starts with price_)');
console.log('   Add to .env.local: STRIPE_PRICE_ID_BASIC=price_xxxxx\n');

console.log('2️⃣  PROFESSIONAL PLAN ($29/month)');
console.log('   ─────────────────────────────────────────────────');
console.log('   📍 Go to: https://dashboard.stripe.com/test/products/create');
console.log('   ');
console.log('   Product details:');
console.log('   • Name: Professional Plan');
console.log('   • Description: 200 AI-powered design generations per month');
console.log('   ');
console.log('   Pricing:');
console.log('   • Pricing model: Standard pricing');
console.log('   • Price: $29.00 USD');
console.log('   • Billing period: Monthly');
console.log('   • Payment type: Recurring');
console.log('   ');
console.log('   ✅ After creating, COPY the Price ID (starts with price_)');
console.log('   Add to .env.local: STRIPE_PRICE_ID_PRO=price_xxxxx\n');

console.log('3️⃣  ENTERPRISE PLAN ($99/month)');
console.log('   ─────────────────────────────────────────────────');
console.log('   📍 Go to: https://dashboard.stripe.com/test/products/create');
console.log('   ');
console.log('   Product details:');
console.log('   • Name: Enterprise Plan');
console.log('   • Description: 1000 AI-powered design generations per month');
console.log('   ');
console.log('   Pricing:');
console.log('   • Pricing model: Standard pricing');
console.log('   • Price: $99.00 USD');
console.log('   • Billing period: Monthly');
console.log('   • Payment type: Recurring');
console.log('   ');
console.log('   ✅ After creating, COPY the Price ID (starts with price_)');
console.log('   Add to .env.local: STRIPE_PRICE_ID_ENTERPRISE=price_xxxxx\n');

console.log('='.repeat(70));
console.log('📝 QUICK SETUP STEPS:');
console.log('='.repeat(70));
console.log('1. Open: https://dashboard.stripe.com/test/products');
console.log('2. Click "Add product" button (top right)');
console.log('3. Fill in the details from above for each plan');
console.log('4. After creating each product, click on it');
console.log('5. Find the "Pricing" section');
console.log('6. Copy the Price ID (looks like: price_1Abc2DefGhi3Jkl4Mno)');
console.log('7. Add to your .env.local file');
console.log('8. Repeat for all 3 plans\n');

console.log('='.repeat(70));
console.log('✅ AFTER CREATING ALL PRODUCTS:');
console.log('='.repeat(70));
console.log('Your .env.local should have:');
console.log('');
console.log('STRIPE_PRICE_ID_BASIC=price_xxxxx');
console.log('STRIPE_PRICE_ID_PRO=price_xxxxx');
console.log('STRIPE_PRICE_ID_ENTERPRISE=price_xxxxx');
console.log('');
console.log('Then run: npm run dev');
console.log('');
console.log('='.repeat(70) + '\n');

console.log('💡 TIP: Keep your Stripe Dashboard open - you\'ll need it!\n');
