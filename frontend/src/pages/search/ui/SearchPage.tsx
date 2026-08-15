import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/widgets/header";
import { SubHeader } from "@/widgets/sub-header";
import LatestResearchCard from "@/entities/paper/ui/LatestResearchCard";
import { AIAnswerSection } from "@/widgets/ai-answer-section";
import { papersApi } from "@/shared/api/papers";
import { Typography, PaperCardSkeleton } from "@/shared/ui";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  console.log("[SearchPage] 렌더링됨, searchQuery:", searchQuery);

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setTotal(0);
        return;
      }

      try {
        setLoading(true);
        const result = await papersApi.searchPapers({
          searchQuery: searchQuery.trim(),
          page: 1,
          limit: 20,
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

        setSearchResults(formattedPapers);
        setTotal(result.total);
      } catch (error) {
        console.error("검색 실패:", error);
        setSearchResults([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-white" style={{ marginTop: "121px" }}>
      <Header />
      <div style={{ marginBottom: 0 }}>
        <SubHeader />
      </div>

      <div
        style={{
          display: "flex",
          width: "1440px",
          padding: "var(--spacing-40) var(--spacing-24)",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "var(--spacing-32)",
          alignSelf: "stretch",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "var(--spacing-24)",
            flex: 1,
            minWidth: 0,
          }}
        >
          {searchQuery ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-8)",
                }}
              >
                <h2 className="text-[var(--color-text-default)] font-[Pretendard] text-[24px] font-bold leading-[30px] m-0">
                  검색 결과
                </h2>
                <Typography.Body color="subtle">({total}개)</Typography.Body>
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
                  <>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <PaperCardSkeleton key={i} />
                    ))}
                  </>
                ) : searchResults.length > 0 ? (
                  searchResults.map((paper) => (
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
                  ))
                ) : (
                  <Typography.Body color="subtle">
                    검색 결과가 없습니다.
                  </Typography.Body>
                )}
              </div>
            </>
          ) : (
            <Typography.Body color="subtle">
              검색어를 입력해주세요.
            </Typography.Body>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            flexShrink: 0,
          }}
        >
          <AIAnswerSection searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
}
