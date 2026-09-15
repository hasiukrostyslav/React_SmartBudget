import { afterEach, describe, expect, it, vi } from 'vitest';

// env.ts validates at import time, so each case re-imports it with a fresh
// module registry. CLIENT_URL is stubbed as '' rather than removed: dotenv
// never overrides a variable that is already set, so a local .env can't mask
// the case under test.
async function loadEnv(vars: Record<string, string>) {
  for (const [key, value] of Object.entries(vars)) vi.stubEnv(key, value);
  vi.resetModules();
  return import('./env');
}

describe('env CLIENT_URL', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('fails at import in production when CLIENT_URL is missing', async () => {
    await expect(
      loadEnv({ NODE_ENV: 'production', CLIENT_URL: '' }),
    ).rejects.toThrow('CLIENT_URL is required in production');
  });

  it('accepts production with CLIENT_URL set', async () => {
    const { env, isProd } = await loadEnv({
      NODE_ENV: 'production',
      CLIENT_URL: 'https://app.example.com',
    });

    expect(isProd).toBe(true);
    expect(env.CLIENT_URL).toBe('https://app.example.com');
  });

  it.each([
    ['https://app.example.com/', 'https://app.example.com'],
    ['https://App.Example.com', 'https://app.example.com'],
    ['https://app.example.com:443/dashboard', 'https://app.example.com'],
  ])(
    'reduces CLIENT_URL %s to the origin a browser sends',
    async (input, origin) => {
      const { env } = await loadEnv({
        NODE_ENV: 'production',
        CLIENT_URL: input,
      });

      expect(env.CLIENT_URL).toBe(origin);
    },
  );

  it('rejects a CLIENT_URL that is not http(s)', async () => {
    await expect(
      loadEnv({ NODE_ENV: 'test', CLIENT_URL: 'ftp://app.example.com' }),
    ).rejects.toThrow('CLIENT_URL must be an http(s) URL');
  });

  it('allows a missing CLIENT_URL outside production', async () => {
    const { env } = await loadEnv({ NODE_ENV: 'test', CLIENT_URL: '' });

    expect(env.CLIENT_URL).toBeUndefined();
  });
});
