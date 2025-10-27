import Logout from "@/shared/ui/icons/Logout";
import { Avatar } from "@/shared/ui";

interface UserProfileCardProps {
  username: string;
  subtitle: string;
  profileImage: string;
  onLogout?: () => void;
}

export default function UserProfileCard({
  username,
  subtitle,
  profileImage,
  onLogout,
}: UserProfileCardProps) {
  return (
    <div className="flex w-[286px] p-[var(--spacing-14)] px-[var(--spacing-16)] flex-col items-start gap-[10px] rounded-[var(--radius-16)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
      <div className="flex justify-between items-center self-stretch">
        <div className="flex items-center gap-[var(--spacing-12)]">
          <Avatar src={profileImage} alt={username} size={48} />

          <div className="flex flex-col items-start gap-[2px]">
            <span className="text-[var(--color-text-default)] font-[Pretendard] text-[17px] font-medium leading-[24px]">
              {username}
            </span>
            <span className="text-[var(--color-text-subtle)] font-[Pretendard] text-[14px] font-medium leading-[20px]">
              {subtitle}
            </span>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center justify-center hover:opacity-70 transition-opacity"
        >
          <Logout size={18} />
        </button>
      </div>
    </div>
  );
}
