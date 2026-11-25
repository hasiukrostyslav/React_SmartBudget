import LoginForm from '@/components/forms/LoginForm';
import AuthFormContainer from '@/components/layouts/AuthFormContainer';

export default function LoginPage() {
  return (
    <AuthFormContainer type="login">
      <title>Sign In | SmartBudget</title>
      <LoginForm />
    </AuthFormContainer>
  );
}
