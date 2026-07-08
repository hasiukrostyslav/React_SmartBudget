import { useAuth } from '@/hooks/useAuth';

import SignOutForm from '../forms/SignOutForm';
import ButtonIcon from './buttons/ButtonIcon';

export default function UserPanel() {
  const { session } = useAuth();
  const userName = session?.user?.name;

  return (
    <div className="ml-10 flex items-center">
      <div className="mr-10 flex items-center gap-3">
        <ButtonIcon size={16} iconName="chat" shape="round" variant="solid" />
        <ButtonIcon
          size={16}
          iconName="message"
          shape="round"
          variant="solid"
        />
      </div>
      <div className="mr-6 flex items-center gap-2">
        <span>{userName}</span>
        <ButtonIcon
          size={16}
          iconName="user"
          shape="round"
          variant="outline"
        />
      </div>
      <SignOutForm />
    </div>
  );
}
