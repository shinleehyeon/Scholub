import { apiClient } from "./client";
import type { Paper as BasePaper } from "./papers";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  interestedCategories?: string[];
}

export interface Paper extends BasePaper {
  description?: string;
  category?: string;
  likes?: number;
  comments?: number;
  commentCount?: number;
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

export interface DiscussedPapersResponse {
  status: number;
  method: string;
  instance: string;
  details: string;
  data: Paper[];
  errors: Record<string, unknown> | null;
  timestamp: string;
}

export interface ReactedPapersResponse {
  status: number;
  method: string;
  instance: string;
  details: string;
  data: Paper[];
  errors: Record<string, unknown> | null;
  timestamp: string;
}

export const profileApi = {
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<ProfileResponse>("/users/me");
    return response.data;
  },

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const response = await apiClient.get<ProfileResponse>(
        `/users/${encodeURIComponent(userId)}`
      );
      return response.data;
    } catch (error) {
      console.error(`사용자 프로필 가져오기 실패 (userId: ${userId}):`, error);
      return null;
    }
  },

  async getReactionPapers(): Promise<Paper[]> {
    const response = await apiClient.get<ReactedPapersResponse>(
      "/papers/me/reacted"
    );

    return Array.isArray(response.data) ? response.data : [];
  },

  async getCommentPapers(): Promise<Paper[]> {
    const response = await apiClient.get<PapersResponse>("/users/me/comments");
    return response.data.items || [];
  },

  async getDiscussedPapers(): Promise<Paper[]> {
    const response = await apiClient.get<DiscussedPapersResponse>(
      "/papers/me/discussed"
    );

    return Array.isArray(response.data) ? response.data : [];
  },

  async updateInterestedCategories(
    interestedCategories: string[]
  ): Promise<UserProfile> {

    const formData = new FormData();

    interestedCategories.forEach((category) => {
      formData.append("interestedCategories", category);
    });

    const response = await apiClient.patch<ProfileResponse>("/users/me", formData);
    return response.data;
  },
};
