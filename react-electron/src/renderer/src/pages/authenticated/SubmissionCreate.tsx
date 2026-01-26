import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import type {  IQuestionnaire } from '../../api/types';
import Layout from '../../components/Layout';
import { apiGetQuestionnaire } from '../../api/apiQuestionnaire';


export default function SubmissionCreate() {
    const { id: urlQuestionnaireId} = useParams();
    const [error, setError] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    
    const [questionnaire, setQuestionnaire] = useState<IQuestionnaire | undefined>();

    useEffect(() => {
        const fetchQuestionnaire = async () => {
            if (!urlQuestionnaireId) return;

            try {
                setLoading(true);
                setError(undefined);
                // Assuming there's an API function to get questionnaire by ID
                const response = await apiGetQuestionnaire(parseInt(urlQuestionnaireId, 10));
                if (response == null) {
                    throw new Error('Failed to load questionnaire');
                }

                const data: IQuestionnaire = response;
                setQuestionnaire(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load questionnaire');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestionnaire();
    }, [urlQuestionnaireId]);

    const navigate = useNavigate();

    const handleStart = async (e: React.FormEvent) => {
        e.preventDefault();
    };

    if (loading || !questionnaire) {
        return (
            <Layout>
                <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
                    <p>Loading questionnaire...</p>
                </div>
            </Layout>
        );
    }


    return (
        <Layout>
            <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
            <Link
                    to="#"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate(-1);
                    }}
                    style={{
                        color: '#646cff',
                        textDecoration: 'none',
                    }}
                >
                    ← Back
                </Link>
            <h2>{questionnaire.name}</h2>
            <button onClick={handleStart} disabled={loading}>
                {loading ? 'Starting...' : 'Start New Submission'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </Layout>
    );
}
