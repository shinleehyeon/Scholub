import { Typography } from "@/shared/ui";

interface NotificationItemProps {
  imageUrl: string;
  message: string;
  timestamp: string;
}

export default function NotificationItem({
  imageUrl,
  message,
  timestamp,
}: NotificationItemProps) {
  return (
    <div
      style={{
        display: "flex",
        padding: "var(--spacing-10) var(--spacing-16)",
        justifyContent: "space-between",
        alignItems: "flex-start",
        alignSelf: "stretch",
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
        <Typography.Caption color="default">{message}</Typography.Caption>
        <Typography.Caption color="subtle">{timestamp}</Typography.Caption>
      </div>
    </div>
  );
}
