import { apiClient } from "./client";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  reactionCount: number;
  commentCount: number;
}

export interface Paper {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  likes: number;
  comments: number;
}

export const profileApi = {
  async getProfile(): Promise<UserProfile> {
    return apiClient.get<UserProfile>("/users/me");
  },

  async getReactionPapers(): Promise<Paper[]> {
    return apiClient.get<Paper[]>("/users/me/reactions");
  },

  async getCommentPapers(): Promise<Paper[]> {
    return apiClient.get<Paper[]>("/users/me/comments");
  },
};
