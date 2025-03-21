import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

/**
 * @typedef ModalProps
 * @property {string} [title]
 * @property {string | undefined} [description]
 * @property {boolean} [isOpen]
 * @property {() => void} [onClose]
 * @property {React.ReactNode | undefined} [children]
 */

/**
 * @param {ModalProps} props
 * @returns {JSX.Element}
 */
function Modal ({
  title,
  description,
  isOpen,
  onClose,
  children,
}) {

  const onChange = /** @param {boolean} open */ (open) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export {Modal};