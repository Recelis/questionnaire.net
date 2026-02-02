import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useNavigate, useParams } from 'react-router';
import { apiGetSubmission } from '../../api/apiSubmission';
import { apiGetQuestions } from '../../api/apiQuestion';
import type { IQuestion } from '../../api/types';

export default function SubmissionQuestion() {
    const { id, submissionId, questionIndex } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<IQuestion[]>([]);

    useEffect(() => {
        // Fetch question data here
        const fetchQuestionData = async () => {
            try {
                setLoading(true);
                const submission = await apiGetSubmission(
                    submissionId ? parseInt(submissionId, 10) : 0
                );
                if (!submission) {
                    throw new Error('Failed to load submission');
                }
                // use templateId to get questions
                const questions = await apiGetQuestions(submission.templateId);
                if (!questions || questions.length === 0) {
                    // Redirect to no questions page
                    navigate(`/questionnaire/${id}/submission/${submissionId}/noquestions`);
                    return;
                }
                const qIndex = questionIndex ? parseInt(questionIndex, 10) : 0;
                if (qIndex < 0 || qIndex >= questions.length) {
                    throw new Error('Question index out of bounds');
                }
                setQuestions(questions);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestionData();
    }, []);
    if (loading || !questions) {
        return (
            <Layout>
                <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
                    <p>Loading questions...</p>
                </div>
            </Layout>
        );
    }
    if (questionIndex === undefined) {
        return (
            <Layout>
                <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
                    <p>Invalid question index.</p>
                </div>
            </Layout>
        );
    }
    const qIndex = parseInt(questionIndex, 10);
    if (isNaN(qIndex) || qIndex < 0 || qIndex >= questions.length) {
        return (
            <Layout>
                <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
                    <p>Question index out of bounds.</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
                {questions[qIndex] && <p>{questions[qIndex].text}</p>}
            </div>
        </Layout>
    );
}
