import { Link } from 'react-router';
import AuthFormContainer from '@/components/containers/AuthFormContainer';
import ForgotPasswordForm from '@/components/forms/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <AuthFormContainer heading="Forgot Password?">
      <title>Forgot Password | SmartBudget</title>
      <p className="my-2 text-center text-xs text-slate-600 dark:text-slate-200">
        Enter your email and we&apos;ll send you a link to reset your password.
      </p>
      <ForgotPasswordForm />
      <Link
        className="outline-round-sm mt-3 text-sm text-blue-600 hover:text-blue-500 dark:text-slate-300 hover:dark:text-slate-400"
        to="/auth/login"
      >
        Back to Login
      </Link>
    </AuthFormContainer>
  );
}
