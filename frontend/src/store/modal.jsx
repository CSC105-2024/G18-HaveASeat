import { create } from "zustand";

/**
 * @typedef {Object} ModalData
 * @property {boolean} isOpen
 * @property {React.ReactNode} content
 * @property {string} title
 * @property {string} [description]
 */

/**
 * @typedef {Object} ModalStore
 * @property {Record<string, ModalData>} modals - A record of modal instances.
 * @property {(id: string, content: React.ReactNode, title: string, description?: string) => void} openModal - Function to open a modal.
 * @property {(id: string) => void} closeModal - Function to close a modal.
 */

/** @type {import("zustand").useStore<ModalStore>} */
export const useModalStore = create((set) => ({
  modals: {},

  /**
   * Opens a modal with the given parameters.
   *
   * @param {string} id
   * @param {React.ReactNode} content
   * @param {string} title
   * @param {string} [description]
   */
  openModal: (id, content, title, description) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [id]: { isOpen: true, content, title, description },
      },
    })),

  /**
   * Closes a modal by setting its `isOpen` flag to `false`.
   *
   * @param {string} id
   */
  closeModal: (id) =>
    set((state) => ({
      modals: { ...state.modals, [id]: { ...state.modals[id], isOpen: false } },
    })),
}));
