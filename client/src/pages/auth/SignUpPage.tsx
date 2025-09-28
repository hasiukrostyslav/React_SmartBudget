import AuthForm from '@/components/AuthForm';
import AuthLink from '@/components/AuthLink';
import SignUpForm from '@/components/SignUpForm';

export default function SignUpPage() {
  return (
    <AuthForm heading="Create an account">
      <title>Sign Up | SmartBudget</title>
      <SignUpForm />
      <p className="text-xs mt-3 text-slate-400">
        Already have an account? <AuthLink href="/auth/login">Sign In</AuthLink>
      </p>
    </AuthForm>
  );
}
