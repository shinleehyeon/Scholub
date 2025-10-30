import Logo from "@/shared/ui/Logo";
import SearchIcon from "@/shared/ui/icons/Search";

export default function Header() {
  return (
    <header
      style={{
        display: "flex",
        height: "71px",
        padding: "0 var(--spacing-24)",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "stretch",
        borderBottom: "1px solid var(--color-border-default)",
        background: "var(--color-surface-default)",
      }}
    >
      <a href="/" style={{ flexShrink: 0 }}>
        <Logo />
      </a>

      <div
        style={{
          borderRadius: "var(--radius-9999)",
          border: "2px solid var(--color-brand-default)",
          background: "var(--color-surface-default)",
          display: "flex",
          width: "400px",
          padding: "var(--spacing-12) var(--spacing-14)",
          alignItems: "center",
          gap: "var(--spacing-6)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            width: "var(--spacing-16)",
            height: "var(--spacing-16)",
            alignItems: "center",
            gap: "var(--spacing-10)",
            aspectRatio: "1/1",
            color: "var(--color-text-default)",
          }}
        >
          <SearchIcon size={16} />
        </div>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: "Pretendard",
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: "var(--spacing-20)",
            color: "var(--color-text-default)",
          }}
          className="placeholder:text-[var(--color-text-subtle)] placeholder:font-[Pretendard] placeholder:text-[14px] placeholder:font-medium placeholder:leading-[var(--spacing-20)]"
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-20)",
        }}
      >
        <a
          href="/login"
          style={{
            color: "var(--color-text-subtle)",
            fontFamily: "Pretendard",
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: "var(--spacing-20)",
            textDecoration: "none",
          }}
        >
          로그인
        </a>
        <a
          href="/signup"
          style={{
            color: "var(--color-text-subtle)",
            fontFamily: "Pretendard",
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: "var(--spacing-20)",
            textDecoration: "none",
          }}
        >
          회원가입
        </a>
      </div>
    </header>
  );
}
