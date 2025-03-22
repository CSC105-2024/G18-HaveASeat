import { create } from 'zustand';

/**
 * @typedef {Object} ModalData
 * @property {boolean} isOpen - Whether the modal is open.
 * @property {React.ReactNode} content - The modal content.
 * @property {string} title - The modal title.
 * @property {string} [description] - The optional modal description.
 */

/**
 * @typedef {Object} ModalStore
 * @property {Record<string, ModalData>} modals - A record of modal instances.
 * @property {(id: string, content: React.ReactNode, title: string, description?: string) => void} openModal - Function to open a modal.
 * @property {(id: string) => void} closeModal - Function to close a modal.
 */

/** @type {import('zustand').useStore<ModalStore>} */
export const useModalStore = create((set) => ({
  modals: {},

  /**
   * Opens a modal with the given parameters.
   *
   * @param {string} id - The unique modal ID.
   * @param {React.ReactNode} content - The content of the modal.
   * @param {string} title - The title of the modal.
   * @param {string} [description] - The optional description of the modal.
   */
  openModal: (id, content, title, description) =>
    set((state) => ({
      modals: { ...state.modals, [id]: { isOpen: true, content, title, description } },
    })),

  /**
   * Closes a modal by setting its `isOpen` flag to `false`.
   *
   * @param {string} id - The unique modal ID.
   */
  closeModal: (id) =>
    set((state) => ({
      modals: { ...state.modals, [id]: { ...state.modals[id], isOpen: false } },
    })),
}));
