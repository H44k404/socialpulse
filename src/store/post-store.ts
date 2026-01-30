"use client";

import { create } from "zustand";
import type { PlatformKey } from "@/lib/constants";

export type PostStatus = "draft" | "scheduled" | "published" | "failed";

export type ScheduledPost = {
  id: string;
  platform: PlatformKey;
  title: string;
  scheduledAt: string;
  status: PostStatus;
};

type PostStoreState = {
  posts: ScheduledPost[];
  loading: boolean;
  createPost: (post: Omit<ScheduledPost, "id" | "status"> & { status?: PostStatus }) => Promise<void>;
  updateStatus: (id: string, status: PostStatus) => void;
};

export const usePostStore = create<PostStoreState>((set) => ({
  posts: [],
  loading: false,
  async createPost(post) {
    set({ loading: true });
    await new Promise((resolve) => setTimeout(resolve, 700));
    const id = `post_${Date.now()}`;
    set((state) => ({
      loading: false,
      posts: [
        ...state.posts,
        {
          id,
          ...post,
          status: post.status ?? "scheduled"
        }
      ]
    }));
  },
  updateStatus(id, status) {
    set((state) => ({
      posts: state.posts.map((p) => (p.id === id ? { ...p, status } : p))
    }));
  }
}));

