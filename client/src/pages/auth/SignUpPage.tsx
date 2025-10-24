import SignUpForm from '@/components/forms/SignUpForm';
import AuthFormContainer from '@/components/layouts/AuthFormContainer';
import AuthLink from '@/components/ui/AuthLink';

export default function SignUpPage() {
  return (
    <AuthFormContainer heading="Create an account">
      <title>Sign Up | SmartBudget</title>
      <SignUpForm />
      <p className="mt-3 text-xs text-slate-400">
        Already have an account? <AuthLink href="/auth/login">Sign In</AuthLink>
      </p>
    </AuthFormContainer>
  );
}
