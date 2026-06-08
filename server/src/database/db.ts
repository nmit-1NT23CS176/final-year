import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  // Use connection string from env or fallback for local development
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/stock',
  max: 20, // Max number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error if connection takes >2 seconds
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export default pool;
