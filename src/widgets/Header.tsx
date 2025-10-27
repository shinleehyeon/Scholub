import { Search, Button } from "@/shared/ui";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--color-surface-default)] border-b border-[var(--color-border-default)]">
      <div className="flex max-w-[var(--layout-max-width)] px-[var(--layout-padding)] py-[var(--spacing-10)] justify-between items-center mx-auto">
        <div className="flex items-center gap-[var(--spacing-40)]">
          <a
            href="/"
            className="text-[var(--color-text-default)] font-[Pretendard] text-sm font-medium leading-5"
          >
            로고
          </a>

          <nav className="flex items-center gap-[var(--spacing-24)]">
            <a
              href="/topics"
              className="text-[var(--color-text-subtle)] font-[Pretendard] text-[17px] font-medium leading-6 hover:text-[var(--color-text-default)] transition-colors"
            >
              주제분류
            </a>
            <a
              href="/popular"
              className="text-[var(--color-text-subtle)] font-[Pretendard] text-[17px] font-medium leading-6 hover:text-[var(--color-text-default)] transition-colors"
            >
              인기논문
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-[var(--spacing-8)]">
          <Search placeholder="검색어를 입력하세요" />
          <Button variant="primary" size="medium">
            로그인
          </Button>
        </div>
      </div>
    </header>
  );
}
