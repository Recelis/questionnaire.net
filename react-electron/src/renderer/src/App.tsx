import { useEffect, useState } from "react";

import "./App.css";
import { Link } from "react-router";
import RouterComponent from "./routes";

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
      {user && user.name}
      <RouterComponent />
    </>
  );
}

export default App;
