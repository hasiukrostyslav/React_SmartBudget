import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type z from 'zod';

import { INPUT_PLACEHOLDER } from '@/lib/constants/messages';
import { ForgotPasswordSchema } from '@/lib/schemas/schema';

import Button from '../ui/buttons/Button';
import Input from '../ui/inputs/Input';

type FormInput = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(ForgotPasswordSchema) });

  function onSubmit(data: FormInput) {
    return data;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className="flex w-full flex-col gap-3"
    >
      <Input
        {...register('email')}
        label="Email address"
        placeholder={INPUT_PLACEHOLDER.email}
        error={errors.email?.message}
        icon="email"
      />

      <Button size="lg" color="black" type="submit">
        Reset Password
      </Button>
    </form>
  );
}
