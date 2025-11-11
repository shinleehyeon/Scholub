import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/widgets/header";
import { SubHeader } from "@/widgets/sub-header";
import { papersApi } from "@/shared/api/papers";
import type { Paper } from "@/shared/api/papers";
import { Typography } from "@/shared/ui";

export default function PaperDetailPage() {
  const { paperId } = useParams<{ paperId: string }>();
  const navigate = useNavigate();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaperDetail = async () => {
      if (!paperId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const paperData = await papersApi.getPaperDetail(paperId);
        setPaper(paperData);
      } catch (error) {
        console.error("논문 상세 정보 로드 실패:", error);
        setPaper(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPaperDetail();
  }, [paperId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <SubHeader />
        <div
          style={{
            display: "flex",
            padding: "var(--spacing-32) var(--padding)",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--spacing-32)",
            alignSelf: "stretch",
          }}
        >
          <Typography.Body color="subtle">로딩 중...</Typography.Body>
        </div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <SubHeader />
        <div
          style={{
            display: "flex",
            padding: "var(--spacing-32) var(--padding)",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--spacing-32)",
            alignSelf: "stretch",
          }}
        >
          <Typography.Body color="subtle">논문을 찾을 수 없습니다.</Typography.Body>
        </div>
      </div>
    );
  }

  const category = paper.categories.join(" > ") || "분류 없음";
  const thumbnailUrl =
    paper.thumbnailUrl ||
    paper.imageUrl ||
    paper.coverImage ||
    "https://via.placeholder.com/250x271/CCCCCC/666666?text=No+Image";

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <SubHeader />
      <div
        style={{
          display: "flex",
          padding: "var(--spacing-32) var(--padding)",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--spacing-32)",
          alignSelf: "stretch",
        }}
      >
        {/* 위쪽 글자 레이아웃 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--spacing-12)",
            width: "692px",
          }}
        >
          {/* 카테고리 */}
          <div
            style={{
              color: "var(--color-text-brand-default)",
              fontFamily: "Pretendard",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "20px",
              width: "100%",
            }}
          >
            {category}
          </div>

          {/* 제목 */}
          <div
            style={{
              color: "#322F29",
              fontFamily: "Pretendard",
              fontSize: "26px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "140%",
              width: "692px",
            }}
          >
            {paper.title}
          </div>

          {/* 요약 */}
          <div
            style={{
              color: "var(--color-text-subtle)",
              fontFamily: "Pretendard",
              fontSize: "17px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "24px",
              width: "692px",
            }}
          >
            {paper.summary || paper.translatedSummary || ""}
          </div>
        </div>

        {/* 위쪽 레이아웃 - 썸네일과 메타데이터 */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "var(--spacing-24)",
            alignSelf: "stretch",
          }}
        >
          {/* 왼쪽 - 썸네일 */}
          <div
            style={{
              display: "flex",
              width: "300px",
              padding: "29px 25px 0 25px",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "var(--radius-14)",
              background: "var(--color-surface-subtle)",
            }}
          >
            <div
              style={{
                width: "250px",
                height: "271px",
                flexShrink: 0,
                aspectRatio: "250/271",
                borderRadius: "var(--radius-10) var(--radius-10) 0 0",
                background: `url(${thumbnailUrl}) lightgray 50% / cover no-repeat`,
                boxShadow: "0 -2px 10px 0 rgba(0, 0, 0, 0.05)",
              }}
            />
          </div>

          {/* 오른쪽 - 메타데이터 (추후 구현) */}
          <div style={{ flex: 1 }}></div>
        </div>
      </div>
    </div>
  );
}

