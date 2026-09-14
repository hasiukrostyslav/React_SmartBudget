import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { useLogin } from './useLogin';
import { useSignOut } from './useSignOut';
import { useSignUp } from './useSignUp';

vi.mock('@/services/apiAuth', () => ({
  login: vi.fn(async () => ({ success: true })),
  signUp: vi.fn(async () => ({ success: true })),
  signOut: vi.fn(async () => ({ success: true })),
}));

const TRANSACTIONS_KEY = ['transactions', { page: '1' }];

// A tab where someone has already browsed their transactions.
function renderWithCache<T>(hook: () => T) {
  const queryClient = new QueryClient();
  queryClient.setQueryData(['session'], { user: { id: 'alice' } });
  queryClient.setQueryData(TRANSACTIONS_KEY, {
    transactions: [{ transactionId: 'alice-private' }],
    transactionCount: 1,
  });

  const { result } = renderHook(hook, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    ),
  });
  return { result, queryClient };
}

describe('auth mutations clear the previous user’s cached data', () => {
  it('sign-out removes every cached query', async () => {
    const { result, queryClient } = renderWithCache(() => useSignOut());

    act(() => result.current.signOut());

    await waitFor(() =>
      expect(queryClient.getQueryCache().getAll()).toEqual([]),
    );
  });

  it('sign-in removes cached transactions before the new session renders', async () => {
    const { result, queryClient } = renderWithCache(() => useLogin());

    act(() =>
      result.current.login({ email: 'bob@example.com', password: 'x' }),
    );

    await waitFor(() =>
      expect(queryClient.getQueryData(TRANSACTIONS_KEY)).toBeUndefined(),
    );
    expect(queryClient.getQueryState(['session'])?.isInvalidated).toBe(true);
  });

  it('sign-up removes cached transactions too', async () => {
    const { result, queryClient } = renderWithCache(() => useSignUp());

    act(() =>
      result.current.signUp({
        name: 'Bob',
        email: 'bob@example.com',
        password: 'Passw0rd!',
      }),
    );

    await waitFor(() =>
      expect(queryClient.getQueryData(TRANSACTIONS_KEY)).toBeUndefined(),
    );
  });
});
