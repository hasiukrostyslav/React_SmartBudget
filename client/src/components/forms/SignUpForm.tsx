import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignUp } from '@/hooks/useSignUp';
import { SignUpSchema } from '@/lib/schemas/schema';
import type { SignUpFormInputs } from '@/types/types';
import Input from '../ui/inputs/Input';
import Button from '../ui/buttons/Button';
import FormError from '../ui/FormError';
import Icon from '../ui/Icon';

export default function SignUpForm() {
  const { signUp, isPending, error } = useSignUp();
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
        placeholder="Please enter your full name"
        error={errors.name?.message}
        disabled={isPending}
        withError
        icon="name"
      />
      <Input
        label="Email address"
        {...register('email')}
        placeholder="Please enter your email"
        error={errors.email?.message}
        disabled={isPending}
        withError
        icon="email"
      />
      <Input
        label="Password"
        {...register('password')}
        placeholder="Please enter your password"
        error={errors.password?.message}
        disabled={isPending}
        withError
        icon="password"
        withButton
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
