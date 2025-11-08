import Heart from "@/shared/ui/icons/Heart";
import Message from "@/shared/ui/icons/Message";
import Share from "@/shared/ui/icons/Share";
import { Typography } from "@/shared/ui";

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
        <Typography.BodyLarge color="default" className="w-[469px]">
          {title}
        </Typography.BodyLarge>

        <Typography.Subtext color="subtle" className="w-[399px] line-clamp-2">
          {description}
        </Typography.Subtext>

        <div className="flex items-center gap-[var(--spacing-12)]">
          <button
            onClick={onHeartClick}
            className="flex items-center gap-[var(--spacing-4)] hover:opacity-70 transition-opacity"
          >
            <Heart size={14} />
            <Typography.Subtext color="default">32</Typography.Subtext>
          </button>

          <button
            onClick={onMessageClick}
            className="flex items-center gap-[var(--spacing-4)] hover:opacity-70 transition-opacity"
          >
            <Message size={14} />
            <Typography.Subtext color="default">32</Typography.Subtext>
          </button>

          <button
            onClick={onShareClick}
            className="flex items-center gap-[var(--spacing-4)] hover:opacity-70 transition-opacity"
          >
            <Share size={14} />
            <Typography.Subtext color="default">32</Typography.Subtext>
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
