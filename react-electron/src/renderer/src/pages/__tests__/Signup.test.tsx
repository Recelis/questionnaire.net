import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "../../test/test-utils";
import userEvent from "@testing-library/user-event";
import Signup from "../Signup";
import * as api from "../../api/api";

// Helper to create a valid JWT token format (header.payload.signature)
// Payload: {"id":"123"} base64 encoded
const createMockToken = () => "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyJ9.signature";

// Mock the API module
vi.mock("../../api/api", () => ({
  apiUserLogin: vi.fn(),
  apiUserSignup: vi.fn(),
  apiGetUser: vi.fn(),
}));

// Mock react-router Link component
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
      <a href={to}>{children}</a>
    ),
  };
});

describe("Signup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders the sign up form with email, name, and password fields", () => {
    render(<Signup />);

    expect(screen.getByText("Sign up")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByText(/or Sign in/i)).toBeInTheDocument();
  });

  it("allows user to type in email field", async () => {
    const user = userEvent.setup();
    render(<Signup />);

    const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
    await user.type(emailInput, "test@example.com");

    expect(emailInput.value).toBe("test@example.com");
  });

  it("allows user to type in name field", async () => {
    const user = userEvent.setup();
    render(<Signup />);

    const nameInput = screen.getByLabelText("Name") as HTMLInputElement;
    await user.type(nameInput, "John Doe");

    expect(nameInput.value).toBe("John Doe");
  });

  it("allows user to type in password field", async () => {
    const user = userEvent.setup();
    render(<Signup />);

    const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;
    await user.type(passwordInput, "password123");

    expect(passwordInput.value).toBe("password123");
  });

  it("calls signup function when form is submitted with valid credentials", async () => {
    const user = userEvent.setup();
    const mockToken = createMockToken();
    const mockUser = { email: "test@example.com" };
    const newUser = { email: "test@example.com", name: "John Doe" };

    vi.mocked(api.apiUserSignup).mockResolvedValue(newUser as any);
    vi.mocked(api.apiUserLogin).mockResolvedValue(mockToken);
    vi.mocked(api.apiGetUser).mockResolvedValue(mockUser);

    render(<Signup />);

    const emailInput = screen.getByLabelText("Email");
    const nameInput = screen.getByLabelText("Name");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /submit/i });

    await user.type(emailInput, "test@example.com");
    await user.type(nameInput, "John Doe");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(api.apiUserSignup).toHaveBeenCalledWith({
        email: "test@example.com",
        name: "John Doe",
        password: "password123",
      });
    });
  });

  it("displays error message when signup fails due to existing email", async () => {
    const user = userEvent.setup();
    vi.mocked(api.apiUserSignup).mockRejectedValue(
      new Error("User with this email already exists")
    );

    render(<Signup />);

    const emailInput = screen.getByLabelText("Email");
    const nameInput = screen.getByLabelText("Name");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /submit/i });

    await user.type(emailInput, "existing@example.com");
    await user.type(nameInput, "John Doe");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/User with this email already exists/i)
      ).toBeInTheDocument();
    });
  });

  it("displays error message when API throws an error", async () => {
    const user = userEvent.setup();
    vi.mocked(api.apiUserSignup).mockRejectedValue(
      new Error("Failed to create account")
    );

    render(<Signup />);

    const emailInput = screen.getByLabelText("Email");
    const nameInput = screen.getByLabelText("Name");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /submit/i });

    await user.type(emailInput, "test@example.com");
    await user.type(nameInput, "John Doe");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Failed to create account/i)).toBeInTheDocument();
    });
  });

  it("clears error message when form is resubmitted", async () => {
    const user = userEvent.setup();
    const mockToken = createMockToken();
    const mockUser = { email: "test@example.com" };
    const newUser = { email: "test@example.com", name: "John Doe" };

    // First attempt fails
    vi.mocked(api.apiUserSignup).mockRejectedValueOnce(
      new Error("User with this email already exists")
    );
    // Second attempt succeeds
    vi.mocked(api.apiUserSignup).mockResolvedValueOnce(newUser as any);
    vi.mocked(api.apiUserLogin).mockResolvedValue(mockToken);
    vi.mocked(api.apiGetUser).mockResolvedValue(mockUser);

    render(<Signup />);

    const emailInput = screen.getByLabelText("Email");
    const nameInput = screen.getByLabelText("Name");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /submit/i });

    await user.type(emailInput, "test@example.com");
    await user.type(nameInput, "John Doe");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/User with this email already exists/i)).toBeInTheDocument();
    });

    // Clear and resubmit with different email
    await user.clear(emailInput);
    await user.type(emailInput, "newuser@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.queryByText(/User with this email already exists/i)
      ).not.toBeInTheDocument();
    });
  });

  it("disables submit button while loading", async () => {
    const user = userEvent.setup();
    const mockToken = createMockToken();
    const mockUser = { email: "test@example.com" };
    const newUser = { email: "test@example.com", name: "John Doe" };

    vi.mocked(api.apiUserSignup).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(newUser as any), 100))
    );
    vi.mocked(api.apiUserLogin).mockResolvedValue(mockToken);
    vi.mocked(api.apiGetUser).mockResolvedValue(mockUser);

    render(<Signup />);

    const emailInput = screen.getByLabelText("Email");
    const nameInput = screen.getByLabelText("Name");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /submit/i });

    await user.type(emailInput, "test@example.com");
    await user.type(nameInput, "John Doe");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/Creating account.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("displays link to signin page", () => {
    render(<Signup />);

    const signinLink = screen.getByText(/or Sign in/i);
    expect(signinLink).toBeInTheDocument();
    expect(signinLink.closest("a")).toHaveAttribute("href", "/signin");
  });

  it("handles signup with empty name field", async () => {
    const user = userEvent.setup();
    const mockToken = createMockToken();
    const mockUser = { email: "test@example.com" };
    const newUser = { email: "test@example.com", name: "" };

    vi.mocked(api.apiUserSignup).mockResolvedValue(newUser as any);
    vi.mocked(api.apiUserLogin).mockResolvedValue(mockToken);
    vi.mocked(api.apiGetUser).mockResolvedValue(mockUser);

    render(<Signup />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /submit/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(api.apiUserSignup).toHaveBeenCalledWith({
        email: "test@example.com",
        name: "",
        password: "password123",
      });
    });
  });
});

