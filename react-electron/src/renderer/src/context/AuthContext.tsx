import { createContext } from "react";
import type { IUser } from "./types";

interface IAuthContext {
  token: string | undefined;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | undefined;
  signin: (email: string, password: string) => Promise<void>;
  signup: () => Promise<void>;
  signout: () => Promise<void>;
  user: IUser | undefined;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);
