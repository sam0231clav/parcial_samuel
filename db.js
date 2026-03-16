const { Pool } = require('pg');

let poolConfig;
if (process.env.DATABASE_URL) {
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  };
} else {
  poolConfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'parcial',
    password: '1234',
    port: 5432
  };
}

const pool = new Pool(poolConfig);
module.exports = pool;