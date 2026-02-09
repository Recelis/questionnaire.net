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
import Submission from '../pages/authenticated/Submission';
import SubmissionNoQuestions from '../pages/authenticated/SubmissionNoQuestions';
import SubmissionQuestion from '../pages/authenticated/SubmissionQuestion';
import SubmissionComplete from '../pages/authenticated/SubmissionComplete';

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
                            path=":id/edit/template/edit/:templateId"
                            element={<TemplateEdit />}
                        />
                        <Route
                            path=":id/edit/template/:templateId/question"
                            element={<TemplateQuestions />}
                        />
                        <Route
                            path=":id/submission"
                            element={<Submission />}
                        />
                        <Route
                            path=":id/submission/:submissionId/noquestions"
                            element={<SubmissionNoQuestions />}
                        />
                        <Route
                            path=":id/submission/:submissionId/question/:questionIndex"
                            element={<SubmissionQuestion />}
                        />
                        <Route
                            path=":id/submission/:submissionId/complete"
                            element={<SubmissionComplete />}
                        />
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
};

export default RouterComponent;
