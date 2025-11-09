import { useState, useEffect } from "react";
import NotificationItem from "./NotificationItem";
import XIcon from "@/shared/ui/icons/X";
import { Typography } from "@/shared/ui";
import {
  notificationsApi,
  type Notification,
} from "@/shared/api/notifications";
import { useToast } from "@/shared/ui/Toast";

export interface NotificationItemData {
  id: string;
  imageUrl: string;
  message: string;
  timestamp: string;
}

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPopover({
  isOpen,
  onClose,
}: NotificationPopoverProps) {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // 타임스탬프 포맷팅 함수
  const formatTimestamp = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString("ko-KR");
  };

  // 알림 목록 가져오기
  useEffect(() => {
    const fetchNotifications = async () => {
      if (isOpen) {
        try {
          setLoading(true);
          const data = await notificationsApi.getNotifications({
            page: 1,
            limit: 20,
          });
          setNotifications(data.items);
        } catch (error) {
          console.error("알림 로드 실패:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "알림을 불러오는데 실패했습니다.";
          showToast(errorMessage, "error");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchNotifications();
  }, [isOpen, showToast]);

  // 알림 데이터를 NotificationItemData 형식으로 변환
  const notificationItems: NotificationItemData[] = notifications.map(
    (notif) => ({
      id: notif.id,
      imageUrl: notif.relatedPaper?.id
        ? `/api/assets/${notif.relatedPaper.id}`
        : "https://picsum.photos/50/50?random=notification",
      message: notif.message,
      timestamp: formatTimestamp(notif.createdAt),
    })
  );

  if (!isOpen) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        right: "0",
        top: "45px",
        display: "flex",
        width: "320px",
        padding: "var(--spacing-14) 0",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "var(--spacing-10)",
        background: "var(--color-surface-default)",
        borderRadius: "var(--radius-16)",
        border: "1px solid var(--color-border-default)",
        boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: "0 var(--spacing-16)",
        }}
      >
        <Typography.Body color="default" as="h3">
          Scholub 알림
        </Typography.Body>
        <button
          type="button"
          onClick={onClose}
          style={{
            display: "flex",
            width: "30px",
            height: "30px",
            padding: "5px",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "var(--radius-10)",
            border: "1px solid var(--color-border-default)",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          <XIcon size={20} />
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: "var(--spacing-10)",
        }}
      >
        {loading ? (
          <div
            style={{
              padding: "var(--spacing-16)",
              textAlign: "center",
              color: "var(--color-text-subtle)",
            }}
          >
            로딩 중...
          </div>
        ) : notificationItems.length > 0 ? (
          notificationItems.map((notification) => (
            <NotificationItem
              key={notification.id}
              imageUrl={notification.imageUrl}
              message={notification.message}
              timestamp={notification.timestamp}
            />
          ))
        ) : (
          <div
            style={{
              padding: "var(--spacing-16)",
              textAlign: "center",
              color: "var(--color-text-subtle)",
            }}
          >
            알림이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
