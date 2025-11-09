import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/shared/ui";
import SearchIcon from "@/shared/ui/icons/Search";
import Bell from "@/shared/ui/icons/Bell";
import NotificationBadge from "@/shared/ui/icons/NotificationBadge";
import { NotificationPopover } from "@/widgets/notification-popover";
import { UserMenuPopover } from "@/widgets/user-menu-popover";
import { Typography } from "@/shared/ui";
import { authApi } from "@/shared/api/auth";
import { authStorage } from "@/shared/lib/auth";
import { profileApi, type UserProfile } from "@/shared/api/profile";
import { notificationsApi } from "@/shared/api/notifications";

interface HeaderProps {
  status?: "logined" | "default";
  onStatusChange?: (status: "logined" | "default") => void;
}

export default function Header({
  status: initialStatus,
  onStatusChange,
}: HeaderProps) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"logined" | "default">(() => {
    if (initialStatus !== undefined) {
      return initialStatus;
    }
    return authStorage.isAuthenticated() ? "logined" : "default";
  });
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const checkAuthStatus = () => {
      const isAuthenticated = authStorage.isAuthenticated();
      const newStatus = isAuthenticated ? "logined" : "default";

      if (status !== newStatus) {
        setStatus(newStatus);
        onStatusChange?.(newStatus);
      }
    };

    checkAuthStatus();

    const interval = setInterval(checkAuthStatus, 1000);

    return () => clearInterval(interval);
  }, [status, onStatusChange]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (status === "logined" && authStorage.isAuthenticated()) {
        try {
          const profile = await profileApi.getProfile();
          setUserProfile(profile);
        } catch (err) {
          console.error("Failed to fetch user profile:", err);
          authStorage.clearTokens();
          setStatus("default");
          onStatusChange?.("default");
        }
      } else {
        setUserProfile(null);
      }
    };

    fetchUserProfile();
  }, [status, onStatusChange]);

  // 읽지 않은 알림 수만 가져오기
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (status === "logined" && authStorage.isAuthenticated()) {
        try {
          const count = await notificationsApi.getUnreadCount();
          setUnreadCount(count);
        } catch (err) {
          console.error("Failed to fetch unread count:", err);
        }
      } else {
        setUnreadCount(0);
      }
    };

    fetchUnreadCount();

    // 주기적으로 읽지 않은 알림 수 업데이트 (30초마다)
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [status]);

  const handleLogout = async () => {
    try {
      const refreshToken = authStorage.getRefreshToken();

      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      authStorage.clearTokens();

      setStatus("default");
      onStatusChange?.("default");

      navigate("/login");
    }
  };
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialStatus !== undefined) {
      setStatus(initialStatus);
    }
  }, [initialStatus]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node) &&
        isNotificationOpen
      ) {
        setIsNotificationOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node) &&
        isUserMenuOpen
      ) {
        setIsUserMenuOpen(false);
      }
    };

    if (isNotificationOpen || isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen, isUserMenuOpen]);

  return (
    <header
      style={{
        position: "relative",
        display: "flex",
        height: "71px",
        padding: "0 var(--spacing-24)",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "stretch",
        borderBottom: "1px solid var(--color-border-default)",
        background: "var(--color-surface-default)",
      }}
    >
      <Link to="/" style={{ flexShrink: 0 }}>
        <Logo />
      </Link>

      <div
        style={{
          borderRadius: "var(--radius-9999)",
          border: "2px solid var(--color-brand-default)",
          background: "var(--color-surface-default)",
          display: "flex",
          width: "400px",
          padding: "var(--spacing-12) var(--spacing-14)",
          alignItems: "center",
          gap: "var(--spacing-6)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            width: "var(--spacing-16)",
            height: "var(--spacing-16)",
            alignItems: "center",
            gap: "var(--spacing-10)",
            aspectRatio: "1/1",
            color: "var(--color-text-default)",
          }}
        >
          <SearchIcon size={16} />
        </div>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: "Pretendard",
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: "var(--spacing-20)",
            color: "var(--color-text-default)",
          }}
          className="placeholder:text-[var(--color-text-subtle)] placeholder:font-[Pretendard] placeholder:text-[14px] placeholder:font-medium placeholder:leading-[var(--spacing-20)]"
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-20)",
        }}
      >
        {status === "logined" ? (
          <>
            <div ref={notificationRef} style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => {
                  setIsNotificationOpen(!isNotificationOpen);
                  setIsUserMenuOpen(false);
                }}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <Bell size={24} />
                {unreadCount > 0 && <NotificationBadge size={10} />}
              </button>
              <NotificationPopover
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
              />
            </div>

            <div ref={userMenuRef} style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => {
                  setIsUserMenuOpen(!isUserMenuOpen);
                  setIsNotificationOpen(false);
                }}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "var(--color-surface-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  cursor: "pointer",
                  border: "none",
                  padding: 0,
                }}
              >
                <img
                  src={
                    userProfile?.profileImageUrl ||
                    "https://picsum.photos/32/32?random=avatar"
                  }
                  alt="User avatar"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </button>
              <UserMenuPopover
                isOpen={isUserMenuOpen}
                onClose={() => setIsUserMenuOpen(false)}
                onLogout={handleLogout}
                userName={userProfile?.name}
                userEmail={userProfile?.email}
                avatarUrl={userProfile?.profileImageUrl}
              />
            </div>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                textDecoration: "none",
              }}
            >
              <Typography.Subtext color="subtle">로그인</Typography.Subtext>
            </Link>
            <Link
              to="/register"
              style={{
                textDecoration: "none",
              }}
            >
              <Typography.Subtext color="subtle">회원가입</Typography.Subtext>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
