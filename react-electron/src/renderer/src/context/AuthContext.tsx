/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface IAuthContext {
  token: string | undefined;
  signin: (email: string, password: string) => Promise<void>;
  signup: () => void;
  signout: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export function AuthProvider(props: { children: ReactNode }) {
  const [token, setToken] = useState<string | undefined>(undefined);

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

  const signup = () => {};

  const signout = () => {
    setToken(undefined);
    localStorage.removeItem("user_token");
  };

  return (
    <AuthContext.Provider value={{ token, signin, signup, signout }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
