import "./global.css";
import React, { StrictMode, Suspense, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  useLocation,
  useNavigate,
  useRoutes,
} from "react-router";
import Layout from "@/components/layout/default.jsx";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback, ErrorLayout } from "@/components/layout/error.jsx";
import routes from "@/routes.js";
import usePageMetadata from "@/hooks/use-page-metadata.js";
import Loading from "@/components/layout/loading.jsx";
import { ModalProvider } from "@/providers/model.jsx";
import { Toaster } from "@/components/ui/sonner.jsx";
import { SidebarProvider } from "@/components/ui/sidebar.jsx";

export const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const metadata = usePageMetadata();

  const PageContent = useRoutes(routes);

  useEffect(() => {
    if (metadata.title) document.title = metadata.title + " | Have A Seat";

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

  if (location.pathname.startsWith("_/")) {
    if (!import.meta.env.DEV) {
      return navigate("/", { replace: true });
    }
  }

  return (
    <Suspense fallback={<Loading />}>
      <SidebarProvider defaultOpen={false}>
        <Layout>
          {PageContent}
          <Toaster />
          <ModalProvider />
        </Layout>
      </SidebarProvider>
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
);
