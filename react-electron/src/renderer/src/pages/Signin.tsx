import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import useAuth from "../hooks/useAuth";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await auth.signin(email, password);
  };

  useEffect(() => {
    auth.clearError();
  }, [])

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <h1>Sign in</h1>
        {auth.error && (
          <div
            style={{
              color: "red",
              padding: "10px",
              marginBottom: "10px",
              border: "1px solid red",
              borderRadius: "4px",
              backgroundColor: "#ffe6e6",
            }}
          >
            {auth.error}
          </div>
        )}
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="text"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
        />
        <button type="submit" disabled={auth.loading}>
          {auth.loading ? "Signing in..." : "Submit"}
        </button>
      </form>
      <Link to="/signup">or Sign up</Link>
    </div>
  );
}
