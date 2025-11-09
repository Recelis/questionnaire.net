import React from "react";
import { Link } from "react-router";
import useAuth from "../hooks/useAuth";

export default function Signin() {
  const auth = useAuth();
  return (
    <div>
      <Link to="/">Back</Link>
    </div>
  );
}
