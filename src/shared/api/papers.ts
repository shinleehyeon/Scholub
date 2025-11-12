import { apiClient } from "./client";

export interface Paper {
  id: string;
  paperId?: string;
  title: string;
  categories: string[];
  authors?: string[];
  summary: string;
  translatedSummary?: string;
  content?: Record<string, unknown>;
  doi?: string;
  url?: string;
  pdfUrl?: string;
  issuedAt?: string;
  likeCount: number;
  unlikeCount: number;
  discussionCount?: number;
  totalViewCount?: number;
  thumbnailUrl?: string;
  imageUrl?: string;
  coverImage?: string;
  pdfId?: string;
  createdAt?: string;
  updatedAt?: string;
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
  timestamp?: string;
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

export interface PaperDetailResponse {
  status: number;
  method: string;
  instance: string;
  details: string;
  data: Paper;
  errors: Record<string, unknown> | null;
  timestamp?: string;
}

export interface CategoryPapersResponse {
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

export interface CategoryPapersParams {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "issuedAt" | "likeCount" | "totalViewCount";
  sortOrder?: "asc" | "desc";
  categories?: string[];
  authors?: string[];
  year?: number;
  searchQuery?: string;
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
    }>(`/papers/${paperId}/reactions?paperId=${encodeURIComponent(paperId)}`, {
      type,
    });

    console.log("toggleReaction API 응답:", response);

    return {
      isReacted: response.data?.isReacted ?? false,
      likeCount: response.data?.likeCount,
    };
  },

  async getReactionStats(
    paperId: string
  ): Promise<{ likeCount: number; unlikeCount: number }> {
    const response = await apiClient.get<{
      status: number;
      method: string;
      instance: string;
      details: string;
      data: {
        likeCount: number;
        unlikeCount: number;
      };
      errors: Record<string, unknown>;
      timestamp: string;
    }>(`/papers/${encodeURIComponent(paperId)}/reactions`);

    return response.data || { likeCount: 0, unlikeCount: 0 };
  },

  async startChatSession(paperId: string): Promise<{ activityId: string }> {
    const response = await apiClient.post<{
      status: number;
      data: {
        activityId: string;
        message: string;
      };
    }>("/papers/chat/start", {
      paperId,
    });

    return {
      activityId: response.data?.activityId || "",
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

  async getPapersByCategory(
    category: string,
    params?: CategoryPapersParams
  ): Promise<{
    papers: Paper[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params?.limit) {
      queryParams.append("limit", params.limit.toString());
    }
    if (params?.sortBy) {
      queryParams.append("sortBy", params.sortBy);
    }
    if (params?.sortOrder) {
      queryParams.append("sortOrder", params.sortOrder);
    }
    if (params?.categories && params.categories.length > 0) {
      params.categories.forEach((cat) => {
        queryParams.append("categories", cat);
      });
    }
    if (params?.authors && params.authors.length > 0) {
      params.authors.forEach((author) => {
        queryParams.append("authors", author);
      });
    }
    if (params?.year) {
      queryParams.append("year", params.year.toString());
    }
    if (params?.searchQuery) {
      queryParams.append("searchQuery", params.searchQuery);
    }

    const encodedCategory = encodeURIComponent(category);
    const response = await apiClient.get<CategoryPapersResponse>(
      `/papers/categories/${encodedCategory}?${queryParams.toString()}`
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

  async getPaperDetail(paperId: string): Promise<Paper> {
    const response = await apiClient.get<PaperDetailResponse>(
      `/papers/${encodeURIComponent(paperId)}`
    );
    return response.data;
  },

  async recordPaperView(
    paperId: string
  ): Promise<{ success: boolean; paperViewId?: string }> {
    const response = await apiClient.post<{
      status: number;
      method: string;
      instance: string;
      details: string;
      data: {
        success: boolean;
        paperViewId?: string;
      };
      errors: Record<string, unknown>;
      timestamp: string;
    }>(`/papers/${encodeURIComponent(paperId)}/view`);

    return response.data || { success: false };
  },
};
