import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ToastContainer } from 'react-toastify';

import GuestRoute from './components/routes/GuestRoute';
import ProtectedRoute from './components/routes/ProtectedRoute';
import RedirectRoute from './components/routes/RedirectRoute';
import RouteErrorBoundary from './components/routes/RouteErrorBoundary';
import { ThemeProvider } from './context';
import { lazyPage } from './lib/utils/lazyPage';
import { shouldRetryQuery } from './lib/utils/queryRetry';
import AuthLayout from './pages/auth/AuthLayout';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import ErrorPage from './pages/ErrorPage';
import NotFound from './pages/NotFound';

// Pages load on demand: the login screen doesn't ship the dashboard, and
// each dashboard page downloads only when it is first visited. lazyPage
// reloads once if a chunk fails to load, e.g. after a deploy.
const ForgotPasswordPage = lazyPage(
  () => import('./pages/auth/ForgotPasswordPage'),
);
const LoginPage = lazyPage(() => import('./pages/auth/LoginPage'));
const SignUpPage = lazyPage(() => import('./pages/auth/SignUpPage'));
const CardsPage = lazyPage(() => import('./pages/dashboard/CardsPage'));
const DashboardPage = lazyPage(() => import('./pages/dashboard/DashboardPage'));
const DepositsPage = lazyPage(() => import('./pages/dashboard/DepositsPage'));
const LoansPage = lazyPage(() => import('./pages/dashboard/LoansPage'));
const PaymentsPage = lazyPage(() => import('./pages/dashboard/PaymentsPage'));
const ProfilePage = lazyPage(() => import('./pages/dashboard/ProfilePage'));
const SavingsPage = lazyPage(() => import('./pages/dashboard/SavingsPage'));
const SettingsPage = lazyPage(() => import('./pages/dashboard/SettingsPage'));
const TransactionsPage = lazyPage(
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
