import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import Layout from '../../components/Layout';
import TemplateCreate from './TemplateCreate';
import TemplateListItem from './TemplateListItem';
import useAuth from '../../hooks/useAuth';
import { apiGetQuestionnaire } from '../../api/apiQuestionnaire';
import type { ITemplate } from '../../api/types';

export default function Templates() {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>(undefined);
    const [templates, setTemplates] = useState<ITemplate[]>([]);
    const [questionnaireName, setQuestionnaireName] = useState<string>('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const auth = useAuth();

    const navigate = useNavigate();
    const questionnaireId = id ? parseInt(id, 10) : undefined;
    if (!questionnaireId) {
        navigate('/');
        return;
    }

    useEffect(() => {
        const fetchData = async () => {
            if (!auth.user?.id || !id) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(undefined);

                // Fetch questionnaire to get its name
                const questionnaire = await apiGetQuestionnaire(questionnaireId);

                if (questionnaire) {
                    setQuestionnaireName(questionnaire.name);
                    setTemplates(questionnaire.templates);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load templates');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, auth.user?.id]);

    const handleTemplateCreated = (newTemplate: ITemplate) => {
        setTemplates([...templates, newTemplate]);
        setShowCreateForm(false);
    };

    // Show create form only if no error, not loading, and either explicitly requested or no templates
    if (!error && !loading && (showCreateForm || templates.length === 0)) {
        return (
            <TemplateCreate
                questionnaireId={questionnaireId}
                questionnaireName={questionnaireName}
                onTemplateCreated={handleTemplateCreated}
                onCancel={() => {
                    if (templates.length > 0) {
                        setShowCreateForm(false);
                    } else {
                        navigate('/');
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
                        to="/"
                        style={{
                            color: '#646cff',
                            textDecoration: 'none',
                            marginBottom: '1rem',
                            display: 'inline-block',
                        }}
                    >
                        ← Back to Questionnaires
                    </Link>
                </div>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '2rem',
                    }}
                >
                    <div>
                        <h1 style={{ margin: 0, marginBottom: '0.5rem' }}>Templates</h1>
                        {questionnaireName && (
                            <p style={{ margin: 0, color: '#888', fontSize: '0.9em' }}>
                                For: {questionnaireName}
                            </p>
                        )}
                    </div>
                    {!error && (
                        <button
                            onClick={() => setShowCreateForm(true)}
                            style={{
                                padding: '0.6em 1.2em',
                                fontSize: '1em',
                                fontWeight: 500,
                                borderRadius: '8px',
                                border: '1px solid transparent',
                                backgroundColor: '#646cff',
                                color: 'white',
                                cursor: 'pointer',
                                transition: 'all 0.25s',
                            }}
                        >
                            + Create New Template
                        </button>
                    )}
                </div>

                {loading && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                        Loading templates...
                    </div>
                )}

                {error && (
                    <div
                        style={{
                            padding: '1rem',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(255, 0, 0, 0.1)',
                            color: '#ff6b6b',
                            border: '1px solid rgba(255, 0, 0, 0.3)',
                            marginBottom: '1rem',
                        }}
                    >
                        {error}
                    </div>
                )}

                {!loading && !error && templates.length > 0 && (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '1.5rem',
                        }}
                    >
                        {templates.map(template => (
                            <TemplateListItem
                                key={template.id}
                                questionnaireId={questionnaireId}
                                template={template}
                            />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
