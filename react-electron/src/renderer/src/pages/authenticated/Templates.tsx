import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import TemplateCreate from './TemplateCreate';
import useAuth from '../../hooks/useAuth';
import { ITemplate } from '../../api/apiQuestionnaire';

export default function Templates() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>(undefined);
    const [templates, setTemplates] = useState<ITemplate[]>([]);
    const auth = useAuth();

    useEffect(() => {
        const fetchTemplates = async () => {
            if (!auth.user?.id) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(undefined);
                const data = await apiGetTemplates(auth.user.id);
                if (data) {
                    setTemplates(data);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load questionnaires');
            } finally {
                setLoading(false);
            }
        };
        fetchTemplates();
    }, []);
    // If no templates, then show create

    // else show list of tempalates
    return (
        <Layout>
            {loading && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                    Loading questionnaires...
                </div>
            )}
            {templates.length == 0 && <TemplateCreate />}
        </Layout>
    );
}
