import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../services/api";

const AuthContext = createContext(null);

function readStoredToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(readStoredToken());
  const [loading, setLoading] = useState(true);

  // Khi app khoi dong, neu co token luu san thi lay lai thong tin user
  useEffect(() => {
    const stored = readStoredToken();
    if (!stored) {
      setLoading(false);
      return;
    }
    authApi
      .getMe(stored)
      .then((data) => {
        setUser(data);
        setToken(stored);
      })
      .catch(() => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password, remember) => {
    const data = await authApi.login(email, password);
    const { token: newToken, ...userInfo } = data;

    if (remember) {
      localStorage.setItem("token", newToken);
    } else {
      sessionStorage.setItem("token", newToken);
    }

    setToken(newToken);
    setUser(userInfo);
    return userInfo;
  };

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phai duoc dung ben trong AuthProvider");
  return ctx;
}
