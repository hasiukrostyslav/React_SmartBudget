import AuthForm from '@/components/AuthForm';
import AuthLink from '@/components/AuthLink';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <AuthForm heading="Login to account">
      <title>Sign In | SmartBudget</title>
      <LoginForm />
      <p className="text-xs mt-3 text-slate-400">
        Don&apos;t have an account?{' '}
        <AuthLink href="/auth/signup">Sign Up</AuthLink>
      </p>
    </AuthForm>
  );
}
