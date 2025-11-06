import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider(props: { children: ReactNode }) {
  const [token, setToken] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (saved) setToken(JSON.parse(saved));
  }, []);

  const signin = async (email: string, password: string) => {
    // sign in

    const newToken = "string";
    setToken(newToken);
    // get user
    // localStorage.setItem("user_token", newToken);
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
