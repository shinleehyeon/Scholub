import { useState, useEffect, useRef } from "react";
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
  isRead: boolean;
  relatedPaperId?: string | null;
  relatedDiscussionId?: string | null;
}

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadCountChange?: (count: number) => void;
}

const ITEMS_PER_PAGE = 10;

export default function NotificationPopover({
  isOpen,
  onClose,
  onUnreadCountChange,
}: NotificationPopoverProps) {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const fetchNotifications = async () => {
      if (isOpen) {
        try {
          setLoading(true);
          setCurrentPage(1);
          const data = await notificationsApi.getNotifications({
            page: 1,
            limit: ITEMS_PER_PAGE,
          });
          setNotifications(data.items);
          if (data.meta) {
            setTotalPages(data.meta.totalPages);
            setHasMore(data.meta.page < data.meta.totalPages);
          } else {
            setTotalPages(1);
            setHasMore(false);
          }
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
      } else {
        // 닫을 때 상태 초기화
        setNotifications([]);
        setCurrentPage(1);
        setHasMore(false);
        setTotalPages(1);
      }
    };

    fetchNotifications();
  }, [isOpen, showToast]);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore || currentPage >= totalPages) return;

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const data = await notificationsApi.getNotifications({
        page: nextPage,
        limit: ITEMS_PER_PAGE,
      });
      setNotifications((prev) => [...prev, ...data.items]);
      setCurrentPage(nextPage);
      if (data.meta) {
        setTotalPages(data.meta.totalPages);
        setHasMore(data.meta.page < data.meta.totalPages);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("알림 추가 로드 실패:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알림을 불러오는데 실패했습니다.";
      showToast(errorMessage, "error");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    // 낙관적 업데이트: 즉시 UI 업데이트
    setNotifications((prev) => {
      const updated = prev.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      );

      // 읽지 않은 알림 개수 업데이트
      if (onUnreadCountChange) {
        const unreadCount = updated.filter((n) => !n.isRead).length;
        onUnreadCountChange(unreadCount);
      }

      return updated;
    });
  };

  const handleMarkAllAsRead = async () => {
    // 낙관적 업데이트: 즉시 UI 업데이트
    const previousNotifications = [...notifications]; // 이전 상태 저장
    const previousUnreadCount = notifications.filter((n) => !n.isRead).length;

    const updatedNotifications = notifications.map((notif) => ({
      ...notif,
      isRead: true,
    }));
    setNotifications(updatedNotifications);

    // Header의 주황 점도 즉시 제거
    if (onUnreadCountChange) {
      onUnreadCountChange(0);
    }

    try {
      await notificationsApi.markAllAsRead();
      showToast("모든 알림이 읽음으로 표시되었습니다.", "success");
    } catch (error) {
      console.error("모두 읽기 실패:", error);

      // 실패 시 롤백: 이전 상태로 복원
      setNotifications(previousNotifications);

      // Header의 주황 점도 복원
      if (onUnreadCountChange) {
        onUnreadCountChange(previousUnreadCount);
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : "알림을 읽음으로 표시하는데 실패했습니다.";
      showToast(errorMessage, "error");
    }
  };

  const notificationItems: NotificationItemData[] = notifications.map(
    (notif) => {
      // "string"이라는 값은 무시 (백엔드에서 실제 ID 대신 타입 예시가 올 수 있음)
      const validDiscussionId =
        notif.relatedDiscussionId &&
        notif.relatedDiscussionId !== "string" &&
        notif.relatedDiscussionId.trim() !== ""
          ? notif.relatedDiscussionId
          : null;

      const item = {
        id: notif.id,
        imageUrl:
          notif.paperThumbnailUrl ||
          "https://via.placeholder.com/50x50/CCCCCC/666666?text=N",
        message: notif.message,
        timestamp: formatTimestamp(notif.createdAt),
        isRead: notif.isRead,
        relatedPaperId: notif.relatedPaperId,
        relatedDiscussionId: validDiscussionId,
      };
      console.log("알림 아이템 생성:", {
        id: item.id,
        message: item.message,
        relatedPaperId: item.relatedPaperId,
        originalRelatedDiscussionId: notif.relatedDiscussionId,
        relatedDiscussionId: item.relatedDiscussionId,
        notificationType: notif.type,
      });
      return item;
    }
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
        maxHeight: "600px",
        flexDirection: "column",
        background: "var(--color-surface-default)",
        borderRadius: "var(--radius-16)",
        border: "1px solid var(--color-border-default)",
        boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
        zIndex: 10001,
        overflow: "hidden",
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: "var(--spacing-14) var(--spacing-16)",
          borderBottom: "1px solid var(--color-border-default)",
          flexShrink: 0,
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

      {/* 읽은 것으로 표시 버튼 */}
      {notificationItems.length > 0 && (
        <div
          style={{
            padding: "var(--spacing-10) var(--spacing-16)",
            width: "100%",
            borderBottom: "1px solid var(--color-border-default)",
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            style={{
              width: "100%",
              padding: "var(--spacing-10) var(--spacing-16)",
              borderRadius: "var(--radius-8)",
              background: "var(--color-brand-default)",
              color: "var(--color-text-white)",
              border: "none",
              cursor: "pointer",
              fontFamily: "Pretendard",
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: "20px",
            }}
          >
            모두 읽음 처리
          </button>
        </div>
      )}

      {/* 스크롤 가능한 알림 리스트 */}
      <div
        ref={scrollContainerRef}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          flex: 1,
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
          <>
            {notificationItems.map((notification) => (
              <NotificationItem
                key={notification.id}
                id={notification.id}
                imageUrl={notification.imageUrl}
                message={notification.message}
                timestamp={notification.timestamp}
                isRead={notification.isRead}
                relatedPaperId={notification.relatedPaperId}
                relatedDiscussionId={notification.relatedDiscussionId}
                onNavigate={onClose}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
            {hasMore && (
              <div
                style={{
                  padding: "var(--spacing-16)",
                  display: "flex",
                  justifyContent: "center",
                  borderTop: "1px solid var(--color-border-default)",
                }}
              >
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  style={{
                    padding: "var(--spacing-10) var(--spacing-20)",
                    borderRadius: "var(--radius-8)",
                    background: loadingMore
                      ? "var(--color-surface-subtle)"
                      : "var(--color-surface-default)",
                    color: loadingMore
                      ? "var(--color-text-subtle)"
                      : "var(--color-text-default)",
                    border: "1px solid var(--color-border-default)",
                    cursor: loadingMore ? "not-allowed" : "pointer",
                    fontFamily: "Pretendard",
                    fontSize: "14px",
                    fontWeight: 500,
                    lineHeight: "20px",
                    transition: "all 0.2s ease",
                  }}
                >
                  {loadingMore ? "로딩 중..." : "더보기"}
                </button>
              </div>
            )}
          </>
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
