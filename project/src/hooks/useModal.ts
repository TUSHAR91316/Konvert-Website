import { useEffect } from 'react';

interface UseModalOptions {
  isOpen: boolean;
  onClose: () => void;
  lockScroll?: boolean;
}

/**
 * Custom hook to handle modal Escape key closing and body scroll lock
 */
export const useModal = ({ isOpen, onClose, lockScroll = true }: UseModalOptions): void => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    let originalOverflow = '';
    if (lockScroll) {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (lockScroll) {
        document.body.style.overflow = originalOverflow;
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, lockScroll]);
};
