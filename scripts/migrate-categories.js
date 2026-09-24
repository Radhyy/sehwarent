require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  try {
    // Create categories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default categories
    await pool.query(`
      INSERT INTO categories (id, name) VALUES 
      ('pubg', 'PUBG Mobile'),
      ('mlbb', 'Mobile Legends'),
      ('ff', 'Free Fire')
      ON CONFLICT (id) DO NOTHING
    `);

    // Add category_id column to products if not exists
    await pool.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS category_id VARCHAR(50) DEFAULT 'pubg'
    `);

    // Update existing products to pubg
    await pool.query(`
      UPDATE products SET category_id = 'pubg' WHERE category_id IS NULL OR category_id = 'pubg'
    `);

    console.log('Migration successful');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    pool.end();
  }
}

migrate();
