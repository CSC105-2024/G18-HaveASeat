import React, { useCallback } from "react";
import { useModalStore } from "@/store/modal.jsx";

/**
 * Creates a custom hook for opening and closing a specific modal.
 *
 * @template T
 * @param {React.ComponentType<T>} ModalContent - The React component to render inside the modal.
 * @param {string} modalId - The unique identifier for the modal.
 * @param {React.ReactNode | ((props: T) => React.ReactNode)} title - The title of the modal (static string or function returning a string).
 * @param {React.ReactNode | ((props: T) => React.ReactNode)} [description] - The description of the modal (optional).
 * @returns {function(): { open: (props: T) => void, close: () => void }} - A hook returning `open` and `close` functions.
 */
export const createModalHook = (ModalContent, modalId, title, description) => {
  return () => {
    const { openModal, closeModal } = useModalStore();

    /**
     * Opens the modal with the provided props.
     *
     * @template T
     * @param {T} props - Props to pass to the modal.
     */
    const open = useCallback(
      (props) => {
        /**
         * Resolves content dynamically.
         *
         * @template T
         * @param {string | React.ReactNode | ((props: T) => string | React.ReactNode)} content - The content generator function or value.
         * @returns {string} - Resolved content.
         */
        const resolveContent = (content) => {
          if (typeof content === "function") {
            return content(props);
          }
          return content;
        };

        const modalTitle = resolveContent(title);
        const modalDescription = description
          ? resolveContent(description)
          : undefined;

        openModal(
          modalId,
          <ModalContent {...props} />,
          modalTitle,
          modalDescription,
        );
      },
      [openModal],
    );

    /**
     * Closes the modal.
     */
    const close = useCallback(() => {
      closeModal(modalId);
    }, [closeModal]);

    return { open, close };
  };
};
