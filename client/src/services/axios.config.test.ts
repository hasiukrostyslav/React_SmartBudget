import {
  AxiosError,
  type AxiosAdapter,
  type InternalAxiosRequestConfig,
} from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';

interface Call {
  method: string;
  path: string;
  csrf: string | undefined;
}

type Reply = { status: number; data?: unknown };

// A fresh copy of axios.config (its token cache is module state) whose
// requests all go to `handler` instead of the network.
async function loadApi(handler: (call: Call) => Reply) {
  vi.resetModules();
  vi.stubEnv('VITE_API_EXPRESS_URL', 'http://api.test');

  const calls: Call[] = [];
  const adapter: AxiosAdapter = async (config: InternalAxiosRequestConfig) => {
    const url = config.url!.startsWith('http')
      ? config.url!
      : `${config.baseURL}${config.url}`;
    const call: Call = {
      method: config.method!.toUpperCase(),
      path: url.replace('http://api.test', ''),
      csrf: config.headers['X-CSRF-Token'] as string | undefined,
    };
    calls.push(call);
    await new Promise((resolve) => setTimeout(resolve, 5));

    const { status, data } = handler(call);
    const response = { status, statusText: '', data, headers: {}, config };
    if (status >= 400) {
      throw new AxiosError(
        'failed',
        'ERR_BAD_RESPONSE',
        config,
        null,
        response,
      );
    }
    return response;
  };

  const axios = (await import('axios')).default;
  axios.defaults.adapter = adapter;
  const { api } = await import('./axios.config');
  api.defaults.adapter = adapter;

  const tokenFetches = () =>
    calls.filter((c) => c.path === '/api/auth/csrf-token').length;
  return { api, calls, tokenFetches };
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('axios CSRF handling', () => {
  it('sends reads without fetching a token', async () => {
    const { api, calls } = await loadApi(() => ({ status: 200, data: {} }));

    await api.get('/transactions');

    expect(calls).toEqual([
      { method: 'GET', path: '/api/transactions', csrf: undefined },
    ]);
  });

  it('shares one token fetch between concurrent writes', async () => {
    const { api, calls, tokenFetches } = await loadApi(({ path }) =>
      path === '/api/auth/csrf-token'
        ? { status: 200, data: { csrfToken: 't1' } }
        : { status: 200, data: {} },
    );

    await Promise.all([api.post('/a'), api.post('/b')]);

    expect(tokenFetches()).toBe(1);
    expect(calls.filter((c) => c.method === 'POST').map((c) => c.csrf)).toEqual(
      ['t1', 't1'],
    );
  });

  it('refetches the token once for concurrent CSRF rejections and retries both', async () => {
    // The server accepts only the most recently issued token, as happens when
    // each fetch without a csrf-sid binds the token to a new sid.
    let issued = 0;
    let valid = '';
    const { api, tokenFetches } = await loadApi(({ path, csrf }) => {
      if (path === '/api/auth/csrf-token') {
        valid = `t${++issued}`;
        return { status: 200, data: { csrfToken: valid } };
      }
      if (path === '/api/prime') return { status: 200, data: {} };
      return csrf === valid
        ? { status: 200, data: { ok: true } }
        : { status: 403, data: { code: 'EBADCSRFTOKEN' } };
    });
    await api.post('/prime'); // caches t1
    valid = 'rebound'; // the server no longer accepts t1

    const results = await Promise.all([api.post('/a'), api.post('/b')]);

    expect(results.map((r) => r.status)).toEqual([200, 200]);
    expect(tokenFetches()).toBe(2); // the prime, plus one shared refetch
  });

  it('rejects with the original 403 when the token refetch fails', async () => {
    let tokenCalls = 0;
    const { api } = await loadApi(({ path }) => {
      if (path === '/api/auth/csrf-token') {
        return ++tokenCalls === 1
          ? { status: 200, data: { csrfToken: 't1' } }
          : { status: 500, data: { message: 'down' } };
      }
      return { status: 403, data: { code: 'EBADCSRFTOKEN' } };
    });

    const error = await api.post('/a').catch((e: unknown) => e);

    expect(error).toBeInstanceOf(AxiosError);
    expect((error as AxiosError).response?.status).toBe(403);
  });
});
