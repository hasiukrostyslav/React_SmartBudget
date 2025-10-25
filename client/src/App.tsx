import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ToastContainer } from 'react-toastify';
import AuthLayout from './pages/auth/AuthLayout';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<SignUpPage />} />
            <Route
              path="/auth/forgot-password"
              element={<ForgotPasswordPage />}
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer limit={1} />
      <ReactQueryDevtools buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
}
