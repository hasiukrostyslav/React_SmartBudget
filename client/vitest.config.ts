import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';

// Tests reuse the app's Vite config (the @ alias, the React plugin), so modules
// resolve under test exactly as they do in the build.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      include: ['src/**/*.test.{ts,tsx}'],
      setupFiles: ['./src/test/setup.ts'],
    },
  }),
);
