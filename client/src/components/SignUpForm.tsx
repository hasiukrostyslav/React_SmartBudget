import Button from './Button';
import Input from './Input';

export default function SignUpForm() {
  return (
    <form autoComplete="off" className="mt-6 flex w-full flex-col gap-2">
      <Input label="Name" name="name" />
      <Input label="Email address" name="email" />
      <Input label="Password" name="password" isPassword />
      <Input label="Confirm Password" name="confirm-password" isPassword />
      <Button type="submit" className="mt-3">
        Sign Up
      </Button>
    </form>
  );
}
