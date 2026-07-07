import { useSignOut } from '@/hooks/useSignOut';

import ButtonIcon from '../ui/buttons/ButtonIcon';

export default function SignOutForm() {
  const { signOut } = useSignOut();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signOut();
  };

  return (
    <form onSubmit={onSubmit}>
      <ButtonIcon
        size={18}
        iconName="log-out"
        shape="square"
        variant="ghost"
        type="submit"
      />
    </form>
  );
}
