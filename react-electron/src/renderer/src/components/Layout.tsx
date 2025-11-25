import React from "react";
import useAuth from "../hooks/useAuth";

export default function Layout(props: { children: React.ReactNode }) {
  const auth = useAuth();
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span>LifeTracker</span>{" "}
        <span>
          <span style={{ marginInlineEnd: "0.25rem" }}>
            Logged in as: {auth.user?.email}
          </span>
          <button
            onClick={() => {
              auth.signout();
            }}
          >
            Sign out
          </button>
        </span>
      </div>
      {props.children}
    </div>
  );
}
