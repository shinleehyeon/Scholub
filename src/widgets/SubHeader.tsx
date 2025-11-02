import ChevronUp from "@/shared/ui/icons/ChevronUp";

export default function SubHeader() {
  return (
    <div
      style={{
        display: "flex",
        height: "50px",
        padding: "0 var(--spacing-24)",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "stretch",
        borderBottom: "1px solid var(--color-border-default)",
        background: "var(--color-surface-default)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-20)",
        }}
      >
        <a
          href="/latest"
          style={{
            color: "var(--color-text-default)",
            fontFamily: "Pretendard",
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: "var(--spacing-20)",
            textDecoration: "none",
          }}
        >
          최신연구
        </a>
        <a
          href="/computer-science"
          style={{
            color: "var(--color-text-default)",
            fontFamily: "Pretendard",
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: "var(--spacing-20)",
            textDecoration: "none",
          }}
        >
          컴퓨터과학
        </a>
        <a
          href="/network"
          style={{
            color: "var(--color-text-default)",
            fontFamily: "Pretendard",
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: "var(--spacing-20)",
            textDecoration: "none",
          }}
        >
          네트워크 및 통신
        </a>
        <a
          href="/ai"
          style={{
            color: "var(--color-text-default)",
            fontFamily: "Pretendard",
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: "var(--spacing-20)",
            textDecoration: "none",
          }}
        >
          인공지능
        </a>
      </div>

      <div
        style={{
          background: "var(--color-border-default)",
          width: "1px",
          height: "var(--spacing-12)",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-12)",
        }}
      >
        <span
          style={{
            color: "var(--color-text-default)",
            fontFamily: "Pretendard",
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: "var(--spacing-20)",
          }}
        >
          실시간 인기 논문
        </span>

        <span
          style={{
            color: "var(--color-text-subtle)",
            fontFamily: "Pretendard",
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: "var(--spacing-20)",
            width: "10px",
          }}
        >
          1
        </span>

        <span
          style={{
            overflow: "hidden",
            color: "var(--color-text-default)",
            textOverflow: "ellipsis",
            fontFamily: "Pretendard",
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: "var(--spacing-20)",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
          }}
        >
          DeepSeek-OCR: Context Optical
        </span>

        <div
          style={{
            display: "flex",
            width: "var(--spacing-16)",
            height: "var(--spacing-16)",
            alignItems: "center",
            gap: "var(--spacing-10)",
          }}
        >
          <ChevronUp size={16} />
        </div>
      </div>
    </div>
  );
}
