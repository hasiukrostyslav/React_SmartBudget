import axios, { AxiosError } from 'axios';
import { getCsrfCookie } from '@/lib/utils/cookie';

const BASE_URL =
  import.meta.env.VITE_ENV === 'production'
    ? import.meta.env.VITE_SERVER_PROD_URL
    : import.meta.env.VITE_SERVER_DEV_URL;

console.log(BASE_URL);

async function getCsrfToken() {
  try {
    await axios(`${BASE_URL}/api/auth/csrf-token`, {
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
  baseURL: `${BASE_URL}/api`,
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
