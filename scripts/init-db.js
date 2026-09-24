require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function init() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create a default admin if none exists
    const res = await pool.query('SELECT * FROM admins WHERE username = $1', ['admin']);
    if (res.rows.length === 0) {
      const hash = await bcrypt.hash('admin123', 10);
      await pool.query('INSERT INTO admins (username, password_hash) VALUES ($1, $2)', ['admin', hash]);
      console.log('Default admin created: admin / admin123');
    } else {
      console.log('Admin already exists.');
    }
    console.log('Database initialized.');
  } catch (error) {
    console.error('DB Error:', error);
  } finally {
    await pool.end();
  }
}

init();
