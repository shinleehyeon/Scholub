import { apiClient } from "./client";

export interface Paper {
  id: string;
  paperId?: string; // API 응답에 있을 수 있지만, 실제로는 id를 사용
  title: string;
  categories: string[];
  authors: string[];
  summary: string;
  content: Record<string, unknown>;
  doi?: string;
  url?: string;
  pdfUrl?: string;
  issuedAt: string;
  likeCount: number;
  unlikeCount: number;
  totalViewCount: number;
  thumbnailUrl?: string;
  imageUrl?: string;
  coverImage?: string;
  pdfId?: string;
  createdAt: string;
  updatedAt: string;
  myReaction?: {
    isLiked: boolean;
    isUnliked: boolean;
  };
}

export interface HeadlinesResponse {
  status: number;
  method: string;
  instance: string;
  details: string;
  data: Paper[] | null;
  errors: Record<string, unknown> | null;
  timestamp: string;
}

export interface PopularPapersResponse {
  status: number;
  method: string;
  instance: string;
  details: string;
  data: Paper[] | null;
  errors: Record<string, unknown> | null;
  timestamp: string;
}

export interface LatestPapersResponse {
  status: number;
  method: string;
  instance: string;
  details: string;
  data: Paper[] | null;
  errors: Record<string, unknown> | null;
  timestamp: string;
}

export interface RecommendedPapersResponse {
  status: number;
  method: string;
  instance: string;
  details: string;
  data: Paper[] | null;
  errors: Record<string, unknown> | null;
  timestamp: string;
}

export const papersApi = {
  async getHeadlines(limit: number = 4): Promise<Paper[]> {
    const response = await apiClient.get<HeadlinesResponse>(
      `/papers/headlines?limit=${limit}`
    );
    return Array.isArray(response.data) ? response.data : [];
  },

  async getPopularPapers(
    limit: number = 20,
    days: number = 90
  ): Promise<Paper[]> {
    const response = await apiClient.get<PopularPapersResponse>(
      `/papers/popular?limit=${limit}&days=${days}`
    );
    return Array.isArray(response.data) ? response.data : [];
  },

  async getLatestPapers(limit: number = 20): Promise<Paper[]> {
    const response = await apiClient.get<LatestPapersResponse>(
      `/papers/latest?limit=${limit}`
    );
    return Array.isArray(response.data) ? response.data : [];
  },

  async getRecommendedPapers(limit: number = 20): Promise<Paper[]> {
    const response = await apiClient.get<RecommendedPapersResponse>(
      `/papers/me/recommended?limit=${limit}`
    );
    return Array.isArray(response.data) ? response.data : [];
  },

  async toggleReaction(
    paperId: string,
    type: "LIKE" | "UNLIKE"
  ): Promise<{ isReacted: boolean; likeCount?: number }> {
    const response = await apiClient.post<{
      status: number;
      data: {
        reactionType: string;
        isReacted: boolean;
        likeCount?: number;
      };
    }>(`/papers/${paperId}/reactions`, { type });

    console.log("toggleReaction API 응답:", response);

    return {
      isReacted: response.data?.isReacted ?? false,
      likeCount: response.data?.likeCount,
    };
  },
};
