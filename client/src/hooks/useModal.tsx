import { useCallback, useEffect, useRef, useState } from 'react';

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Declared before the effects that call them, and stable across renders.
  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => {
    dialogRef.current?.close();
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
      dialogRef.current?.focus();
    }
  }, [isOpen]);

  // The dialog element only exists while the modal is open, so listeners are
  // attached when it opens and removed when it closes. The keydown listener
  // used to have no dependency array and was re-attached on every render.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;

    const handleCloseOnKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (event.target !== dialog && dialog.contains(event.target as Node))
        return;

      const rect = dialog.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        handleClose();
      }
    };

    dialog.addEventListener('keydown', handleCloseOnKey);
    dialog.addEventListener('mousedown', handleClickOutside);
    return () => {
      dialog.removeEventListener('keydown', handleCloseOnKey);
      dialog.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleClose]);

  return { dialogRef, isOpen, handleOpen, handleClose };
}
