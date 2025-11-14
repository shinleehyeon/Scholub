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

export interface DiscussionMessage {
  id: string;
  discussionId: string;
  userId: string;
  content: string;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionMessagesResponse {
  messages: DiscussionMessage[];
  total?: number;
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
    id: string,
    type: "LIKE" | "UNLIKE"
  ): Promise<{ isReacted: boolean; likeCount?: number }> {
    const response = await apiClient.post<{
      status: number;
      data: {
        reactionType: string;
        isReacted: boolean;
        likeCount?: number;
      };
    }>(`/papers/${id}/reactions?paperId=${encodeURIComponent(id)}`, {
      type,
    });

    console.log("toggleReaction API 응답:", response);

    return {
      isReacted: response.data?.isReacted ?? false,
      likeCount: response.data?.likeCount,
    };
  },

  async getReactionStats(
    id: string
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
    }>(`/papers/${encodeURIComponent(id)}/reactions`);

    return response.data || { likeCount: 0, unlikeCount: 0 };
  },

  async startChatSession(id: string): Promise<{ activityId: string }> {
    const response = await apiClient.post<{
      status: number;
      data: {
        activityId: string;
        message: string;
      };
    }>("/papers/chat/start", {
      paperId: id,
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

  async getPaperDetail(id: string): Promise<Paper> {
    const response = await apiClient.get<PaperDetailResponse>(
      `/papers/${encodeURIComponent(id)}`
    );
    return response.data;
  },

  async getOpposingPapers(
    paperId: string,
    limit: number = 20
  ): Promise<Paper[]> {
    const response = await apiClient.get<LatestPapersResponse>(
      `/papers/${encodeURIComponent(paperId)}/opposing?limit=${limit}`
    );
    return Array.isArray(response.data) ? response.data : [];
  },

  async getSimilarPapers(
    paperId: string,
    limit: number = 20
  ): Promise<Paper[]> {
    const response = await apiClient.get<LatestPapersResponse>(
      `/papers/${encodeURIComponent(paperId)}/similar?limit=${limit}`
    );
    return Array.isArray(response.data) ? response.data : [];
  },

  async recordPaperView(
    id: string
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
    }>(`/papers/${encodeURIComponent(id)}/view`);

    return response.data || { success: false };
  },

  async createDiscussion(
    id: string,
    title: string,
    content: string
  ): Promise<{
    id: string;
    paperId: string;
    title: string;
    content: string;
    creatorId: string;
    participantCount: number;
    messageCount: number;
    createdAt: string;
    updatedAt: string;
  }> {
    const response = await apiClient.post<{
      status: number;
      method: string;
      instance: string;
      details: string;
      data: {
        id: string;
        paperId: string;
        title: string;
        content: string;
        creatorId: string;
        participantCount: number;
        messageCount: number;
        createdAt: string;
        updatedAt: string;
      };
      errors: Record<string, unknown>;
      timestamp: string;
    }>(`/papers/${encodeURIComponent(id)}/discussions`, {
      title,
      content,
    });

    return response.data;
  },

  async getDiscussions(
    id: string,
    page: number = 1,
    limit: number = 20
  ): Promise<
    Array<{
      id: string;
      paperId: string;
      title: string;
      content: string;
      creatorId: string;
      participantCount: number;
      messageCount: number;
      createdAt: string;
      updatedAt: string;
    }>
  > {
    const response = await apiClient.get<{
      status: number;
      method: string;
      instance: string;
      details: string;
      data: Array<{
        id: string;
        paperId: string;
        title: string;
        content: string;
        creatorId: string;
        participantCount: number;
        messageCount: number;
        createdAt: string;
        updatedAt: string;
      }>;
      errors: Record<string, unknown> | null;
      timestamp: string;
    }>(
      `/papers/${encodeURIComponent(id)}/discussions?page=${page}&limit=${limit}`
    );

    return response.data || [];
  },

  async getDiscussion(discussionId: string): Promise<{
    id: string;
    paperId: string;
    title: string;
    content: string;
    creatorId: string;
    participantCount: number;
    messageCount: number;
    createdAt: string;
    updatedAt: string;
  }> {
    const response = await apiClient.get<{
      status: number;
      method: string;
      instance: string;
      details: string;
      data: {
        id: string;
        paperId: string;
        title: string;
        content: string;
        creatorId: string;
        participantCount: number;
        messageCount: number;
        createdAt: string;
        updatedAt: string;
      };
      errors: Record<string, unknown> | null;
      timestamp: string;
    }>(`/discussions/${encodeURIComponent(discussionId)}`);

    return response.data;
  },

  async getDiscussionMessages(
    discussionId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<DiscussionMessagesResponse> {
    const response = await apiClient.get<{
      status: number;
      method: string;
      instance: string;
      details: string;
      data: Array<{
        id: string;
        discussionId: string;
        userId: string;
        content: string;
        isEdited: boolean;
        createdAt: string;
        updatedAt: string;
      }>;
      errors: Record<string, unknown> | null;
      timestamp?: string;
    }>(
      `/discussions/${encodeURIComponent(discussionId)}/messages?page=${page}&limit=${limit}`
    );

    const messages = Array.isArray(response.data.data)
      ? response.data.data
      : Array.isArray(response.data)
        ? response.data
        : [];

    return {
      messages,
      total: messages.length,
      page,
      limit,
    };
  },

  async createDiscussionMessage(
    discussionId: string,
    content: string
  ): Promise<DiscussionMessage> {
    const response = await apiClient.post<{
      status: number;
      method: string;
      instance: string;
      details: string;
      data: DiscussionMessage;
      errors: Record<string, unknown> | null;
      timestamp: string;
    }>(`/discussions/${encodeURIComponent(discussionId)}/messages`, {
      content,
    });

    return response.data.data;
  },

  async updateDiscussionMessage(
    discussionId: string,
    messageId: string,
    content: string
  ): Promise<DiscussionMessage> {
    const response = await apiClient.patch<{
      status: number;
      method: string;
      instance: string;
      details: string;
      data: DiscussionMessage | { data: DiscussionMessage };
      errors: Record<string, unknown> | null;
      timestamp: string;
    }>(
      `/discussions/${encodeURIComponent(discussionId)}/messages/${encodeURIComponent(messageId)}`,
      {
        content,
      }
    );

    // API 응답 구조에 따라 data 또는 data.data에서 메시지 추출
    if (
      response.data.data &&
      typeof response.data.data === "object" &&
      "id" in response.data.data
    ) {
      return response.data.data as DiscussionMessage;
    }
    if (
      response.data &&
      typeof response.data === "object" &&
      "id" in response.data
    ) {
      return response.data as DiscussionMessage;
    }
    throw new Error("Invalid API response structure");
  },

  async deleteDiscussionMessage(
    discussionId: string,
    messageId: string
  ): Promise<void> {
    await apiClient.delete<{
      status: number;
      method: string;
      instance: string;
      details: string;
      errors: Record<string, unknown> | null;
      timestamp: string;
    }>(
      `/discussions/${encodeURIComponent(discussionId)}/messages/${encodeURIComponent(messageId)}`
    );
  },

  async searchPapersAI(params: {
    messages: Array<{ role: string; content: string }>;
    model?: string;
    temperature?: number;
    max_tokens?: number;
  }): Promise<{
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
      index: number;
      message: {
        role: string;
        content: string;
      };
      finish_reason: string;
    }>;
    citations: Array<{
      title: string;
      url: string;
      snippet: string;
    }>;
  }> {
    // AI 채팅 API는 별도 서버(https://dicon2.kur.kr)로 요청
    // 개발 환경에서는 Vite 프록시를 통해 요청 (/api/search-papers)
    // 프로덕션에서는 직접 요청하거나 백엔드를 통해 프록시 필요
    const isDev = import.meta.env.DEV;
    const url = isDev
      ? "/api/search-papers" // Vite 프록시 사용
      : "https://dicon2.kur.kr/api/search-papers"; // 프로덕션은 직접 요청 (또는 백엔드 프록시)

    const requestBody = {
      messages: params.messages,
      model: params.model || "sonar-pro",
      temperature: params.temperature ?? 0.2,
      ...(params.max_tokens && { max_tokens: params.max_tokens }),
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `AI API 요청 실패: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  },

  async *searchPapersAIStream(params: {
    messages: Array<{
      role: string;
      content:
        | string
        | Array<{
            type: string;
            text?: string;
            file_url?: string;
          }>;
    }>;
    model?: string;
    temperature?: number;
    max_tokens?: number;
  }): AsyncGenerator<
    {
      content: string;
      citations?: Array<{ title: string; url: string; snippet: string }>;
    },
    void,
    unknown
  > {
    // AI 채팅 API는 별도 서버(https://dicon2.kur.kr)로 요청
    // 개발 환경에서는 Vite 프록시를 통해 요청 (/api/search-papers)
    const isDev = import.meta.env.DEV;
    const url = isDev
      ? "/api/search-papers" // Vite 프록시 사용
      : "https://dicon2.kur.kr/api/search-papers"; // 프로덕션은 직접 요청

    const requestBody = {
      messages: params.messages,
      model: params.model || "sonar-pro",
      temperature: params.temperature ?? 0.2,
      ...(params.max_tokens && { max_tokens: params.max_tokens }),
      stream: true, // 스트리밍 활성화
    };

    console.log("[스트리밍 API] 요청 시작:", { url, requestBody });
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log(
      "[스트리밍 API] 응답 상태:",
      response.status,
      response.statusText
    );
    console.log("[스트리밍 API] 응답 헤더:", {
      contentType: response.headers.get("content-type"),
      contentLength: response.headers.get("content-length"),
    });

    if (!response.ok) {
      const errorText = await response.text();
      // HTML 에러 페이지인 경우 간단하게 표시
      const isHtmlError = errorText.trim().startsWith("<!DOCTYPE");
      const errorMessage = isHtmlError
        ? `서버 에러 (${response.status}): ${response.statusText}`
        : errorText.substring(0, 200);

      console.error("[스트리밍 API] 오류 발생:", {
        status: response.status,
        statusText: response.statusText,
        error: errorMessage,
      });
      throw new Error(
        `AI API 요청 실패: ${response.status} ${response.statusText}`
      );
    }

    const contentType = response.headers.get("content-type") || "";
    console.log("Content-Type:", contentType);

    // Content-Type이 text/event-stream이 아니면 일반 JSON 응답으로 처리
    if (!contentType.includes("text/event-stream")) {
      console.log("일반 JSON 응답으로 처리");

      // 응답 본문을 텍스트로 먼저 읽어서 확인
      const responseText = await response.text();
      console.log("응답 텍스트 (처음 500자):", responseText.substring(0, 500));

      let data;
      try {
        data = JSON.parse(responseText);
        console.log("전체 응답 데이터:", data);
      } catch (e) {
        console.error("JSON 파싱 실패:", e);
        throw new Error("응답을 JSON으로 파싱할 수 없습니다.");
      }

      console.log("choices:", data.choices);
      console.log("choices[0]:", data.choices?.[0]);
      console.log("choices[0].message:", data.choices?.[0]?.message);

      const content = data.choices?.[0]?.message?.content || "";
      const citations = data.citations || [];

      console.log("추출된 content 길이:", content.length);
      console.log("추출된 content (처음 200자):", content.substring(0, 200));
      console.log("citations:", citations);

      // 일반 JSON 응답을 스트리밍처럼 시뮬레이션 (문자 단위로 전송)
      if (content) {
        console.log("콘텐츠 스트리밍 시작, 총 길이:", content.length);
        // 한 글자씩 yield하여 스트리밍 효과 생성
        for (let i = 0; i < content.length; i++) {
          yield {
            content: content[i],
          };
          // 자연스러운 타이핑 효과를 위한 약간의 지연
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
        console.log("콘텐츠 스트리밍 완료");
      } else {
        console.warn("content가 비어있습니다!");
      }

      // citations 반환
      if (citations.length > 0) {
        console.log("Citations 반환:", citations);
        yield {
          content: "",
          citations,
        };
      }
      return;
    }

    // SSE 스트리밍 처리
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      console.error("스트리밍 reader를 생성할 수 없습니다.");
      throw new Error("스트리밍 응답을 읽을 수 없습니다.");
    }

    let buffer = "";
    let citations:
      | Array<{ title: string; url: string; snippet: string }>
      | undefined;
    let chunkCount = 0;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log("스트리밍 완료 (done=true), 총 청크:", chunkCount);
          break;
        }

        chunkCount++;
        const decoded = decoder.decode(value, { stream: true });
        console.log(`청크 #${chunkCount} 받음:`, decoded.substring(0, 200));
        buffer += decoded;
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // 마지막 불완전한 라인은 버퍼에 보관

        for (const line of lines) {
          if (line.trim() === "") continue;
          console.log("라인 처리:", line.substring(0, 200));

          // SSE 형식: data: {...}
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              console.log("스트리밍 종료 신호 받음");
              return;
            }

            try {
              const parsed = JSON.parse(data);
              console.log("파싱된 데이터:", parsed);

              // OpenAI 스트리밍 형식 처리
              if (parsed.choices?.[0]?.delta?.content) {
                const content = parsed.choices[0].delta.content;
                console.log("콘텐츠 추출:", content);
                yield {
                  content: content,
                };
              } else {
                console.log("delta.content 없음:", parsed.choices?.[0]);
              }

              // citations가 있으면 저장
              if (parsed.citations && !citations) {
                console.log("Citations 발견:", parsed.citations);
                citations = parsed.citations;
              }
            } catch (e) {
              // JSON 파싱 실패는 무시하고 계속 진행
              console.warn("스트리밍 데이터 파싱 실패:", e, "데이터:", data);
            }
          }
          // 일반 JSON 응답일 수도 있음 (SSE 형식이 아닌 경우)
          else if (line.trim().startsWith("{")) {
            try {
              const parsed = JSON.parse(line.trim());
              console.log("일반 JSON 응답 파싱:", parsed);

              const content = parsed.choices?.[0]?.message?.content || "";
              const responseCitations = parsed.citations || [];

              if (content) {
                // 한 글자씩 yield하여 스트리밍 효과 생성
                for (let i = 0; i < content.length; i++) {
                  yield {
                    content: content[i],
                  };
                  await new Promise((resolve) => setTimeout(resolve, 10));
                }
              }

              if (responseCitations.length > 0) {
                citations = responseCitations;
              }
            } catch (e) {
              console.warn(
                "JSON 파싱 실패:",
                e,
                "라인:",
                line.substring(0, 100)
              );
            }
          } else {
            console.log("인식되지 않은 형식, 라인:", line.substring(0, 100));
          }
        }
      }

      // 마지막 citations 반환
      if (citations) {
        yield {
          content: "",
          citations,
        };
      }
    } finally {
      reader.releaseLock();
    }
  },
};
