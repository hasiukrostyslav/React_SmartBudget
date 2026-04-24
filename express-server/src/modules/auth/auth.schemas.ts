import { z } from 'zod';

const passwordSchema = z
  .string()
  .trim()
  .min(8, 'Password must be at least 8 characters')
  .refine((val) => /[a-zA-Z]/.test(val), 'Password must contain a letter')
  .refine((val) => /[0-9]/.test(val), 'Password must contain a number')
  .refine((val) => /[^a-zA-Z0-9]/.test(val), 'Password must contain a special character');

export const SignUpSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Invalid email format'),
  password: passwordSchema,
});

export const SignInSchema = z.object({
  email: z.string().trim().email('Invalid email format'),
  password: passwordSchema,
});

export const ForgotPasswordSchema = z.object({
  email: z.string().trim().email('Invalid email format'),
});

export type SignUpDto = z.infer<typeof SignUpSchema>;
export type SignInDto = z.infer<typeof SignInSchema>;
export type ForgotPasswordDto = z.infer<typeof ForgotPasswordSchema>;

// hashedPassword matches the field name used when creating a user in the DB
export type NewUserDto = { id: string; hashedPassword: string } & Omit<SignUpDto, 'password'>;
