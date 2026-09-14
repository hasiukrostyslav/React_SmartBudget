import { Pool, types, type QueryResult, type QueryResultRow } from 'pg';

import { databaseSsl, env } from '../config/env';
import { logger } from '../lib/logger';

// `created_at` / `updated_at` are `timestamp without time zone` columns holding
// UTC wall-clock values (the Prisma/Next convention). node-postgres otherwise
// parses OID 1114 in the process's LOCAL timezone, which shifts every displayed
// time by the local UTC offset. Parse it as UTC so this API returns the same
// instants Prisma/Next do. (OID 1114 = timestamp without time zone.)
types.setTypeParser(1114, (value) =>
  value === null ? null : new Date(value.replace(' ', 'T') + 'Z'),
);

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: databaseSsl,
  // Fail a request that can't get a client rather than queueing it forever
  // behind an exhausted pool — the default is to wait indefinitely.
  connectionTimeoutMillis: 5_000,
  // Cancel a runaway statement server-side so it can't hold a client open.
  statement_timeout: 30_000,
});

// node-postgres emits `error` on the pool when the backend terminates an IDLE
// client (a DB restart, a failover, a provider-side idle timeout). An `error`
// event with no listener is an unhandled exception in Node and takes the whole
// process down without a single request being involved. The pool replaces the
// dead client on its own, so logging is the correct response.
pool.on('error', (error) => {
  logger.error({ err: error }, 'idle database client error');
});

// Generic so call sites name the row shape they expect instead of every row
// entering the app untyped at the widest boundary in the codebase.
export const query = <T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<QueryResult<T>> => {
  return pool.query<T>(text, params);
};

export default pool;
