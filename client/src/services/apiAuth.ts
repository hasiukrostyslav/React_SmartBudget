import type { z } from 'zod';

import { SignInSchema, SignUpSchema } from '@/lib/schemas/auth.schema';

import { toApiError } from './apiError';
import { api, resetCsrfToken } from './axios.config';

type LoginFormInputs = z.infer<typeof SignInSchema>;
type SignUpFormInputs = z.infer<typeof SignUpSchema>;

// Response bodies, as the API sends them.
export interface AuthResponse {
  success: boolean;
  user: { email: string };
}

export interface SessionUser {
  id: string;
  email: string;
  // Accounts created through OAuth in the original app have no name.
  name: string | null;
}

export interface SessionResponse {
  isAuthenticated: boolean;
  // ISO timestamp when the access token expires.
  expires: string;
  user: SessionUser;
}

export async function login({
  email,
  password,
}: LoginFormInputs): Promise<AuthResponse> {
  try {
    const res = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });

    return res.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function signUp({
  name,
  email,
  password,
}: SignUpFormInputs): Promise<AuthResponse> {
  try {
    const res = await api.post<AuthResponse>('/auth/signup', {
      email,
      password,
      name,
    });

    return res.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function getSession(): Promise<SessionResponse> {
  try {
    const res = await api.get<SessionResponse>('/auth/session');

    return res.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function signOut(): Promise<void> {
  try {
    await api.post('/auth/signout');
    resetCsrfToken();
  } catch (error) {
    throw toApiError(error);
  }
}
