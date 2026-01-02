import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Layout from "../../components/Layout";
import useAuth from "../../hooks/useAuth";
import {
  apiGetQuestionnaires,
  apiDeleteQuestionnaire,
  type IQuestionnaire,
} from "../../api/api";
import DropdownMenu from "../../components/DropdownMenu";
import ConfirmationModal from "../../components/ConfirmationModal";

export default function Home() {
  const [questionnaires, setQuestionnaires] = useState<IQuestionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [questionnaireToDelete, setQuestionnaireToDelete] = useState<
    IQuestionnaire | null
  >(null);
  const [deleting, setDeleting] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      if (!auth.user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(undefined);
        const data = await apiGetQuestionnaires(auth.user.id);
        if (data) {
          setQuestionnaires(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load questionnaires");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionnaires();
  }, [auth.user?.id]);

  const handleDeleteClick = (questionnaire: IQuestionnaire) => {
    setQuestionnaireToDelete(questionnaire);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!questionnaireToDelete) return;

    try {
      setDeleting(true);
      const success = await apiDeleteQuestionnaire(questionnaireToDelete.id);
      if (success) {
        setQuestionnaires(
          questionnaires.filter((q) => q.id !== questionnaireToDelete.id)
        );
        setDeleteModalOpen(false);
        setQuestionnaireToDelete(null);
      } else {
        setError("Failed to delete questionnaire. It may not exist.");
        setDeleteModalOpen(false);
        setQuestionnaireToDelete(null);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete questionnaire. Please try again."
      );
      setDeleteModalOpen(false);
      setQuestionnaireToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setQuestionnaireToDelete(null);
  };

  const handleEditClick = (questionnaire: IQuestionnaire) => {
    navigate(`/questionnaire/${questionnaire.id}/edit`);
  };

  return (
    <Layout>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h1 style={{ margin: 0 }}>My Questionnaires</h1>
          <Link
            to="/questionnaire/create"
            style={{
              padding: "0.6em 1.2em",
              fontSize: "1em",
              fontWeight: 500,
              borderRadius: "8px",
              border: "1px solid transparent",
              backgroundColor: "#646cff",
              color: "white",
              textDecoration: "none",
              display: "inline-block",
              transition: "all 0.25s",
            }}
          >
            + Create New
          </Link>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "2rem", color: "#888" }}>
            Loading questionnaires...
          </div>
        )}

        {error && (
          <div
            style={{
              padding: "1rem",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 0, 0, 0.1)",
              color: "#ff6b6b",
              border: "1px solid rgba(255, 0, 0, 0.3)",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && questionnaires.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              backgroundColor: "#1a1a1a",
              borderRadius: "8px",
              border: "1px dashed #646cff",
            }}
          >
            <p style={{ marginBottom: "1rem", color: "#888" }}>No questionnaires yet.</p>
            <Link
              to="/questionnaire/create"
              style={{
                color: "#646cff",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Create your first questionnaire →
            </Link>
          </div>
        )}

        {!loading && !error && questionnaires.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {questionnaires.map((questionnaire) => (
              <div
                key={questionnaire.id}
                style={{
                  padding: "1.5rem",
                  // backgroundColor: "#1a1a1a",
                  borderRadius: "8px",
                  border: "1px solid #333",
                  transition: "all 0.25s",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#646cff";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#333";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "0.5rem",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "1.25em",
                      color: "#646cff",
                      flex: 1,
                    }}
                  >
                    {questionnaire.name}
                  </h3>
                  <DropdownMenu
                    trigger={
                      <div
                        style={{
                          padding: "0.25rem 0.5rem",
                          cursor: "pointer",
                          color: "#888",
                          fontSize: "1.2em",
                          userSelect: "none",
                        }}
                      >
                        ⋮
                      </div>
                    }
                    options={[
                      {
                        label: "Edit",
                        action: () => handleEditClick(questionnaire),
                      },
                      {
                        label: "Delete",
                        action: () => handleDeleteClick(questionnaire),
                        danger: true,
                      },
                    ]}
                  />
                </div>
                <p style={{ margin: "0.5rem 0", color: "#888", fontSize: "0.9em" }}>
                  {questionnaire.templates.length} template
                  {questionnaire.templates.length !== 1 ? "s" : ""}
                </p>
                <div style={{ marginTop: "1rem", fontSize: "0.85em", color: "#666" }}>
                  ID: {questionnaire.id}
                </div>
              </div>
            ))}
          </div>
        )}

        <ConfirmationModal
          isOpen={deleteModalOpen}
          title="Delete Questionnaire"
          message={
            questionnaireToDelete
              ? `Are you sure you want to delete "${questionnaireToDelete.name}"? This action cannot be undone.`
              : ""
          }
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isLoading={deleting}
        />
      </div>
    </Layout>
  );
}
