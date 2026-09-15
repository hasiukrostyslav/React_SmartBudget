import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation, useNavigate } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useSearchInput } from './useSearchInput';

function SearchBox() {
  const { searchQuery, handleChange, handleClear } = useSearchInput({
    isUpdateSearchParam: true,
  });
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <input aria-label="Search" value={searchQuery} onChange={handleChange} />
      <output aria-label="URL">{location.search}</output>
      <button type="button" onClick={handleClear}>
        Clear
      </button>
      <button
        type="button"
        onClick={() => navigate('/transactions?search=zzz')}
      >
        Other search
      </button>
      <button type="button" onClick={() => navigate(-1)}>
        Back
      </button>
      <button type="button" onClick={() => navigate(1)}>
        Forward
      </button>
    </>
  );
}

function renderSearchBox(
  entries = ['/transactions?page=2'],
  index = entries.length - 1,
) {
  vi.useFakeTimers();
  render(
    <MemoryRouter initialEntries={entries} initialIndex={index}>
      <SearchBox />
    </MemoryRouter>,
  );
  const input = screen.getByLabelText<HTMLInputElement>('Search');
  const type = (value: string) =>
    fireEvent.change(input, { target: { value } });
  return { input, type };
}

describe('useSearchInput', () => {
  afterEach(() => vi.useRealTimers());

  it('keeps a keystroke typed while the debounced URL write is rendering', () => {
    const { input, type } = renderSearchBox();

    act(() => type('abc'));
    // The timer fires and navigates (a transition); "d" is typed before that
    // transition commits.
    act(() => {
      vi.advanceTimersByTime(300);
      type('abcd');
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(input.value).toBe('abcd');
    expect(screen.getByLabelText('URL').textContent).toContain('search=abcd');
  });

  it('writes the query after typing pauses, resetting the page', () => {
    const { type } = renderSearchBox();

    act(() => type('coffee'));
    expect(screen.getByLabelText('URL').textContent).toBe('?page=2');

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByLabelText('URL').textContent).toBe(
      '?page=1&search=coffee',
    );
  });

  it('shows the URL’s query again after Back and Forward', () => {
    const { input, type } = renderSearchBox();

    act(() => type('abc'));
    act(() => {
      vi.advanceTimersByTime(300);
    });
    act(() => fireEvent.click(screen.getByText('Other search')));
    expect(input.value).toBe('zzz');

    act(() => fireEvent.click(screen.getByText('Back')));
    expect(input.value).toBe('abc');

    act(() => fireEvent.click(screen.getByText('Forward')));
    expect(input.value).toBe('zzz');
  });

  it('syncs a later Back to the written query when another navigation superseded the write', () => {
    const { input, type } = renderSearchBox();

    act(() => type('abc'));
    act(() => {
      vi.advanceTimersByTime(300); // writes abc (a transition)
      fireEvent.click(screen.getByText('Other search')); // before it commits
    });
    expect(input.value).toBe('zzz');

    act(() => fireEvent.click(screen.getByText('Back')));

    expect(screen.getByLabelText('URL').textContent).toContain('search=abc');
    expect(input.value).toBe('abc');
  });

  it('syncs a later Back to the written query when Clear superseded the write', () => {
    const { input, type } = renderSearchBox([
      '/transactions?page=1&search=abc',
      '/transactions?page=3',
    ]);

    act(() => type('abc'));
    act(() => {
      vi.advanceTimersByTime(300); // writes abc (a transition)
      fireEvent.click(screen.getByText('Clear')); // before it commits
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    act(() => fireEvent.click(screen.getByText('Back')));

    expect(screen.getByLabelText('URL').textContent).toContain('search=abc');
    expect(input.value).toBe('abc');
  });
});
