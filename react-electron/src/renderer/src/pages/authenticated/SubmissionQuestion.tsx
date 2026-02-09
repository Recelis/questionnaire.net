import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useNavigate, useParams } from 'react-router';
import { apiGetSubmission } from '../../api/apiSubmission';
import { apiGetQuestions } from '../../api/apiQuestion';
import { apiGetAnswerBySubmissionQuestion, apiCreateAnswer, apiUpdateAnswer } from '../../api/apiAnswer';
import type { IQuestion } from '../../api/types';
import SubmissionQuestionProgress from './SubmissionQuestionProgress';

export default function SubmissionQuestion() {
    const { id, submissionId, questionIndex } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<IQuestion[]>([]);
    const [answer, setAnswer] = useState<string>('');

    const handleSaveAnswer = async (questionnaireId: number, submissionId: number, questionId: number, answer: string) => {
      // if answer exists then update, otherwise create
      try {
        const existingAnswer = await apiGetAnswerBySubmissionQuestion(submissionId, questionId);
        if (existingAnswer) {
            console.log(`Updating existing answer with id ${existingAnswer.id} for question ${questionId} and submission ${submissionId}`);
          // Update existing answer
          await apiUpdateAnswer(existingAnswer.id, { text: answer, points: 0 });
        } else {
            console.log(`Creating new answer for question ${questionId} and submission ${submissionId}`);
          // Create new answer
          await apiCreateAnswer({ submissionId, questionId, text: answer, points: answer ? 0 : 0 });
        }
        // Optionally, you can navigate to the next question or show a success message here
        if (questionIndex !== undefined) {
            const nextQuestionIndex = parseInt(questionIndex, 10) + 1;
            if (nextQuestionIndex < questions.length) {
                navigate(`/questionnaire/${questionnaireId}/submission/${submissionId}/question/${nextQuestionIndex}`);
            } else {
                // No more questions, navigate to submission summary or completion page
                navigate(`/questionnaire/${questionnaireId}/submission/${submissionId}/complete`);
            }
        }
      } catch (err) {
        console.error('Failed to save answer:', err);
      }
    };

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

    // when question changes, load existing answer if it exists
    useEffect(() => {
        const loadExistingAnswer = async () => {
            if (!questions || questions.length === 0) return;
            const qIndex = questionIndex ? parseInt(questionIndex, 10) : 0;
            if (qIndex < 0 || qIndex >= questions.length) return;
            try {
                const existingAnswer = await apiGetAnswerBySubmissionQuestion(
                    submissionId ? parseInt(submissionId, 10) : 0,
                    questions[qIndex].id
                );
                if (existingAnswer) {
                    setAnswer(existingAnswer.text);
                } else {
                    setAnswer('');
                }
            } catch (err) {
                console.error('Failed to load existing answer:', err);
            }
        };
        loadExistingAnswer();
    }, [questionIndex, questions]);

    if (!submissionId || !id) {
        return (
            <Layout>
                <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
                    <p>Invalid submission or questionnaire ID.</p>
                </div>
            </Layout>
        );
    }
    const questionnaireIdNum = parseInt(id, 10);
    const submissionIdNum = parseInt(submissionId, 10);

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

    const answerInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAnswer(value);
        console.log(`Answer for question ${questions[qIndex].id}: ${value}`);
        if (isNaN(Number(value))) {
            console.error('Invalid input: not a number');
            setAnswer(answer); // use previous valid answer
            return;
        }

    };

    return (
        <Layout>
            <SubmissionQuestionProgress
                questionnaireId={questionnaireIdNum}
                submissionId={submissionIdNum}
                totalQuestions={questions.length}
                currentQuestionIndex={qIndex}
            />
            <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
                {questions[qIndex] && <p>{questions[qIndex].text}</p>}
                <input
                    type="text"
                    placeholder="Answer with a number..."
                    style={{ width: '100%', padding: '0.5rem', marginTop: '1rem' }}
                    value={answer}
                    onChange={answerInputChanged}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && answer.trim() !== '') {
                            handleSaveAnswer(questionnaireIdNum, submissionIdNum, questions[qIndex].id, answer);
                        }
                    }}
                />
                <button
                    style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
                    disabled={answer.trim() === ''}
                    onClick={() => handleSaveAnswer(questionnaireIdNum, submissionIdNum, questions[qIndex].id, answer)}
                >
                    Save
                </button>
            </div>
        </Layout>
    );
}
