// Icon names
export type IconName =
  | 'eye'
  | 'eye-off'
  | 'mail'
  | 'lock'
  | 'user'
  | 'sun'
  | 'moon'
  | 'check'
  | 'x'
  | 'info'
  | 'circle-alert'
  | 'loader-circle';

// Toast Component types
interface ToastStyleProps<I extends IconName> {
  icon: I;
  bgIcon: string;
  border: string;
  bg: string;
}

export interface ToastRoles {
  success: ToastStyleProps<'check'>;
  error: ToastStyleProps<'x'>;
  info: ToastStyleProps<'info'>;
  warning: ToastStyleProps<'circle-alert'>;
}

// Auth input with icons types
export interface InputIcons {
  name: Extract<IconName, 'user'>;
  email: Extract<IconName, 'mail'>;
  password: Extract<IconName, 'lock'>;
}
