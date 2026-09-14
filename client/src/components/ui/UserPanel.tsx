import { useNavigate } from 'react-router';

import { useAuth } from '@/hooks/useAuth';

import SignOutForm from '../forms/SignOutForm';
import ButtonIcon from './buttons/ButtonIcon';

export default function UserPanel() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const userName = session?.user?.name;

  return (
    <div className="ml-auto flex items-center">
      <div className="mr-10 flex items-center gap-3">
        <ButtonIcon
          size={16}
          iconName="chat"
          // Placeholder until chat exists: disabled so it doesn't pose as a
          // working control.
          label="Chat (coming soon)"
          disabled
          shape="round"
          variant="solid"
        />
        <ButtonIcon
          size={16}
          iconName="message"
          label="Messages (coming soon)"
          disabled
          shape="round"
          variant="solid"
        />
      </div>
      <div className="mr-6 flex items-center gap-2">
        <span>{userName}</span>
        <ButtonIcon
          size={16}
          iconName="user"
          label="Profile"
          onClick={() => navigate('/profile')}
          shape="round"
          variant="outline"
        />
      </div>
      <SignOutForm />
    </div>
  );
}
