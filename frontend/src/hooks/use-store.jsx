import { useEffect, useState } from "react";

/**
 * Custom hook to subscribe to a store and track state updates.
 *
 * @param {Function} store - Zustand store function that accepts a callback.
 * @param {Function} callback - Function to derive specific state from the store.
 * @returns {any} - The selected state from the store.
 */
export const useStore = (store, callback) => {
  const result = store(callback);
  const [data, setData] = useState();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};
