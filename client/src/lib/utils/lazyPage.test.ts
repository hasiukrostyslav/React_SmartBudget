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

describe('importWithReload', () => {
  beforeEach(() => sessionStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('passes a successful import through without reloading', async () => {
    const reload = vi.fn();

    await expect(
      importWithReload(async () => ({ default: 'page' }), reload),
    ).resolves.toEqual({ default: 'page' });
    expect(reload).not.toHaveBeenCalled();
  });

  it('reloads once when the import fails, and never settles meanwhile', async () => {
    const reload = vi.fn();
    const failing = () => Promise.reject(new Error('Failed to fetch module'));

    const result = await settled(importWithReload(failing, reload));

    expect(reload).toHaveBeenCalledTimes(1);
    expect(result).toBe(pending);
  });

  it('rethrows a second failure soon after reloading instead of looping', async () => {
    const reload = vi.fn();
    const error = new Error('Failed to fetch module');
    const failing = () => Promise.reject(error);

    await settled(importWithReload(failing, reload));
    const second = await settled(importWithReload(failing, reload));

    expect(reload).toHaveBeenCalledTimes(1);
    expect(second).toEqual({ error });
  });

  it('rethrows without reloading when session storage is unavailable', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const reload = vi.fn();
    const error = new Error('Failed to fetch module');

    const result = await settled(
      importWithReload(() => Promise.reject(error), reload),
    );

    expect(reload).not.toHaveBeenCalled();
    expect(result).toEqual({ error });
  });
});
