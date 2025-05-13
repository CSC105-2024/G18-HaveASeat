import * as React from "react";

/**
 * @param {string} query
 * @returns {boolean}
 */
export function useMediaQuery(query) {
  const [value, setValue] = React.useState(false);

  React.useEffect(() => {
    /**
     * @param {MediaQueryListEvent} event
     */
    function onChange(event) {
      setValue(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener("change", onChange);
    setValue(result.matches);

    return () => result.removeEventListener("change", onChange);
  }, [query]);

  return value;
}
