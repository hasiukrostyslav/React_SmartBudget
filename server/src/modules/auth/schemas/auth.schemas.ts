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

export const SignInSchema = z.object({
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

export const ForgotPasswordSchema = z.object({
  email: z.email({ message: 'Please enter a valid email.' }).trim(),
});

export type SignInDto = z.infer<typeof SignInSchema>;
export type SignUpDto = z.infer<typeof SignUpSchema>;
export type ForgotPasswordDto = z.infer<typeof ForgotPasswordSchema>;
