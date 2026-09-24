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
      ADD COLUMN IF NOT EXISTS price_3_hari VARCHAR(255),
      ADD COLUMN IF NOT EXISTS price_7_hari VARCHAR(255),
      ADD COLUMN IF NOT EXISTS rent_count INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS current_rent_price INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS total_revenue INTEGER DEFAULT 0;
    `);
    console.log("Migration successful");
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

migrate();
