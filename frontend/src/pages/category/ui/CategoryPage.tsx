import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/widgets/header";
import { SubHeader } from "@/widgets/sub-header";
import LatestResearchCard from "@/entities/paper/ui/LatestResearchCard";
import Tag from "@/shared/ui/icons/Tag";
import { Typography } from "@/shared/ui";
import { papersApi } from "@/shared/api/papers";

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();

  const categoryName = categoryId ? decodeURIComponent(categoryId) : "";

  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [displayedCount, setDisplayedCount] = useState(7);

  useEffect(() => {
    const fetchPapers = async () => {
      if (!categoryName) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await papersApi.getPapersByCategory(categoryName, {
          page: 1,
          limit: 1000,
        });

        const formattedPapers = result.papers.map((paper) => {
          const imageUrl =
            paper.thumbnailUrl ||
            paper.imageUrl ||
            paper.coverImage ||
            "https://via.placeholder.com/228x128/CCCCCC/666666?text=No+Image";

          const category = paper.categories.join(" > ") || "분류 없음";
          const description = paper.summary || "";

          return {
            id: paper.id,
            imageUrl,
            title: paper.title,
            description,
            category,
            likes: paper.likeCount || 0,
            comments: paper.discussionCount || 0,
            isLiked: paper.myReaction?.isLiked || false,
          };
        });

        setPapers(formattedPapers);
        setTotal(result.total);
      } catch (error) {
        console.error("카테고리 논문 로드 실패:", error);
        setPapers([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [categoryName]);

  return (
    <div className="min-h-screen bg-white" style={{ marginTop: "121px" }}>
      <Header />
      <div style={{ marginBottom: 0 }}>
        <SubHeader />
      </div>

      <div
        style={{
          display: "flex",
          padding: "var(--spacing-24) var(--padding)",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--spacing-32)",
          alignSelf: "stretch",
          maxWidth: "var(--layout-max-width)",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-14)",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "var(--spacing-12)",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "var(--radius-14)",
              background: "var(--color-surface-brand-subtle)",
            }}
          >
            <Tag size={24} color="#F7971D" />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "var(--spacing-4)",
            }}
          >
            <Typography.Subtext color="subtle">카테고리</Typography.Subtext>
            <Typography.Body
              style={{
                color: "#000",
                fontFamily: "Pretendard",
                fontSize: "17px",
                fontWeight: 500,
                lineHeight: "24px",
              }}
            >
              {categoryName}
            </Typography.Body>
          </div>

          <div
            style={{
              width: "1px",
              height: "52px",
              background: "var(--color-border-default)",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "var(--spacing-4)",
            }}
          >
            <Typography.Caption
              style={{
                color: "var(--color-text-subtle)",
                fontFamily: "Pretendard",
                fontSize: "12px",
                fontWeight: 500,
                lineHeight: "16px",
              }}
            >
              논문
            </Typography.Caption>
            <Typography.BodyLarge
              style={{
                color: "#000",
                fontFamily: "Pretendard",
                fontSize: "18px",
                fontWeight: 500,
                lineHeight: "24px",
              }}
            >
              {total}개
            </Typography.BodyLarge>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-24)",
            width: "100%",
          }}
        >
          {loading ? (
            <div>로딩 중...</div>
          ) : papers.length > 0 ? (
            <>
              {papers.slice(0, displayedCount).map((paper) => (
                <LatestResearchCard
                  key={paper.id}
                  id={paper.id}
                  imageUrl={paper.imageUrl}
                  category={paper.category}
                  title={paper.title}
                  description={paper.description}
                  likes={paper.likes}
                  comments={paper.comments}
                  isLiked={paper.isLiked}
                />
              ))}
              {papers.length > displayedCount && (
                <button
                  onClick={() => setDisplayedCount((prev) => prev + 7)}
                  style={{
                    display: "flex",
                    padding: "var(--spacing-12) var(--spacing-24)",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "var(--spacing-8)",
                    borderRadius: "var(--radius-8)",
                    background: "transparent",
                    border: "1px solid var(--color-border-default)",
                    cursor: "pointer",
                    alignSelf: "center",
                    fontFamily: "Pretendard",
                    fontSize: "14px",
                    fontWeight: 500,
                    lineHeight: "20px",
                    color: "var(--color-text-default)",
                  }}
                >
                  더보기
                </button>
              )}
            </>
          ) : (
            <div>논문이 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
}
