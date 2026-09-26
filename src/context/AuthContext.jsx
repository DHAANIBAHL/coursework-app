import { createContext, useContext, useEffect, useState } from "react";

// Talks to the Express server in the coursework-server folder.
// Vite forwards every /api request to it (see vite.config.js).
async function request(path, { method = "GET", body } = {}) {
  let response;
  try {
    response = await fetch(`/api/auth${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Can't reach the server. Make sure the backend is running.");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(
      data.error || "Can't reach the server. Make sure the backend is running."
    );
    // e.g. "NO_ACCOUNT" or "WRONG_PASSWORD", so pages can react to specific cases
    error.code = data.code;
    throw error;
  }
  return data;
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
  }

  async function login({ email, password }) {
    const data = await request("/login", {
      method: "POST",
      body: { email, password },
    });
    setUser(data.user);
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
