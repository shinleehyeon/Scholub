import { useState, useEffect } from "react";
import { Header } from "@/widgets/header";
import { SubHeader } from "@/widgets/sub-header";
import LatestResearchCard from "@/entities/paper/ui/LatestResearchCard";
import { AIAnswerSection } from "@/widgets/ai-answer-section";
import { papersApi } from "@/shared/api/papers";
import { Typography } from "@/shared/ui";

export default function NewscolatorPage() {
  const [latestPapers, setLatestPapers] = useState<any[]>([]);
  const [loadingLatest, setLoadingLatest] = useState(true);

  useEffect(() => {
    const fetchLatestPapers = async () => {
      try {
        setLoadingLatest(true);
        const papers = await papersApi.getLatestPapers(20);

        const formattedPapers = papers.map((paper) => {
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
            paperId: paper.paperId || paper.id,
            imageUrl,
            title: paper.title,
            description,
            category,
            likes: paper.likeCount || 0,
            comments: 0, // API 응답에 댓글 수가 없으므로 기본값 0
            isLiked: paper.myReaction?.isLiked || false,
          };
        });

        setLatestPapers(formattedPapers);
      } catch (error) {
        console.error("최신 연구 로드 실패:", error);
        setLatestPapers([]);
      } finally {
        setLoadingLatest(false);
      }
    };

    fetchLatestPapers();
  }, []);

  return (
    <div className="min-h-screen bg-white">
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
          <h2 className="text-[var(--color-text-default)] font-[Pretendard] text-[24px] font-bold leading-[30px] m-0">
            최신 연구
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-24)",
              width: "100%",
            }}
          >
            {loadingLatest ? (
              <Typography.Body color="subtle">로딩 중...</Typography.Body>
            ) : latestPapers.length > 0 ? (
              latestPapers.map((paper) => (
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
                최신 연구가 없습니다.
              </Typography.Body>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            flexShrink: 0,
          }}
        >
          <AIAnswerSection />
        </div>
      </div>
    </div>
  );
}
