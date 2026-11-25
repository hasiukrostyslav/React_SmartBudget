import SignUpForm from '@/components/forms/SignUpForm';
import AuthFormContainer from '@/components/layouts/AuthFormContainer';

export default function SignUpPage() {
  return (
    <AuthFormContainer type="register">
      <title>Sign Up | SmartBudget</title>
      <SignUpForm />
    </AuthFormContainer>
  );
}
