import { Typography } from "@/shared/ui";
import { useNavigate } from "react-router-dom";

interface PopularPaperCardProps {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  category: string;
}

export default function PopularPaperCard({
  id,
  imageUrl,
  title,
  subtitle,
  category,
}: PopularPaperCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (id) {
      navigate(`/papers/${id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "var(--spacing-8)",
        flexShrink: 0,
        width: "300px",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: "300px",
          height: "169px",
          aspectRatio: "300/169",
          background: `url(${imageUrl}) lightgray 50% / cover no-repeat`,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "var(--spacing-8)",
          alignSelf: "stretch",
        }}
      >
        <Typography.BodyLarge
          color="default"
          className="line-clamp-2 self-stretch"
        >
          {title}
        </Typography.BodyLarge>

        <Typography.Subtext
          color="subtle"
          className="line-clamp-1 self-stretch"
        >
          {subtitle}
        </Typography.Subtext>

        <Typography.Subtext color="brand">
          {category.split(" > ").slice(0, 3).join(" > ")}
        </Typography.Subtext>
      </div>
    </div>
  );
}
