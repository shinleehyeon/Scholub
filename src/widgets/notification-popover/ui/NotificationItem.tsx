import { Typography } from "@/shared/ui";
import { useNavigate } from "react-router-dom";
import { notificationsApi } from "@/shared/api/notifications";

interface NotificationItemProps {
  id: string;
  imageUrl: string;
  message: string;
  timestamp: string;
  isRead?: boolean;
  relatedPaperId?: string | null;
  relatedDiscussionId?: string | null;
  onNavigate?: () => void;
  onMarkAsRead?: (notificationId: string) => void;
}

export default function NotificationItem({
  id,
  imageUrl,
  message,
  timestamp,
  isRead = false,
  relatedPaperId,
  relatedDiscussionId,
  onNavigate,
  onMarkAsRead,
}: NotificationItemProps) {
  const navigate = useNavigate();

  // 컴포넌트가 렌더링될 때 props 확인
  console.log("NotificationItem 렌더링:", {
    message,
    relatedPaperId,
    relatedDiscussionId,
    hasBoth: !!(relatedDiscussionId && relatedPaperId),
  });

  const handleClick = async () => {
    console.log("알림 클릭:", {
      id,
      relatedPaperId,
      relatedDiscussionId,
      hasBoth: !!(relatedDiscussionId && relatedPaperId),
    });

    // 읽지 않은 알림이면 읽음 처리
    if (!isRead) {
      try {
        await notificationsApi.markAsRead(id);
        onMarkAsRead?.(id);
      } catch (error) {
        console.error("알림 읽음 처리 실패:", error);
      }
    }

    const validDiscussionId =
      relatedDiscussionId &&
      relatedDiscussionId !== "string" &&
      relatedDiscussionId.trim() !== "";

    if (validDiscussionId && relatedPaperId) {
      const encodedDiscussionId = encodeURIComponent(relatedDiscussionId);
      const url = `/papers/${relatedPaperId}?discussion=${encodedDiscussionId}`;
      console.log("Discussion 알림 이동:", {
        url,
        encodedUrl: url,
        relatedPaperId,
        relatedDiscussionId,
        encodedDiscussionId,
        validDiscussionId,
        currentUrl: window.location.href,
      });
      onNavigate?.();
      // navigate를 명시적으로 호출하고 URL 확인
      console.log("navigate 호출 전:", window.location.href);
      navigate(url, { replace: false });
      console.log("navigate 호출 직후:", window.location.href);
      setTimeout(() => {
        console.log("navigate 완료 후 URL:", window.location.href);
        console.log(
          "현재 searchParams:",
          new URLSearchParams(window.location.search).toString()
        );
      }, 100);
      return;
    }

    // 일반 논문 알림인 경우
    if (relatedPaperId) {
      console.log("일반 논문 알림 이동:", `/papers/${relatedPaperId}`);
      onNavigate?.();
      navigate(`/papers/${relatedPaperId}`, { replace: false });
      return;
    }

    // relatedDiscussionId만 있는 경우 (일반적이지 않지만 처리)
    if (relatedDiscussionId) {
      // discussion 정보를 가져와서 paperId 확인 후 이동
      // 이 경우는 백엔드에서 relatedPaperId도 함께 제공해야 함
      console.warn(
        "Discussion ID는 있지만 Paper ID가 없습니다. 백엔드에서 relatedPaperId도 함께 제공해야 합니다."
      );
    }
  };

  const canNavigate = !!(relatedPaperId || relatedDiscussionId);

  const handleDivClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("div 클릭 이벤트 발생:", {
      canNavigate,
      relatedPaperId,
      relatedDiscussionId,
    });
    if (canNavigate) {
      handleClick();
    }
  };

  return (
    <div
      onClick={handleDivClick}
      style={{
        display: "flex",
        padding: "var(--spacing-10) var(--spacing-16)",
        justifyContent: "space-between",
        alignItems: "flex-start",
        alignSelf: "stretch",
        background: isRead ? "#F9F9F9" : "transparent",
        borderRadius: isRead ? "8px" : "0",
        opacity: isRead ? 0.5 : 1,
        cursor: canNavigate ? "pointer" : "default",
        transition: canNavigate ? "background-color 0.2s ease" : "none",
      }}
      onMouseEnter={(e) => {
        if (canNavigate) {
          e.currentTarget.style.backgroundColor = "var(--color-surface-subtle)";
        }
      }}
      onMouseLeave={(e) => {
        if (canNavigate) {
          e.currentTarget.style.backgroundColor = isRead
            ? "#F9F9F9"
            : "transparent";
        }
      }}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "var(--radius-8)",
          background: `url(${imageUrl}) lightgray 50% / cover no-repeat`,
          flexShrink: 0,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          width: "225px",
        }}
      >
        <Typography.Caption
          color={isRead ? "subtle" : "default"}
          style={{
            color: isRead ? "#7D7D7D" : undefined,
            fontFamily: "Pretendard",
            fontSize: "12px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "16px",
          }}
        >
          {message}
        </Typography.Caption>
        <Typography.Caption
          color="subtle"
          style={{
            color: "#7D7D7D",
            fontFamily: "Pretendard",
            fontSize: "12px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "16px",
          }}
        >
          {timestamp}
        </Typography.Caption>
      </div>
    </div>
  );
}
