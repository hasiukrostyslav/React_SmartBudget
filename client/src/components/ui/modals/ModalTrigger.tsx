import { useModal } from '@/hooks/useModal';

import Modal from './Modal';

interface ModalTriggerProps {
  modalWidth?: 'md' | 'lg';
  renderTrigger: (open: () => void) => React.ReactNode;
  renderContent: (close: () => void) => React.ReactNode;
}

export default function ModalTrigger({
  modalWidth = 'md',
  renderTrigger,
  renderContent,
}: ModalTriggerProps) {
  const { isOpen, dialogRef, handleOpen, handleClose } = useModal();

  return (
    <>
      {renderTrigger(handleOpen)}
      {isOpen && (
        <Modal
          ref={dialogRef}
          className={modalWidth === 'md' ? 'w-4/12' : 'w-5/12'}
        >
          {renderContent(handleClose)}
        </Modal>
      )}
    </>
  );
}
