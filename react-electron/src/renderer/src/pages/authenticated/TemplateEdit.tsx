import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import Layout from '../../components/Layout';
import { apiGetTemplate, apiUpdateTemplate, apiGetTemplates } from '../../api/apiTemplate';
import useAuth from '../../hooks/useAuth';

export default function TemplateEdit() {
    const { id, templateid } = useParams<{ id: string; templateid: string }>();
    const templateId = templateid;
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState<string | undefined>(undefined);
    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
        const fetchTemplate = async () => {
            if (!templateId || !auth.user?.id) {
                setInitialLoading(false);
                return;
            }

            try {
                setInitialLoading(true);
                setError(undefined);
                const template = await apiGetTemplate(parseInt(templateId, 10));
                if (template) {
                    setName(template.name);
                } else {
                    setError('Template not found');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load template');
            } finally {
                setInitialLoading(false);
            }
        };

        fetchTemplate();
    }, [templateId, auth.user?.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!templateId) return;

        setError(undefined);
        setLoading(true);

        try {
            if (!name.trim()) {
                setError('Template name is required');
                setLoading(false);
                return;
            }

            await apiUpdateTemplate(parseInt(templateId, 10), { name: name.trim() });
            navigate(`/questionnaire/${id}/edit/template`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update template');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <Layout>
                <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                        Loading template...
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <Link
                        to={`/questionnaire/${id}/edit/template`}
                        style={{ color: '#646cff', textDecoration: 'none' }}
                    >
                        ← Back to Templates
                    </Link>
                </div>

                <h1 style={{ marginBottom: '1.5rem' }}>Edit Template</h1>

                {error && !loading && (
                    <div
                        style={{
                            padding: '0.75rem',
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

                <form
                    onSubmit={handleSubmit}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    <div>
                        <label
                            htmlFor="name"
                            style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: 500,
                            }}
                        >
                            Template Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Enter template name"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '0.6em 1em',
                                fontSize: '1em',
                                borderRadius: '8px',
                                border: '1px solid #646cff',
                                color: 'inherit',
                                fontFamily: 'inherit',
                            }}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            type="submit"
                            disabled={loading || !name.trim()}
                            style={{
                                padding: '0.6em 1.2em',
                                fontSize: '1em',
                                fontWeight: 500,
                                borderRadius: '8px',
                                border: '1px solid transparent',
                                backgroundColor: loading ? '#444' : '#646cff',
                                color: 'white',
                                cursor: loading || !name.trim() ? 'not-allowed' : 'pointer',
                                opacity: loading || !name.trim() ? 0.6 : 1,
                                transition: 'all 0.25s',
                            }}
                        >
                            {loading ? 'Updating...' : 'Update Template'}
                        </button>
                        <Link
                            to={`/questionnaire/${id}/edit/template`}
                            style={{
                                padding: '0.6em 1.2em',
                                fontSize: '1em',
                                fontWeight: 500,
                                borderRadius: '8px',
                                border: '1px solid #646cff',
                                backgroundColor: 'transparent',
                                color: '#646cff',
                                textDecoration: 'none',
                                display: 'inline-block',
                                textAlign: 'center',
                            }}
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
