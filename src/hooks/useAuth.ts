import { useState, useEffect } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Add `name` to user type here
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const res = await fetch("http://localhost:5001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    localStorage.setItem("vault_token", data.token);
    setUser(data.user); // data.user now contains name too
    setIsAuthenticated(true);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch("http://localhost:5001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Register failed");
    localStorage.setItem("vault_token", data.token);
    setUser(data.user); // data.user contains name
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("vault_token");
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("vault_token");
    if (token) {
      setIsAuthenticated(true);
      // optionally fetch user data here to populate `user.name`
    }
    setLoading(false);
  }, []);

  return { isAuthenticated, user, login, register, logout, loading };
}
