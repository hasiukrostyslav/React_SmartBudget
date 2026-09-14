import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { getCsrfCookie } from '@/lib/utils/cookie';

import { toApiError } from './apiError';

type RetryableRequest = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _csrfRetry?: boolean;
};

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

const BASE_URL = import.meta.env.VITE_API_EXPRESS_URL;

if (!BASE_URL) {
  throw new Error('❌ VITE_API_EXPRESS_URL is missing');
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
    throw toApiError(error);
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

    // A CSRF token cached before the server re-bound or rotated it is rejected
    // with EBADCSRFTOKEN. Fetch a fresh token and retry the request once.
    const code = (error.response?.data as { code?: unknown } | undefined)?.code;
    if (
      status === 403 &&
      code === 'EBADCSRFTOKEN' &&
      originalRequest &&
      !originalRequest._csrfRetry
    ) {
      originalRequest._csrfRetry = true;
      resetCsrfToken();
      await getCsrfToken();
      return api(originalRequest);
    }

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
