import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../../test/test-utils';
import * as apiTemplate from '../../../api/apiTemplate';
import * as apiQuestionnaire from '../../../api/apiQuestionnaire';
import * as apiUser from '../../../api/apiUser';
import Submission from '../Submission';

// Mock the API modules
vi.mock('../../../api/apiTemplate', () => ({
    apiGetTemplates: vi.fn(),
    apiCreateTemplate: vi.fn(),
    apiUpdateTemplate: vi.fn(),
}));

vi.mock('../../../api/apiQuestionnaire', () => ({
    apiGetQuestionnaire: vi.fn(),
}));

vi.mock('../../../api/apiUser', () => ({
    apiGetUser: vi.fn(),
}));

// Mock react-router
const mockUseParams = vi.fn();
vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router');
    return {
        ...actual,
        useParams: () => mockUseParams(),
    };
});

// Helper to create a valid JWT token format (header.payload.signature)
// Payload: {"id":"1"} base64 encoded
const createMockToken = () => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEifQ.signature';

describe('Submission', () => {
    const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
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

    const mockQuestionnaire = {
        id: 1,
        name: 'My Test Questionnaire',
        userId: 1,
        templates: mockTemplates,
    };

    

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        mockUseParams.mockReturnValue({ id: '1' });
        vi.mocked(apiUser.apiGetUser).mockResolvedValue(mockUser);
        localStorage.setItem('user_token', createMockToken());
    });

    it('renders loading state initially', async () => {
        vi.mocked(apiQuestionnaire.apiGetQuestionnaire).mockImplementation(
            () => new Promise(() => {}) // Never resolves
        );
        vi.mocked(apiTemplate.apiGetTemplates).mockImplementation(
            () => new Promise(() => {}) // Never resolves
        );

        render(<Submission />);

        // Wait for auth to initialize, then check for loading state
        await waitFor(
            () => {
                const loadingText = screen.queryByText('Loading submissions...');
                // Either loading or create form should be visible
                expect(loadingText).toBeInTheDocument();
            },
            { timeout: 2000 }
        );
    });

    it('displays a message and a link to templates when questionnaire has no templates', async () => {
        const questionnaireWithoutTemplates = {
            ...mockQuestionnaire,
            templates: [],
        };

        vi.mocked(apiQuestionnaire.apiGetQuestionnaire).mockResolvedValue(
            questionnaireWithoutTemplates,
        );
        vi.mocked(apiTemplate.apiGetTemplates).mockResolvedValue([]);

        render(<Submission />);

        await waitFor(() => {
            expect(screen.getByText(/no templates/i)).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /templates/i })).toBeInTheDocument();
        });
    });

    it('displays create submission button when questionnaire has templates', async () => {

        vi.mocked(apiQuestionnaire.apiGetQuestionnaire).mockResolvedValue(
            mockQuestionnaire,
        );
        vi.mocked(apiTemplate.apiGetTemplates).mockResolvedValue(mockTemplates);

        render(<Submission />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /start new submission/i })).toBeInTheDocument();
        });
    });
});
