/* eslint-disable react-hooks/immutability */
import { useEffect, useRef, useState } from 'react';

export function useDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
      dialogRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClickOutside = (event: MouseEvent) => {
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

    dialog.addEventListener('mousedown', handleClickOutside);
    return () => dialog.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    dialogRef.current?.close();
    setIsOpen(false);
  };

  return { dialogRef, isOpen, handleOpen, handleClose };
}
