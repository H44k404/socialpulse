"use client";

import { create } from "zustand";
import type { PlatformKey } from "@/lib/constants";

export type PlatformConnectionStatus = "connected" | "disconnected" | "error";

export type PlatformConnection = {
  key: PlatformKey;
  name: string;
  status: PlatformConnectionStatus;
  accountName?: string;
  lastSync?: string;
};

type PlatformStoreState = {
  connections: PlatformConnection[];
  loadingKeys: Set<PlatformKey>;
  connect: (key: PlatformKey) => Promise<void>;
  disconnect: (key: PlatformKey) => void;
};

export const usePlatformStore = create<PlatformStoreState>((set, get) => ({
  connections: [],
  loadingKeys: new Set(),
  async connect(key) {
    set((state) => ({
      loadingKeys: new Set([...state.loadingKeys, key])
    }));
    await new Promise((resolve) => setTimeout(resolve, 700));
    const existing = get().connections.find((c) => c.key === key);
    const updated: PlatformConnection = {
      key,
      name: existing?.name ?? key,
      status: "connected",
      accountName: existing?.accountName ?? "@demo_account",
      lastSync: new Date().toISOString()
    };
    set((state) => ({
      connections: [...state.connections.filter((c) => c.key !== key), updated],
      loadingKeys: new Set([...state.loadingKeys].filter((k) => k !== key))
    }));
  },
  disconnect(key) {
    set((state) => ({
      connections: state.connections.map((c) =>
        c.key === key ? { ...c, status: "disconnected" as const } : c
      )
    }));
  }
}));

