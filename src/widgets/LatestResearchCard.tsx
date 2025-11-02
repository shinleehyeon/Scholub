import Heart from "@/shared/ui/icons/Heart";
import Message from "@/shared/ui/icons/Message";

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
        <span
          style={{
            color: "var(--color-text-brand-default)",
            fontFamily: "Pretendard",
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: "20px",
            marginBottom: "var(--spacing-4)",
          }}
        >
          {category}
        </span>

        <h3
          style={{
            color: "#000",
            fontFamily: "Pretendard",
            fontSize: "18px",
            fontWeight: 600,
            lineHeight: "26px",
            margin: 0,
            marginBottom: "var(--spacing-4)",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            color: "var(--color-text-subtle)",
            fontFamily: "Pretendard",
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: "20px",
            margin: 0,
            marginBottom: "var(--spacing-12)",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {description}
        </p>

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
              color: "var(--color-text-subtle)",
              fontFamily: "Pretendard",
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: "20px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <Heart size={14} />
            <span>{likes}</span>
          </button>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-4)",
              color: "var(--color-text-subtle)",
              fontFamily: "Pretendard",
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: "20px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <Message size={14} />
            <span>{comments}</span>
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
