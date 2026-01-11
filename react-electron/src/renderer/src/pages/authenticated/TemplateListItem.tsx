import type { ITemplate } from '../../api/types';
import { Link } from 'react-router';

export interface ITemplateListItemProps {
    questionnaireId: number;
    template: ITemplate;
}

export default function TemplateListItem(props: ITemplateListItemProps) {
    const { template, questionnaireId } = props;
    return (
        <Link
            to={`/questionnaire/${questionnaireId}/edit/template/edit/${template.id}`}
            key={template.id}
            style={{
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid #333',
                transition: 'all 0.25s',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#646cff';
                e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            <h3
                style={{
                    margin: 0,
                    fontSize: '1.25em',
                    color: '#646cff',
                    marginBottom: '0.5rem',
                }}
            >
                {template.name}
            </h3>
            <p style={{ margin: '0.5rem 0', color: '#888', fontSize: '0.9em' }}>
                Version: {template.version}
            </p>
            <div style={{ marginTop: '1rem', fontSize: '0.85em', color: '#666' }}>
                ID: {template.id}
            </div>
        </Link>
    );
}
