import React from 'react';
import { Route, Routes } from 'react-router';
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';
import AuthComponent from '../components/AuthComponent';
import QuestionnaireCreate from '../pages/authenticated/QuestionnaireCreate';
import QuestionnaireEdit from '../pages/authenticated/QuestionnaireEdit';
import Questionnaires from '../pages/authenticated/Questionnaires';
import Templates from '../pages/authenticated/Templates';
import TemplateEdit from '../pages/authenticated/TemplateEdit';
import TemplateQuestions from '../pages/authenticated/TemplateQuestions';

const RouterComponent = () => {
    return (
        <Routes>
            <Route element={<AuthComponent />}>
                <Route path="/">
                    <Route path="signin" element={<Signin />} />
                    <Route path="signup" element={<Signup />} />

                    {/* Authenticated Routes */}
                    <Route index element={<Questionnaires />} />
                    <Route path="questionnaire">
                        <Route path="create" element={<QuestionnaireCreate />} />
                        <Route path=":id/edit" element={<QuestionnaireEdit />} />
                        <Route path=":id/edit/template" element={<Templates />} />
                        <Route
                            path=":id/edit/template/edit/:templateid"
                            element={<TemplateEdit />}
                        />
                        <Route
                            path=":id/edit/template/:templateid/question"
                            element={<TemplateQuestions />}
                        />
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
};

export default RouterComponent;
