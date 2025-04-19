import React from "react";
import { useNavigate } from "react-router";

function Page() {
  const navigate = useNavigate();
  return navigate('/');
}

export default Page;