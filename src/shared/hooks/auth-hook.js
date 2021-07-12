import { useEffect, useCallback, useState } from "react";
let logoutTimer;
export const useAuth = () => {
  const [isFaculty, setIsFaculty] = useState(null);
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [standard, setStandard] = useState("");
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const login = useCallback(
    (userId, token, faculty, standard, experirationDate) => {
      setUserId(userId);
      setIsFaculty(faculty);
      setStandard(standard);
      setToken(token);
      const tokenExpirationDate =
        experirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: userId,
          token: token,
          expiration: tokenExpirationDate.toISOString(),
          isFaculty: faculty,
        })
      );
    },
    []
  );

  const logout = useCallback(() => {
    setToken(null);
    setIsFaculty(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingtime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingtime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        storedData.isFaculty,
        new Date(storedData.expiration)
      );
    }
  }, [login]);
  return { token, login, logout, userId, isFaculty, standard };
};
