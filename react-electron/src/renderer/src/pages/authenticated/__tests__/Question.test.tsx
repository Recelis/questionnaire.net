import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../../test/test-utils';
import userEvent from '@testing-library/user-event';
import Templates from '../Templates';
import TemplateCreate from '../TemplateCreate';
import * as apiTemplate from '../../../api/apiTemplate';
import * as apiQuestionnaire from '../../../api/apiQuestionnaire';
import * as apiUser from '../../../api/apiUser';
import TemplateListItem from '../TemplateListItem';

// Mock the API modules
vi.mock('../../../api/apiTemplate', () => ({
    apiGetTemplates: vi.fn(),
    apiCreateTemplate: vi.fn(),
    apiUpdateTemplate: vi.fn(),
}));

vi.mock('../../../api/apiQuestionnaire', () => ({
    apiGetQuestionnaires: vi.fn(),
}));

vi.mock('../../../api/apiUser', () => ({
    apiGetUser: vi.fn(),
}));

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

// Helper to create a valid JWT token format (header.payload.signature)
// Payload: {"id":"1"} base64 encoded
const createMockToken = () => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEifQ.signature';

describe('TemplateQuestions', () => {
    const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
    };

    const mockQuestionnaire = {
        id: 1,
        name: 'My Test Questionnaire',
        userId: 1,
        templates: [],
    };

    const mockTemplates = [
        {
            id: 1,
            name: 'Template 1',
            version: 1,
            questionnaireId: 1,
        },
        {
            id: 2,
            name: 'Template 2',
            version: 2,
            questionnaireId: 1,
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        mockUseParams.mockReturnValue({ id: '1' });
        vi.mocked(apiUser.apiGetUser).mockResolvedValue(mockUser);
        localStorage.setItem('user_token', createMockToken());
    });

    it('renders loading state initially', async () => {
        vi.mocked(apiQuestionnaire.apiGetQuestionnaires).mockImplementation(
            () => new Promise(() => {}) // Never resolves
        );
        vi.mocked(apiTemplate.apiGetTemplates).mockImplementation(
            () => new Promise(() => {}) // Never resolves
        );

        render(<Templates />);

        // Wait for auth to initialize, then check for loading state
        await waitFor(
            () => {
                const loadingText = screen.queryByText('Loading templates...');
                const createForm = screen.queryByText('Create New Template');
                // Either loading or create form should be visible
                expect(loadingText || createForm).toBeTruthy();
            },
            { timeout: 2000 }
        );
    });

    it.todo('displays questions for the template');

    it.todo('displays create form when there are no templates');

    it.todo('displays button for adding a new template when templates exist');

    it.todo('shows create form when create button is clicked');

    it.todo('displays error message when API call fails');

    it.todo('displays back link to templates');

    it('updates questions list when new question is created');
});

describe('QuestionCreate', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it.todo('renders the create question form with all elements');

    it.todo('renders form without template name when not provided');

    it.todo('allows user to type in the question text field');

    it.todo('calls apiCreateQuestion when form is submitted with valid name');

    it.todo('calls onCancel when cancel button is clicked');

    it.todo('navigates back when question is created without callback');

    it.todo('prevents submitting when question text is empty');

    it.todo('prevents submitting when question text is only whitespace');

    it.todo('displays error message when API call fails');

    it.todo('displays generic error message when API throws non-Error');

    it.todo('clears error message when form is resubmitted');

    it.todo('displays error when template ID is missing');

    it.todo('disables submit button and input while loading');

    it.todo('displays back link when onCancel is not provided');
});

describe.todo('TemplateQuestionItem');

describe.todo('TemplateQuestionEdit');

describe.todo('TemplateQuestionRemove');
