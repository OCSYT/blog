import { Pool } from 'pg';

const Database = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default Database;