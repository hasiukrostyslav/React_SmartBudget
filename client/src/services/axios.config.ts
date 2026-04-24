import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { getCsrfCookie } from '@/lib/utils/cookie';

type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

/** Single in-flight refresh so concurrent 401s share one POST /auth/refresh. */
let refreshAccessTokenPromise: Promise<void> | null = null;

function refreshAccessToken() {
  if (!refreshAccessTokenPromise) {
    refreshAccessTokenPromise = api
      .post('/auth/refresh')
      .then(() => undefined)
      .finally(() => {
        refreshAccessTokenPromise = null;
      });
  }
  return refreshAccessTokenPromise;
}

function shouldSkipAuthRefresh(config: InternalAxiosRequestConfig): boolean {
  const url = config.url ?? '';
  return (
    url.includes('/auth/login') ||
    url.includes('/auth/signup') ||
    url.includes('/auth/refresh') ||
    url.includes('/auth/signout')
  );
}

const serverType = import.meta.env.VITE_API_SERVER;
const BASE_URL =
  serverType === 'nest'
    ? import.meta.env.VITE_API_NEST_URL
    : import.meta.env.VITE_API_EXPRESS_URL;

if (!BASE_URL) {
  throw new Error('❌ VITE_API_URL is missing');
}

/** Token from last /csrf-token response; required when API is on another origin (cookie not in document.cookie). */
let cachedCsrfToken: string | null = null;

export function resetCsrfToken() {
  cachedCsrfToken = null;
}

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
    let csrfToken = cachedCsrfToken ?? getCsrfCookie();

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

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined;
    const status = error.response?.status;

    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      shouldSkipAuthRefresh(originalRequest)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await refreshAccessToken();
      return api(originalRequest);
    } catch {
      return Promise.reject(error);
    }
  },
);
