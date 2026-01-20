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
import PublicRoutes from './components/routes/PublicRoutes';
import ProtectedRoutes from './components/routes/ProtectedRoutes';
import TransactionsPage from './pages/dashboard/TransactionPage';
import PaymentsPage from './pages/dashboard/PaymentsPage';
import CardsPage from './pages/dashboard/CardsPage';
import SavingsPage from './pages/dashboard/SavingsPage';
import LoansPage from './pages/dashboard/LoansPage';
import DepositsPage from './pages/dashboard/DepositsPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import SettingsPage from './pages/dashboard/SettingsPage';
import NotFoundGuard from './components/routes/NotFoundGuard';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="auth"
              element={
                <PublicRoutes>
                  <AuthLayout />
                </PublicRoutes>
              }
            >
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignUpPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
            </Route>
            <Route
              path="dashboard"
              element={
                <ProtectedRoutes>
                  <DashboardLayout />
                </ProtectedRoutes>
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
            <Route
              path="*"
              element={
                <NotFoundGuard>
                  <NotFound />
                </NotFoundGuard>
              }
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
      <ToastContainer limit={1} />
      <ReactQueryDevtools buttonPosition="top-left" />
    </QueryClientProvider>
  );
}
