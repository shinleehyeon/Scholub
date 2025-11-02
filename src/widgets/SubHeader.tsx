import { Link } from "react-router-dom";

export default function SubHeader() {
  return (
    <div
      style={{
        display: "flex",
        height: "50px",
        padding: "0 var(--spacing-24)",
        justifyContent: "flex-start",
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
        <Link
          to="/newscolar"
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
        </Link>
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
    </div>
  );
}
