import { apiClient } from "./client";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  avatarUrl?: string;
  reactionCount: number;
  commentCount: number;
  interestedCategories?: string[];
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

  async updateInterestedCategories(
    interestedCategories: string[]
  ): Promise<UserProfile> {
    // multipart/form-data 형식으로 전송
    const formData = new FormData();
    // 배열을 JSON 문자열로 전송하거나, 각각 append
    // API가 배열을 어떻게 받는지에 따라 다를 수 있음
    interestedCategories.forEach((category) => {
      formData.append("interestedCategories", category);
    });
    
    const response = await apiClient.patch<ProfileResponse>("/users/me", formData);
    return response.data;
  },
};
