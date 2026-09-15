import { describe, expect, it } from 'vitest';

import {
  ForgotPasswordSchema,
  SignInSchema,
  SignUpSchema,
} from './auth.schemas';

const password = 'Passw0rd!';
// 242 + '@example.com' (12) = 254 characters, the longest valid address.
const longestEmail = `${'a'.repeat(242)}@example.com`;
const tooLongEmail = `a${longestEmail}`;

function lengthIssues(result: { error?: { issues: { message: string }[] } }) {
  return (result.error?.issues ?? [])
    .map((issue) => issue.message)
    .filter((message) => message.includes('at most'));
}

describe('auth schemas: upper bounds (S-P3-1)', () => {
  it('accepts a 100-character name and a 254-character email', () => {
    const result = SignUpSchema.safeParse({
      name: 'n'.repeat(100),
      email: longestEmail,
      password,
    });

    expect(result.success).toBe(true);
  });

  it('rejects a name over 100 characters', () => {
    const result = SignUpSchema.safeParse({
      name: 'n'.repeat(101),
      email: 'ann@example.com',
      password,
    });

    expect(lengthIssues(result)).toEqual([
      'Name must be at most 100 characters',
    ]);
  });

  it('rejects an email over 254 characters on every auth form', () => {
    for (const schema of [SignUpSchema, SignInSchema, ForgotPasswordSchema]) {
      const result = schema.safeParse({
        name: 'Ann',
        email: tooLongEmail,
        password,
      });

      expect(lengthIssues(result)).toEqual([
        'Email must be at most 254 characters',
      ]);
    }
  });
});
