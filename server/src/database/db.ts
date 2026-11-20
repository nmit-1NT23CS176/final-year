import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

  const connectionString = process.env.DATABASE_URL;
  let pool: Pool | null = null;

  if (connectionString) {
    const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
    pool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      ssl: isLocal ? false : { rejectUnauthorized: false },
    });
  } else {
    console.warn('DATABASE_URL environment variable is missing. Database queries will return an error until set.');
  }

  export const query = (text: string, params?: any[]) => {
    if (!pool) {
      throw new Error('Database connection not configured (missing DATABASE_URL)');
    }
    return pool.query(text, params);
  };

  export default pool;
