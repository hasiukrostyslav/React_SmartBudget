import { describe, expect, it } from 'vitest';

import { SearchParamsSchema } from './transactions.schemas';

// These are the params the API advertises. Before this schema existed they
// were parsed and then ignored, so the contract is pinned here.
describe('SearchParamsSchema', () => {
  it('applies defaults when nothing is supplied', () => {
    const parsed = SearchParamsSchema.parse({});

    expect(parsed).toEqual({
      limit: 10,
      page: 1,
      sort: 'date',
      order: 'desc',
      search: '',
      category: [],
      type: [],
      status: [],
      currency: [],
      account: [],
    });
  });

  it('splits comma-separated filters and validates each value', () => {
    const parsed = SearchParamsSchema.parse({
      category: 'cafe, pet_care',
      type: 'Expenses',
      status: 'COMPLETED,PENDING',
      currency: 'USD',
      account: 'Visa, Cash',
    });

    expect(parsed.category).toEqual(['cafe', 'pet_care']);
    expect(parsed.type).toEqual(['Expenses']);
    expect(parsed.status).toEqual(['COMPLETED', 'PENDING']);
    expect(parsed.currency).toEqual(['USD']);
    expect(parsed.account).toEqual(['Visa', 'Cash']);
  });

  it('treats the legacy "all" sentinel and blanks as no filter', () => {
    const parsed = SearchParamsSchema.parse({
      category: 'all',
      type: '',
      status: '  ',
    });

    expect(parsed.category).toEqual([]);
    expect(parsed.type).toEqual([]);
    expect(parsed.status).toEqual([]);
  });

  it('rejects an unknown enum value instead of silently dropping it', () => {
    expect(
      SearchParamsSchema.safeParse({ category: 'not_a_category' }).success,
    ).toBe(false);
    expect(SearchParamsSchema.safeParse({ status: 'MADE_UP' }).success).toBe(
      false,
    );
    expect(SearchParamsSchema.safeParse({ type: 'Refund' }).success).toBe(
      false,
    );
  });

  it('coerces and bounds pagination', () => {
    expect(SearchParamsSchema.parse({ limit: '25', page: '3' })).toMatchObject({
      limit: 25,
      page: 3,
    });

    for (const bad of [
      { limit: '0' },
      { limit: 'abc' },
      { limit: '101' },
      { page: '0' },
      { page: '-1' },
      { page: '1.5' },
    ]) {
      expect(
        SearchParamsSchema.safeParse(bad).success,
        JSON.stringify(bad),
      ).toBe(false);
    }
  });

  it('trims the search term but keeps it otherwise verbatim', () => {
    expect(SearchParamsSchema.parse({ search: "  o'brien %_  " }).search).toBe(
      "o'brien %_",
    );
  });

  it('caps a long search term instead of rejecting it (S-P3-1)', () => {
    const parsed = SearchParamsSchema.parse({
      search: `  ${'a'.repeat(150)}  `,
    });

    expect(parsed.search).toBe('a'.repeat(100));
  });

  it('rejects an unknown sort key and order', () => {
    expect(SearchParamsSchema.safeParse({ sort: 'id' }).success).toBe(false);
    expect(SearchParamsSchema.safeParse({ order: 'up' }).success).toBe(false);
  });
});
