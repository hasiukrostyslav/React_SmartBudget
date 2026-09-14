import * as z from 'zod';

export const SignUpSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z.email({ message: 'Please enter a valid email.' }).trim(),
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

// Sign-in checks presence only, matching the server. The complexity rules
// belong to sign-up; applying them here locks out accounts whose passwords
// predate the policy.
export const SignInSchema = z.object({
  email: z.email({ message: 'Please enter a valid email.' }).trim(),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export const ForgotPasswordSchema = z.object({
  email: z.email({ message: 'Please enter a valid email.' }).trim(),
});
