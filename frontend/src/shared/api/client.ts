import { authApi } from "./auth";
import { authStorage } from "@/shared/lib/auth";

// 프로덕션에서는 항상 상대 경로(/api)를 사용하여 Nginx 프록시를 통해 요청
// 개발 환경에서도 Vite 프록시를 통해 요청
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "/api" : "/api");

export class ApiClient {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshPromise: Promise<void> | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async refreshToken(): Promise<void> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const refreshToken = authStorage.getRefreshToken();
        if (!refreshToken) {
          throw new Error("리프레시 토큰이 없습니다.");
        }

        const response = await authApi.refresh(refreshToken);
        authStorage.setTokens(
          response.data.accessToken,
          response.data.refreshToken
        );
      } catch (error) {
        authStorage.clearTokens();
        throw error;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: HeadersInit = {};

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const accessToken = authStorage.getAccessToken();
    const refreshToken = authStorage.getRefreshToken();
    const shouldRefresh =
      refreshToken &&
      accessToken &&
      (authStorage.isAccessTokenExpiringSoon() ||
        authStorage.isAccessTokenExpired()) &&
      !endpoint.includes("/auth/refresh") &&
      !endpoint.includes("/auth/login") &&
      !endpoint.includes("/auth/register");

    if (shouldRefresh) {
      try {
        await this.refreshToken();

        const newAccessToken = authStorage.getAccessToken();
        if (newAccessToken) {
          headers["Authorization"] = `Bearer ${newAccessToken}`;
        }
      } catch (error) {
        console.error("토큰 리프레시 실패:", error);
        authStorage.clearTokens();

        if (accessToken) {
          window.location.href = "/login";
          throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
        }
      }
    }

    if (!headers["Authorization"]) {
      const currentAccessToken = authStorage.getAccessToken();
      if (currentAccessToken) {
        headers["Authorization"] = `Bearer ${currentAccessToken}`;
      }
    }

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const isAuthError = response.status === 401 || response.status === 403;
      if (
        isAuthError &&
        authStorage.getRefreshToken() &&
        retryCount === 0 &&
        !endpoint.includes("/auth/refresh") &&
        !endpoint.includes("/auth/login") &&
        !endpoint.includes("/auth/register")
      ) {
        try {
          await this.refreshToken();

          const retryResponse = await this.request<T>(
            endpoint,
            options,
            retryCount + 1
          );
          return retryResponse;
        } catch {
          authStorage.clearTokens();
          window.location.href = "/login";
          throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
        }
      }

      if (isAuthError && retryCount > 0) {
        authStorage.clearTokens();
        window.location.href = "/login";
        throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
      }

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

  async patch<T>(
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
      method: "PATCH",
      body,
    });
  }

  /**
   * 토큰이 곧 만료되면 자동으로 리프레시
   * 주기적으로 호출하여 토큰을 갱신할 수 있음
   */
  async refreshTokenIfNeeded(): Promise<void> {
    if (
      authStorage.isAccessTokenExpiringSoon() &&
      authStorage.getRefreshToken()
    ) {
      try {
        await this.refreshToken();
      } catch (error) {
        console.error("토큰 자동 리프레시 실패:", error);
      }
    }
  }
}

export const apiClient = new ApiClient();
