import React from "react";
import { useParams } from "react-router";

function Page() {
  const { id } = useParams();

  return (
    <div></div>
  );
}

export default Page;