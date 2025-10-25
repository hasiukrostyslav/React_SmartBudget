import { useForm } from 'react-hook-form';
import type z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { SignInSchema } from '@/lib/schemas/schema';
import { toastOptions } from '@/lib/constants';
import Toast from '../ui/Toast';
import Input from '../ui/Input';
import AuthLink from '../ui/AuthLink';
import Button from '../ui/Button';

type FormInputs = z.infer<typeof SignInSchema>;

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(SignInSchema) });

  function onSubmit(data: FormInputs) {
    console.log(data);
    reset();
    toast(<Toast type="login" role="success" />, toastOptions);
  }

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
        error={errors.email?.message}
      />
      <Input
        label="Password"
        {...register('password')}
        placeholder="Please enter your password"
        error={errors.password?.message}
        isPassword
      />
      <AuthLink href="/auth/forgot-password" className="mb-3 self-end">
        Forgot password
      </AuthLink>

      <Button color="black" type="submit">
        Sign In
      </Button>
    </form>
  );
}
