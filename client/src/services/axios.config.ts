import axios, { AxiosError } from 'axios';
import { getCsrfCookie } from '@/lib/utils/cookie';

const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  throw new Error('❌ VITE_API_URL is missing');
}

/** Token from last /csrf-token response; required when API is on another origin (cookie not in document.cookie). */
let cachedCsrfToken: string | null = null;

async function getCsrfToken() {
  try {
    const { data } = await axios.get<{ success: boolean; csrfToken: string }>(
      `${BASE_URL}/api/auth/csrf-token`,
      { withCredentials: true },
    );
    const token = data.csrfToken ?? getCsrfCookie();
    if (token) {
      cachedCsrfToken = token;
    }
    return token ?? null;
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
    let csrfToken =
      cachedCsrfToken ?? getCsrfCookie();

    if (!csrfToken) {
      csrfToken = await getCsrfToken();
    }

    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error),
);
