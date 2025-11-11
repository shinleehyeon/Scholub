import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Typography } from "@/shared/ui";
import { categoriesApi, type Category } from "@/shared/api/categories";

export default function SubHeader() {
  const [topCategories, setTopCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categories = await categoriesApi.getCategories();

        const sorted = [...categories].sort((a, b) => b.count - a.count);
        setTopCategories(sorted.slice(0, 3));
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
        justifyContent: "flex-start",
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
        <Link
          to="/newscolar"
          style={{
            textDecoration: "none",
          }}
        >
          <Typography.Subtext color="default">최신연구</Typography.Subtext>
        </Link>
        {topCategories.length > 0 && (
          <>
            <div
              style={{
                background: "var(--color-border-default)",
                width: "1px",
                height: "var(--spacing-12)",
              }}
            />
            {topCategories.map((category, index) => (
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
            ))}
          </>
        )}
        {loading && (
          <>
            <div
              style={{
                background: "var(--color-border-default)",
                width: "1px",
                height: "var(--spacing-12)",
              }}
            />
            <Typography.Subtext color="subtle">로딩 중...</Typography.Subtext>
          </>
        )}
      </div>
    </div>
  );
}
