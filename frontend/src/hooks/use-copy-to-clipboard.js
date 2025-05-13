import * as React from "react";

/**
 * @param {number} [timeout]
 * @param {() => void} onCopy
 * @returns {{isCopied: boolean, copyToClipboard: copyToClipboard}}
 */
export function useCopyToClipboard({ timeout = 2000, onCopy } = {}) {
  const [isCopied, setIsCopied] = React.useState(false);

  /**
   * @param {string} value
   */
  const copyToClipboard = (value) => {
    if (typeof window === "undefined" || !navigator.clipboard.writeText) {
      return;
    }

    if (!value) return;

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);

      if (onCopy) {
        onCopy();
      }

      setTimeout(() => {
        setIsCopied(false);
      }, timeout);
    }, console.error);
  };

  return { isCopied, copyToClipboard };
}
