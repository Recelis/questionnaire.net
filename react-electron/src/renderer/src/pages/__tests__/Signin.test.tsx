import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import Signin from '../Signin';
import * as api from '../../api/apiUser';

// Helper to create a valid JWT token format (header.payload.signature)
// Payload: {"id":"123"} base64 encoded
const createMockToken = () => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyJ9.signature';

// Mock the API module
vi.mock('../../api/apiUser', () => ({
    apiUserLogin: vi.fn(),
    apiGetUser: vi.fn(),
}));

// Mock react-router Link component
vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router');
    return {
        ...actual,
        Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
            <a href={to}>{children}</a>
        ),
    };
});

describe('Signin', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('renders the sign in form with email and password fields', () => {
        render(<Signin />);

        expect(screen.getByText('Sign in')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
        expect(screen.getByText(/or Sign up/i)).toBeInTheDocument();
    });

    it('allows user to type in email field', async () => {
        const user = userEvent.setup();
        render(<Signin />);

        const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
        await user.type(emailInput, 'test@example.com');

        expect(emailInput.value).toBe('test@example.com');
    });

    it('allows user to type in password field', async () => {
        const user = userEvent.setup();
        render(<Signin />);

        const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
        await user.type(passwordInput, 'password123');

        expect(passwordInput.value).toBe('password123');
    });

    it('calls signin function when form is submitted with valid credentials', async () => {
        const user = userEvent.setup();
        const mockToken = createMockToken();
        const mockUser = { email: 'test@example.com', id: 1, name: 'Test User' };

        vi.mocked(api.apiUserLogin).mockResolvedValue(mockToken);
        vi.mocked(api.apiGetUser).mockResolvedValue(mockUser);

        render(<Signin />);

        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Password');
        const submitButton = screen.getByRole('button', { name: /submit/i });

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);

        await waitFor(() => {
            expect(api.apiUserLogin).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
        });
    });

    it('submits form when submit button is clicked', async () => {
        const user = userEvent.setup();
        const mockToken = createMockToken();
        const mockUser = { email: 'test@example.com', id: 1, name: 'Test User' };

        vi.mocked(api.apiUserLogin).mockResolvedValue(mockToken);
        vi.mocked(api.apiGetUser).mockResolvedValue(mockUser);

        render(<Signin />);

        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Password');
        const submitButton = screen.getByRole('button', { name: /submit/i });

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);

        await waitFor(() => {
            expect(api.apiUserLogin).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
        });
    });

    it('handles empty form submission', async () => {
        const user = userEvent.setup();
        const mockToken = createMockToken();
        const mockUser = { email: 'test@example.com', id: 1, name: 'Test User' };

        vi.mocked(api.apiUserLogin).mockResolvedValue(mockToken);
        vi.mocked(api.apiGetUser).mockResolvedValue(mockUser);

        render(<Signin />);

        const submitButton = screen.getByRole('button', { name: /submit/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(api.apiUserLogin).toHaveBeenCalledWith({
                email: '',
                password: '',
            });
        });
    });

    it('displays link to signup page', () => {
        render(<Signin />);

        const signupLink = screen.getByText(/or Sign up/i);
        expect(signupLink).toBeInTheDocument();
        expect(signupLink.closest('a')).toHaveAttribute('href', '/signup');
    });

    it('displays error message when signin fails', async () => {
        const user = userEvent.setup();
        vi.mocked(api.apiUserLogin).mockResolvedValue(undefined);

        render(<Signin />);

        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Password');
        const submitButton = screen.getByRole('button', { name: /submit/i });

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'wrongpassword');
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
        });
    });

    it('displays error message when API throws an error', async () => {
        const user = userEvent.setup();
        vi.mocked(api.apiUserLogin).mockRejectedValue(new Error('Invalid email or password'));

        render(<Signin />);

        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Password');
        const submitButton = screen.getByRole('button', { name: /submit/i });

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'wrongpassword');
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
        });
    });

    it('clears error message when form is resubmitted', async () => {
        const user = userEvent.setup();
        const mockToken = createMockToken();
        const mockUser = { email: 'test@example.com', id: 1, name: 'Test User' };

        // First attempt fails
        vi.mocked(api.apiUserLogin).mockResolvedValueOnce(undefined);
        // Second attempt succeeds
        vi.mocked(api.apiUserLogin).mockResolvedValueOnce(mockToken);
        vi.mocked(api.apiGetUser).mockResolvedValue(mockUser);

        render(<Signin />);

        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Password');
        const submitButton = screen.getByRole('button', { name: /submit/i });

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'wrongpassword');
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
        });

        // Update password and resubmit
        await user.clear(passwordInput);
        await user.type(passwordInput, 'correctpassword');
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.queryByText(/Invalid email or password/i)).not.toBeInTheDocument();
        });
    });

    it('disables submit button while loading', async () => {
        const user = userEvent.setup();
        const mockToken = createMockToken();
        const mockUser = { email: 'test@example.com', id: 1, name: 'Test User' };

        vi.mocked(api.apiUserLogin).mockImplementation(
            () => new Promise(resolve => setTimeout(() => resolve(mockToken), 100))
        );
        vi.mocked(api.apiGetUser).mockResolvedValue(mockUser);

        render(<Signin />);

        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Password');
        const submitButton = screen.getByRole('button', { name: /submit/i });

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);

        expect(submitButton).toBeDisabled();
        expect(screen.getByText(/Signing in.../i)).toBeInTheDocument();

        await waitFor(() => {
            expect(submitButton).not.toBeDisabled();
        });
    });
});
