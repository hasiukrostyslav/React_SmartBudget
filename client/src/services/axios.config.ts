import axios, { AxiosError } from 'axios';
import { getCsrfCookie } from '@/lib/utils/cookie';

async function getCsrfToken() {
  try {
    await axios('http://localhost:3001/api/auth/csrf-token', {
      withCredentials: true,
    });
    const token = getCsrfCookie();
    return token;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }

    throw new Error('Internal server error!');
  }
}

export const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    let csrfToken = getCsrfCookie();

    if (!csrfToken) {
      csrfToken = await getCsrfToken();
    }

    config.headers['X-CSRF-Token'] = csrfToken;

    return config;
  },
  (error) => Promise.reject(error),
);
