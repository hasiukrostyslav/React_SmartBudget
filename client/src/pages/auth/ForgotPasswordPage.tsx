import ForgotPasswordForm from '@/components/forms/ForgotPasswordForm';
import AuthFormContainer from '@/components/layouts/AuthFormContainer';

export default function ForgotPasswordPage() {
  return (
    <AuthFormContainer type="reset">
      <title>Forgot Password | SmartBudget</title>

      <ForgotPasswordForm />
    </AuthFormContainer>
  );
}
