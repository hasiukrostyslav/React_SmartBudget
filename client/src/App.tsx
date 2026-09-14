import { lazy } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ToastContainer } from 'react-toastify';

import GuestRoute from './components/routes/GuestRoute';
import ProtectedRoute from './components/routes/ProtectedRoute';
import RedirectRoute from './components/routes/RedirectRoute';
import RouteErrorBoundary from './components/routes/RouteErrorBoundary';
import { ThemeProvider } from './context';
import { shouldRetryQuery } from './lib/utils/queryRetry';
import AuthLayout from './pages/auth/AuthLayout';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import ErrorPage from './pages/ErrorPage';
import NotFound from './pages/NotFound';

// Pages load on demand: the login screen doesn't ship the dashboard, and
// each dashboard page downloads only when it is first visited.
const ForgotPasswordPage = lazy(
  () => import('./pages/auth/ForgotPasswordPage'),
);
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignUpPage = lazy(() => import('./pages/auth/SignUpPage'));
const CardsPage = lazy(() => import('./pages/dashboard/CardsPage'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const DepositsPage = lazy(() => import('./pages/dashboard/DepositsPage'));
const LoansPage = lazy(() => import('./pages/dashboard/LoansPage'));
const PaymentsPage = lazy(() => import('./pages/dashboard/PaymentsPage'));
const ProfilePage = lazy(() => import('./pages/dashboard/ProfilePage'));
const SavingsPage = lazy(() => import('./pages/dashboard/SavingsPage'));
const SettingsPage = lazy(() => import('./pages/dashboard/SettingsPage'));
const TransactionsPage = lazy(
  () => import('./pages/dashboard/TransactionPage'),
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetryQuery,
      // Data this fresh is reused on mount and window focus, not refetched.
      staleTime: 30_000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <RouteErrorBoundary fallback={<ErrorPage />}>
            <Routes>
              <Route
                path="auth"
                element={
                  <GuestRoute>
                    <AuthLayout />
                  </GuestRoute>
                }
              >
                <Route index element={<RedirectRoute />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="signup" element={<SignUpPage />} />
                <Route
                  path="forgot-password"
                  element={<ForgotPasswordPage />}
                />
              </Route>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="transactions" element={<TransactionsPage />} />
                <Route path="payments" element={<PaymentsPage />} />
                <Route path="cards" element={<CardsPage />} />
                <Route path="savings" element={<SavingsPage />} />
                <Route path="loans" element={<LoansPage />} />
                <Route path="deposits" element={<DepositsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route index element={<RedirectRoute />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </RouteErrorBoundary>
        </BrowserRouter>
      </ThemeProvider>
      <ToastContainer
        limit={3}
        closeButton={false}
        hideProgressBar
        toastStyle={{
          background: 'transparent',
          boxShadow: 'none',
          padding: 0,
          minHeight: 'unset',
          overflow: 'visible',
        }}
      />
      <ReactQueryDevtools buttonPosition="top-left" />
    </QueryClientProvider>
  );
}
