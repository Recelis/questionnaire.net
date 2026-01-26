import React from 'react';
import DropdownMenu from '../../components/DropdownMenu';
import type { IQuestionnaire } from '../../api/types';
import { useNavigate } from 'react-router';

interface IQuestionnaireListItemProps {
    questionnaire: IQuestionnaire;
    onDeleteClick: (questionnaire: IQuestionnaire) => void;
    onEditClick: (questionnaire: IQuestionnaire) => void;
    onEditTemplatesClick: (questionnaire: IQuestionnaire) => void;
}

export default function QuestionnaireListItem(props: IQuestionnaireListItemProps) {
    const { questionnaire, onDeleteClick, onEditClick, onEditTemplatesClick } = props;

    const navigate = useNavigate();

    return (
        <div
            style={{
                padding: '1.5rem',
                // backgroundColor: "#1a1a1a",
                borderRadius: '8px',
                border: '1px solid #333',
                transition: 'all 0.25s',
                position: 'relative',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#646cff';
                e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
            onClick={e => {
                // Prevent click when clicking on dropdown menu
                if ((e.target as HTMLElement).closest('button')) return;
                navigate(`/questionnaire/${questionnaire.id}/submission`);
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem',
                }}
            >
                <h3
                    style={{
                        margin: 0,
                        fontSize: '1.25em',
                        color: '#646cff',
                        flex: 1,
                    }}
                >
                    {questionnaire.name}
                </h3>
                <DropdownMenu
                    trigger={
                        <button
                            style={{
                                padding: '0.25rem 0.5rem',
                                cursor: 'pointer',
                                color: '#888',
                                fontSize: '1.2em',
                                userSelect: 'none',
                            }}
                        >
                            ⋮
                        </button>
                    }
                    options={[
                        {
                            label: 'Edit',
                            action: () => onEditClick(questionnaire),
                        },
                        {
                            label: 'Edit Templates',
                            action: () => onEditTemplatesClick(questionnaire),
                        },
                        // {
                        //     label: 'View Latest Submissions',
                        //     action: () => {},
                        // },
                        {
                            label: 'Delete',
                            action: () => onDeleteClick(questionnaire),
                            danger: true,
                        },
                    ]}
                />
            </div>
            <p style={{ margin: '0.5rem 0', color: '#888', fontSize: '0.9em' }}>
                {questionnaire.templates.length} template
                {questionnaire.templates.length !== 1 ? 's' : ''}
            </p>
            <div style={{ marginTop: '1rem', fontSize: '0.85em', color: '#666' }}>
                ID: {questionnaire.id}
            </div>
        </div>
    );
}
