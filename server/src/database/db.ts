import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is missing');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Max number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error if connection takes >2 seconds
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export default pool;
