import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Typography, Skeleton, Button } from "@/shared/ui";
import { categoriesApi, type Category } from "@/shared/api/categories";
import { AIChat } from "@/widgets/ai-chat";
import Sparkles from "@/shared/ui/icons/Sparkles";
import { useAIChat } from "@/shared/lib/ai-chat-context";

export default function SubHeader() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [topCategories, setTopCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAIChatOpen, setIsAIChatOpen } = useAIChat();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categories = await categoriesApi.getCategories();

        const sorted = [...categories].sort((a, b) => b.count - a.count);
        // 논문이 가장 많은 카테고리 하나를 최신연구 자리에 추가
        setTopCategories(sorted.slice(0, 4));
      } catch (error) {
        console.error("카테고리 로드 실패:", error);
        setTopCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: "71px",
        left: 0,
        right: 0,
        display: "flex",
        height: "50px",
        padding: "0 var(--spacing-24)",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "stretch",
        borderBottom: "1px solid var(--color-border-default)",
        background: "var(--color-surface-default)",
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-20)",
        }}
      >
        <Typography.Subtext color="subtle">카테고리</Typography.Subtext>
        <div
          style={{
            background: "var(--color-border-default)",
            width: "1px",
            height: "var(--spacing-12)",
          }}
        />
        {topCategories.length > 0 ? (
          topCategories.map((category, index) => (
            <div key={category.category} style={{ display: "contents" }}>
              <Link
                to={`/category/${encodeURIComponent(category.category)}`}
                style={{
                  textDecoration: "none",
                }}
              >
                <Typography.Subtext color="default">
                  {category.category}
                </Typography.Subtext>
              </Link>
              {index < topCategories.length - 1 && (
                <div
                  style={{
                    background: "var(--color-border-default)",
                    width: "1px",
                    height: "var(--spacing-12)",
                  }}
                />
              )}
            </div>
          ))
        ) : loading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-20)",
                }}
              >
                <Skeleton width="80px" height="20px" />
                {i < 3 && (
                  <div
                    style={{
                      background: "var(--color-border-default)",
                      width: "1px",
                      height: "var(--spacing-12)",
                    }}
                  />
                )}
              </div>
            ))}
          </>
        ) : null}
      </div>
      {isHomePage && (
        <Button
          variant="secondary"
          size="medium"
          leadingIcon={
            <Sparkles size={16} color="var(--color-brand-default)" />
          }
          onClick={() => setIsAIChatOpen(true)}
          style={{
            flexShrink: 0,
          }}
        >
          AI 채팅
        </Button>
      )}
      {isHomePage && isAIChatOpen && (
        <AIChat onClose={() => setIsAIChatOpen(false)} />
      )}
    </div>
  );
}
