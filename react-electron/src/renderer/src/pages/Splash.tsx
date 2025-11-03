import React from "react";
import { Link } from "react-router";

export default function Splash() {
  return (
    <div>
      <Link to="/signin">Sign in</Link>
      <Link to="/signup">Sign up</Link>
    </div>
  );
}
