import { apiClient } from "./client";

export interface HeadlinePaper {
  id: string;
  paperId: string;
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
  thumbnailUrl?: string; // URL 형태로 올 수 있음
  imageUrl?: string; // URL 형태로 올 수 있음
  coverImage?: string; // URL 형태로 올 수 있음
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
  data: HeadlinePaper[] | null;
  errors: Record<string, unknown> | null;
  timestamp: string;
}

export interface PopularPapersResponse {
  status: number;
  method: string;
  instance: string;
  details: string;
  data: HeadlinePaper[] | null;
  errors: Record<string, unknown> | null;
  timestamp: string;
}

export interface LatestPapersResponse {
  status: number;
  method: string;
  instance: string;
  details: string;
  data: HeadlinePaper[] | null;
  errors: Record<string, unknown> | null;
  timestamp: string;
}

export interface RecommendedPapersResponse {
  status: number;
  method: string;
  instance: string;
  details: string;
  data: HeadlinePaper[] | null;
  errors: Record<string, unknown> | null;
  timestamp: string;
}

export const papersApi = {
  async getHeadlines(limit: number = 4): Promise<HeadlinePaper[]> {
    const response = await apiClient.get<HeadlinesResponse>(
      `/papers/headlines?limit=${limit}`
    );
    // API가 null을 반환할 수 있으므로 빈 배열로 처리
    return Array.isArray(response.data) ? response.data : [];
  },

  async getPopularPapers(
    limit: number = 20,
    days: number = 90
  ): Promise<HeadlinePaper[]> {
    const response = await apiClient.get<PopularPapersResponse>(
      `/papers/popular?limit=${limit}&days=${days}`
    );
    // API가 null을 반환할 수 있으므로 빈 배열로 처리
    return Array.isArray(response.data) ? response.data : [];
  },

  async getLatestPapers(limit: number = 20): Promise<HeadlinePaper[]> {
    const response = await apiClient.get<LatestPapersResponse>(
      `/papers/latest?limit=${limit}`
    );
    // API가 null을 반환할 수 있으므로 빈 배열로 처리
    return Array.isArray(response.data) ? response.data : [];
  },

  async getRecommendedPapers(limit: number = 20): Promise<HeadlinePaper[]> {
    const response = await apiClient.get<RecommendedPapersResponse>(
      `/papers/me/recommended?limit=${limit}`
    );
    // API가 null을 반환할 수 있으므로 빈 배열로 처리
    return Array.isArray(response.data) ? response.data : [];
  },
};
