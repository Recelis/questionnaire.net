import { useEffect, useState } from "react";

import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState<undefined | { name: string }>(undefined);
  useEffect(() => {
    getUser(13);
  }, []);

  async function getUser(userId: number) {
    try {
      const response = await fetch(`http://localhost:5283/user/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEzIiwibmJmIjoxNzYxOTU4NTg0LCJleHAiOjE3NjE5NjU3ODQsImlhdCI6MTc2MTk1ODU4NH0.OeFeefrwUTpt6gb6dcWRk7jRYDfYAqoVzI4IDBrxPUo"}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const user = await response.json();
      setUser(user);
      console.log("Fetched user:", user);
      return user;
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  }
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank"></a>
        <a href="https://react.dev" target="_blank"></a>
      </div>
      <h1>Vite + React + electron + other fun stuff</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      {user && user.name}
    </>
  );
}

export default App;
