import { Typography } from "@/shared/ui";

interface PopularPaperCardProps {
  imageUrl: string;
  title: string;
  subtitle: string;
  category: string;
}

export default function PopularPaperCard({
  imageUrl,
  title,
  subtitle,
  category,
}: PopularPaperCardProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "var(--spacing-8)",
        flexShrink: 0,
        width: "300px",
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
          {category}
        </Typography.Subtext>
      </div>
    </div>
  );
}

