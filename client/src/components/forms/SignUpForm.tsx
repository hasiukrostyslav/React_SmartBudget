import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignUp } from '@/hooks/useSignUp';
import { SignUpSchema } from '@/lib/schemas/schema';
import type { SignUpFormInputs } from '@/types/types';
import Input from '../ui/Input';
import Button from '../ui/Button';
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
      />
      <Input
        label="Email address"
        {...register('email')}
        placeholder="Please enter your email"
        error={errors.email?.message}
        disabled={isPending}
      />
      <Input
        label="Password"
        {...register('password')}
        placeholder="Please enter your password"
        error={errors.password?.message}
        disabled={isPending}
        isPassword
      />
      {error && <FormError message={error.message} />}
      <Button color="black" type="submit" className="mt-3" disabled={isPending}>
        {!isPending ? (
          'Sign Up'
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
