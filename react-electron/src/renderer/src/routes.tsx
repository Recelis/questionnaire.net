import React from "react";
import { Route, Routes } from "react-router";
import Signin from "./pages/Signin.js";
import Signup from "./pages/Signup.js";
import Splash from "./pages/Splash.js";

export default function RouterComponent() {
  return (
    <Routes>
      <Route index element={<Splash />} />
      <Route path="signin" element={<Signin />} />
      <Route path="signup" element={<Signup />} />

      {/* Authenticated Routes sit somewhere */}
    </Routes>
  );
}
