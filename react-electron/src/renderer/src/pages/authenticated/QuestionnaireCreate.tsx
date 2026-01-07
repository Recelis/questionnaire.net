import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Layout from '../../components/Layout';
import { apiCreateQuestionnaire } from '../../api/apiQuestionnaire';

export default function QuestionnaireCreate() {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(undefined);
        setLoading(true);

        try {
            if (!name.trim()) {
                setError('Questionnaire name is required');
                setLoading(false);
                return;
            }

            await apiCreateQuestionnaire({ name: name.trim() });
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create questionnaire');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <Link to="/" style={{ color: '#646cff', textDecoration: 'none' }}>
                        ← Back to Questionnaires
                    </Link>
                </div>

                <h1 style={{ marginBottom: '1.5rem' }}>Create New Questionnaire</h1>

                <form
                    onSubmit={handleSubmit}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    <div>
                        <label
                            htmlFor="name"
                            style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}
                        >
                            Questionnaire Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Enter questionnaire name"
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

                    {error && (
                        <div
                            style={{
                                padding: '0.75rem',
                                borderRadius: '8px',
                                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                                color: '#ff6b6b',
                                border: '1px solid rgba(255, 0, 0, 0.3)',
                            }}
                        >
                            {error}
                        </div>
                    )}

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
                            {loading ? 'Creating...' : 'Create Questionnaire'}
                        </button>
                        <Link
                            to="/"
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
