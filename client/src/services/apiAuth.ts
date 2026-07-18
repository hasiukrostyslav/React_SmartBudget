import { AxiosError } from 'axios';
import type { z } from 'zod';

import { SignInSchema, SignUpSchema } from '@/lib/schemas/auth.schema';

import { api, resetCsrfToken } from './axios.config';

type LoginFormInputs = z.infer<typeof SignInSchema>;
type SignUpFormInputs = z.infer<typeof SignUpSchema>;

export async function login({ email, password }: LoginFormInputs) {
  try {
    const res = await api.post('/auth/login', {
      email,
      password,
    });

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }

    throw new Error('Internal server error!');
  }
}

export async function signUp({ name, email, password }: SignUpFormInputs) {
  try {
    const res = await api.post('/auth/signup', {
      email,
      password,
      name,
    });

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }

    throw new Error('Internal server error!');
  }
}

export async function getSession() {
  try {
    const res = await api.get('/auth/session');

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }

    throw new Error('Internal server error!');
  }
}

export async function signOut() {
  try {
    await api.post('/auth/signout');
    resetCsrfToken();
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }

    throw new Error('Internal server error!');
  }
}
