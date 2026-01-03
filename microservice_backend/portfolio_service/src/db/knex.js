import knex from 'knex';
import 'dotenv/config';

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DB_URI,
    ssl: { rejectUnauthorized: false }
  },
  pool: { min: 2, max: 10 }
});

export default db;
