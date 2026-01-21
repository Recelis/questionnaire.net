import { use, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import Layout from '../../components/Layout';
import QuestionCreate from './QuestionCreate';
import { apiGetQuestions } from '../../api/apiQuestion';
import { apiGetTemplate } from '../../api/apiTemplate';
import type { IQuestion, ITemplate } from '../../api/types';

export default function TemplateQuestions() {
    const { templateId } = useParams<{ templateId: string }>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>(undefined);
    const [questions, setQuestions] = useState<IQuestion[]>([]);
    const [template, setTemplate] = useState<ITemplate | undefined>(undefined);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const parsedTemplateId = templateId ? parseInt(templateId, 10) : undefined;
    console.log('Parsed Template ID:', parsedTemplateId);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (!parsedTemplateId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(undefined);

                // Fetch template info
                const templateData = await apiGetTemplate(parsedTemplateId);
                if (templateData) {
                    setTemplate(templateData);
                }

                // Fetch questions for the template
                const questionsData = await apiGetQuestions(parsedTemplateId);
                if (questionsData) {
                    setQuestions(questionsData);
                } else {
                    setQuestions([]);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load questions');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [parsedTemplateId]);

    const handleQuestionCreated = (newQuestion: IQuestion) => {
        setQuestions([...questions, newQuestion]);
        setShowCreateForm(false);
    };

    // Show create form if explicitly requested or no questions exist
    if (!error && !loading && (showCreateForm || questions.length === 0)) {
        return (
            <QuestionCreate
                templateId={parsedTemplateId || 0}
                templateName={template?.name}
                onQuestionCreated={handleQuestionCreated}
                onCancel={() => {
                    if (questions.length > 0) {
                        setShowCreateForm(false);
                    }
                    else {
                        // navigate back if no questions exist
                        navigate(-1);
                    }
                    
                }}
            />
        );
    }

    return (
        <Layout>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <Link
                        to="/templates"
                        style={{
                            color: '#646cff',
                            textDecoration: 'none',
                            marginBottom: '1rem',
                            display: 'inline-block',
                        }}
                    >
                        ← Back to Templates
                    </Link>
                </div>

                {loading && <p>Loading questions...</p>}

                {error && (
                    <div
                        style={{
                            color: '#d32f2f',
                            backgroundColor: '#ffebee',
                            padding: '1rem',
                            borderRadius: '4px',
                            marginBottom: '2rem',
                        }}
                    >
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '2rem',
                            }}
                        >
                            <div>
                                <h1>{template?.name}</h1>
                                <p style={{ color: '#666' }}>Questions: {questions.length}</p>
                            </div>
                            {questions.length > 0 && (
                                <button
                                    onClick={() => setShowCreateForm(true)}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        fontSize: '1rem',
                                        backgroundColor: '#646cff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Add Question
                                </button>
                            )}
                        </div>

                        {questions.length > 0 && (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {questions.map((question, index) => (
                                    <div
                                        key={question.id}
                                        style={{
                                            padding: '1.5rem',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            backgroundColor: '#f9f9f9',
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>
                                                    Question {index + 1}
                                                </p>
                                                <p style={{ margin: 0, color: '#333' }}>{question.questionText}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
}
