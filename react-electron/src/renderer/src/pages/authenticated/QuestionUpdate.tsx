import { useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router';
import { apiUpdateQuestion } from '../../api/apiQuestion';
import type { IQuestion } from '../../api/types';

export default function QuestionUpdate() {
    const { id, templateId, questionId } = useParams<{
        id: string;
        templateId: string;
        questionId: string;
    }>();
    const navigate = useNavigate();
    const location = useLocation();

    const existingQuestion = location.state?.question as IQuestion | undefined;

    const [questionText, setQuestionText] = useState(existingQuestion?.text ?? '');
    const [error, setError] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    const parsedQuestionId = questionId ? parseInt(questionId, 10) : undefined;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!parsedQuestionId) {
            setError('Question ID is missing');
            return;
        }

        if (!questionText || questionText.trim() === '') {
            setError('Question text cannot be empty');
            return;
        }

        try {
            setError(undefined);
            setLoading(true);

            await apiUpdateQuestion(parsedQuestionId, { text: questionText.trim() });

            navigate(`/questionnaire/${id}/edit/template/${templateId}/question`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link
                    to={`/questionnaire/${id}/edit/template/${templateId}/question`}
                    style={{ color: '#646cff', textDecoration: 'none' }}
                >
                    ← Back to Questions
                </Link>
            </div>

            <h2>Edit Question</h2>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor="questionText" style={{ display: 'block', marginBottom: '0.5rem' }}>
                        Question Text:
                    </label>
                    <textarea
                        id="questionText"
                        value={questionText}
                        onChange={(e) => {
                            setQuestionText(e.target.value);
                            if (error) setError(undefined);
                        }}
                        disabled={loading}
                        placeholder="Enter the question text..."
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            fontSize: '1rem',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontFamily: 'inherit',
                            minHeight: '120px',
                            boxSizing: 'border-box',
                        }}
                    />
                </div>

                {error && (
                    <div
                        style={{
                            color: '#d32f2f',
                            backgroundColor: '#ffebee',
                            padding: '0.75rem',
                            borderRadius: '4px',
                            marginBottom: '1.5rem',
                        }}
                    >
                        {error}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '0.75rem 1.5rem',
                            fontSize: '1rem',
                            backgroundColor: loading ? '#ccc' : '#646cff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(`/questionnaire/${id}/edit/template/${templateId}/question`)}
                        disabled={loading}
                        style={{
                            padding: '0.75rem 1.5rem',
                            fontSize: '1rem',
                            backgroundColor: '#f0f0f0',
                            color: '#333',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
