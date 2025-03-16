import React, { useCallback } from "react";
import { useModalStore } from "@/store/modal.jsx";

/**
 * @typedef {string | ((props: any) => string)} ContentGenerator
 */

/**
 * Creates a custom hook for managing a modal.
 *
 * @param {React.ComponentType<any>} ModalContent - The modal component.
 * @param {string} modalId - Unique identifier for the modal.
 * @param {ContentGenerator} title - Title content, can be a string, or a function returning one.
 * @param {ContentGenerator} [description] - Description content (optional).
 * @returns {() => { open: (props: any) => void, close: () => void }} - Returns a hook for opening and closing the modal.
 */
export const createModalHook = (ModalContent, modalId, title, description) => {
  return () => {
    const { openModal, closeModal } = useModalStore();

    /**
     * Opens the modal with the provided props.
     *
     * @param {any} props - Props to pass to the modal.
     */
    const open = useCallback((props) => {
      /**
       * Resolves content dynamically.
       *
       * @param {ContentGenerator} content - The content generator function or value.
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
    }, []);

    /**
     * Closes the modal.
     */
    const close = useCallback(() => {
      closeModal(modalId);
    }, []);

    return { open, close };
  };
};
