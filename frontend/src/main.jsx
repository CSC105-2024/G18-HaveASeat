import "./global.css";
import React, { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useRoutes } from "react-router";
import Layout from "@/components/layout/default.jsx";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback, ErrorLayout } from "@/components/layout/error.jsx";
import pages from "~react-pages";
import Loading from "@/components/layout/loading.jsx";
import { ModalProvider } from "@/providers/modal.jsx";
import { Toaster } from "@/components/ui/sonner.jsx";
import { SidebarProvider } from "@/components/ui/sidebar.jsx";
import { AuthProvider } from "@/providers/auth.jsx";
import { MerchantProvider } from "@/providers/merchant.jsx";

export const App = () => {
  const PageContent = useRoutes(pages);

  return (
    <Suspense fallback={<Loading />}>
      <AuthProvider>
        <SidebarProvider defaultOpen={false}>
          <MerchantProvider>
            <Layout>
              {PageContent}
              <Toaster richColors={true} theme="light" />
              <ModalProvider />
            </Layout>
          </MerchantProvider>
        </SidebarProvider>
      </AuthProvider>
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
