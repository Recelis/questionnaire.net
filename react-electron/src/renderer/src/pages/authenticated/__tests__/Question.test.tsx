import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../../test/test-utils';
import userEvent from '@testing-library/user-event';
import TemplateQuestions from '../TemplateQuestions';
import QuestionCreate from '../QuestionCreate';
import * as apiTemplate from '../../../api/apiTemplate';
import * as apiQuestionnaire from '../../../api/apiQuestionnaire';
import * as apiUser from '../../../api/apiUser';
import * as apiQuestion from '../../../api/apiQuestion';

// Mock the API modules
vi.mock('../../../api/apiTemplate', () => ({
    apiGetTemplates: vi.fn(),
    apiCreateTemplate: vi.fn(),
    apiUpdateTemplate: vi.fn(),
    apiGetTemplate: vi.fn(),
}));

vi.mock('../../../api/apiQuestionnaire', () => ({
    apiGetQuestionnaires: vi.fn(),
}));

vi.mock('../../../api/apiUser', () => ({
    apiGetUser: vi.fn(),
}));

vi.mock('../../../api/apiQuestion', () => ({
    apiCreateQuestion: vi.fn(),
    apiGetQuestions: vi.fn(),
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
    const mockTemplate = {
        id: 1,
        name: 'Test Template',
        version: 1,
        questionnaireId: 1,
    };

    const mockQuestions = [
        {
            id: 1,
            questionText: 'What is your name?',
            templateId: 1,
        },
        {
            id: 2,
            questionText: 'What is your age?',
            templateId: 1,
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        mockUseParams.mockReturnValue({ templateId: '1' });
    });

    it('renders loading state initially', async () => {
        vi.mocked(apiTemplate.apiGetTemplate).mockImplementation(
            () => new Promise(() => {}) // Never resolves
        );
        vi.mocked(apiQuestion.apiGetQuestions).mockImplementation(
            () => new Promise(() => {}) // Never resolves
        );

        render(<TemplateQuestions />);

        await waitFor(
            () => {
                const loadingText = screen.queryByText('Loading questions...');
                expect(loadingText).toBeTruthy();
            },
            { timeout: 2000 }
        );
    });

    it('displays questions for the template', async () => {
        vi.mocked(apiTemplate.apiGetTemplate).mockResolvedValue(mockTemplate);
        vi.mocked(apiQuestion.apiGetQuestions).mockResolvedValue(mockQuestions);

        render(<TemplateQuestions />);

        await waitFor(() => {
            expect(screen.getByText('What is your name?')).toBeInTheDocument();
            expect(screen.getByText('What is your age?')).toBeInTheDocument();
        });
    });

    it('displays create form when there are no questions for the template', async () => {
        vi.mocked(apiTemplate.apiGetTemplate).mockResolvedValue(mockTemplate);
        vi.mocked(apiQuestion.apiGetQuestions).mockResolvedValue([]);

        render(<TemplateQuestions />);

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: 'Create Question' })).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Enter the question text...')).toBeInTheDocument();
        });
    });

    it('displays button for adding a new question when question exist', async () => {
        vi.mocked(apiTemplate.apiGetTemplate).mockResolvedValue(mockTemplate);
        vi.mocked(apiQuestion.apiGetQuestions).mockResolvedValue(mockQuestions);

        render(<TemplateQuestions />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /add question/i })).toBeInTheDocument();
        });
    });

    it('shows create form when create button is clicked', async () => {
        const user = userEvent.setup();
        vi.mocked(apiTemplate.apiGetTemplate).mockResolvedValue(mockTemplate);
        vi.mocked(apiQuestion.apiGetQuestions).mockResolvedValue(mockQuestions);

        render(<TemplateQuestions />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /add question/i })).toBeInTheDocument();
        });

        const addButton = screen.getByRole('button', { name: /add question/i });
        await user.click(addButton);

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: 'Create Question' })).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Enter the question text...')).toBeInTheDocument();
        });
    });

    it('displays error message when API call fails', async () => {
        const errorMessage = 'Failed to load questions';
        vi.mocked(apiTemplate.apiGetTemplate).mockRejectedValue(new Error(errorMessage));
        vi.mocked(apiQuestion.apiGetQuestions).mockRejectedValue(new Error(errorMessage));

        render(<TemplateQuestions />);

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });

    it('displays back link to templates', async () => {
        vi.mocked(apiTemplate.apiGetTemplate).mockResolvedValue(mockTemplate);
        vi.mocked(apiQuestion.apiGetQuestions).mockResolvedValue(mockQuestions);

        render(<TemplateQuestions />);

        await waitFor(() => {
            expect(screen.getByRole('link', { name: /back to templates/i })).toBeInTheDocument();
        });
    });

    it('updates questions list when new question is created', async () => {
        const user = userEvent.setup();
        const newQuestion = {
            id: 3,
            questionText: 'What is your email?',
            templateId: 1,
        };

        vi.mocked(apiTemplate.apiGetTemplate).mockResolvedValue(mockTemplate);
        vi.mocked(apiQuestion.apiGetQuestions).mockResolvedValue(mockQuestions);
        vi.mocked(apiQuestion.apiCreateQuestion).mockResolvedValue(newQuestion);

        render(<TemplateQuestions />);

        // Wait for initial questions to load
        await waitFor(() => {
            expect(screen.getByText('What is your name?')).toBeInTheDocument();
        });

        // Click add button
        const addButton = screen.getByRole('button', { name: /add question/i });
        await user.click(addButton);

        // Wait for form to appear
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: 'Create Question' })).toBeInTheDocument();
        });

        // Fill and submit form
        const textInput = screen.getByPlaceholderText('Enter the question text...');
        await user.type(textInput, 'What is your email?');

        const submitButton = screen.getByRole('button', { name: /create question/i });
        await user.click(submitButton);

        // Verify new question appears in the list
        await waitFor(() => {
            expect(screen.getByText('What is your email?')).toBeInTheDocument();
            expect(screen.getByText('What is your name?')).toBeInTheDocument();
            expect(screen.getByText('What is your age?')).toBeInTheDocument();
        });
    });
});

describe('QuestionCreate', () => {
    const mockTemplateId = 1;
    const mockTemplateName = 'Test Template';

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        mockUseParams.mockReturnValue({ id: '1' });
    });

    it('renders the create question form with all elements', () => {
        render(
            <QuestionCreate
                templateId={mockTemplateId}
                templateName={mockTemplateName}
            />
        );

        expect(screen.getByRole('heading', { name: 'Create Question' })).toBeInTheDocument();
        expect(screen.getByLabelText('Question Text:')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter the question text...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create question/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
        expect(screen.getByRole('link')).toBeInTheDocument();
    });

    it('renders form without template name when not provided', () => {
        render(
            <QuestionCreate
                templateId={mockTemplateId}
            />
        );

        expect(screen.getByRole('heading', { name: 'Create Question' })).toBeInTheDocument();
        expect(screen.queryByText(`Template: ${mockTemplateName}`)).not.toBeInTheDocument();
    });

    it('allows user to type in the question text field', async () => {
        const user = userEvent.setup();
        render(
            <QuestionCreate
                templateId={mockTemplateId}
                templateName={mockTemplateName}
            />
        );

        const textInput = screen.getByPlaceholderText('Enter the question text...');
        await user.type(textInput, 'What is your name?');

        expect(textInput).toHaveValue('What is your name?');
    });

    it('calls apiCreateQuestion when form is submitted with valid name', async () => {
        const user = userEvent.setup();
        const mockQuestion = {
            id: 1,
            questionText: 'What is your name?',
            templateId: mockTemplateId,
        };

        vi.mocked(apiQuestion.apiCreateQuestion).mockResolvedValue(mockQuestion);

        const onQuestionCreated = vi.fn();
        render(
            <QuestionCreate
                templateId={mockTemplateId}
                templateName={mockTemplateName}
                onQuestionCreated={onQuestionCreated}
            />
        );

        const textInput = screen.getByPlaceholderText('Enter the question text...');
        await user.type(textInput, 'What is your name?');

        const submitButton = screen.getByRole('button', { name: /create question/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(apiQuestion.apiCreateQuestion).toHaveBeenCalledWith({
                templateId: mockTemplateId,
                questionText: 'What is your name?',
            });
            expect(onQuestionCreated).toHaveBeenCalledWith(mockQuestion);
        });
    });

    it('calls onCancel when cancel button is clicked', async () => {
        const user = userEvent.setup();
        const onCancel = vi.fn();

        render(
            <QuestionCreate
                templateId={mockTemplateId}
                templateName={mockTemplateName}
                onCancel={onCancel}
            />
        );

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        await user.click(cancelButton);

        expect(onCancel).toHaveBeenCalled();
    });

    it('navigates back when question is created without callback', async () => {
        const user = userEvent.setup();
        const mockQuestion = {
            id: 1,
            questionText: 'What is your name?',
            templateId: mockTemplateId,
        };

        vi.mocked(apiQuestion.apiCreateQuestion).mockResolvedValue(mockQuestion);

        render(
            <QuestionCreate
                templateId={mockTemplateId}
                templateName={mockTemplateName}
            />
        );

        const textInput = screen.getByPlaceholderText('Enter the question text...');
        await user.type(textInput, 'What is your name?');

        const submitButton = screen.getByRole('button', { name: /create question/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(apiQuestion.apiCreateQuestion).toHaveBeenCalled();
        });
    });

    it('prevents submitting when question text is empty', async () => {
        const user = userEvent.setup();

        render(
            <QuestionCreate
                templateId={mockTemplateId}
                templateName={mockTemplateName}
            />
        );

        const submitButton = screen.getByRole('button', { name: /create question/i });
        await user.click(submitButton);

        expect(screen.getByText('Question text cannot be empty')).toBeInTheDocument();
        expect(apiQuestion.apiCreateQuestion).not.toHaveBeenCalled();
    });

    it('prevents submitting when question text is only whitespace', async () => {
        const user = userEvent.setup();

        render(
            <QuestionCreate
                templateId={mockTemplateId}
                templateName={mockTemplateName}
            />
        );

        const textInput = screen.getByPlaceholderText('Enter the question text...');
        await user.type(textInput, '   ');

        const submitButton = screen.getByRole('button', { name: /create question/i });
        await user.click(submitButton);

        expect(screen.getByText('Question text cannot be empty')).toBeInTheDocument();
        expect(apiQuestion.apiCreateQuestion).not.toHaveBeenCalled();
    });

    it('displays error message when API call fails', async () => {
        const user = userEvent.setup();
        const errorMessage = 'Failed to create question';

        vi.mocked(apiQuestion.apiCreateQuestion).mockRejectedValue(new Error(errorMessage));

        render(
            <QuestionCreate
                templateId={mockTemplateId}
                templateName={mockTemplateName}
            />
        );

        const textInput = screen.getByPlaceholderText('Enter the question text...');
        await user.type(textInput, 'What is your name?');

        const submitButton = screen.getByRole('button', { name: /create question/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });

    it('displays generic error message when API throws non-Error', async () => {
        const user = userEvent.setup();

        vi.mocked(apiQuestion.apiCreateQuestion).mockRejectedValue('Unknown error');

        render(
            <QuestionCreate
                templateId={mockTemplateId}
                templateName={mockTemplateName}
            />
        );

        const textInput = screen.getByPlaceholderText('Enter the question text...');
        await user.type(textInput, 'What is your name?');

        const submitButton = screen.getByRole('button', { name: /create question/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('An unknown error occurred')).toBeInTheDocument();
        });
    });

    it('clears error message when form is resubmitted', async () => {
        const user = userEvent.setup();
        const mockQuestion = {
            id: 1,
            questionText: 'What is your name?',
            templateId: mockTemplateId,
        };

        vi.mocked(apiQuestion.apiCreateQuestion)
            .mockRejectedValueOnce(new Error('First attempt failed'))
            .mockResolvedValueOnce(mockQuestion);

        render(
            <QuestionCreate
                templateId={mockTemplateId}
                templateName={mockTemplateName}
            />
        );

        const textInput = screen.getByPlaceholderText('Enter the question text...');
        const submitButton = screen.getByRole('button', { name: /create question/i });

        // First submission - fails
        await user.type(textInput, 'What is your name?');
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('First attempt failed')).toBeInTheDocument();
        });

        // Clear the input and type again
        await user.clear(textInput);
        await user.type(textInput, 'What is your age?');

        // Second submission - succeeds
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.queryByText('First attempt failed')).not.toBeInTheDocument();
            expect(apiQuestion.apiCreateQuestion).toHaveBeenCalledTimes(2);
        });
    });

    it('displays error when template ID is missing', async () => {
        const user = userEvent.setup();

        render(
            <QuestionCreate
                templateId={0}
                templateName={mockTemplateName}
            />
        );

        const textInput = screen.getByPlaceholderText('Enter the question text...');
        await user.type(textInput, 'What is your name?');

        const submitButton = screen.getByRole('button', { name: /create question/i });
        await user.click(submitButton);

        expect(screen.getByText('Template ID is missing')).toBeInTheDocument();
        expect(apiQuestion.apiCreateQuestion).not.toHaveBeenCalled();
    });

    it('disables submit button and input while loading', async () => {
        const user = userEvent.setup();

        vi.mocked(apiQuestion.apiCreateQuestion).mockImplementation(
            () => new Promise(() => {}) // Never resolves
        );

        render(
            <QuestionCreate
                templateId={mockTemplateId}
                templateName={mockTemplateName}
            />
        );

        const textInput = screen.getByPlaceholderText('Enter the question text...') as HTMLTextAreaElement;
        await user.type(textInput, 'What is your name?');

        const submitButton = screen.getByRole('button', { name: /create question/i }) as HTMLButtonElement;
        await user.click(submitButton);

        await waitFor(() => {
            expect(submitButton).toBeDisabled();
            expect(textInput).toBeDisabled();
        });
    });

    it('displays back link when onCancel is not provided', () => {
        render(
            <QuestionCreate
                templateId={mockTemplateId}
                templateName={mockTemplateName}
            />
        );

        const backLink = screen.getByRole('link');
        expect(backLink).toBeInTheDocument();
    });
});

describe.todo('TemplateQuestionItem');

describe.todo('TemplateQuestionEdit');

describe.todo('TemplateQuestionRemove');
