import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignInSchema } from '@/lib/schemas/schema';
import { useLogin } from '@/hooks/useLogin';
import type { LoginFormInputs } from '@/types/types';
import Input from '../ui/Input';
import AuthLink from '../ui/AuthLink';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import FormError from '../ui/FormError';

export default function LoginForm() {
  const { login, isPending, error } = useLogin();
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm({ resolver: zodResolver(SignInSchema) });

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => login(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className="mt-6 flex w-full flex-col gap-2"
    >
      <Input
        label="Email address"
        {...register('email')}
        placeholder="Please enter your email"
        disabled={isPending}
        error={errors.email?.message}
      />
      <Input
        label="Password"
        {...register('password')}
        placeholder="Please enter your password"
        disabled={isPending}
        error={errors.password?.message}
        isPassword
      />
      <AuthLink href="/auth/forgot-password" className="mb-3 self-end">
        Forgot password
      </AuthLink>
      {error && <FormError message={error.message} />}
      <Button color="black" type="submit" disabled={isPending}>
        {!isPending ? (
          'Sign In'
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Icon name="loader-circle" className="animate-spin" />
            Submit
          </span>
        )}
      </Button>
    </form>
  );
}
