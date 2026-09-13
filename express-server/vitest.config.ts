import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // Tests read the same .env the app does (via config/env), but must never
    // log through the pino-pretty worker — see logger.middleware.
    env: { NODE_ENV: 'test' },
  },
});
