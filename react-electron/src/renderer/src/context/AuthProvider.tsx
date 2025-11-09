import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";

const host = "http://localhost:5283";

export function AuthProvider(props: { children: ReactNode }) {
  const [token, setToken] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (saved) setToken(JSON.parse(saved));
  }, []);

  const signin = async (email: string, password: string) => {
    // sign in
    setLoading(true);
    try {
      const res = await fetch(`${host}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      localStorage.setItem("user_token", data);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const signup = async () => {};

  const signout = async () => {
    setToken(undefined);
    localStorage.removeItem("user_token");
  };

  return (
    <AuthContext.Provider value={{ token, signin, signup, signout, loading }}>
      {props.children}
    </AuthContext.Provider>
  );
}
