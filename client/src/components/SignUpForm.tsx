import Button from './Button';
import Input from './Input';

export default function SignUpForm() {
  return (
    <form autoComplete="off" className="flex flex-col w-full gap-2 mt-6">
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
