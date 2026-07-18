import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';

import type { LoginFormInputs } from '@/types/types';

import { INPUT_PLACEHOLDER } from '@/lib/constants/messages';
import { SignInSchema } from '@/lib/schemas/auth.schema';
import { useLogin } from '@/hooks/useLogin';
import { usePasswordVisibility } from '@/hooks/usePasswordVisibility';

import Button from '../ui/buttons/Button';
import FormError from '../ui/feedback/FormError';
import Icon from '../ui/icons/Icon';
import Input from '../ui/inputs/Input';
import AuthLink from '../ui/links/AuthLink';

export default function LoginForm() {
  const { login, isPending, error } = useLogin();
  const { buttonRole, toggleVisibility } = usePasswordVisibility();

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
        placeholder={INPUT_PLACEHOLDER.email}
        disabled={isPending}
        error={errors.email?.message}
        iconName="email"
      />
      <Input
        label="Password"
        {...register('password')}
        placeholder={INPUT_PLACEHOLDER.password}
        disabled={isPending}
        error={errors.password?.message}
        iconName="password"
        trailingButton={{
          role: buttonRole,
          onClick: toggleVisibility,
        }}
      />
      <AuthLink href="/auth/forgot-password" className="mb-3 self-end">
        Forgot password
      </AuthLink>

      {error && <FormError message={error.message} />}

      <Button size="lg" color="black" type="submit" disabled={isPending}>
        {!isPending ? (
          'Sign In'
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Icon size={24} name="loader-circle" className="animate-spin" />
            Submit
          </span>
        )}
      </Button>
    </form>
  );
}
