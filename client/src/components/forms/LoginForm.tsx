import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';

import { INPUT_PLACEHOLDER } from '@/lib/constants/messages';
import { SignInSchema } from '@/lib/schemas/auth.schema';
import { applyServerFieldErrors } from '@/lib/utils/formErrors';
import { useLogin } from '@/hooks/useLogin';
import { usePasswordVisibility } from '@/hooks/usePasswordVisibility';

import Button from '../ui/buttons/Button';
import FormError from '../ui/feedback/FormError';
import Input from '../ui/inputs/Input';
import AuthLink from '../ui/links/AuthLink';

type FormInputs = z.infer<typeof SignInSchema>;

export default function LoginForm() {
  const { login, isPending, error } = useLogin();
  const { buttonRole, isVisible, toggleVisibility } = usePasswordVisibility();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(SignInSchema) });

  const onSubmit: SubmitHandler<FormInputs> = (data) =>
    login(data, {
      onError: (error) =>
        applyServerFieldErrors(error, setError, ['email', 'password']),
    });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4"
    >
      <Input
        label="Email"
        {...register('email')}
        placeholder={INPUT_PLACEHOLDER.email}
        disabled={isPending}
        error={errors.email?.message}
        iconName="email"
        autoComplete="email"
      />
      <Input
        label="Password"
        {...register('password')}
        placeholder={INPUT_PLACEHOLDER.password}
        disabled={isPending}
        error={errors.password?.message}
        iconName="password"
        autoComplete="current-password"
        type={isVisible ? 'text' : 'password'}
        trailingButton={{
          role: buttonRole,
          onClick: toggleVisibility,
        }}
      />
      <AuthLink href="/auth/forgot-password" className="mb-3 self-end">
        Forgot password?
      </AuthLink>

      {error && <FormError message={error.message} />}

      <Button type="submit" variant="primary" size="form" isLoading={isPending}>
        Sign In
      </Button>
    </form>
  );
}
