import { useState, useEffect } from "react";
import Header from "@/widgets/Header";
import SubHeader from "@/widgets/SubHeader";
import PopularPaperCard from "@/widgets/PopularPaperCard";
import LatestResearchCard from "@/widgets/LatestResearchCard";
import ChevronLeft from "@/shared/ui/icons/ChevronLeft";
import ChevronRight from "@/shared/ui/icons/ChevronRight";
import Sparkles from "@/shared/ui/icons/Sparkles";

interface CarouselItem {
  id: number;
  imageUrl: string;
  title: string;
  authors: string;
}

const carouselItems: CarouselItem[] = [
  {
    id: 1,
    imageUrl: "https://picsum.photos/1200/371?random=1",
    title: "Deaminative cross-coupling of amines by boryl radical β-scission",
    authors: "Haoran Wei, Yaofeng Sun, Yukun Li (2025)",
  },
  {
    id: 2,
    imageUrl: "https://picsum.photos/1200/371?random=1",
    title: "Deaminative cross-coupling of amines by boryl radical β-scission",
    authors: "Haoran Wei, Yaofeng Sun, Yukun Li (2025)",
  },
  {
    id: 3,
    imageUrl: "https://picsum.photos/1200/371?random=1",
    title: "Deaminative cross-coupling of amines by boryl radical β-scission",
    authors: "Haoran Wei, Yaofeng Sun, Yukun Li (2025)",
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselItems.length) % carouselItems.length
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentItem = carouselItems[currentSlide];

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
          <h1 className="text-white font-[Pretendard] text-[32px] font-bold leading-[140%] text-center">
            {currentItem.title}
          </h1>

          <p className="text-white font-[Pretendard] text-[18px] font-medium leading-[26px] text-center">
            {currentItem.authors}
          </p>
        </div>

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
        <h2
          style={{
            color: "#000",
            fontFamily: "Pretendard",
            fontSize: "24px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "30px",
            margin: 0,
          }}
        >
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
          <PopularPaperCard
            imageUrl="https://picsum.photos/300/169?random=1"
            title="Deaminative cross-coupling of amines by boryl radical β-scission"
            subtitle="Amines are among the most common functional groups in bioactive molecules and pharmaceuticals,1-3 yet they are almost universally treated as synthetic endpoint..."
            category="인공지능 > 머신러닝"
          />
          <PopularPaperCard
            imageUrl="https://picsum.photos/300/169?random=1"
            title="Deaminative cross-coupling of amines by boryl radical β-scission"
            subtitle="Amines are among the most common functional groups in bioactive molecules and pharmaceuticals,1-3 yet they are almost universally treated as synthetic endpoint..."
            category="인공지능 > 머신러닝"
          />
          <PopularPaperCard
            imageUrl="https://picsum.photos/300/169?random=1"
            title="Deaminative cross-coupling of amines by boryl radical β-scission"
            subtitle="Amines are among the most common functional groups in bioactive molecules and pharmaceuticals,1-3 yet they are almost universally treated as synthetic endpoint..."
            category="인공지능 > 머신러닝"
          />
          <PopularPaperCard
            imageUrl="https://picsum.photos/300/169?random=1"
            title="Deaminative cross-coupling of amines by boryl radical β-scission"
            subtitle="Amines are among the most common functional groups in bioactive molecules and pharmaceuticals,1-3 yet they are almost universally treated as synthetic endpoint..."
            category="인공지능 > 머신러닝"
          />
          <PopularPaperCard
            imageUrl="https://picsum.photos/300/169?random=1"
            title="Deaminative cross-coupling of amines by boryl radical β-scission"
            subtitle="Amines are among the most common functional groups in bioactive molecules and pharmaceuticals,1-3 yet they are almost universally treated as synthetic endpoint..."
            category="인공지능 > 머신러닝"
          />
          <PopularPaperCard
            imageUrl="https://picsum.photos/300/169?random=1"
            title="Deaminative cross-coupling of amines by boryl radical β-scission"
            subtitle="Amines are among the most common functional groups in bioactive molecules and pharmaceuticals,1-3 yet they are almost universally treated as synthetic endpoint..."
            category="인공지능 > 머신러닝"
          />
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
          <h2
            style={{
              color: "#000",
              fontFamily: "Pretendard",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "30px",
              margin: 0,
            }}
          >
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
            <LatestResearchCard
              imageUrl="https://picsum.photos/228/128?random=1"
              category="인공지능 > 머신러닝"
              title="Deaminative cross-coupling of amines by boryl radical β-scission"
              description="Amines are among the most common functional groups in bioactive molecules and pharmaceuticals,1-3 yet they are almost universally treated as synthetic endpoint..."
              likes={32}
              comments={32}
            />
            <LatestResearchCard
              imageUrl="https://picsum.photos/228/128?random=1"
              category="인공지능 > 머신러닝"
              title="Deaminative cross-coupling of amines by boryl radical β-scission"
              description="Amines are among the most common functional groups in bioactive molecules and pharmaceuticals,1-3 yet they are almost universally treated as synthetic endpoint..."
              likes={32}
              comments={32}
            />
            <LatestResearchCard
              imageUrl="https://picsum.photos/228/128?random=1"
              category="인공지능 > 머신러닝"
              title="Deaminative cross-coupling of amines by boryl radical β-scission"
              description="Amines are among the most common functional groups in bioactive molecules and pharmaceuticals,1-3 yet they are almost universally treated as synthetic endpoint..."
              likes={32}
              comments={32}
            />
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
              <span
                style={{
                  color: "var(--color-text-subtle)",
                  fontFamily: "Pretendard",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "20px",
                }}
              >
                최근 Deaminative 논문을 확인해서
              </span>
            </div>

            <h2
              style={{
                color: "#000",
                fontFamily: "Pretendard",
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "30px",
                margin: 0,
              }}
            >
              인공지능
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
            <LatestResearchCard
              imageUrl="https://picsum.photos/228/128?random=1"
              category="인공지능 > 머신러닝"
              title="Deaminative cross-coupling of amines by boryl radical β-scission"
              description="Amines are among the most common functional groups in bioactive molecules and pharmaceuticals,1-3 yet they are almost universally treated as synthetic endpoint..."
              likes={32}
              comments={32}
            />
            <LatestResearchCard
              imageUrl="https://picsum.photos/228/128?random=1"
              category="인공지능 > 머신러닝"
              title="Deaminative cross-coupling of amines by boryl radical β-scission"
              description="Amines are among the most common functional groups in bioactive molecules and pharmaceuticals,1-3 yet they are almost universally treated as synthetic endpoint..."
              likes={32}
              comments={32}
            />
            <LatestResearchCard
              imageUrl="https://picsum.photos/228/128?random=1"
              category="인공지능 > 머신러닝"
              title="Deaminative cross-coupling of amines by boryl radical β-scission"
              description="Amines are among the most common functional groups in bioactive molecules and pharmaceuticals,1-3 yet they are almost universally treated as synthetic endpoint..."
              likes={32}
              comments={32}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
