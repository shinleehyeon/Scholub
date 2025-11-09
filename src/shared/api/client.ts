const API_BASE_URL = import.meta.env.DEV
  ? "/api"
  : "https://scholub-api.alpa.dev/api";

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: HeadersInit = {};

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    // 인증 토큰 자동 추가
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorData: any = {};

      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          errorData = await response.json();
        } else {
          const text = await response.text().catch(() => "");
          if (text) {
            try {
              errorData = JSON.parse(text);
            } catch {
              errorData = { details: text || response.statusText };
            }
          }
        }
      } catch (err) {
        console.error("Failed to parse error response:", err);
        if (response.status === 0 || response.type === "opaque") {
          throw new Error(
            "CORS 에러가 발생했습니다. 서버에서 CORS 설정을 확인해주세요."
          );
        }
        errorData = {
          details: `API Error: ${response.status} ${response.statusText}`,
        };
      }

      if (
        errorData.errors &&
        Array.isArray(errorData.errors) &&
        errorData.errors.length > 0
      ) {
        const errorMessages = errorData.errors
          .map((err: { field?: string; message?: string }) => {
            if (err.field && err.message) {
              return `${err.field}: ${err.message}`;
            }
            return err.message || "Unknown error";
          })
          .join(", ");
        throw new Error(errorMessages);
      }

      throw new Error(
        errorData.details ||
          `API Error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    let body: BodyInit | undefined;

    if (data instanceof FormData) {
      body = data;
    } else if (data) {
      body = JSON.stringify(data);
    }

    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
