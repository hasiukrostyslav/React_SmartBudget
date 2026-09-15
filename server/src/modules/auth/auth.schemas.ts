import { z } from 'zod';

// Upper bounds on stored free text. 254 is the longest valid email address.
const MAX_NAME = 100;
const MAX_EMAIL = 254;

const passwordSchema = z
  .string()
  .trim()
  .min(8, 'Password must be at least 8 characters')
  .refine((val) => /[a-zA-Z]/.test(val), 'Password must contain a letter')
  .refine((val) => /[0-9]/.test(val), 'Password must contain a number')
  .refine(
    (val) => /[^a-zA-Z0-9]/.test(val),
    'Password must contain a special character',
  );

export const SignUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(MAX_NAME, `Name must be at most ${MAX_NAME} characters`),
  email: z
    .string()
    .trim()
    .max(MAX_EMAIL, `Email must be at most ${MAX_EMAIL} characters`)
    .email('Invalid email format'),
  password: passwordSchema,
});

// Sign-in checks presence only. Applying the signup complexity policy here
// locked out any account whose password predates the policy, and advertised
// the policy to unauthenticated callers.
export const SignInSchema = z.object({
  email: z
    .string()
    .trim()
    .max(MAX_EMAIL, `Email must be at most ${MAX_EMAIL} characters`)
    .email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .max(MAX_EMAIL, `Email must be at most ${MAX_EMAIL} characters`)
    .email('Invalid email format'),
});

export type SignUpDto = z.infer<typeof SignUpSchema>;
export type SignInDto = z.infer<typeof SignInSchema>;
export type ForgotPasswordDto = z.infer<typeof ForgotPasswordSchema>;
