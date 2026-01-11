import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from './context';
import AuthLayout from './pages/auth/AuthLayout';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import NotFound from './pages/NotFound';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import RedirectRoute from './components/routes/RedirectRoute';
import ProtectedRoute from './components/routes/ProtectedRoute';
import TransactionsPage from './pages/dashboard/TransactionPage';
import PaymentsPage from './pages/dashboard/PaymentsPage';
import CardsPage from './pages/dashboard/CardsPage';
import SavingsPage from './pages/dashboard/SavingsPage';
import LoansPage from './pages/dashboard/LoansPage';
import DepositsPage from './pages/dashboard/DepositsPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import SettingsPage from './pages/dashboard/SettingsPage';

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
      <ToastContainer limit={1} />
      <ReactQueryDevtools buttonPosition="top-left" />
    </QueryClientProvider>
  );
}
