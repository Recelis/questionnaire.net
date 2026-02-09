import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../../test/test-utils';
import SubmissionNoQuestions from '../SubmissionNoQuestions';

// Mock react-router
const mockNavigate = vi.fn();
const mockUseParams = vi.fn();
vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router');
    return {
        ...actual,
        Link: ({
            to,
            children,
            onClick,
        }: {
            to: string;
            children: React.ReactNode;
            onClick?: () => void;
        }) => {
            const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                e.stopPropagation();
                mockNavigate(to);
                onClick?.();
            };
            return (
                <a href={to} onClick={handleClick}>
                    {children}
                </a>
            );
        },
        useNavigate: () => mockNavigate,
        useParams: () => mockUseParams(),
    };
});

describe('SubmissionNoQuestions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockNavigate.mockClear();
        mockUseParams.mockReturnValue({ questionnaireId: '1', templateId: '1' });
    });

    it('renders the no questions page with correct message', () => {
        render(<SubmissionNoQuestions />);

        expect(screen.getByText('No Questions Available')).toBeInTheDocument();
        expect(screen.getByText(/no questions available for this questionnaire/i)).toBeInTheDocument();
    });

    it('displays a back link to navigate back', async () => {
        render(<SubmissionNoQuestions />);

        const backLink = screen.getByText('← Back');
        expect(backLink).toBeInTheDocument();
        expect(backLink.closest('a')).toHaveAttribute('href', '#');
    });

    it('displays a link to go to template questions', () => {
        render(<SubmissionNoQuestions />);

        const templateLink = screen.getByText('Go to Template Questions');
        expect(templateLink).toBeInTheDocument();
        expect(templateLink.closest('a')).toHaveAttribute('href', '/questionnaire/1/edit/template/1/question');
    });

    it('navigates back when back link is clicked', async () => {
        const user = await import('@testing-library/user-event').then(mod => mod.default.setup());
        render(<SubmissionNoQuestions />);

        const backLink = screen.getByText('← Back');
        await user.click(backLink);

        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
});
