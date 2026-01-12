import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../../test/test-utils';
import userEvent from '@testing-library/user-event';
import Templates from '../Templates';
import TemplateCreate from '../TemplateCreate';
import * as apiTemplate from '../../../api/apiTemplate';
import * as apiQuestionnaire from '../../../api/apiQuestionnaire';
import * as apiUser from '../../../api/apiUser';

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
        Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
            <a href={to}>{children}</a>
        ),
        useNavigate: () => mockNavigate,
        useParams: () => mockUseParams(),
    };
});

// Helper to create a valid JWT token format (header.payload.signature)
// Payload: {"id":"1"} base64 encoded
const createMockToken = () => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEifQ.signature';

describe('Templates', () => {
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

    it('displays templates for the questionnaire', async () => {
        vi.mocked(apiQuestionnaire.apiGetQuestionnaires).mockResolvedValue([mockQuestionnaire]);
        vi.mocked(apiTemplate.apiGetTemplates).mockResolvedValue(mockTemplates);

        render(<Templates />);

        await waitFor(
            () => {
                expect(screen.getByText('Templates')).toBeInTheDocument();
            },
            { timeout: 3000 }
        );

        expect(screen.getByText('For: My Test Questionnaire')).toBeInTheDocument();
        expect(screen.getByText('Template 1')).toBeInTheDocument();
        expect(screen.getByText('Template 2')).toBeInTheDocument();
        expect(screen.getByText('Version: 1')).toBeInTheDocument();
        expect(screen.getByText('Version: 2')).toBeInTheDocument();
    });

    it('displays create form when there are no templates', async () => {
        vi.mocked(apiQuestionnaire.apiGetQuestionnaires).mockResolvedValue([mockQuestionnaire]);
        vi.mocked(apiTemplate.apiGetTemplates).mockResolvedValue([]);

        render(<Templates />);

        await waitFor(
            () => {
                expect(screen.getByText('Create New Template')).toBeInTheDocument();
            },
            { timeout: 3000 }
        );

        expect(screen.getByLabelText('Template Name')).toBeInTheDocument();
    });

    it('displays button for adding a new template when templates exist', async () => {
        vi.mocked(apiQuestionnaire.apiGetQuestionnaires).mockResolvedValue([mockQuestionnaire]);
        vi.mocked(apiTemplate.apiGetTemplates).mockResolvedValue(mockTemplates);

        render(<Templates />);

        await waitFor(() => {
            expect(screen.getByText('+ Create New Template')).toBeInTheDocument();
        });
    });

    it('shows create form when create button is clicked', async () => {
        const user = userEvent.setup();
        vi.mocked(apiQuestionnaire.apiGetQuestionnaires).mockResolvedValue([mockQuestionnaire]);
        vi.mocked(apiTemplate.apiGetTemplates).mockResolvedValue(mockTemplates);

        render(<Templates />);

        await waitFor(() => {
            expect(screen.getByText('+ Create New Template')).toBeInTheDocument();
        });

        const createButton = screen.getByText('+ Create New Template');
        await user.click(createButton);

        await waitFor(() => {
            expect(screen.getByText('Create New Template')).toBeInTheDocument();
        });
    });

    it('displays error message when API call fails', async () => {
        vi.mocked(apiQuestionnaire.apiGetQuestionnaires).mockRejectedValue(
            new Error('Failed to load templates')
        );

        render(<Templates />);

        await waitFor(
            () => {
                expect(screen.getByText(/Failed to load templates/i)).toBeInTheDocument();
            },
            { timeout: 3000 }
        );
    });

    it('displays back link to questionnaires', async () => {
        vi.mocked(apiQuestionnaire.apiGetQuestionnaires).mockResolvedValue([mockQuestionnaire]);
        vi.mocked(apiTemplate.apiGetTemplates).mockResolvedValue(mockTemplates);

        render(<Templates />);

        await waitFor(() => {
            expect(screen.getByText('← Back to Questionnaires')).toBeInTheDocument();
        });

        const backLink = screen.getByText('← Back to Questionnaires');
        expect(backLink.closest('a')).toHaveAttribute('href', '/');
    });

    it('updates template list when new template is created', async () => {
        const user = userEvent.setup();
        const newTemplate = {
            id: 3,
            name: 'Template 3',
            version: 1,
            questionnaireId: 1,
        };

        vi.mocked(apiQuestionnaire.apiGetQuestionnaires).mockResolvedValue([mockQuestionnaire]);
        vi.mocked(apiTemplate.apiGetTemplates)
            .mockResolvedValueOnce(mockTemplates)
            .mockResolvedValueOnce([...mockTemplates, newTemplate]);
        vi.mocked(apiTemplate.apiCreateTemplate).mockResolvedValue(newTemplate);

        render(<Templates />);

        await waitFor(() => {
            expect(screen.getByText('+ Create New Template')).toBeInTheDocument();
        });

        const createButton = screen.getByText('+ Create New Template');
        await user.click(createButton);

        await waitFor(() => {
            expect(screen.getByLabelText('Template Name')).toBeInTheDocument();
        });

        const nameInput = screen.getByLabelText('Template Name');
        const submitButton = screen.getByRole('button', { name: /Create Template/i });

        await user.type(nameInput, 'Template 3');
        await user.click(submitButton);

        await waitFor(() => {
            expect(apiTemplate.apiCreateTemplate).toHaveBeenCalledWith({
                questionnaireId: 1,
                name: 'Template 3',
            });
        });
    });
});

describe('TemplateCreate', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('renders the create template form with all elements', () => {
        render(
            <TemplateCreate
                questionnaireId={1}
                questionnaireName="My Test Questionnaire"
                onTemplateCreated={vi.fn()}
                onCancel={vi.fn()}
            />
        );

        expect(screen.getByText('Create New Template')).toBeInTheDocument();
        expect(screen.getByText(/For questionnaire:/i)).toBeInTheDocument();
        expect(screen.getByText('My Test Questionnaire')).toBeInTheDocument();
        expect(screen.getByLabelText('Template Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter template name')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Create Template/i })).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.getByText('← Back to Templates')).toBeInTheDocument();
    });

    it('renders form without questionnaire name when not provided', () => {
        render(
            <TemplateCreate questionnaireId={1} onTemplateCreated={vi.fn()} onCancel={vi.fn()} />
        );

        expect(screen.getByText('Create New Template')).toBeInTheDocument();
        expect(screen.queryByText(/For questionnaire:/i)).not.toBeInTheDocument();
    });

    it('allows user to type in the template name field', async () => {
        const user = userEvent.setup();
        render(
            <TemplateCreate
                questionnaireId={1}
                questionnaireName="My Test Questionnaire"
                onTemplateCreated={vi.fn()}
                onCancel={vi.fn()}
            />
        );

        const nameInput = screen.getByLabelText('Template Name') as HTMLInputElement;
        await user.type(nameInput, 'My Test Template');

        expect(nameInput.value).toBe('My Test Template');
    });

    it('calls apiCreateTemplate when form is submitted with valid name', async () => {
        const user = userEvent.setup();
        const onTemplateCreated = vi.fn();
        const mockTemplate = {
            id: 1,
            name: 'My Test Template',
            version: 1,
            questionnaireId: 1,
        };

        vi.mocked(apiTemplate.apiCreateTemplate).mockResolvedValue(mockTemplate);

        render(
            <TemplateCreate
                questionnaireId={1}
                questionnaireName="My Test Questionnaire"
                onTemplateCreated={onTemplateCreated}
                onCancel={vi.fn()}
            />
        );

        const nameInput = screen.getByLabelText('Template Name');
        const submitButton = screen.getByRole('button', {
            name: /Create Template/i,
        });

        await user.type(nameInput, 'My Test Template');
        await user.click(submitButton);

        await waitFor(() => {
            expect(apiTemplate.apiCreateTemplate).toHaveBeenCalledWith({
                questionnaireId: 1,
                name: 'My Test Template',
            });
        });

        await waitFor(() => {
            expect(onTemplateCreated).toHaveBeenCalledWith(mockTemplate);
        });
    });

    it('calls onCancel when cancel button is clicked', async () => {
        const user = userEvent.setup();
        const onCancel = vi.fn();

        render(
            <TemplateCreate
                questionnaireId={1}
                questionnaireName="My Test Questionnaire"
                onTemplateCreated={vi.fn()}
                onCancel={onCancel}
            />
        );

        const cancelButton = screen.getByText('Cancel');
        await user.click(cancelButton);

        expect(onCancel).toHaveBeenCalled();
    });

    it('navigates back when template is created without callback', async () => {
        const user = userEvent.setup();
        const mockTemplate = {
            id: 1,
            name: 'My Test Template',
            version: 1,
            questionnaireId: 1,
        };

        vi.mocked(apiTemplate.apiCreateTemplate).mockResolvedValue(mockTemplate);

        render(<TemplateCreate questionnaireId={1} />);

        const nameInput = screen.getByLabelText('Template Name');
        const submitButton = screen.getByRole('button', {
            name: /Create Template/i,
        });

        await user.type(nameInput, 'My Test Template');
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith(-1);
        });
    });

    it('trims whitespace from template name before submitting', async () => {
        const user = userEvent.setup();
        const mockTemplate = {
            id: 1,
            name: 'My Test Template',
            version: 1,
            questionnaireId: 1,
        };

        vi.mocked(apiTemplate.apiCreateTemplate).mockResolvedValue(mockTemplate);

        render(
            <TemplateCreate
                questionnaireId={1}
                questionnaireName="My Test Questionnaire"
                onTemplateCreated={vi.fn()}
                onCancel={vi.fn()}
            />
        );

        const nameInput = screen.getByLabelText('Template Name');
        const submitButton = screen.getByRole('button', {
            name: /Create Template/i,
        });

        await user.type(nameInput, '  My Test Template  ');
        await user.click(submitButton);

        await waitFor(() => {
            expect(apiTemplate.apiCreateTemplate).toHaveBeenCalledWith({
                questionnaireId: 1,
                name: 'My Test Template',
            });
        });
    });

    it('prevents submitting when template name is empty', () => {
        render(
            <TemplateCreate
                questionnaireId={1}
                questionnaireName="My Test Questionnaire"
                onTemplateCreated={vi.fn()}
                onCancel={vi.fn()}
            />
        );

        const submitButton = screen.getByRole('button', {
            name: /Create Template/i,
        });

        // Button should be disabled when name is empty
        expect(submitButton).toBeDisabled();
        expect(apiTemplate.apiCreateTemplate).not.toHaveBeenCalled();
    });

    it('prevents submitting when template name is only whitespace', async () => {
        const user = userEvent.setup();
        render(
            <TemplateCreate
                questionnaireId={1}
                questionnaireName="My Test Questionnaire"
                onTemplateCreated={vi.fn()}
                onCancel={vi.fn()}
            />
        );

        const nameInput = screen.getByLabelText('Template Name');
        const submitButton = screen.getByRole('button', {
            name: /Create Template/i,
        });

        await user.type(nameInput, '   ');

        // Button should be disabled when name is only whitespace
        expect(submitButton).toBeDisabled();
        expect(apiTemplate.apiCreateTemplate).not.toHaveBeenCalled();
    });

    it('displays error message when API call fails', async () => {
        const user = userEvent.setup();
        vi.mocked(apiTemplate.apiCreateTemplate).mockRejectedValue(
            new Error('Failed to create template. Status: 500: Internal Server Error')
        );

        render(
            <TemplateCreate
                questionnaireId={1}
                questionnaireName="My Test Questionnaire"
                onTemplateCreated={vi.fn()}
                onCancel={vi.fn()}
            />
        );

        const nameInput = screen.getByLabelText('Template Name');
        const submitButton = screen.getByRole('button', {
            name: /Create Template/i,
        });

        await user.type(nameInput, 'My Test Template');
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Failed to create template/i)).toBeInTheDocument();
        });
    });

    it('displays generic error message when API throws non-Error', async () => {
        const user = userEvent.setup();
        vi.mocked(apiTemplate.apiCreateTemplate).mockRejectedValue('Unknown error');

        render(
            <TemplateCreate
                questionnaireId={1}
                questionnaireName="My Test Questionnaire"
                onTemplateCreated={vi.fn()}
                onCancel={vi.fn()}
            />
        );

        const nameInput = screen.getByLabelText('Template Name');
        const submitButton = screen.getByRole('button', {
            name: /Create Template/i,
        });

        await user.type(nameInput, 'My Test Template');
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Failed to create template')).toBeInTheDocument();
        });
    });

    it('clears error message when form is resubmitted', async () => {
        const user = userEvent.setup();
        const mockTemplate = {
            id: 1,
            name: 'My Test Template',
            version: 1,
            questionnaireId: 1,
        };

        // First attempt fails
        vi.mocked(apiTemplate.apiCreateTemplate).mockRejectedValueOnce(
            new Error('Failed to create template')
        );
        // Second attempt succeeds
        vi.mocked(apiTemplate.apiCreateTemplate).mockResolvedValueOnce(mockTemplate);

        render(
            <TemplateCreate
                questionnaireId={1}
                questionnaireName="My Test Questionnaire"
                onTemplateCreated={vi.fn()}
                onCancel={vi.fn()}
            />
        );

        const nameInput = screen.getByLabelText('Template Name');
        const submitButton = screen.getByRole('button', {
            name: /Create Template/i,
        });

        await user.type(nameInput, 'My Test Template');
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Failed to create template/i)).toBeInTheDocument();
        });

        // Resubmit
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.queryByText(/Failed to create template/i)).not.toBeInTheDocument();
        });
    });

    it('displays error when questionnaire ID is missing', async () => {
        const user = userEvent.setup();

        render(
            <TemplateCreate
                questionnaireName="My Test Questionnaire"
                onTemplateCreated={vi.fn()}
                onCancel={vi.fn()}
            />
        );

        const nameInput = screen.getByLabelText('Template Name');
        const submitButton = screen.getByRole('button', {
            name: /Create Template/i,
        });

        await user.type(nameInput, 'My Test Template');
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Questionnaire ID is required')).toBeInTheDocument();
        });
    });

    it('disables submit button and input while loading', async () => {
        const user = userEvent.setup();
        const mockTemplate = {
            id: 1,
            name: 'My Test Template',
            version: 1,
            questionnaireId: 1,
        };

        vi.mocked(apiTemplate.apiCreateTemplate).mockImplementation(
            () => new Promise(resolve => setTimeout(() => resolve(mockTemplate), 100))
        );

        render(
            <TemplateCreate
                questionnaireId={1}
                questionnaireName="My Test Questionnaire"
                onTemplateCreated={vi.fn()}
                onCancel={vi.fn()}
            />
        );

        const nameInput = screen.getByLabelText('Template Name');
        const submitButton = screen.getByRole('button', {
            name: /Create Template/i,
        });

        await user.type(nameInput, 'My Test Template');
        await user.click(submitButton);

        expect(submitButton).toBeDisabled();
        expect(nameInput).toBeDisabled();
        expect(screen.getByText('Creating...')).toBeInTheDocument();

        await waitFor(() => {
            expect(submitButton).not.toBeDisabled();
        });
    });

    it('displays back link when onCancel is not provided', () => {
        render(<TemplateCreate questionnaireId={1} />);

        const backLink = screen.getByText('← Back to Questionnaires');
        expect(backLink).toBeInTheDocument();
        expect(backLink.closest('a')).toHaveAttribute('href', '/');
    });
});

describe('TemplateListItem', () => {
    it.todo("Clicking on the template 'Edit' dropdown takes the user to the Edit Template Form");

    it.todo('Clicking on card navigates to the template questions page');

    it.todo("Clicking on the template 'Delete' dropdown opens a modal to delete the template");
});

describe('TemplateEdit', () => {
    const createMockToken = () => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEifQ.signature';
    const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        mockUseParams.mockReturnValue({ id: '1' });
        vi.mocked(apiUser.apiGetUser).mockResolvedValue(mockUser);
        localStorage.setItem('user_token', createMockToken());
    });

    it.todo('renders the edit template form with all elements');

    it.todo('renders the edit template form with all elements');

    it.todo('allows user to type in the template name field');

    it.todo('calls apiUpdateTemplate when form is submitted with valid name');

    it.todo('displays error message when API call fails');

    it.todo('clears error message when form is resubmitted');
});
