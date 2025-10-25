import axios, { AxiosError } from 'axios';
import type { LoginFormInputs, SignUpFormInputs } from '@/types/types';

const baseURL = 'http://localhost:3001/api/auth';

async function getCsrfToken() {
  try {
    await axios(`${baseURL}/csrf-token`, { withCredentials: true });

    const token = document.cookie
      .split('; ')
      .find((str) => str.includes('csrf-token'))
      ?.split('=')
      .at(-1);

    return token;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }

    throw new Error('Internal server error!');
  }
}

export async function login({ email, password }: LoginFormInputs) {
  try {
    const csrfToken = await getCsrfToken();

    await axios.post(
      `${baseURL}/login`,
      {
        email,
        password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
      },
    );
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }

    throw new Error('Internal server error!');
  }
}

export async function signUp({ name, email, password }: SignUpFormInputs) {
  try {
    const csrfToken = await getCsrfToken();

    await axios.post(
      `${baseURL}/signup`,
      {
        email,
        password,
        name,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
      },
    );
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }

    throw new Error('Internal server error!');
  }
}
