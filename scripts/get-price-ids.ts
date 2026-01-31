/**
 * Get Price IDs from Product IDs
 * 
 * You provided Product IDs, but we need Price IDs for checkout.
 * This script shows you exactly where to find them.
 */

const products = {
  'Basic Plan': 'prod_TsR8XfYtLkNl3O',
  'Professional Plan': 'prod_TsRAoAoWu7eFJp',
  'Enterprise Plan': 'prod_TsRBIiMZZ4tzUR',
};

console.log('\n' + '='.repeat(70));
console.log('🔍 GET PRICE IDs FROM YOUR PRODUCTS');
console.log('='.repeat(70) + '\n');

console.log('You\'ve created the products! Now you need to get the PRICE IDs.\n');
console.log('📝 A Product can have multiple Prices (e.g., monthly, yearly)');
console.log('   We need the MONTHLY Price ID for each product.\n');

Object.entries(products).forEach(([name, productId], index) => {
  console.log(`${index + 1}️⃣  ${name.toUpperCase()}`);
  console.log('   ' + '─'.repeat(65));
  console.log(`   Product ID: ${productId}`);
  console.log(`   \n   🔗 Direct link to product:`);
  console.log(`   https://dashboard.stripe.com/test/products/${productId}`);
  console.log(`   \n   📋 Steps:`);
  console.log(`   1. Click the link above (or paste in browser)`);
  console.log(`   2. Look for the "Pricing" section`);
  console.log(`   3. Find the $${name.includes('Basic') ? '9' : name.includes('Professional') ? '29' : '99'}.00/month price`);
  console.log(`   4. Copy the API ID (looks like: price_1Abc2DefGhi3Jkl4Mno)`);
  console.log(`   5. It starts with "price_" not "prod_"`);
  console.log('');
});

console.log('='.repeat(70));
console.log('✅ AFTER GETTING ALL 3 PRICE IDs:');
console.log('='.repeat(70));
console.log('Update your .env.local file:\n');
console.log('STRIPE_PRICE_ID_BASIC=price_xxxxx       (from Basic Plan)');
console.log('STRIPE_PRICE_ID_PRO=price_xxxxx         (from Professional Plan)');
console.log('STRIPE_PRICE_ID_ENTERPRISE=price_xxxxx  (from Enterprise Plan)\n');

console.log('='.repeat(70));
console.log('🚀 QUICK METHOD:');
console.log('='.repeat(70));
console.log('1. Open all 3 links above in browser tabs');
console.log('2. Copy each Price ID');
console.log('3. Paste them here in chat');
console.log('4. I\'ll add them to .env.local for you!\n');

console.log('💡 Example: "Basic price_1abc... Pro price_2def... Enterprise price_3ghi..."\n');
