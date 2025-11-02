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
        <h3
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            alignSelf: "stretch",
            overflow: "hidden",
            color: "#000",
            textOverflow: "ellipsis",
            fontFamily: "Pretendard",
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "24px",
            margin: 0,
          }}
        >
          {title}
        </h3>

        <p
          style={{
            overflow: "hidden",
            color: "var(--color-text-subtle)",
            textOverflow: "ellipsis",
            fontFamily: "Pretendard",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "20px",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            alignSelf: "stretch",
            margin: 0,
          }}
        >
          {subtitle}
        </p>

        <span
          style={{
            color: "var(--color-text-brand-default)",
            fontFamily: "Pretendard",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "20px",
          }}
        >
          {category}
        </span>
      </div>
    </div>
  );
}
