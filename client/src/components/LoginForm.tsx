import AuthLink from './AuthLink';
import Button from './Button';
import Input from './Input';

export default function LoginForm() {
  return (
    <form autoComplete="off" className="mt-6 flex w-full flex-col gap-2">
      <Input label="Email address" name="email" />
      <Input label="Password" name="password" isPassword />
      <AuthLink href="#" className="mb-3 self-end">
        Forgot password
      </AuthLink>
      <Button type="submit">Sign In</Button>
    </form>
  );
}
