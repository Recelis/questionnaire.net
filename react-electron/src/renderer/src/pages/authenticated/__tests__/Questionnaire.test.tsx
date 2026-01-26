import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../../test/test-utils';
import userEvent from '@testing-library/user-event';
import QuestionnaireCreate from '../QuestionnaireCreate';
import * as apiUser from '../../../api/apiUser';
import * as apiQuestionnaire from '../../../api/apiQuestionnaire';
import QuestionnaireEdit from '../QuestionnaireEdit';
import QuestionnaireListItem from '../QuestionnaireListItem';

// Mock the API modules
vi.mock('../../../api/apiQuestionnaire', () => ({
    apiCreateQuestionnaire: vi.fn(),
    apiUpdateQuestionnaire: vi.fn(),
    apiGetQuestionnaires: vi.fn(),
    apiDeleteQuestionnaire: vi.fn(),
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


describe('QuestionnaireCreate', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('renders the create questionnaire form with all elements', () => {
        render(<QuestionnaireCreate />);

        expect(screen.getByText('Create New Questionnaire')).toBeInTheDocument();
        expect(screen.getByLabelText('Questionnaire Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter questionnaire name')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Create Questionnaire/i })).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.getByText('← Back to Questionnaires')).toBeInTheDocument();
    });

    it('allows user to type in the questionnaire name field', async () => {
        const user = userEvent.setup();
        render(<QuestionnaireCreate />);

        const nameInput = screen.getByLabelText('Questionnaire Name') as HTMLInputElement;
        await user.type(nameInput, 'My Test Questionnaire');

        expect(nameInput.value).toBe('My Test Questionnaire');
    });

    it('calls apiCreateQuestionnaire when form is submitted with valid name', async () => {
        const user = userEvent.setup();
        const mockQuestionnaire = {
            id: 1,
            name: 'My Test Questionnaire',
            userId: 1,
            templates: [],
        };

        vi.mocked(apiQuestionnaire.apiCreateQuestionnaire).mockResolvedValue(mockQuestionnaire);

        render(<QuestionnaireCreate />);

        const nameInput = screen.getByLabelText('Questionnaire Name');
        const submitButton = screen.getByRole('button', {
            name: /Create Questionnaire/i,
        });

        await user.type(nameInput, 'My Test Questionnaire');
        await user.click(submitButton);

        await waitFor(() => {
            expect(apiQuestionnaire.apiCreateQuestionnaire).toHaveBeenCalledWith({
                name: 'My Test Questionnaire',
            });
        });
    });

    it('navigates to home page after successful questionnaire creation', async () => {
        const user = userEvent.setup();
        const mockQuestionnaire = {
            id: 1,
            name: 'My Test Questionnaire',
            userId: 1,
            templates: [],
        };

        vi.mocked(apiQuestionnaire.apiCreateQuestionnaire).mockResolvedValue(mockQuestionnaire);

        render(<QuestionnaireCreate />);

        const nameInput = screen.getByLabelText('Questionnaire Name');
        const submitButton = screen.getByRole('button', {
            name: /Create Questionnaire/i,
        });

        await user.type(nameInput, 'My Test Questionnaire');
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    it('trims whitespace from questionnaire name before submission', async () => {
        const user = userEvent.setup();
        const mockQuestionnaire = {
            id: 1,
            name: 'My Test Questionnaire',
            userId: 1,
            templates: [],
        };

        vi.mocked(apiQuestionnaire.apiCreateQuestionnaire).mockResolvedValue(mockQuestionnaire);

        render(<QuestionnaireCreate />);

        const nameInput = screen.getByLabelText('Questionnaire Name');
        const submitButton = screen.getByRole('button', {
            name: /Create Questionnaire/i,
        });

        await user.type(nameInput, '  My Test Questionnaire  ');
        await user.click(submitButton);

        await waitFor(() => {
            expect(apiQuestionnaire.apiCreateQuestionnaire).toHaveBeenCalledWith({
                name: 'My Test Questionnaire',
            });
        });
    });

    it('prevents submission when questionnaire name is empty', () => {
        render(<QuestionnaireCreate />);

        const submitButton = screen.getByRole('button', {
            name: /Create Questionnaire/i,
        });

        // Button should be disabled when name is empty
        expect(submitButton).toBeDisabled();
        expect(apiQuestionnaire.apiCreateQuestionnaire).not.toHaveBeenCalled();
    });

    it('prevents submission when questionnaire name is only whitespace', async () => {
        const user = userEvent.setup();
        render(<QuestionnaireCreate />);

        const nameInput = screen.getByLabelText('Questionnaire Name');
        const submitButton = screen.getByRole('button', {
            name: /Create Questionnaire/i,
        });

        await user.type(nameInput, '   ');

        // Button should be disabled when name is only whitespace
        expect(submitButton).toBeDisabled();
        expect(apiQuestionnaire.apiCreateQuestionnaire).not.toHaveBeenCalled();
    });

    it('displays error message when name is cleared after having content', async () => {
        const user = userEvent.setup();
        render(<QuestionnaireCreate />);

        const nameInput = screen.getByLabelText('Questionnaire Name');
        const submitButton = screen.getByRole('button', {
            name: /Create Questionnaire/i,
        });

        // Type some content to enable the button
        await user.type(nameInput, 'Test Questionnaire');
        expect(submitButton).not.toBeDisabled();

        // Clear the input
        await user.clear(nameInput);

        // Button should be disabled again
        expect(submitButton).toBeDisabled();
    });

    it('displays error message when API call fails', async () => {
        const user = userEvent.setup();
        vi.mocked(apiQuestionnaire.apiCreateQuestionnaire).mockRejectedValue(
            new Error('Failed to create questionnaire. Status: 500: Internal Server Error')
        );

        render(<QuestionnaireCreate />);

        const nameInput = screen.getByLabelText('Questionnaire Name');
        const submitButton = screen.getByRole('button', {
            name: /Create Questionnaire/i,
        });

        await user.type(nameInput, 'My Test Questionnaire');
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Failed to create questionnaire/i)).toBeInTheDocument();
        });
    });

    it('displays generic error message when API throws non-Error', async () => {
        const user = userEvent.setup();
        vi.mocked(apiQuestionnaire.apiCreateQuestionnaire).mockRejectedValue('Unknown error');

        render(<QuestionnaireCreate />);

        const nameInput = screen.getByLabelText('Questionnaire Name');
        const submitButton = screen.getByRole('button', {
            name: /Create Questionnaire/i,
        });

        await user.type(nameInput, 'My Test Questionnaire');
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Failed to create questionnaire')).toBeInTheDocument();
        });
    });

    it('clears error message when form is resubmitted', async () => {
        const user = userEvent.setup();
        const mockQuestionnaire = {
            id: 1,
            name: 'My Test Questionnaire',
            userId: 1,
            templates: [],
        };

        // First attempt fails
        vi.mocked(apiQuestionnaire.apiCreateQuestionnaire).mockRejectedValueOnce(
            new Error('Failed to create questionnaire')
        );
        // Second attempt succeeds
        vi.mocked(apiQuestionnaire.apiCreateQuestionnaire).mockResolvedValueOnce(mockQuestionnaire);

        render(<QuestionnaireCreate />);

        const nameInput = screen.getByLabelText('Questionnaire Name');
        const submitButton = screen.getByRole('button', {
            name: /Create Questionnaire/i,
        });

        await user.type(nameInput, 'My Test Questionnaire');
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Failed to create questionnaire/i)).toBeInTheDocument();
        });

        // Resubmit
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.queryByText(/Failed to create questionnaire/i)).not.toBeInTheDocument();
        });
    });

    it('disables submit button and input while loading', async () => {
        const user = userEvent.setup();
        const mockQuestionnaire = {
            id: 1,
            name: 'My Test Questionnaire',
            userId: 1,
            templates: [],
        };

        vi.mocked(apiQuestionnaire.apiCreateQuestionnaire).mockImplementation(
            () => new Promise(resolve => setTimeout(() => resolve(mockQuestionnaire), 100))
        );

        render(<QuestionnaireCreate />);

        const nameInput = screen.getByLabelText('Questionnaire Name');
        const submitButton = screen.getByRole('button', {
            name: /Create Questionnaire/i,
        });

        await user.type(nameInput, 'My Test Questionnaire');
        await user.click(submitButton);

        expect(submitButton).toBeDisabled();
        expect(nameInput).toBeDisabled();
        expect(screen.getByText('Creating...')).toBeInTheDocument();

        await waitFor(() => {
            expect(submitButton).not.toBeDisabled();
        });
    });

    it('disables submit button when name field is empty', () => {
        render(<QuestionnaireCreate />);

        const submitButton = screen.getByRole('button', {
            name: /Create Questionnaire/i,
        });

        expect(submitButton).toBeDisabled();
    });

    it('enables submit button when name field has content', async () => {
        const user = userEvent.setup();
        render(<QuestionnaireCreate />);

        const nameInput = screen.getByLabelText('Questionnaire Name');
        const submitButton = screen.getByRole('button', {
            name: /Create Questionnaire/i,
        });

        expect(submitButton).toBeDisabled();

        await user.type(nameInput, 'My Test Questionnaire');

        expect(submitButton).not.toBeDisabled();
    });

    it('disables submit button when name field contains only whitespace', async () => {
        const user = userEvent.setup();
        render(<QuestionnaireCreate />);

        const nameInput = screen.getByLabelText('Questionnaire Name');
        const submitButton = screen.getByRole('button', {
            name: /Create Questionnaire/i,
        });

        await user.type(nameInput, '   ');

        expect(submitButton).toBeDisabled();
    });

    it('displays back link to questionnaires list', () => {
        render(<QuestionnaireCreate />);

        const backLink = screen.getByText('← Back to Questionnaires');
        expect(backLink).toBeInTheDocument();
        expect(backLink.closest('a')).toHaveAttribute('href', '/');
    });

    it('displays cancel link to questionnaires list', () => {
        render(<QuestionnaireCreate />);

        const cancelLink = screen.getByText('Cancel');
        expect(cancelLink).toBeInTheDocument();
        expect(cancelLink.closest('a')).toHaveAttribute('href', '/');
    });
});

describe('QuestionnaireListItem navigation', () => {
    const onEditClick = vi.fn();
    const onEditTemplatesClick = vi.fn();
    const onDeleteClick = vi.fn();

    const mockQuestionnaire = {
        id: 1,
        name: 'My Test Questionnaire',
        userId: 1,
        templates: [],
    };

    it('navigates to submission page on item click', async () => {
        const user = userEvent.setup();
        render(
            <QuestionnaireListItem
                questionnaire={mockQuestionnaire}
                onEditClick={onEditClick}
                onEditTemplatesClick={onEditTemplatesClick}
                onDeleteClick={onDeleteClick}
            />
        );

        const listItem = screen.getByText('My Test Questionnaire');
        await user.click(listItem);

        expect(mockNavigate).toHaveBeenCalledWith('/questionnaire/1/submission');
    });
});

describe('QuestionnaireListItem dropdown menu', () => {
    const onEditClick = vi.fn();
    const onEditTemplatesClick = vi.fn();
    const onDeleteClick = vi.fn();

    const mockQuestionnaire = {
        id: 1,
        name: 'My Test Questionnaire',
        userId: 1,
        templates: [],
    };

    it('renders the dropdown list on the questionnaire list item', () => {
        render(
            <QuestionnaireListItem
                questionnaire={mockQuestionnaire}
                onEditClick={onEditClick}
                onEditTemplatesClick={onEditTemplatesClick}
                onDeleteClick={onDeleteClick}
            />
        );

        const dropdownMenu = screen.getByRole('button', { name: '⋮' });
        expect(dropdownMenu).toBeInTheDocument();
    });

    it('calls onEditClick when Edit is clicked', async () => {
        const user = userEvent.setup();
        const onEditClick = vi.fn();
        render(
            <QuestionnaireListItem
                questionnaire={mockQuestionnaire}
                onEditClick={onEditClick}
                onEditTemplatesClick={onEditTemplatesClick}
                onDeleteClick={onDeleteClick}
            />
        );
        const dropdownMenu = screen.getByRole('button', { name: '⋮' });
        await user.click(dropdownMenu);
        const editOption = screen.getByText('Edit');
        await user.click(editOption);
        expect(onEditClick).toHaveBeenCalledWith(mockQuestionnaire);
    });

    it('calls onEditTemplatesClick when Edit Templates is clicked', async () => {
        const user = userEvent.setup();
        const onEditTemplatesClick = vi.fn();
        render(
            <QuestionnaireListItem
                questionnaire={mockQuestionnaire}
                onEditClick={onEditClick}
                onEditTemplatesClick={onEditTemplatesClick}
                onDeleteClick={onDeleteClick}
            />
        );
        const dropdownMenu = screen.getByRole('button', { name: '⋮' });
        await user.click(dropdownMenu);
        const editQuestionsOption = screen.getByText('Edit Templates');
        await user.click(editQuestionsOption);
        expect(onEditTemplatesClick).toHaveBeenCalledWith(mockQuestionnaire);
    });

    it('calls onDeleteClick when Delete is clicked', async () => {
        const user = userEvent.setup();
        const onDeleteClick = vi.fn();
        render(
            <QuestionnaireListItem
                questionnaire={mockQuestionnaire}
                onEditClick={onEditClick}
                onEditTemplatesClick={onEditTemplatesClick}
                onDeleteClick={onDeleteClick}
            />
        );
        const dropdownMenu = screen.getByRole('button', { name: '⋮' });
        await user.click(dropdownMenu);
        const deleteOption = screen.getByText('Delete');
        await user.click(deleteOption);
        expect(onDeleteClick).toHaveBeenCalledWith(mockQuestionnaire);
    });
});

describe('QuestionnaireEdit', () => {
    const createMockToken = () => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEifQ.signature';
    const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        mockUseParams.mockReturnValue({ id: '1' });
        vi.mocked(apiUser.apiGetUser).mockResolvedValue(mockUser);
        localStorage.setItem('user_token', createMockToken());
    });

    it('renders the edit questionnaire form with all elements', () => {
        render(<QuestionnaireEdit />);

        expect(screen.getByText('Edit Questionnaire')).toBeInTheDocument();
        expect(screen.getByLabelText('Questionnaire Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter questionnaire name')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Update Questionnaire/i })).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.getByText('← Back to Questionnaires')).toBeInTheDocument();
    });

    it('allows user to type in the questionnaire name field', async () => {
        const user = userEvent.setup();
        render(<QuestionnaireEdit />);

        const nameInput = screen.getByLabelText('Questionnaire Name');
        await user.type(nameInput, 'My Test Questionnaire');

        expect((nameInput as HTMLInputElement).value).toBe('My Test Questionnaire');
    });

    it('calls apiUpdateQuestionnaire when form is submitted with valid name', async () => {
        const user = userEvent.setup();
        const mockQuestionnaire = {
            id: 1,
            name: 'Original Name',
            userId: 1,
            templates: [],
        };
        vi.mocked(apiQuestionnaire.apiUpdateQuestionnaire).mockResolvedValue(mockQuestionnaire);
        vi.mocked(apiQuestionnaire.apiGetQuestionnaires).mockResolvedValue([mockQuestionnaire]);

        render(<QuestionnaireEdit />);

        // Wait for the component to load the questionnaire
        await waitFor(() => {
            expect(apiQuestionnaire.apiGetQuestionnaires).toHaveBeenCalled();
        });

        const nameInput = screen.getByLabelText('Questionnaire Name') as HTMLInputElement;
        // Wait for the input to be populated with the existing name
        await waitFor(() => {
            expect(nameInput.value).toBe('Original Name');
        });

        // Clear and type new name
        await user.clear(nameInput);
        await user.type(nameInput, 'My Test Questionnaire');

        const submitButton = screen.getByRole('button', {
            name: /Update Questionnaire/i,
        });
        await user.click(submitButton);

        await waitFor(() => {
            expect(apiQuestionnaire.apiUpdateQuestionnaire).toHaveBeenCalledWith(1, {
                name: 'My Test Questionnaire',
            });
        });
    });

    it('displays error message when API call fails', async () => {
        const user = userEvent.setup();
        vi.mocked(apiQuestionnaire.apiUpdateQuestionnaire).mockRejectedValue(
            new Error('Failed to update questionnaire. Status: 500: Internal Server Error')
        );

        render(<QuestionnaireEdit />);

        const nameInput = screen.getByLabelText('Questionnaire Name');
        const submitButton = screen.getByRole('button', {
            name: /Update Questionnaire/i,
        });

        await user.type(nameInput, 'My Test Questionnaire');
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Failed to update questionnaire/i)).toBeInTheDocument();
        });
    });

    it('clears error message when form is resubmitted', async () => {
        const user = userEvent.setup();

        const mockQuestionnaire = {
            id: 1,
            name: 'My Test Questionnaire',
            userId: 1,
            templates: [],
        };

        // First attempt fails
        vi.mocked(apiQuestionnaire.apiCreateQuestionnaire).mockRejectedValueOnce(
            new Error('Failed to create questionnaire')
        );
        // Second attempt succeeds
        vi.mocked(apiQuestionnaire.apiCreateQuestionnaire).mockResolvedValueOnce(mockQuestionnaire);

        render(<QuestionnaireEdit />);

        const nameInput = screen.getByLabelText('Questionnaire Name');
        const submitButton = screen.getByRole('button', {
            name: /Update Questionnaire/i,
        });

        await user.type(nameInput, 'My Test Questionnaire');
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Failed to update questionnaire/i)).toBeInTheDocument();
        });
    });
});

// TODO: refactor deletion and write tests
