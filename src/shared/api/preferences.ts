import { apiClient } from "./client";

export interface Preferences {
  interestedCategories?: string[];
  excludedCategories?: string[];
  minYear?: number;
  enableNotifications?: boolean;
}

export interface UpdatePreferencesRequest {
  interestedCategories?: string[];
  excludedCategories?: string[];
  minYear?: number;
  enableNotifications?: boolean;
}

export interface PreferencesResponse {
  status: number;
  method: string;
  instance: string;
  details: string;
  data: Preferences;
  errors: Record<string, unknown> | null;
  timestamp: string;
}

export const preferencesApi = {
  async getPreferences(): Promise<Preferences> {
    const response = await apiClient.get<PreferencesResponse>("/preferences");
    return response.data;
  },

  async updatePreferences(
    preferences: UpdatePreferencesRequest
  ): Promise<Preferences> {
    const response = await apiClient.patch<PreferencesResponse>(
      "/preferences",
      preferences
    );
    return response.data;
  },
};
