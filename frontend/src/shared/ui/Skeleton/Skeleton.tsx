interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({
  width = "100%",
  height = "20px",
  borderRadius = "4px",
  className,
  style,
}: SkeletonProps) {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        borderRadius,
        background:
          "linear-gradient(90deg, var(--color-surface-subtle) 25%, rgba(255, 255, 255, 0.1) 50%, var(--color-surface-subtle) 75%)",
        backgroundSize: "200% 100%",
        animation: "skeleton-loading 1.5s ease-in-out infinite",
        ...style,
      }}
    >
      <style>
        {`
          @keyframes skeleton-loading {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
        `}
      </style>
    </div>
  );
}

// 논문 카드 스켈레톤
export function PaperCardSkeleton() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-12)",
        padding: "var(--spacing-16)",
        borderRadius: "var(--radius-12)",
        border: "1px solid var(--color-border-default)",
        background: "var(--color-surface-default)",
      }}
    >
      <Skeleton width="100%" height="128px" borderRadius="8px" />
      <Skeleton width="60%" height="16px" />
      <Skeleton width="100%" height="20px" />
      <Skeleton width="80%" height="20px" />
      <Skeleton width="40%" height="14px" />
    </div>
  );
}

// 리스트 아이템 스켈레톤
export function ListItemSkeleton() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--spacing-12)",
        padding: "var(--spacing-12)",
      }}
    >
      <Skeleton width="40px" height="40px" borderRadius="50%" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        <Skeleton width="70%" height="16px" />
        <Skeleton width="50%" height="14px" />
      </div>
    </div>
  );
}

// 텍스트 라인 스켈레톤
export function TextLineSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? "60%" : "100%"}
          height="16px"
        />
      ))}
    </div>
  );
}

// PopularPaperCard 스켈레톤 (가로 카드)
export function PopularPaperCardSkeleton() {
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
      <Skeleton width="300px" height="169px" borderRadius="8px" />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "var(--spacing-8)",
          alignSelf: "stretch",
        }}
      >
        <Skeleton width="100%" height="20px" />
        <Skeleton width="80%" height="20px" />
        <Skeleton width="60%" height="14px" />
      </div>
    </div>
  );
}

