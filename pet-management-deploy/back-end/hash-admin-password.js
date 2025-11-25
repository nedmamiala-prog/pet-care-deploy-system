const bcrypt = require('bcryptjs');

const password = 'admin123';
const hashedPassword = bcrypt.hashSync(password, 10);

console.log('Plain password:', password);
console.log('Hashed password:', hashedPassword);
console.log('\nSQL command to update admin_den:');
console.log(`UPDATE admin SET password = '${hashedPassword}' WHERE username = 'admin_den';`);
