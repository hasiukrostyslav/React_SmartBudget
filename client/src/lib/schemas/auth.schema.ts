import * as z from 'zod';

export const SignUpSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .max(100, { message: 'Name must be at most 100 characters long.' })
    .trim(),
  email: z
    .email({ message: 'Enter a valid email.' })
    .max(254, { message: 'Email must be at most 254 characters long.' })
    .trim(),
  password: z
    .string()
    .min(8, { message: 'Password should be at least 8 characters long.' })
    .regex(/[a-zA-Z]/, {
      message: 'Password should contain at least one letter.',
    })
    .regex(/[0-9]/, { message: 'Password should contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Password should contain at least one special character.',
    })
    .trim(),
});

export const SignInSchema = z.object({
  email: z
    .email({ message: 'Enter a valid email.' })
    .max(254, { message: 'Email must be at most 254 characters long.' })
    .trim(),
  password: z.string().min(1, { message: 'Enter your password.' }),
});

export const ForgotPasswordSchema = z.object({
  email: z
    .email({ message: 'Enter a valid email.' })
    .max(254, { message: 'Email must be at most 254 characters long.' })
    .trim(),
});
