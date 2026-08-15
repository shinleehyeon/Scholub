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

export interface UserActivities {
  userId: string;
  interestedHashtags: string[];
  interestedPaperUrls: string[];
}

export interface UserActivitiesResponse {
  status: number;
  method: string;
  instance: string;
  details: string;
  data: UserActivities;
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
      const response = await apiClient.get<{
        status: number;
        method: string;
        instance: string;
        details: string;
        data: {
          email: string;
          name: string;
          profileImageUrl?: string;
        };
        errors: Record<string, unknown> | null;
        timestamp: string;
      }>(`/users/${encodeURIComponent(userId)}/profile`);

      // API 응답 구조: response.data에 직접 프로필 정보가 있음
      console.log("getUserProfile 전체 응답:", response);

      if (
        response.data &&
        typeof response.data === "object" &&
        "name" in response.data
      ) {
        const profileData = response.data;
        console.log("프로필 데이터 추출 성공:", profileData);
        return {
          id: userId,
          name: profileData.name,
          email: profileData.email,
          profileImageUrl: profileData.profileImageUrl,
        };
      }

      console.warn("프로필 데이터를 찾을 수 없음. 응답 구조:", response);
      return null;
    } catch (error) {
      console.error(`사용자 프로필 가져오기 실패 (userId: ${userId}):`, error);
      return null;
    }
  },

  async getReactionPapers(): Promise<Paper[]> {
    const response =
      await apiClient.get<ReactedPapersResponse>("/papers/me/reacted");

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

    const response = await apiClient.patch<ProfileResponse>(
      "/users/me",
      formData
    );
    return response.data;
  },

  async updateProfile(data: {
    name?: string;
    profilePicture?: File;
  }): Promise<UserProfile> {
    const formData = new FormData();

    if (data.name !== undefined) {
      formData.append("name", data.name);
    }

    if (data.profilePicture) {
      formData.append("profilePicture", data.profilePicture);
    }

    // FormData를 보낼 때는 Content-Type 헤더를 명시하지 않아야
    // 브라우저가 자동으로 boundary를 포함한 올바른 Content-Type을 설정합니다.
    const response = await apiClient.patch<ProfileResponse>(
      "/users/me",
      formData
    );
    return response.data;
  },

  async getUserActivities(): Promise<UserActivities | null> {
    try {
      const response = await apiClient.get<UserActivitiesResponse>(
        "/users/me/activities"
      );
      return response.data;
    } catch (error) {
      console.error("사용자 활동 데이터 가져오기 실패:", error);
      return null;
    }
  },
};
