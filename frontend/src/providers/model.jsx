import React from 'react';
import { useMounted } from '@/hooks/use-mounted';
import { useModalStore } from '@/store/modal';
import { Modal } from '@/components/ui/modal';

export function ModalProvider() {
  const isMounted = useMounted();
  const modals = useModalStore((state) => state.modals);
  const closeModal = useModalStore((state) => state.closeModal);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {Object.entries(modals).map(([id, { isOpen, content, title, description }]) => (
        <Modal
          key={id}
          isOpen={isOpen}
          onClose={() => closeModal(id)}
          title={title}
          description={description}
        >
          {content}
        </Modal>
      ))}
    </>
  );
}