require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || undefined,
      ssl: process.env.DB_HOST ? { rejectUnauthorized: false } : false,
      connectTimeout: 10000
    });

    const [rows] = await conn.query('SELECT NOW() AS now, DATABASE() AS db');
    console.log('DB connection OK');
    console.log('serverTime:', rows[0].now, 'database:', rows[0].db);
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('DB connection FAILED:', err.message || err);
    process.exit(1);
  }
})();
