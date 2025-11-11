import { authApi } from "./auth";
import { authStorage } from "@/shared/lib/auth";

const API_BASE_URL = import.meta.env.DEV
  ? "/api"
  : "https://scholub-api.alpa.dev/api/";

export class ApiClient {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshPromise: Promise<void> | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async refreshToken(): Promise<void> {
    // 이미 리프레시 중이면 기존 Promise 반환
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
        // 리프레시 실패 시 토큰 삭제
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

    // 토큰이 곧 만료되거나 이미 만료되었으면 리프레시 시도
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
        // 리프레시 후 새로운 토큰으로 헤더 업데이트
        const newAccessToken = authStorage.getAccessToken();
        if (newAccessToken) {
          headers["Authorization"] = `Bearer ${newAccessToken}`;
        }
      } catch (error) {
        // 리프레시 실패 시 토큰 삭제
        console.error("토큰 리프레시 실패:", error);
        authStorage.clearTokens();
        // 인증이 필요한 요청인 경우 에러 발생
        if (accessToken) {
          throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
        }
      }
    }

    // 리프레시 후 헤더가 설정되지 않았으면 기본 토큰 사용
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
      // 401 또는 403 에러이고 리프레시 토큰이 있고, 아직 재시도하지 않은 경우
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
          // 리프레시 토큰으로 액세스 토큰 갱신
          await this.refreshToken();
          // 원래 요청 재시도 (재시도 카운트 증가)
          return this.request<T>(endpoint, options, retryCount + 1);
        } catch {
          // 리프레시 실패 시 에러 처리
          authStorage.clearTokens();
          let errorData: any = {};
          try {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              errorData = await response.json();
            }
          } catch {
            // ignore
          }
          throw new Error(
            errorData.details || "인증이 만료되었습니다. 다시 로그인해주세요."
          );
        }
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
        // 리프레시 실패 시 토큰 삭제는 refreshToken 내부에서 처리됨
      }
    }
  }
}

export const apiClient = new ApiClient();
