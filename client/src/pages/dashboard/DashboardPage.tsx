import { useSignOut } from '@/hooks/useSignOut';

export default function DashboardPage() {
  const { signOut } = useSignOut();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signOut();
  };

  return (
    <div>
      DashboardPage
      <form onSubmit={onSubmit}>
        <button type="submit">Sign out</button>
      </form>
    </div>
  );
}
