import Heart from "@/shared/ui/icons/Heart";
import Message from "@/shared/ui/icons/Message";
import { Typography } from "@/shared/ui";

interface LatestResearchCardProps {
  imageUrl: string;
  category: string;
  title: string;
  description: string;
  likes?: number;
  comments?: number;
}

export default function LatestResearchCard({
  imageUrl,
  category,
  title,
  description,
  likes = 32,
  comments = 32,
}: LatestResearchCardProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--spacing-24)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          flex: 1,
        }}
      >
        <Typography.Subtext
          color="brand"
          className="mb-[var(--spacing-4)]"
        >
          {category}
        </Typography.Subtext>

        <Typography.BodyLarge
          color="default"
          className="mb-[var(--spacing-4)]"
        >
          {title}
        </Typography.BodyLarge>

        <Typography.Subtext
          color="subtle"
          className="mb-[var(--spacing-12)] line-clamp-2"
        >
          {description}
        </Typography.Subtext>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-12)",
          }}
        >
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-4)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <Heart size={14} />
            <Typography.Subtext color="subtle">
              {likes}
            </Typography.Subtext>
          </button>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-4)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <Message size={14} />
            <Typography.Subtext color="subtle">
              {comments}
            </Typography.Subtext>
          </button>
        </div>
      </div>

      <div
        style={{
          width: "228px",
          height: "128px",
          borderRadius: "var(--radius-10)",
          background: `url(${imageUrl}) lightgray 50% / cover no-repeat`,
          flexShrink: 0,
        }}
      />
    </div>
  );
}

