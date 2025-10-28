import { AxiosError } from 'axios';
import { api } from './axios.config';
import type { LoginFormInputs, SignUpFormInputs } from '@/types/types';

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

export async function signOut() {
  try {
    await api.post('/auth/signout');
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }

    throw new Error('Internal server error!');
  }
}
