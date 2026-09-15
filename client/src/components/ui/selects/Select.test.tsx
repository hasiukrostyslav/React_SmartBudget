import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { ThemeProvider } from '@/context/ThemeProvider';

import ModalTrigger from '../modals/ModalTrigger';
import Select from './Select';

beforeAll(() => {
  // jsdom has <dialog> but not its modal API.
  HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
    this.open = true;
  };
  HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
    this.open = false;
  };
  localStorage.setItem('theme', 'light');
});

function renderSelectInDialog() {
  render(
    <ThemeProvider>
      <MemoryRouter>
        <ModalTrigger
          renderTrigger={(open) => (
            <button type="button" onClick={open}>
              Open dialog
            </button>
          )}
          renderContent={() => (
            <form>
              <input aria-label="Name" defaultValue="Coffee" />
              <Select
                label="Currency"
                options={[
                  { label: 'UAH', value: 'UAH' },
                  { label: 'USD', value: 'USD' },
                ]}
                selectedValue="UAH"
                showSelectedOption
                onSelect={vi.fn()}
              />
            </form>
          )}
        />
      </MemoryRouter>
    </ThemeProvider>,
  );
  fireEvent.click(screen.getByText('Open dialog'));
  return document.querySelector<HTMLButtonElement>(
    'button[aria-haspopup="listbox"]',
  )!;
}

describe('Select inside a dialog', () => {
  it('Escape in an open dropdown closes the dropdown, not the dialog', () => {
    const trigger = renderSelectInDialog();
    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    fireEvent.keyDown(screen.getByRole('option', { name: /USD/ }), {
      key: 'Escape',
    });

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.querySelector('dialog')).not.toBeNull();
    expect(screen.getByLabelText<HTMLInputElement>('Name').value).toBe(
      'Coffee',
    );
    expect(document.activeElement).toBe(trigger);
  });

  it('Escape with no dropdown open still closes the dialog', () => {
    renderSelectInDialog();

    fireEvent.keyDown(screen.getByLabelText('Name'), { key: 'Escape' });

    expect(document.querySelector('dialog')).toBeNull();
  });
});
