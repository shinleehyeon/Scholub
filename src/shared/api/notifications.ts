import { apiClient } from "./client";

export interface Notification {
  id: string;
  type: "REACTION" | "COMMENT" | "REPLY";
  message: string;
  read: boolean;
  createdAt: string;
  relatedPaper?: {
    id: string;
    title: string;
  };
}

export interface NotificationsResponse {
  status: number;
  method: string;
  instance: string;
  details: string;
  data: {
    items: Notification[];
    meta?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  errors: Record<string, unknown> | null;
  timestamp: string;
}

export interface UnreadCountResponse {
  status: number;
  method: string;
  instance: string;
  details: string;
  data: {
    count: number;
  };
  errors: Record<string, unknown> | null;
  timestamp: string;
}

export const notificationsApi = {
  async getNotifications(params?: { page?: number; limit?: number }): Promise<{
    items: Notification[];
    meta?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    if (params?.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params?.limit) {
      queryParams.append("limit", params.limit.toString());
    }

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/notifications?${queryString}`
      : "/notifications";

    const response = await apiClient.get<NotificationsResponse>(endpoint);
    return {
      items: response.data?.items || [],
      meta: response.data?.meta,
    };
  },

  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<UnreadCountResponse>(
      "/notifications/unread-count"
    );
    return response.data?.count || 0;
  },

  async markAsRead(notificationId: string): Promise<void> {
    await apiClient.patch(`/notifications/${notificationId}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.patch("/notifications/read-all");
  },
};
