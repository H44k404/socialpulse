"use client";

import { create } from "zustand";

export type ToastVariant = "success" | "error" | "info";

export type Toast = {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type NotificationState = {
  toasts: Toast[];
  push: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  toasts: [],
  push(toast) {
    const id = `toast_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const next: Toast = { id, ...toast };
    set((state) => ({ toasts: [...state.toasts, next] }));
    // auto-dismiss
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  dismiss(id) {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  }
}));

