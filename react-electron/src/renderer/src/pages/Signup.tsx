import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import useAuth from "../hooks/useAuth";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await auth.signup(email, name, password);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <h1>Sign up</h1>
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
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
          required
        />

        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          onChange={(e) => {
            setName(e.target.value);
          }}
          value={name}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
          required
        />
        <button type="submit" disabled={auth.loading}>
          {auth.loading ? "Creating account..." : "Submit"}
        </button>
      </form>
      <Link to="/signin">or Sign in</Link>
    </div>
  );
}
