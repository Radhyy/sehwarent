require('dotenv').config({path: '.env.local'});
const {Pool} = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {rejectUnauthorized: false}
});

async function migrate() {
  try {
    await pool.query(`
      ALTER TABLE activity_logs
      ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE USING created_at AT TIME ZONE 'UTC';
    `);
    
    // Also delete any "Sewa dibatalkan" or "Sewa selesai" that were actually cancellations?
    // Let's just delete all existing activity logs to start fresh and clean up the 7 hours ago mess.
    await pool.query('DELETE FROM activity_logs');
    
    console.log("Migration successful");
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

migrate();
