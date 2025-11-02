import Heart from "@/shared/ui/icons/Heart";
import Message from "@/shared/ui/icons/Message";
import Share from "@/shared/ui/icons/Share";

interface PaperCardProps {
  imageUrl: string;
  title: string;
  description: string;
  onHeartClick?: () => void;
  onMessageClick?: () => void;
  onShareClick?: () => void;
}

export default function PaperCard({
  imageUrl,
  title,
  description,
  onHeartClick,
  onMessageClick,
  onShareClick,
}: PaperCardProps) {
  return (
    <div className="flex items-start gap-[var(--spacing-24)]">
      <div className="flex flex-col items-start gap-[var(--spacing-12)]">
        <h3 className="w-[469px] text-[var(--color-text-default)] font-[Pretendard] text-[18px] font-semibold leading-[26px]">
          {title}
        </h3>

        <p
          className="w-[399px] overflow-hidden text-ellipsis text-[var(--color-text-subtle)] font-[Pretendard] text-[14px] font-medium leading-[20px]"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
          }}
        >
          {description}
        </p>

        <div className="flex items-center gap-[var(--spacing-12)]">
          <button
            onClick={onHeartClick}
            className="flex items-center gap-[var(--spacing-4)] text-[var(--color-text-default)] font-[Pretendard] text-[14px] font-medium leading-[20px] hover:opacity-70 transition-opacity"
          >
            <Heart size={14} />
            <span>32</span>
          </button>

          <button
            onClick={onMessageClick}
            className="flex items-center gap-[var(--spacing-4)] text-[var(--color-text-default)] font-[Pretendard] text-[14px] font-medium leading-[20px] hover:opacity-70 transition-opacity"
          >
            <Message size={14} />
            <span>32</span>
          </button>

          <button
            onClick={onShareClick}
            className="flex items-center gap-[var(--spacing-4)] text-[var(--color-text-default)] font-[Pretendard] text-[14px] font-medium leading-[20px] hover:opacity-70 transition-opacity"
          >
            <Share size={14} />
            <span>32</span>
          </button>
        </div>
      </div>

      <div
        className="w-[228px] h-[128px] rounded-[var(--radius-10)] bg-cover bg-center bg-no-repeat flex-shrink-0"
        style={{
          background: `url(${imageUrl}) lightgray 50% / cover no-repeat`,
          aspectRatio: "57/32",
        }}
      />
    </div>
  );
}

