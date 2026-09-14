import { useState } from 'react';

import { INPUT_CONFIG } from '@/lib/constants/components';

export function usePasswordVisibility() {
  const [isVisible, setIsVisible] = useState(false);

  // Derived, not stored: the button always offers the opposite of what's shown.
  const buttonRole: keyof typeof INPUT_CONFIG.button.roleIcon = isVisible
    ? 'hidePassword'
    : 'showPassword';

  const toggleVisibility = () => setIsVisible((visible) => !visible);

  return { buttonRole, toggleVisibility, isVisible };
}
