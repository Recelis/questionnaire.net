import { useState } from 'react';
import { Link } from 'react-router';
import type {  IQuestionnaire } from '../../api/types';


export default function SubmissionCreate(props: {questionnaire: IQuestionnaire}) {
    const {questionnaire} = props;
    const [ loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const handleStart = async (e: React.FormEvent) => {
        e.preventDefault();
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
