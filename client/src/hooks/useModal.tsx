/* eslint-disable react-hooks/immutability */
import { useEffect, useRef, useState } from 'react';

export function useModal() {
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

    const handleCloseOnKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };

    dialog.addEventListener('keydown', handleCloseOnKey);
    return () => dialog.removeEventListener('keydown', handleCloseOnKey);
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

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
