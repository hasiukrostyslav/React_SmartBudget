import AuthLink from './AuthLink';
import Button from './Button';
import Input from './Input';

export default function LoginForm() {
  return (
    <form autoComplete="off" className="flex flex-col w-full gap-2 mt-6">
      <Input label="Email address" name="email" />
      <Input label="Password" name="password" isPassword />
      <AuthLink href="#" className="self-end mb-3">
        Forgot password
      </AuthLink>
      <Button type="submit">Sign In</Button>
    </form>
  );
}
