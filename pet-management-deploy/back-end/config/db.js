const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',        
  port: process.env.DB_PORT || 3306,               
  user: process.env.DB_USER || 'root',             
  password: process.env.DB_PASSWORD || '',        
  database: process.env.DB_NAME || 'pet_management', 
  ssl: process.env.DB_HOST ? { 
    rejectUnauthorized: false,
    secure: true
  } : false,
  waitForConnections: true,
  connectionLimit: 2, // Reduced to avoid hitting the 5 connection limit
  queueLimit: 10,
  idleTimeout: 300000 // Close idle connections after 5 minutes
});

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log(process.env.DB_HOST ? 
      "Connected to Clever Cloud MySQL" : 
      "Connected to MySQL (XAMPP)"
    );
    connection.release(); // Return to pool
  }
});

module.exports = pool;
