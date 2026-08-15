interface NotificationBadgeProps {
  size?: number;
}

const NotificationBadge = ({ size = 10 }: NotificationBadgeProps) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "-2px",
        right: "2px",
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 10 10"
        fill="none"
      >
        <circle cx="5" cy="5" r="5" fill="var(--color-surface-brand-default)" />
      </svg>
    </div>
  );
};

export default NotificationBadge;
