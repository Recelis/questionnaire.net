import { describe, it, beforeEach, vi } from "vitest";

// Mock the API module
vi.mock("../../../api/api", () => ({
  apiCreateQuestionnaire: vi.fn(),
  apiUpdateQuestionnaire: vi.fn(),
  apiGetQuestionnaires: vi.fn(),
  apiGetUser: vi.fn(),
}));

// Mock react-router
const mockNavigate = vi.fn();
const mockUseParams = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
      <a href={to}>{children}</a>
    ),
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
  };
});

describe("QuestionList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it.todo("renders the questions for the questionnaire");

  it.todo("displays a message when there are no questions for the questionnaire");

  it.todo("displays a button for adding a new question");
});

describe("QuestionCreate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it.todo("renders the create question form with all elements including questionnaire name");

  it.todo("allows user to type in the question name field");

  it.todo("calls apiCreateQuestion when form is submitted with valid name");

  it.todo("displays a continue adding questions or return to home page modal after form is successfully submitted");

  it.todo("trims whitespace from question name before submission");

  it.todo("prevents submission when question name is empty");

  it.todo("prevents submission when question name is only whitespace");

  it.todo("displays error message when API call fails");

  it.todo("displays generic error message when API throws non-Error");

  it.todo("clears error message when form is resubmitted");
});