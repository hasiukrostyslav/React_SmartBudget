import { useAuth } from '@/hooks/useAuth';
import ButtonIcon from './buttons/ButtonIcon';
import SignOutForm from '../forms/SignOutForm';

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
          className="outline-input border border-slate-700"
        />
      </div>
      <SignOutForm />
    </div>
  );
}
