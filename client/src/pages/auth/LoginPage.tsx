import LoginForm from '@/components/forms/LoginForm';
import AuthFormContainer from '@/components/containers/AuthFormContainer';
import AuthLink from '@/components/ui/AuthLink';

export default function LoginPage() {
  return (
    <AuthFormContainer heading="Login to account">
      <title>Sign In | SmartBudget</title>
      <LoginForm />
      <p className="mt-3 text-xs text-slate-400">
        Don&apos;t have an account?{' '}
        <AuthLink href="/auth/signup">Sign Up</AuthLink>
      </p>
    </AuthFormContainer>
  );
}
