import { Link } from "react-router-dom";
import { Typography } from "@/shared/ui";

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
            textDecoration: "none",
          }}
        >
          <Typography.Subtext color="default">최신연구</Typography.Subtext>
        </Link>
        <div
          style={{
            background: "var(--color-border-default)",
            width: "1px",
            height: "var(--spacing-12)",
          }}
        />
        <a
          href="/computer-science"
          style={{
            textDecoration: "none",
          }}
        >
          <Typography.Subtext color="default">컴퓨터과학</Typography.Subtext>
        </a>
        <a
          href="/network"
          style={{
            textDecoration: "none",
          }}
        >
          <Typography.Subtext color="default">
            네트워크 및 통신
          </Typography.Subtext>
        </a>
        <a
          href="/ai"
          style={{
            textDecoration: "none",
          }}
        >
          <Typography.Subtext color="default">인공지능</Typography.Subtext>
        </a>
      </div>
    </div>
  );
}
