import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';

import { INPUT_PLACEHOLDER } from '@/lib/constants/messages';
import { SignUpSchema } from '@/lib/schemas/auth.schema';
import { applyServerFieldErrors } from '@/lib/utils/formErrors';
import { usePasswordVisibility } from '@/hooks/usePasswordVisibility';
import { useSignUp } from '@/hooks/useSignUp';

import Button from '../ui/buttons/Button';
import FormError from '../ui/feedback/FormError';
import Input from '../ui/inputs/Input';

type FormInputs = z.infer<typeof SignUpSchema>;

export default function SignUpForm() {
  const { signUp, isPending, error } = useSignUp();
  const { buttonRole, isVisible, toggleVisibility } = usePasswordVisibility();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(SignUpSchema) });

  const onSubmit: SubmitHandler<FormInputs> = (data) =>
    signUp(data, {
      onError: (error) =>
        applyServerFieldErrors(error, setError, ['name', 'email', 'password']),
    });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4"
    >
      <Input
        label="Full name"
        {...register('name')}
        placeholder={INPUT_PLACEHOLDER.name}
        error={errors.name?.message}
        disabled={isPending}
        iconName="name"
        autoComplete="name"
      />
      <Input
        label="Email"
        {...register('email')}
        placeholder={INPUT_PLACEHOLDER.email}
        error={errors.email?.message}
        disabled={isPending}
        iconName="email"
        autoComplete="email"
      />
      <Input
        label="Password"
        {...register('password')}
        placeholder={INPUT_PLACEHOLDER.password}
        error={errors.password?.message}
        disabled={isPending}
        iconName="password"
        autoComplete="new-password"
        type={isVisible ? 'text' : 'password'}
        trailingButton={{
          role: buttonRole,
          onClick: toggleVisibility,
        }}
      />

      {error && <FormError message={error.message} />}

      <div className="mt-2">
        <Button
          type="submit"
          variant="primary"
          size="form"
          isLoading={isPending}
        >
          Create account
        </Button>
      </div>
    </form>
  );
}
