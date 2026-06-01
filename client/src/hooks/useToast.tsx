import { toast, Zoom, type ToastPosition } from 'react-toastify';

import { TOAST_CONFIG } from '@/lib/constants/ui';

import Toast from '@/components/ui/feedback/Toast';

export function useToast() {
  const config = {
    position: 'bottom-center' as ToastPosition,
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    transition: Zoom,
    style: {
      background: 'transparent',
      padding: 0,
      minHeight: 'unset',
      overflow: 'visible',
    },
  };

  const toastSuccess = (
    operation: keyof typeof TOAST_CONFIG.success.header,
    entity: string,
  ) =>
    toast(
      <Toast role="success" operation={operation} entity={entity} />,
      config,
    );

  const toastError = (
    operation: keyof typeof TOAST_CONFIG.success.header,
    entity: string,
  ) =>
    toast(<Toast role="error" operation={operation} entity={entity} />, config);

  return { toastSuccess, toastError };
}
