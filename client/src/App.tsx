import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ToastContainer } from 'react-toastify';

import ProtectedRoute from './components/routes/ProtectedRoute';
import RedirectRoute from './components/routes/RedirectRoute';
import { ThemeProvider } from './context';
import AuthLayout from './pages/auth/AuthLayout';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import CardsPage from './pages/dashboard/CardsPage';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import DepositsPage from './pages/dashboard/DepositsPage';
import LoansPage from './pages/dashboard/LoansPage';
import PaymentsPage from './pages/dashboard/PaymentsPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import SavingsPage from './pages/dashboard/SavingsPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import TransactionsPage from './pages/dashboard/TransactionPage';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="auth" element={<AuthLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignUpPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
            </Route>
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="cards" element={<CardsPage />} />
              <Route path="savings" element={<SavingsPage />} />
              <Route path="loans" element={<LoansPage />} />
              <Route path="deposits" element={<DepositsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="/" element={<RedirectRoute />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
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
