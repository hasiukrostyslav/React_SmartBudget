import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { importWithReload } from './lazyPage';

const pending = Symbol('pending');
const settled = <T>(promise: Promise<T>) =>
  Promise.race([
    promise.then(
      (value) => ({ value }),
      (error: unknown) => ({ error }),
    ),
    new Promise((resolve) => setTimeout(() => resolve(pending), 20)),
  ]);

const chunkError = new Error('Failed to fetch dynamically imported module');
const failing = () => Promise.reject(chunkError);
const succeeding = async () => ({ default: 'page' });

describe('importWithReload', () => {
  beforeEach(() => sessionStorage.clear());
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('passes a successful import through without reloading', async () => {
    const reload = vi.fn();

    await expect(importWithReload(succeeding, reload)).resolves.toEqual({
      default: 'page',
    });
    expect(reload).not.toHaveBeenCalled();
  });

  it('reloads once when the import fails, and never settles meanwhile', async () => {
    const reload = vi.fn();

    const result = await settled(importWithReload(failing, reload));

    expect(reload).toHaveBeenCalledTimes(1);
    expect(result).toBe(pending);
  });

  it('rethrows the failure after a reload, however long that reload took', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const reload = vi.fn();

    await settled(importWithReload(failing, reload));
    vi.setSystemTime(Date.now() + 60_000); // a very slow reload
    const second = importWithReload(failing, reload);

    await expect(second).rejects.toBe(chunkError);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('reloads again for a later failure once an import has succeeded', async () => {
    const reload = vi.fn();

    await settled(importWithReload(failing, reload));
    await importWithReload(succeeding, reload);
    await settled(importWithReload(failing, reload));

    expect(reload).toHaveBeenCalledTimes(2);
  });

  it('rethrows without reloading when session storage is unavailable', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const reload = vi.fn();

    const result = await settled(importWithReload(failing, reload));

    expect(reload).not.toHaveBeenCalled();
    expect(result).toEqual({ error: chunkError });
  });
});
