import { apiClient } from "./client";

export type NotificationType =
  | "RECOMMENDED_PAPER"
  | "SIMILAR_PAPER"
  | "OPPOSING_PAPER"
  | "DISCUSSION_ACTIVITY"
  | "SYSTEM";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
  relatedPaperId: string | null;
  relatedUserId: string | null;
  userId: string;
}

export interface NotificationsResponse {
  status: number;
  method: string;
  instance: string;
  details: string;
  data: {
    notifications: Notification[];
    page: number;
    limit: number;
    total: number;
  };
  page?: number;
  total?: number;
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

    // API 응답 구조에 맞게 notifications 배열을 items로 변환
    const notifications = response.data?.notifications || [];
    const total = response.data?.total || response.total || 0;
    const page = response.data?.page || response.page || 1;
    const limit = response.data?.limit || 20;

    return {
      items: notifications,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
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
