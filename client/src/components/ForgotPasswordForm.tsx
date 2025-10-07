import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ForgotPasswordSchema } from '@/lib/schema';
import Button from './Button';
import Input from './Input';

type FormInput = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(ForgotPasswordSchema) });

  function onSubmit(data: FormInput) {}

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className="flex w-full flex-col gap-3"
    >
      <Input
        label="Email address"
        {...register('email')}
        placeholder="Please enter your email"
        error={errors.email?.message}
      />
      <Button color="black" type="submit">
        Reset Password
      </Button>
    </form>
  );
}
