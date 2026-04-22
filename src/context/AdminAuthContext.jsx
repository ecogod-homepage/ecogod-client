import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  clearAdminToken,
  fetchCurrentAdmin,
  getStoredAdminToken,
  isUnauthorizedError,
  loginAdmin,
  storeAdminToken
} from "../services/api/adminAuth";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [status, setStatus] = useState("loading");
  const [admin, setAdmin] = useState(null);
  const [accessToken, setAccessToken] = useState("");

  const logout = useCallback(() => {
    clearAdminToken();
    setAccessToken("");
    setAdmin(null);
    setStatus("unauthenticated");
  }, []);

  const restoreSession = useCallback(async () => {
    const storedToken = getStoredAdminToken();

    if (!storedToken) {
      setStatus("unauthenticated");
      return;
    }

    try {
      const profile = await fetchCurrentAdmin(storedToken);
      setAccessToken(storedToken);
      setAdmin(profile);
      setStatus("authenticated");
    } catch (error) {
      logout();
    }
  }, [logout]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const login = useCallback(async (credentials) => {
    const result = await loginAdmin(credentials);
    storeAdminToken(result.accessToken);
    setAccessToken(result.accessToken);
    setAdmin(result.admin);
    setStatus("authenticated");
    return result.admin;
  }, []);

  const refreshProfile = useCallback(async () => {
    const token = getStoredAdminToken();

    if (!token) {
      logout();
      return null;
    }

    try {
      const profile = await fetchCurrentAdmin(token);
      setAccessToken(token);
      setAdmin(profile);
      setStatus("authenticated");
      return profile;
    } catch (error) {
      if (isUnauthorizedError(error)) {
        logout();
      }
      throw error;
    }
  }, [logout]);

  const value = useMemo(
    () => ({
      status,
      admin,
      accessToken,
      isAuthenticated: status === "authenticated",
      login,
      logout,
      refreshProfile
    }),
    [status, admin, accessToken, login, logout, refreshProfile]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error("useAdminAuth는 AdminAuthProvider 내부에서만 사용할 수 있습니다.");
  }

  return context;
}
