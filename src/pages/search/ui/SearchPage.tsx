import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/widgets/header";
import { SubHeader } from "@/widgets/sub-header";
import LatestResearchCard from "@/entities/paper/ui/LatestResearchCard";
import { AIAnswerSection } from "@/widgets/ai-answer-section";
import { papersApi } from "@/shared/api/papers";
import { Typography } from "@/shared/ui";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

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
          // 이미지 URL 구성: URL 형태로 직접 제공되는 경우만 사용
          const imageUrl =
            paper.thumbnailUrl ||
            paper.imageUrl ||
            paper.coverImage ||
            "https://via.placeholder.com/228x128/CCCCCC/666666?text=No+Image";

          // 카테고리 포맷팅 (배열을 " > "로 연결)
          const category = paper.categories.join(" > ") || "분류 없음";

          // 설명(description)은 summary 사용, 없으면 빈 문자열
          const description = paper.summary || "";

          return {
            id: paper.id,
            paperId: paper.id,
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
    <div className="min-h-screen bg-white">
      <Header />
      <div style={{ marginBottom: 0 }}>
        <SubHeader />
      </div>

      <div
        className="flex flex-col lg:flex-row w-full max-w-[1440px] px-6 lg:px-10 py-10 lg:py-10 justify-center items-start gap-8 lg:gap-8 mx-auto"
        style={{
          paddingLeft: "var(--layout-padding)",
          paddingRight: "var(--layout-padding)",
        }}
      >
        <div
          className="flex flex-col items-start gap-6 w-full lg:flex-1 lg:min-w-0"
          style={{
            gap: "var(--spacing-24)",
          }}
        >
          {searchQuery ? (
            <>
              <div
                className="flex flex-col sm:flex-row items-start sm:items-center gap-2"
                style={{
                  gap: "var(--spacing-8)",
                }}
              >
                <h2 className="text-[var(--color-text-default)] font-[Pretendard] text-[20px] sm:text-[24px] font-bold leading-[28px] sm:leading-[30px] m-0">
                  검색 결과
                </h2>
                <Typography.Body color="subtle" className="whitespace-nowrap">
                  ({total}개)
                </Typography.Body>
              </div>

              <div
                className="flex flex-col w-full"
                style={{
                  gap: "var(--spacing-24)",
                }}
              >
                {loading ? (
                  <Typography.Body color="subtle">로딩 중...</Typography.Body>
                ) : searchResults.length > 0 ? (
                  searchResults.map((paper) => (
                    <LatestResearchCard
                      key={paper.id}
                      paperId={paper.paperId}
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

        <div className="flex flex-col items-start w-full lg:w-auto lg:flex-shrink-0 lg:max-w-[400px]">
          <AIAnswerSection />
        </div>
      </div>
    </div>
  );
}
