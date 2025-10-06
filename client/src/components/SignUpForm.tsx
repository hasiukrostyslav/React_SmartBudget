import { useForm } from 'react-hook-form';
import type z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { SignUpSchema } from '@/lib/schema';
import { toastOptions } from '@/lib/constants';
import Input from './Input';
import Button from './Button';
import Toast from './Toast';

type FormInputs = z.infer<typeof SignUpSchema>;

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(SignUpSchema) });

  function onSubmit(data: FormInputs) {
    reset();
    toast(<Toast type="signUp" role="success" />, toastOptions);
  }
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
      />
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
      <Button color="black" type="submit" className="mt-3">
        Sign Up
      </Button>
    </form>
  );
}
