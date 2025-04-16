import React from "react";

function Experimental() {
  return (
    <div className="flex flex-col gap-8">
      <ExperimentalSection title="Authentication">

      </ExperimentalSection>
    </div>
  );
}

export default Experimental;

/**
 * @param {Object} props - The component props.
 * @param {string} props.title - The title displayed at the top of the section.
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the section.
 * @returns {React.JSX.Element} The rendered ExperimentalSection component.
 **/
function ExperimentalSection({ title, children }) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}
