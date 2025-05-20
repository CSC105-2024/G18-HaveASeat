import React from "react";
import { Navigate, useParams } from "react-router";

function Page() {
  const { id } = useParams();

  return <Navigate to={`/merchant/${id}/settings/overview`} replace={true} />;
}

export default Page;
