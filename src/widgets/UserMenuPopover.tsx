import User from "@/shared/ui/icons/User";
import Settings from "@/shared/ui/icons/Settings";
import LogoutIcon from "@/shared/ui/icons/LogoutIcon";
import { Typography } from "@/shared/ui";

interface UserMenuPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
  userName?: string;
  userEmail?: string;
  avatarUrl?: string;
}

export default function UserMenuPopover({
  isOpen,
  onClose,
  onLogout,
  userName = "iamfiro",
  userEmail = "hello@example.com",
  avatarUrl = "https://picsum.photos/33/33?random=avatar",
}: UserMenuPopoverProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        right: "0",
        top: "50px",
        display: "flex",
        width: "198px",
        padding: "var(--spacing-12) 0",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "var(--spacing-8)",
        borderRadius: "var(--radius-14)",
        border: "1px solid var(--color-border-default)",
        background: "var(--color-surface-default)",
        boxShadow: "0 4px 10px 0 rgba(0, 0, 0, 0.10)",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-8)",
          width: "100%",
          padding: "0 var(--spacing-16)",
        }}
      >
        <div
          style={{
            width: "33px",
            height: "33px",
            borderRadius: "var(--radius-9999)",
            background: `url(${avatarUrl}) lightgray 50% / cover no-repeat`,
            flexShrink: 0,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "4px",
            flex: 1,
          }}
        >
          <Typography.Subtext color="default">{userName}</Typography.Subtext>
          <Typography.Caption color="subtle">{userEmail}</Typography.Caption>
        </div>
      </div>

      <div
        style={{
          background: "var(--color-border-default)",
          width: "198px",
          height: "1px",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: "var(--spacing-8)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            display: "flex",
            width: "174px",
            padding: "var(--spacing-4) 0",
            alignItems: "center",
            gap: "8px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            margin: "0 auto",
          }}
        >
          <User size={16} />
          <Typography.Subtext color="default">내 프로필</Typography.Subtext>
        </button>

        <button
          type="button"
          onClick={onClose}
          style={{
            display: "flex",
            width: "174px",
            padding: "var(--spacing-4) 0",
            alignItems: "center",
            gap: "8px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            margin: "0 auto",
          }}
        >
          <Settings size={16} />
          <Typography.Subtext color="default">설정</Typography.Subtext>
        </button>

        <div
          style={{
            background: "var(--color-border-default)",
            width: "198px",
            height: "1px",
          }}
        />

        <button
          type="button"
          onClick={() => {
            onClose();
            onLogout?.();
          }}
          style={{
            display: "flex",
            width: "174px",
            padding: "var(--spacing-4) 0",
            alignItems: "center",
            gap: "8px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            margin: "0 auto",
          }}
        >
          <LogoutIcon size={16} />
          <Typography.Subtext style={{ color: "#FF4040" }}>
            로그아웃
          </Typography.Subtext>
        </button>
      </div>
    </div>
  );
}
