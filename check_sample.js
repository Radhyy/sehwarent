require('dotenv').config({path: '.env.local'});
const {Pool} = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {rejectUnauthorized: false}
});
pool.query("SELECT id, title, price FROM products LIMIT 1").then(res => {
  console.log(res.rows);
  pool.end();
});
