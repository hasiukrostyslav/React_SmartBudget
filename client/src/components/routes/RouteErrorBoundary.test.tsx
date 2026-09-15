import { fireEvent, render, screen } from '@testing-library/react';
import { Link, MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ErrorState from '@/components/ui/feedback/ErrorState';

import RouteErrorBoundary from './RouteErrorBoundary';

let shouldThrow = true;

function FlakyPage() {
  if (shouldThrow) throw new Error('chunk failed');
  return <p>Page content</p>;
}

describe('RouteErrorBoundary', () => {
  beforeEach(() => {
    shouldThrow = true;
    // React logs every caught render error; the test expects them.
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it('retries when the current page’s link is clicked again', () => {
    render(
      <MemoryRouter initialEntries={['/transactions']}>
        <Link to="/transactions">Transactions</Link>
        <RouteErrorBoundary fallback={<p>Fallback</p>}>
          <FlakyPage />
        </RouteErrorBoundary>
      </MemoryRouter>,
    );
    expect(screen.getByText('Fallback')).toBeTruthy();

    shouldThrow = false;
    fireEvent.click(screen.getByText('Transactions'));

    expect(screen.getByText('Page content')).toBeTruthy();
  });

  it('offers a reload in the error state when asked', () => {
    render(
      <MemoryRouter>
        <ErrorState type="server" withReload />
      </MemoryRouter>,
    );

    expect(screen.getByRole('button', { name: 'Reload page' })).toBeTruthy();
  });
});
