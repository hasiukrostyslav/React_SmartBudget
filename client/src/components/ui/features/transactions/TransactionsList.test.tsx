import { TooltipProvider } from '@radix-ui/react-tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeAll, describe, expect, it } from 'vitest';

import type { TransactionItem } from '@/types/types';

import { ThemeProvider } from '@/context/ThemeProvider';

import TransactionsList from './TransactionsList';

beforeAll(() => {
  localStorage.setItem('theme', 'light');
});

const items: TransactionItem[] = ['Coffee', 'Rent'].map((name, i) => ({
  transactionId: `t${i}`,
  userId: 'u1',
  transactionName: name,
  transactionCategory: 'cafe',
  transactionType: 'Expenses',
  paymentMethod: 'Card',
  currency: 'UAH',
  amount: 10 + i,
  description: null,
  status: 'COMPLETED',
  createdAt: '2026-09-01T10:00:00.000Z',
  updatedAt: '2026-09-01T10:00:00.000Z',
}));

function renderList() {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ThemeProvider>
        <MemoryRouter>
          <TooltipProvider>
            <TransactionsList data={items} />
          </TooltipProvider>
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>,
  );
}

describe('TransactionsList', () => {
  it('keeps the bulk toolbar out of the table once a row is selected', () => {
    renderList();

    const [firstRowCheckbox] = screen
      .getByRole('rowgroup')
      .querySelectorAll('[role="checkbox"]');
    fireEvent.click(firstRowCheckbox.closest('label')!);

    const table = screen.getByRole('table');
    const controlsOutsideRows = [
      ...table.querySelectorAll('button, a, input'),
    ].filter((control) => !control.closest('[role="row"]'));

    expect(
      screen.getByRole('button', { name: 'Clear selection' }),
    ).toBeTruthy();
    expect(controlsOutsideRows).toEqual([]);
  });

  it('announces how many rows are selected', () => {
    renderList();
    expect(screen.getByRole('status').textContent).toBe('');

    const checkboxes = screen
      .getByRole('rowgroup')
      .querySelectorAll('[role="checkbox"]');
    fireEvent.click(checkboxes[0].closest('label')!);
    fireEvent.click(checkboxes[1].closest('label')!);

    expect(screen.getByRole('status').textContent).toBe('2 selected');
  });
});
