const bcrypt = require('bcryptjs');
const db = require('./config/db');

const username = 'admin_den';
const plainPassword = 'admin123';
const hashedPassword = bcrypt.hashSync(plainPassword, 10);

db.query(
  'UPDATE admin SET password = ? WHERE username = ?',
  [hashedPassword, username],
  (err, result) => {
    if (err) {
      console.error('Error updating admin password:', err);
      process.exit(1);
    }
    
    if (result.affectedRows === 0) {
      console.log('Admin user not found. Creating new admin...');
      
      db.query(
        'INSERT INTO admin (username, password) VALUES (?, ?)',
        [username, hashedPassword],
        (err, result) => {
          if (err) {
            console.error('Error creating admin:', err);
            process.exit(1);
          }
          console.log('Admin user created successfully!');
          console.log('Username:', username);
          console.log('Password:', plainPassword);
          process.exit(0);
        }
      );
    } else {
      console.log('Admin password updated successfully!');
      console.log('Username:', username);
      console.log('Password:', plainPassword);
      process.exit(0);
    }
  }
);
