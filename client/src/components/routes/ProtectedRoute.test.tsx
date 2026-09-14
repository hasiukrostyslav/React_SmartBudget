import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { useAuth } from '@/hooks/useAuth';

import ProtectedRoute from './ProtectedRoute';

vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }));

type AuthState = ReturnType<typeof useAuth>;

const session = { user: { id: 'u1', email: 'ann@example.com', name: 'Ann' } };

function renderDashboard(auth: Partial<AuthState>) {
  vi.mocked(useAuth).mockReturnValue({
    session: undefined,
    isFetching: false,
    error: null,
    ...auth,
  } as unknown as AuthState);

  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <p>Dashboard</p>
            </ProtectedRoute>
          }
        />
        <Route path="/auth/login" element={<p>Login page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  it('shows progress while the session is being checked', () => {
    renderDashboard({ isFetching: true });

    expect(screen.getByText('Checking your session')).toBeDefined();
    expect(screen.queryByText('Dashboard')).toBeNull();
    expect(screen.queryByText('Login page')).toBeNull();
  });

  it('renders the page for a signed-in user, even during a refetch', () => {
    renderDashboard({ session, isFetching: true } as Partial<AuthState>);

    expect(screen.getByText('Dashboard')).toBeDefined();
  });

  it('redirects to login once the check settles without a session', () => {
    renderDashboard({ isFetching: false });

    expect(screen.getByText('Login page')).toBeDefined();
  });

  it('redirects to login when the check itself failed', () => {
    renderDashboard({ error: new Error('Network Error'), isFetching: true });

    expect(screen.getByText('Login page')).toBeDefined();
  });
});
