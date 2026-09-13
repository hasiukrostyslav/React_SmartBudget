import pool, { query } from '../db/index';
import { TEST_SCHEMA_SQL } from './schema';

// True only when vitest.config mapped TEST_DATABASE_URL onto DATABASE_URL.
// The real DATABASE_URL is never exposed to the test process, so a suite
// gated on this can never write to production data.
export const hasTestDatabase = process.env.TEST_HAS_DATABASE === '1';

export async function resetTestDatabase() {
  if (!hasTestDatabase) {
    throw new Error('resetTestDatabase called without TEST_DATABASE_URL');
  }
  await query(TEST_SCHEMA_SQL);
  await query('TRUNCATE "transactions", "users" CASCADE;');
}

export async function closeTestDatabase() {
  await pool.end();
}
