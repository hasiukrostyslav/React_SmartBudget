import Button from './Button';
import Input from './Input';

export default function SignUpForm() {
  return (
    <form autoComplete="off" className="mt-6 flex w-full flex-col gap-2">
      <Input
        label="Full name"
        name="name"
        placeholder="Please enter your full name"
      />
      <Input
        label="Email address"
        name="email"
        placeholder="Please enter your email"
      />
      <Input
        label="Password"
        name="password"
        isPassword
        placeholder="Please enter your password"
      />
      <Button color="black" type="submit" className="mt-3">
        Sign Up
      </Button>
    </form>
  );
}
