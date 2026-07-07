import { Pool, types } from 'pg';

// `created_at` / `updated_at` are `timestamp without time zone` columns holding
// UTC wall-clock values (the Prisma/Next convention). node-postgres otherwise
// parses OID 1114 in the process's LOCAL timezone, which shifts every displayed
// time by the local UTC offset. Parse it as UTC so this API returns the same
// instants Prisma/Next do. (OID 1114 = timestamp without time zone.)
types.setTypeParser(1114, (value) =>
  value === null ? null : new Date(value.replace(' ', 'T') + 'Z'),
);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true },
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export default pool;
