const db = require('./db');

class ConnectionManager {
  static async executeQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const attemptQuery = (retryCount = 0) => {
        db.query(sql, params, (err, results) => {
          if (err) {
            console.error(`Database query failed (attempt ${retryCount + 1}):`, err.message);
            
            // If it's a connection limit error, retry after a delay
            if (err.code === 'ER_USER_LIMIT_REACHED' && retryCount < 3) {
              console.log(`Retrying database query in 2 seconds... (${retryCount + 1}/3)`);
              setTimeout(() => attemptQuery(retryCount + 1), 2000);
              return;
            }
            
            reject(err);
          } else {
            const duration = Date.now() - startTime;
            console.log(`Query executed successfully in ${duration}ms`);
            resolve(results);
          }
        });
      };
      
      attemptQuery();
    });
  }
  
  static async executeQueryWithCallback(sql, params = [], callback) {
    try {
      const results = await this.executeQuery(sql, params);
      callback(null, results);
    } catch (err) {
      callback(err);
    }
  }
}

module.exports = ConnectionManager;
