import { useLocation } from "react-router-dom";
import routes from "@/routes";
import { useMemo } from "react";

function usePageMetadata() {
  const location = useLocation();

  return useMemo(() => {
    const currentRoute = routes.find(
      (route) => route.path === location.pathname,
    );

    if (!currentRoute) return {};

    // If generateMetadata function exists, execute it with route parameters.
    if (typeof currentRoute.generateMetadata === "function") {
      return currentRoute.generateMetadata(location);
    }

    return currentRoute.metadata || {};
  }, [location]);
}

export default usePageMetadata;
