import "./global.css";
import { StrictMode, Suspense, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useRoutes } from "react-router";
import Layout from "@/components/layout/default.jsx";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback, ErrorLayout } from "@/components/layout/error.jsx";
import routes from "@/routes.js";
import usePageMetadata from "@/hooks/use-page-metadata.js";

export const App = () => {
  const metadata = usePageMetadata();

  useEffect(() => {
    if (metadata.title) document.title = metadata.title;

    const metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc) {
      metaDesc.setAttribute("content", metadata.description || "");
    } else {
      const newMeta = document.createElement("meta");
      newMeta.name = "description";
      newMeta.content = metadata.description || "";
      document.head.appendChild(newMeta);
    }
  }, [metadata]);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Layout>{useRoutes(routes)}</Layout>
    </Suspense>
  );
};

const container = document.getElementById("root");

if (!container.__reactRoot) {
  container.__reactRoot = createRoot(container);
}

container.__reactRoot.render(
  <StrictMode>
    <ErrorBoundary fallback={ErrorFallback} FallbackComponent={ErrorLayout}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
