import React from "react";
import { Route, Routes } from "react-router";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import AuthComponent from "../components/AuthComponent";
import Home from "../pages/authenticated/Home";
import QuestionnaireCreate from "../pages/authenticated/QuestionnaireCreate";
import QuestionnaireEdit from "../pages/authenticated/QuestionnaireEdit";

const RouterComponent = () => {
  return (
    <Routes>
      <Route element={<AuthComponent />}>
        <Route path="/">
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />

          {/* Authenticated Routes */}
          <Route index element={<Home />} />
          <Route path="questionnaire">
            <Route path="create" element={<QuestionnaireCreate />} />
            <Route path=":id/edit" element={<QuestionnaireEdit />} />
          </Route>
          {/* <Route path="questionnaire/:questionnaire" element={<Questionnaire />} /> */}
        </Route>
      </Route>
    </Routes>
  );
};

export default RouterComponent;
