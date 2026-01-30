"use client";

import { create } from "zustand";

type User = {
  id: string;
  name: string;
  role: "owner" | "manager" | "analyst";
  avatarColor: string;
};

type AuthState = {
  user: User | null;
  loading: boolean;
  error?: string;
  signInDemo: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: "demo",
    name: "Alex Morgan",
    role: "owner",
    avatarColor: "#8B5CF6"
  },
  loading: false,
  error: undefined,
  async signInDemo() {
    set({ loading: true, error: undefined });
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({
      loading: false,
      user: {
        id: "demo",
        name: "Alex Morgan",
        role: "owner",
        avatarColor: "#8B5CF6"
      }
    });
  }
}));

