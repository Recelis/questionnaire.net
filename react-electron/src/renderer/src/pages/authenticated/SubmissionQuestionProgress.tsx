import React, { useState } from 'react'
import { useNavigate } from 'react-router';

interface ISubmissionQuestionProgressProps {
    questionnaireId: number;
    submissionId: number;
    totalQuestions: number;
    currentQuestionIndex: number;
}

export default function SubmissionQuestionProgress(props: ISubmissionQuestionProgressProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const navigate = useNavigate();
    const style = {
        container: {
            position: 'fixed' as 'fixed',
            left: '1rem',
            top: '50%',
            height: 'auto',
            padding: '0.75rem',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column' as 'column',
            gap: '8px',
            alignItems: 'start',
        },
        step: {
            height: '12px',
            width: '12px',
            borderRadius: '50%',
            backgroundColor: '#e0e0e0',
            margin: '4px 0',
            position: 'relative' as 'relative',
            transition: 'transform 160ms ease, box-shadow 160ms ease',
            cursor: 'pointer'
        },
        stepCompleted: {
            backgroundColor: '#4caf50',
        },
        stepActive: {
            backgroundColor: '#646cff',
        },
    };
    return (
        <div style={style.container}>
            {Array.from({ length: props.totalQuestions }).map((_, index) => {
                const isCompleted = index < props.currentQuestionIndex;
                    const isActive = index === props.currentQuestionIndex;
                    const isHovered = hoveredIndex === index;

                    let stepStyle: Record<string, any> = { ...style.step };
                    if (isCompleted) stepStyle = { ...stepStyle, ...style.stepCompleted };
                    if (isActive) stepStyle = { ...stepStyle, ...style.stepActive };

                    const scale = isHovered ? 1.5 : (isActive ? 1.2 : 1);
                    stepStyle.transform = `scale(${scale})`;
                    if (isHovered) stepStyle.boxShadow = '0 6px 12px rgba(0,0,0,0.12)';

                    return (
                        <div
                            key={index}
                            style={stepStyle}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onFocus={() => setHoveredIndex(index)}
                            onBlur={() => setHoveredIndex(null)}
                            role="button"
                            tabIndex={0}
                            aria-label={`Question ${index + 1}`}
                            onClick={() => {
                                navigate(`/questionnaire/${props.questionnaireId}/submission/${props.submissionId}/question/${index}`);
                            }}
                        />
                    );
                })}
            </div>
        )
    };

