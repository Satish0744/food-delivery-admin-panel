import { createContext, useContext, useEffect, useState } from "react";
import { loadFromStorage, saveToStorage } from "../utils/helpers";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => loadFromStorage("adminUser", null));

  useEffect(() => {
    saveToStorage("adminUser", admin);
  }, [admin]);

  const login = (email, password) => {
    // Demo credentials
    if (email === "admin@foodhub.com" && password === "admin123") {
      setAdmin({
        name: "Admin",
        email,
        role: "superadmin",
        avatar: "A",
      });
      return { success: true, message: "Welcome back, Admin!" };
    }
    return {
      success: false,
      message: "Invalid credentials. Try admin@foodhub.com / admin123",
    };
  };

  const logout = () => setAdmin(null);

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};