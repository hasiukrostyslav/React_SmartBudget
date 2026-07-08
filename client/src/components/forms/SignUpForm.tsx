import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';

import type { SignUpFormInputs } from '@/types/types';

import { INPUT_PLACEHOLDER } from '@/lib/constants/messages';
import { SignUpSchema } from '@/lib/schemas/schema';
import { usePasswordVisibility } from '@/hooks/usePasswordVisibility';
import { useSignUp } from '@/hooks/useSignUp';

import Button from '../ui/buttons/Button';
import FormError from '../ui/feedback/FormError';
import Icon from '../ui/icons/Icon';
import Input from '../ui/inputs/Input';

export default function SignUpForm() {
  const { signUp, isPending, error } = useSignUp();
  const { buttonRole, toggleVisibility } = usePasswordVisibility();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(SignUpSchema) });

  const onSubmit: SubmitHandler<SignUpFormInputs> = (data) => signUp(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className="mt-6 flex w-full flex-col gap-2"
    >
      <Input
        label="Full name"
        {...register('name')}
        placeholder={INPUT_PLACEHOLDER.name}
        error={errors.name?.message}
        disabled={isPending}
        iconName="name"
      />
      <Input
        label="Email address"
        {...register('email')}
        placeholder={INPUT_PLACEHOLDER.email}
        error={errors.email?.message}
        disabled={isPending}
        iconName="email"
      />
      <Input
        label="Password"
        {...register('password')}
        placeholder={INPUT_PLACEHOLDER.password}
        error={errors.password?.message}
        disabled={isPending}
        iconName="password"
        trailingButton={{
          role: buttonRole,
          onClick: toggleVisibility,
        }}
      />

      {error && <FormError message={error.message} />}

      <Button
        size="lg"
        color="black"
        type="submit"
        className="mt-3"
        disabled={isPending}
      >
        {!isPending ? (
          'Sign Up'
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
