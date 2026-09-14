import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Input from './Input';

describe('Input', () => {
  it('renders the type it is given, whatever the field is named', () => {
    render(<Input name="confirmPassword" label="Confirm" type="password" />);

    expect(screen.getByLabelText('Confirm').getAttribute('type')).toBe(
      'password',
    );
  });

  it('keeps autocomplete off unless the field declares a purpose', () => {
    render(
      <>
        <Input name="search" label="Search" />
        <Input name="email" label="Email" autoComplete="email" />
      </>,
    );

    expect(screen.getByLabelText('Search').getAttribute('autocomplete')).toBe(
      'off',
    );
    expect(screen.getByLabelText('Email').getAttribute('autocomplete')).toBe(
      'email',
    );
  });

  it('ties the error message to the field', () => {
    render(<Input name="amount" label="Amount" error="Amount is required." />);

    const input = screen.getByLabelText('Amount');
    const message = screen.getByRole('alert');

    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(message.id);
    expect(message.textContent).toContain('Amount is required.');
  });

  it('sets min=0 on number inputs only', () => {
    render(
      <>
        <Input name="amount" label="Amount" type="number" />
        <Input name="name" label="Name" />
      </>,
    );

    expect(screen.getByLabelText('Amount').getAttribute('min')).toBe('0');
    expect(screen.getByLabelText('Name').hasAttribute('min')).toBe(false);
  });

  it('marks nothing invalid without an error', () => {
    render(<Input name="amount" label="Amount" />);

    const input = screen.getByLabelText('Amount');
    expect(input.hasAttribute('aria-invalid')).toBe(false);
    expect(input.hasAttribute('aria-describedby')).toBe(false);
  });
});
