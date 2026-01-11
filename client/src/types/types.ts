import { icons } from '@/lib/constants/icons';

import { SignInSchema, SignUpSchema } from '@/lib/schemas/schema';
import type z from 'zod';

// Icon names
export type IconName = (typeof icons)[number]['role'];

// Toast Component types
interface ToastStyleProps<I extends IconName> {
  icon: I;
  bgIcon: string;
  border: string;
  bg: string;
}

export interface ToastRoles {
  success: ToastStyleProps<'check'>;
  error: ToastStyleProps<'close'>;
  info: ToastStyleProps<'info'>;
  warning: ToastStyleProps<'warning'>;
}

// Auth input with icons types
export interface InputIcons {
  name: Extract<IconName, 'name'>;
  email: Extract<IconName, 'email'>;
  password: Extract<IconName, 'password'>;
}

export type LoginFormInputs = z.infer<typeof SignInSchema>;
export type SignUpFormInputs = z.infer<typeof SignUpSchema>;
