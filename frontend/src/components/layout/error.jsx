import React from "react";

function ErrorFallback() {
  return (
    <div>
      Error has occurred
    </div>
  )
}

function ErrorLayout({ error, resetErrorBoundary }) {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  );
}

export { ErrorLayout, ErrorFallback };