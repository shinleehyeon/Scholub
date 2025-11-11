import { apiClient } from "./client";

export interface Paper {
  id: string;
  paperId?: string; // API 응답에 있을 수 있지만, 실제로는 id를 사용
  title: string;
  categories: string[];
  authors?: string[]; // 선택적 필드로 변경
  summary: string;
  translatedSummary?: string; // 번역된 요약 추가
  content?: Record<string, unknown>; // 선택적 필드로 변경
  doi?: string;
  url?: string;
  pdfUrl?: string;
  issuedAt?: string; // 선택적 필드로 변경
  likeCount: number;
  unlikeCount: number;
  discussionCount?: number; // 선택적 필드로 변경 (검색 응답에 없을 수 있음)
  totalViewCount?: number; // 선택적 필드로 변경
  thumbnailUrl?: string;
  imageUrl?: string;
  coverImage?: string;
  pdfId?: string;
  createdAt?: string; // 선택적 필드로 변경
  updatedAt?: string; // 선택적 필드로 변경
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
  data: Paper[];
  errors: Record<string, unknown> | null;
  timestamp?: string; // 선택적 필드로 변경 (실제 응답에 없을 수 있음)
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

export interface SearchPapersResponse {
  status: number;
  method: string;
  instance: string;
  details: string;
  data: {
    papers: Paper[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  errors: Record<string, unknown> | null;
  timestamp?: string;
}

export interface SearchPapersParams {
  searchQuery?: string;
  page?: number;
  limit?: number;
}

export const papersApi = {
  async getHeadlines(limit: number = 4): Promise<Paper[]> {
    try {
      const response = await apiClient.get<HeadlinesResponse>(
        `/papers/headlines?limit=${limit}`
      );
      console.log("헤드라인 API 응답:", response);

      if (!response || !response.data) {
        console.warn("헤드라인 응답 데이터가 없습니다:", response);
        return [];
      }

      if (Array.isArray(response.data)) {
        return response.data;
      }

      console.warn("헤드라인 응답 데이터가 배열이 아닙니다:", response.data);
      return [];
    } catch (error) {
      console.error("헤드라인 API 호출 실패:", error);
      throw error;
    }
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

  async searchPapers(params: SearchPapersParams): Promise<{
    papers: Paper[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();

    if (params.searchQuery) {
      queryParams.append("query", params.searchQuery);
    }
    // /api/papers/search 엔드포인트는 page와 limit 파라미터를 받지 않음

    const response = await apiClient.get<SearchPapersResponse>(
      `/papers/search?${queryParams.toString()}`
    );

    return (
      response.data || {
        papers: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      }
    );
  },
};
