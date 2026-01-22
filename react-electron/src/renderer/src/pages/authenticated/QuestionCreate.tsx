import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { apiCreateQuestion } from '../../api/apiQuestion';
import type { IQuestion } from '../../api/types';

interface QuestionCreateProps {
    templateId: number;
    templateName?: string;
    onCancel?: () => void;
    onQuestionCreated?: (question: IQuestion) => void;
}

export default function QuestionCreate({
    templateId,
    templateName,
    onCancel,
    onQuestionCreated,
}: QuestionCreateProps) {
    const [questionText, setQuestionText] = useState('');
    const [error, setError] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate template ID
        if (!templateId) {
            setError('Template ID is missing');
            return;
        }

        // Validate question text
        if (!questionText || questionText.trim() === '') {
            setError('Question text cannot be empty');
            return;
        }

        try {
            setError(undefined);
            setLoading(true);

            const newQuestion = await apiCreateQuestion({
                templateId,
                text: questionText.trim(),
            });

            if (newQuestion) {
                if (onQuestionCreated) {
                    onQuestionCreated(newQuestion);
                } else {
                    navigate(-1);
                }
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            navigate(-1);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link
                    to="#"
                    onClick={(e) => {
                        e.preventDefault();
                        handleCancel();
                    }}
                    style={{
                        color: '#646cff',
                        textDecoration: 'none',
                    }}
                >
                    ← Back
                </Link>
            </div>

            <h2>Create Question</h2>
            {templateName && <p style={{ color: '#666', marginBottom: '2rem' }}>Template: {templateName}</p>}

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
                        {loading ? 'Creating...' : 'Create Question'}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
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
