import { use, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import type {  IQuestionnaire } from '../../api/types';
import { apiCreateSubmission } from '../../api/apiSubmission';


export default function SubmissionCreate(props: {questionnaire: IQuestionnaire}) {
    const {questionnaire} = props;
    const [ loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const navigate = useNavigate();

    const handleStart = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(undefined);
        try {
            // Create a new submission based on the latest template
            const latestTemplateId = Math.max(...questionnaire.templates.map(t => t.id));
            const submission = await apiCreateSubmission({
                templateId: latestTemplateId
            });
            if (!submission) {
                throw new Error('Failed to create submission');
            }
            // Redirect to the first question for the submission page
            navigate(`/questionnaire/${questionnaire.id}/submission/${submission.id}/question`);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to start submission');
        } finally {
            setLoading(false);
        }
    };
    if (questionnaire.templates.length === 0) {
        return (
            <>
                <p>No templates found for this questionnaire. Please add a template first.</p>
                <Link to={`/questionnaire/${questionnaire.id}/edit/template`}>Go to Templates</Link>
            </>
        );
    }
    return (
        <>
            <button onClick={handleStart} disabled={loading}>
                {loading ? 'Starting...' : 'Start New Submission'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
    );
}
