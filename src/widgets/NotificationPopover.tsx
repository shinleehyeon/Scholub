import NotificationItem from "./NotificationItem";
import XIcon from "@/shared/ui/icons/X";

export interface NotificationItemData {
  id: string;
  imageUrl: string;
  message: string;
  timestamp: string;
}

interface NotificationPopoverProps {
  notifications?: NotificationItemData[];
  isOpen: boolean;
  onClose: () => void;
}

const defaultNotifications: NotificationItemData[] = [
  {
    id: "1",
    imageUrl: "https://picsum.photos/50/50?random=1",
    message:
      '최근 관심을 가진 "DeepSeek-OCR Context..."의 반박 논문이 발행되었습니다.',
    timestamp: "1시간 전",
  },
  {
    id: "2",
    imageUrl: "https://picsum.photos/50/50?random=2",
    message:
      '최근 관심을 가진 "DeepSeek-OCR Context..."의 반박 논문이 발행되었습니다.',
    timestamp: "2시간 전",
  },
  {
    id: "3",
    imageUrl: "https://picsum.photos/50/50?random=3",
    message:
      '최근 관심을 가진 "DeepSeek-OCR Context..."의 반박 논문이 발행되었습니다.',
    timestamp: "3시간 전",
  },
  {
    id: "4",
    imageUrl: "https://picsum.photos/50/50?random=4",
    message:
      '최근 관심을 가진 "DeepSeek-OCR Context..."의 반박 논문이 발행되었습니다.',
    timestamp: "4시간 전",
  },
];

export default function NotificationPopover({
  notifications = defaultNotifications,
  isOpen,
  onClose,
}: NotificationPopoverProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        right: "80px",
        top: "71px",
        display: "flex",
        width: "320px",
        padding: "var(--spacing-14) 0",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "10px",
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
        <h3
          style={{
            color: "var(--color-text-default)",
            fontFamily: "Pretendard",
            fontSize: "17px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "24px",
            margin: 0,
          }}
        >
          Scholub 알림
        </h3>
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
          gap: "10px",
        }}
      >
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            imageUrl={notification.imageUrl}
            message={notification.message}
            timestamp={notification.timestamp}
          />
        ))}
      </div>
    </div>
  );
}
