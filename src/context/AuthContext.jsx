import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

// Every auth call goes to /api/auth on the server (see src/lib/api.js).
function request(path, options) {
  return api(`/auth${path}`, options);
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // True until we've asked the server whether someone is already logged in.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    request("/me")
      .then((data) => {
        if (!cancelled) setUser(data.user);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function signup({ name, email, password }) {
    const data = await request("/signup", {
      method: "POST",
      body: { name, email, password },
    });
    setUser(data.user);
    return data.user;
  }

  async function login({ email, password }) {
    const data = await request("/login", {
      method: "POST",
      body: { email, password },
    });
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    try {
      await request("/logout", { method: "POST" });
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Use this in any component: const { user, login, logout } = useAuth();
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
