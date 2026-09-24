require('dotenv').config({path: '.env.local'});
const {Pool} = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {rejectUnauthorized: false}
});

async function migrate() {
  try {
    await pool.query(`
      ALTER TABLE products
      ALTER COLUMN available_at TYPE TIMESTAMP WITH TIME ZONE USING available_at AT TIME ZONE 'UTC',
      ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE USING created_at AT TIME ZONE 'UTC';
    `);
    console.log("Migration successful");
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

migrate();
