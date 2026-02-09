import React from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router";

export default function Layout(props: { children: React.ReactNode }) {
  const auth = useAuth();
  const navigate = useNavigate();
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          borderBottom: "1px solid rgba(100, 108, 255, 0.2)",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600, cursor: "pointer" }} onClick={() => navigate('/')}>
          LifeTracker
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "0.9rem", color: "#888" }}>
            {auth.user?.email}
          </span>
          <button
            onClick={() => {
              auth.signout();
            }}
            style={{
              padding: "0.6em 1.2em",
              fontSize: "0.9em",
              fontWeight: 500,
              borderRadius: "8px",
              border: "1px solid #646cff",
              backgroundColor: "transparent",
              color: "#646cff",
              cursor: "pointer",
              transition: "all 0.25s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#646cff";
              (e.currentTarget as HTMLButtonElement).style.color = "white";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "#646cff";
            }}
          >
            Sign out
          </button>
        </div>
      </div>
      {props.children}
    </div>
  );
}
