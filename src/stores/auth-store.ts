import { create } from "zustand";

export type User = { id: string; name: string; email: string };

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<string | null>;
  logout: () => void;
  checkAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("loaniq_token") : null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return data.error;
      localStorage.setItem("loaniq_token", data.token);
      set({ user: data.user, token: data.token, isAuthenticated: true });
      return null;
    } catch {
      return "Network error. Please try again.";
    }
  },

  register: async (name, email, password, confirmPassword) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) return data.error;
      localStorage.setItem("loaniq_token", data.token);
      set({ user: data.user, token: data.token, isAuthenticated: true });
      return null;
    } catch {
      return "Network error. Please try again.";
    }
  },

  logout: () => {
    localStorage.removeItem("loaniq_token");
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = get().token || localStorage.getItem("loaniq_token");
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        set({ user: data.user, token, isAuthenticated: true, isLoading: false });
      } else {
        localStorage.removeItem("loaniq_token");
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));
