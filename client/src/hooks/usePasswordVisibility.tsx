import { useState } from 'react';

import { INPUT_CONFIG } from '@/lib/constants/components';

export function usePasswordVisibility() {
  const [isVisible, setIsVisible] = useState(false);
  const [buttonRole, setButtonRole] =
    useState<keyof typeof INPUT_CONFIG.button.roleIcon>('showPassword');

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
    setButtonRole(isVisible ? 'showPassword' : 'hidePassword');
  };
  return { buttonRole, toggleVisibility, isVisible };
}
