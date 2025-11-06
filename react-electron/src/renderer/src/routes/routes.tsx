import React from "react";
import { Route, Routes } from "react-router";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import AuthComponent from "../components/AuthComponent";

const RouterComponent = () => {
  return (
    <Routes>
      <Route element={<AuthComponent />}>
        <Route path="/">
          <Route index element={<Signin />} />
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
        </Route>
      </Route>
      {/* Authenticated Routes sit somewhere */}
    </Routes>
  );
};

export default RouterComponent;
