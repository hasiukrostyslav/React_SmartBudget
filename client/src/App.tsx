import { BrowserRouter, Route, Routes } from 'react-router';
import AuthLayout from './pages/auth/AuthLayout';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignUpPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
