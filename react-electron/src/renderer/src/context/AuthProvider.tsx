import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import type { IUser } from "./types";
import { apiGetUser, apiUserLogin } from "../api/api";

export function AuthProvider(props: { children: ReactNode }) {
  const [token, setToken] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | undefined>(undefined);

  const isLoggedIn = token !== undefined && user !== undefined;

  const checksLogin = useCallback(async (userToken: string | undefined) => {
    if (userToken) {
      setToken(userToken);
      const id = getUserId(userToken);
      if (id) {
        const loggedInUser = await apiGetUser(id);
        setUser(loggedInUser);
      }
    }
  }, []);

  useEffect(() => {
    const userToken = localStorage.getItem("user_token") ?? undefined;
    checksLogin(userToken);
  }, [checksLogin]);

  const signin = async (email: string, password: string) => {
    // sign in
    setLoading(true);
    const userToken = await apiUserLogin({ email, password });
    localStorage.setItem("user_token", userToken);
    checksLogin(userToken);
    setLoading(false);
  };

  const signup = async () => {};

  const signout = async () => {
    setToken(undefined);
    localStorage.removeItem("user_token");
  };

  const getUserId = (token: string | undefined): string | undefined => {
    if (!token) {
      return;
    }
    const decoded = jwtDecode(token);
    const id = (decoded as { id: string } & JwtPayload)?.id;
    return id;
  };

  return (
    <AuthContext.Provider
      value={{ token, signin, signup, signout, loading, user, isLoggedIn }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
