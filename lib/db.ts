import { Pool, QueryResult } from 'pg';

let pool: Pool;

const getPool = () => {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
  }
  return pool;
};

export const query = (text: string, params?: unknown[]) => {
  return getPool().query(text, params);
};

export const getConnection = () => {
  return getPool();
};
