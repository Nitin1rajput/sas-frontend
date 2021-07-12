import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  isFaculty: null,
  standard: null,
  login: () => {},
  logout: () => {},
});
