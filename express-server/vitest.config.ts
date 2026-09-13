import 'dotenv/config';

import { defineConfig } from 'vitest/config';

// The app reads DATABASE_URL. Tests are only ever pointed at TEST_DATABASE_URL:
// when it is set it becomes DATABASE_URL for the test process, and the
// DB-backed suites run; when it isn't, those suites skip and DATABASE_URL is a
// placeholder nothing connects to. The real DATABASE_URL from .env is never
// used by a test.
const testDatabaseUrl = process.env.TEST_DATABASE_URL;

// Deterministic dummies that satisfy the >= 32 char rule in config/env.
const secret = (name: string) => `${name}-test-secret`.padEnd(48, '0');

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // The DB-backed suites each reset the same test database; running files
    // one at a time keeps them from truncating under each other.
    fileParallelism: false,
    env: {
      NODE_ENV: 'test',
      DATABASE_URL:
        testDatabaseUrl ?? 'postgresql://unused:unused@localhost:5432/unused',
      DATABASE_SSL: 'disable',
      JWT_ACCESS_SECRET: secret('jwt-access'),
      JWT_REFRESH_SECRET: secret('jwt-refresh'),
      CSRF_SECRET: secret('csrf'),
      TEST_HAS_DATABASE: testDatabaseUrl ? '1' : '',
    },
  },
});
