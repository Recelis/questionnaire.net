import { createContext } from "react";

interface IAuthContext {
  token: string | undefined;
  loading: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signup: () => Promise<void>;
  signout: () => Promise<void>;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);
