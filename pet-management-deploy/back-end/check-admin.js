const db = require('./config/db');

console.log('Checking admin table...');

// Check if admin table exists and has data
db.query('DESCRIBE admin', (err, results) => {
  if (err) {
    console.error('Error describing admin table:', err);
    process.exit(1);
  }
  
  console.log('Admin table structure:', results);
  
  // Check all admin users
  db.query('SELECT username, password FROM admin', (err, adminResults) => {
    if (err) {
      console.error('Error fetching admin users:', err);
      process.exit(1);
    }
    
    console.log('Admin users found:', adminResults.length);
    adminResults.forEach(admin => {
      console.log(`Username: ${admin.username}, Password length: ${admin.password ? admin.password.length : 'null'}, Password starts with: ${admin.password ? admin.password.substring(0, 10) : 'null'}`);
    });
    
    process.exit(0);
  });
});
