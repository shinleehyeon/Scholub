import { apiClient } from "./client";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
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

export interface ProfileResponse {
  status: number;
  method: string;
  instance: string;
  details: string;
  data: UserProfile;
  errors: Record<string, unknown> | null;
  timestamp: string;
}

export interface PapersResponse {
  status: number;
  method: string;
  instance: string;
  details: string;
  data: {
    items: Paper[];
    meta?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  errors: Record<string, unknown> | null;
  timestamp: string;
}

export const profileApi = {
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<ProfileResponse>("/users/me");
    return response.data;
  },

  async getReactionPapers(): Promise<Paper[]> {
    const response = await apiClient.get<PapersResponse>("/users/me/reactions");
    return response.data.items || [];
  },

  async getCommentPapers(): Promise<Paper[]> {
    const response = await apiClient.get<PapersResponse>("/users/me/comments");
    return response.data.items || [];
  },
};
