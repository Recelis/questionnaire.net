import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../../test/test-utils';
import * as apiTemplate from '../../../api/apiTemplate';
import * as apiQuestionnaire from '../../../api/apiQuestionnaire';
import * as apiUser from '../../../api/apiUser';
import * as apiQuestion from '../../../api/apiQuestion';
import * as apiSubmission from '../../../api/apiSubmission';
import Submission from '../Submission';
import SubmissionQuestion from '../SubmissionQuestion';

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

vi.mock('../../../api/apiQuestion', () => ({
    apiGetQuestions: vi.fn(),
}));

vi.mock('../../../api/apiSubmission', () => ({
    apiGetSubmission: vi.fn(),
}));

// Mock react-router
const mockUseParams = vi.fn();
const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router');
    return {
        ...actual,
        useParams: () => mockUseParams(),
        useNavigate: () => mockNavigate,
    };
});

// Helper to create a valid JWT token format (header.payload.signature)
// Payload: {"id":"1"} base64 encoded
const createMockToken = () => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEifQ.signature';
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

describe('Submission', () => {
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

describe('Submission - Questions', () => {
        const mockQuestions = [
            {
                id: 1,
                text: 'Question 1',
                type: 'text',
                templateId: 1,
                questionNumber: 1,
            },
            {
                id: 2,
                text: 'Question 2',
                type: 'multiple_choice',
                templateId: 1,
                questionNumber: 2,
            },
        ];

        const mockSubmission = {
            id: 1,
            date: new Date().toISOString(),
            userId: 1,
            totalPoints: 0,
            templateId: 1,
            answers: [],
        };

        beforeEach(() => {
            vi.clearAllMocks();
            localStorage.clear();
            mockUseParams.mockReturnValue({ id: '1', submissionId: '1', questionIndex: '0' });
            mockNavigate.mockClear();
            localStorage.setItem('user_token', createMockToken());
        });

        it('It fetches questions for the submission', async () => {
            vi.mocked(apiQuestionnaire.apiGetQuestionnaire).mockResolvedValue(mockQuestionnaire);
            vi.mocked(apiQuestion.apiGetQuestions).mockResolvedValue(mockQuestions);
            vi.mocked(apiSubmission.apiGetSubmission).mockResolvedValue(mockSubmission);

            render(<SubmissionQuestion />);

            await waitFor(() => {
                expect(apiSubmission.apiGetSubmission).toHaveBeenCalled();
            });
        });

        it.todo('It displays loading state while fetching questions');
        it.todo('It handles API errors gracefully');
        
        it('If there are no questions, it redirects to show no questions page', async () => {
            vi.mocked(apiQuestionnaire.apiGetQuestionnaire).mockResolvedValue(mockQuestionnaire);
            vi.mocked(apiQuestion.apiGetQuestions).mockResolvedValue([]);
            vi.mocked(apiSubmission.apiGetSubmission).mockResolvedValue(mockSubmission);

            render(<SubmissionQuestion />);

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/questionnaire/1/submission/1/noquestions');
            });
        });

        it('It displays the nth question based on submissionId and question index', async () => {
            vi.mocked(apiQuestionnaire.apiGetQuestionnaire).mockResolvedValue(mockQuestionnaire);
            vi.mocked(apiQuestion.apiGetQuestions).mockResolvedValue(mockQuestions);
            vi.mocked(apiSubmission.apiGetSubmission).mockResolvedValue(mockSubmission);

            render(<SubmissionQuestion />);

            await waitFor(() => {
                expect(screen.getByText('Question 1')).toBeInTheDocument();
            });
        });

        it('It displays the correct question when questionIndex changes', async () => {
            vi.mocked(apiQuestionnaire.apiGetQuestionnaire).mockResolvedValue(mockQuestionnaire);
            vi.mocked(apiQuestion.apiGetQuestions).mockResolvedValue(mockQuestions);
            vi.mocked(apiSubmission.apiGetSubmission).mockResolvedValue(mockSubmission);
            mockUseParams.mockReturnValue({ id: '1', submissionId: '1', questionIndex: '1' });

            render(<SubmissionQuestion />);

            await waitFor(() => {
                expect(screen.getByText('Question 2')).toBeInTheDocument();
            });
        });

        it('It allows navigation between questions by clicking on the progress indicators', async () => {
            vi.mocked(apiQuestionnaire.apiGetQuestionnaire).mockResolvedValue(mockQuestionnaire);
            vi.mocked(apiQuestion.apiGetQuestions).mockResolvedValue(mockQuestions);
            vi.mocked(apiSubmission.apiGetSubmission).mockResolvedValue(mockSubmission);

            render(<SubmissionQuestion />);

            await waitFor(() => {
                expect(screen.getByText('Question 1')).toBeInTheDocument();
            });

            // Find and click the second progress indicator
            const progressButtons = screen.getAllByRole('button', { name: /Question \d+/ });
            expect(progressButtons).toHaveLength(2);
            
            progressButtons[1].click();

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/questionnaire/1/submission/1/question/1');
            });
        });

        it.todo('Answering a question will navigate to the next question');
        it.todo('It shows progress of the questionnaire');
        it.todo('It shows the end of submission message after the last question');
        it.todo('It saves answers correctly');
});
