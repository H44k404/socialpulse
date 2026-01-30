"use client";

import { create } from "zustand";

export type ThemeMode = "dark" | "light";

type ThemeState = {
  mode: ThemeMode;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  mode: "dark",
  toggle: () =>
    set((state) => {
      const next: ThemeMode = state.mode === "dark" ? "light" : "dark";
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", next === "dark");
      }
      return { mode: next };
    }),
  setMode: (mode) =>
    set(() => {
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", mode === "dark");
      }
      return { mode };
    })
}));

