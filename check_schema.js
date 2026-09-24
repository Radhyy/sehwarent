require('dotenv').config({path: '.env.local'});
const {Pool} = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {rejectUnauthorized: false}
});
pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'products'").then(res => {
  console.log(res.rows);
  pool.end();
});
