/**
 * 인증 토큰 관리 유틸리티 함수
 */

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

/**
 * JWT 토큰 디코딩 (만료 시간 확인용)
 */
function decodeJWT(token: string): { exp?: number } | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * 토큰이 만료되었는지 확인
 */
function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  // exp는 초 단위이므로 밀리초로 변환
  const expirationTime = decoded.exp * 1000;
  const now = Date.now();

  // 만료 시간이 현재 시간보다 이전이면 만료됨
  return expirationTime < now;
}

/**
 * 토큰이 곧 만료될지 확인 (5분 이내)
 */
function isTokenExpiringSoon(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  // exp는 초 단위이므로 밀리초로 변환
  const expirationTime = decoded.exp * 1000;
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000; // 5분

  // 만료 시간이 현재 시간 + 5분보다 이전이면 곧 만료됨
  return expirationTime < now + fiveMinutes;
}

export const authStorage = {
  /**
   * Access Token 저장
   */
  setAccessToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  /**
   * Refresh Token 저장
   */
  setRefreshToken(token: string): void {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  /**
   * Access Token 조회
   */
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  /**
   * Refresh Token 조회
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * 모든 토큰 저장
   */
  setTokens(accessToken: string, refreshToken: string): void {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  },

  /**
   * 모든 토큰 삭제 (로그아웃)
   */
  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  /**
   * 로그인 상태 확인
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    // 토큰이 만료되었으면 인증되지 않은 것으로 처리
    if (isTokenExpired(token)) {
      return false;
    }

    return true;
  },

  /**
   * Access Token이 만료되었는지 확인
   */
  isAccessTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;
    return isTokenExpired(token);
  },

  /**
   * Access Token이 곧 만료될지 확인 (5분 이내)
   */
  isAccessTokenExpiringSoon(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;
    return isTokenExpiringSoon(token);
  },
};
