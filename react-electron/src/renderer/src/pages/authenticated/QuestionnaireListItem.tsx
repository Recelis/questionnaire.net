import React from "react";
import type { IQuestionnaire } from "../../api/api";
import DropdownMenu from "../../components/DropdownMenu";

export default function QuestionnaireListItem(props: { questionnaire: IQuestionnaire, onDeleteClick: (questionnaire: IQuestionnaire) => void, onEditClick: (questionnaire: IQuestionnaire) => void }) {
const { questionnaire, onDeleteClick, onEditClick } = props;

  return <div
  
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
          action: () => onEditClick(questionnaire),
        },
        {
          label: "Delete",
          action: () => onDeleteClick(questionnaire),
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
}
