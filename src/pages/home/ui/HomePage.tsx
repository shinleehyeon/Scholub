import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/widgets/header";
import { SubHeader } from "@/widgets/sub-header";
import PopularPaperCard from "@/entities/paper/ui/PopularPaperCard";
import LatestResearchCard from "@/entities/paper/ui/LatestResearchCard";
import ChevronLeft from "@/shared/ui/icons/ChevronLeft";
import ChevronRight from "@/shared/ui/icons/ChevronRight";
import Sparkles from "@/shared/ui/icons/Sparkles";
import { Typography } from "@/shared/ui";
import { papersApi } from "@/shared/api/papers";
import { authStorage } from "@/shared/lib/auth";

interface CarouselItem {
  id: string;
  imageUrl: string;
  title: string;
  authors: string;
}

export default function Home() {
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [popularPapers, setPopularPapers] = useState<any[]>([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [latestPapers, setLatestPapers] = useState<any[]>([]);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [recommendedPapers, setRecommendedPapers] = useState<any[]>([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchHeadlines = async () => {
      try {
        const headlines = await papersApi.getHeadlines(4);

        const items: CarouselItem[] = headlines.map((paper) => {
          // 이미지 URL 구성: URL 형태로 직접 제공되는 경우만 사용
          const imageUrl =
            paper.thumbnailUrl ||
            paper.imageUrl ||
            paper.coverImage ||
            "https://via.placeholder.com/1200x371/CCCCCC/666666?text=No+Image";

          // 작가 정보 포맷팅
          const authorsList = paper.authors.join(", ");
          const year = paper.issuedAt
            ? new Date(paper.issuedAt).getFullYear()
            : new Date(paper.createdAt).getFullYear();
          const authors = `${authorsList} (${year})`;

          return {
            id: paper.id,
            imageUrl,
            title: paper.title,
            authors,
          };
        });

        setCarouselItems(items);
        if (items.length > 0) {
          setCurrentSlide(0);
        }
      } catch (error) {
        console.error("헤드라인 로드 실패:", error);
        // 404 에러는 데이터가 없는 것으로 처리
        const errorMessage = error instanceof Error ? error.message : "";
        if (
          errorMessage.includes("404") ||
          errorMessage.includes("not found")
        ) {
          setCarouselItems([
            {
              id: "no-data",
              imageUrl:
                "https://via.placeholder.com/1200x371/CCCCCC/666666?text=No+Image",
              title: "헤드라인 논문이 없습니다",
              authors: "",
            },
          ]);
        } else {
          // 다른 에러 발생 시 기본값 사용
          setCarouselItems([
            {
              id: "error",
              imageUrl:
                "https://via.placeholder.com/1200x371/CCCCCC/666666?text=No+Image",
              title: "헤드라인을 불러올 수 없습니다",
              authors: "",
            },
          ]);
        }
      }
    };

    fetchHeadlines();
  }, []);

  useEffect(() => {
    const fetchPopularPapers = async () => {
      try {
        setLoadingPopular(true);
        const papers = await papersApi.getPopularPapers(20, 90);

        const formattedPapers = papers.map((paper) => {
          // 이미지 URL 구성: URL 형태로 직접 제공되는 경우만 사용
          const imageUrl =
            paper.thumbnailUrl ||
            paper.imageUrl ||
            paper.coverImage ||
            "https://via.placeholder.com/300x169/CCCCCC/666666?text=No+Image";

          // 카테고리 포맷팅 (배열을 " > "로 연결)
          const category = paper.categories.join(" > ") || "분류 없음";

          // 요약(subtitle)은 summary 사용, 없으면 빈 문자열
          const subtitle = paper.summary || "";

          return {
            id: paper.id,
            imageUrl,
            title: paper.title,
            subtitle,
            category,
          };
        });

        setPopularPapers(formattedPapers);
      } catch (error) {
        console.error("인기 논문 로드 실패:", error);
        setPopularPapers([]);
      } finally {
        setLoadingPopular(false);
      }
    };

    fetchPopularPapers();
  }, []);

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
            paperId: paper.id, // API 엔드포인트는 id를 사용
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

  useEffect(() => {
    // 로그인 상태 확인
    const checkAuth = () => {
      setIsAuthenticated(authStorage.isAuthenticated());
    };

    checkAuth();
    // 주기적으로 로그인 상태 확인 (1초마다)
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchRecommendedPapers = async () => {
      // 로그인하지 않은 경우 API 호출하지 않음
      if (!authStorage.isAuthenticated()) {
        setLoadingRecommended(false);
        return;
      }

      try {
        setLoadingRecommended(true);
        const papers = await papersApi.getRecommendedPapers(20);

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
            paperId: paper.id, // API 엔드포인트는 id를 사용
            imageUrl,
            title: paper.title,
            description,
            category,
            likes: paper.likeCount || 0,
            comments: 0, // API 응답에 댓글 수가 없으므로 기본값 0
            isLiked: paper.myReaction?.isLiked || false,
          };
        });

        setRecommendedPapers(formattedPapers);
      } catch (error) {
        console.error("추천 논문 로드 실패:", error);
        setRecommendedPapers([]);
      } finally {
        setLoadingRecommended(false);
      }
    };

    fetchRecommendedPapers();
  }, [isAuthenticated]);

  const nextSlide = () => {
    if (carouselItems.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    if (carouselItems.length === 0) return;
    setCurrentSlide(
      (prev) => (prev - 1 + carouselItems.length) % carouselItems.length
    );
  };

  useEffect(() => {
    if (carouselItems.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [carouselItems.length]);

  const currentItem = carouselItems[currentSlide] || {
    id: "loading",
    imageUrl: "",
    title: "로딩 중...",
    authors: "",
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div style={{ marginBottom: 0 }}>
        <SubHeader />
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          height: "371px",
          padding: "55px",
          paddingTop: "251px",
          paddingBottom: "42px",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "7px",
          alignSelf: "stretch",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${carouselItems.length * 100}%`,
            height: "100%",
            display: "flex",
            transform: `translateX(-${currentSlide * (100 / carouselItems.length)}%)`,
            transition: "transform 0.3s ease-in-out",
          }}
        >
          {carouselItems.map((item) => (
            <div
              key={item.id}
              style={{
                width: `${100 / carouselItems.length}%`,
                height: "100%",
                position: "relative",
                background: `
                  linear-gradient(180deg, rgba(0, 0, 0, 0.00) 55.29%, #000 100%),
                  linear-gradient(0deg, rgba(0, 0, 0, 0.10) 0%, rgba(0, 0, 0, 0.10) 100%),
                  url('${item.imageUrl}') lightgray 50% / cover no-repeat
                `,
              }}
            />
          ))}
        </div>
        <div
          style={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <h1 className="text-white font-[Pretendard] text-[32px] font-bold leading-[44.8px] text-center m-0">
            {currentItem.title}
          </h1>

          <Typography.BodyLarge color="white" className="text-center">
            {currentItem.authors}
          </Typography.BodyLarge>
        </div>

        {carouselItems.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              style={{
                position: "absolute",
                left: "var(--spacing-24)",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                zIndex: 2,
              }}
            >
              <ChevronLeft size={64} />
            </button>

            <button
              onClick={nextSlide}
              style={{
                position: "absolute",
                right: "var(--spacing-24)",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                zIndex: 2,
              }}
            >
              <ChevronRight size={64} />
            </button>
          </>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "var(--spacing-24)",
          flex: "1 0 0",
          alignSelf: "stretch",
          paddingLeft: "var(--layout-padding)",
          paddingRight: "var(--layout-padding)",
          marginTop: "var(--spacing-48)",
        }}
      >
        <h2 className="text-[var(--color-text-default)] font-[Pretendard] text-[24px] font-bold leading-[30px] m-0">
          오늘의 인기 논문
        </h2>

        <div
          style={{
            display: "flex",
            gap: "var(--spacing-16)",
            overflowX: "auto",
            width: "100%",
            paddingBottom: "var(--spacing-8)",
          }}
          className="scrollbar-hide"
        >
          {loadingPopular ? (
            <div>로딩 중...</div>
          ) : popularPapers.length > 0 ? (
            popularPapers.map((paper) => (
              <PopularPaperCard
                key={paper.id}
                imageUrl={paper.imageUrl}
                title={paper.title}
                subtitle={paper.subtitle}
                category={paper.category}
              />
            ))
          ) : (
            <div>인기 논문이 없습니다.</div>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          padding: "var(--spacing-48) var(--spacing-24)",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "var(--spacing-64)",
          alignSelf: "stretch",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "var(--spacing-24)",
            flex: 1,
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
              <div>로딩 중...</div>
            ) : latestPapers.length > 0 ? (
              latestPapers
                .slice(0, 3)
                .map((paper) => (
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
              <div>최신 연구가 없습니다.</div>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "var(--spacing-24)",
            flex: "1 0 0",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-4)",
                marginBottom: "var(--spacing-6)",
              }}
            >
              <Sparkles size={13} />
              <Typography.Subtext color="subtle">
                최근 Deaminative 논문을 확인해서
              </Typography.Subtext>
            </div>

            <h2 className="text-[var(--color-text-default)] font-[Pretendard] text-[24px] font-bold leading-[30px] m-0">
              추천 논문
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-24)",
              width: "100%",
            }}
          >
            {!isAuthenticated ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "var(--spacing-48) var(--spacing-24)",
                  gap: "var(--spacing-16)",
                }}
              >
                <Typography.BodyLarge color="subtle" className="text-center">
                  추천 논문을 확인하려면 로그인이 필요합니다.
                </Typography.BodyLarge>
                <Link
                  to="/login"
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <Typography.BodyLarge color="brand" className="text-center">
                    로그인하러 가기 →
                  </Typography.BodyLarge>
                </Link>
              </div>
            ) : loadingRecommended ? (
              <div>로딩 중...</div>
            ) : recommendedPapers.length > 0 ? (
              recommendedPapers
                .slice(0, 3)
                .map((paper) => (
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
              <div>추천 논문이 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
