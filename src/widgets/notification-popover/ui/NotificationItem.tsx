import { Typography } from "@/shared/ui";
import { useNavigate } from "react-router-dom";

interface NotificationItemProps {
  imageUrl: string;
  message: string;
  timestamp: string;
  isRead?: boolean;
  relatedPaperId?: string | null;
}

export default function NotificationItem({
  imageUrl,
  message,
  timestamp,
  isRead = false,
  relatedPaperId,
}: NotificationItemProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (relatedPaperId) {
      navigate(`/papers/${relatedPaperId}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        display: "flex",
        padding: "var(--spacing-10) var(--spacing-16)",
        justifyContent: "space-between",
        alignItems: "flex-start",
        alignSelf: "stretch",
        background: isRead ? "#F9F9F9" : "transparent",
        borderRadius: isRead ? "8px" : "0",
        opacity: isRead ? 0.5 : 1,
        cursor: relatedPaperId ? "pointer" : "default",
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
