// Simple script to generate a secure JWT secret
const crypto = require('crypto');

// Generate a random 64-character hex string
const secret = crypto.randomBytes(32).toString('hex');

console.log('='.repeat(60));
console.log('Your JWT_SECRET (copy this to your .env file):');
console.log('='.repeat(60));
console.log(`JWT_SECRET=${secret}`);
console.log('='.repeat(60));
console.log('\n⚠️  IMPORTANT: Keep this secret secure!');
console.log('   - Never commit it to version control');
console.log('   - Don\'t share it publicly');
console.log('   - Use different secrets for development and production');
console.log('='.repeat(60));

