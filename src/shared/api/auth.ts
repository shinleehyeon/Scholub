import { apiClient } from "./client";

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  profilePicture?: File;
}

export interface RegisterResponse {
  status: number;
  method: string;
  instance: string;
  details: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
  errors: Record<string, unknown>;
  timestamp: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: number;
  method: string;
  instance: string;
  details: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
  errors: Record<string, unknown> | null;
  timestamp: string;
}

export interface ApiError {
  status: number;
  method: string;
  instance: string;
  details: string;
  data: unknown;
  errors: Array<{
    field: string;
    message: string;
  }>;
  timestamp: string;
}

export interface LogoutResponse {
  status: number;
  method: string;
  instance: string;
  details: string;
  data: unknown;
  errors: Record<string, unknown> | null;
  timestamp: string;
}

export const authApi = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>("/auth/login", {
      email: data.email,
      password: data.password,
    });
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("name", data.name);

    if (data.profilePicture) {
      formData.append("profilePicture", data.profilePicture);
      console.log("Profile picture added to FormData:", {
        name: data.profilePicture.name,
        size: data.profilePicture.size,
        type: data.profilePicture.type,
      });
    } else {
      console.log("No profile picture provided");
    }

    console.log("Register FormData contents:");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(
          `  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`
        );
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }

    return apiClient.post<RegisterResponse>("/auth/register", formData);
  },

  async logout(refreshToken: string): Promise<LogoutResponse> {
    return apiClient.post<LogoutResponse>("/auth/logout", {
      refreshToken,
    });
  },
};
