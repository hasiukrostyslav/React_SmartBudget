import { EMPTY_STATE_TEXT } from '@/lib/constants/messages';

import EmptyState from '@/components/ui/feedback/EmptyState';

export default function ProfilePage() {
  return <EmptyState config={EMPTY_STATE_TEXT.dashboard} />;
}
