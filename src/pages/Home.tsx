import { useState, useEffect } from "react";
import Header from "@/widgets/Header";
import SubHeader from "@/widgets/SubHeader";
import PaperCard from "@/widgets/PaperCard";
import UserProfileCard from "@/widgets/UserProfileCard";
import TrendingPapers from "@/widgets/TrendingPapers";
import ChevronLeft from "@/shared/ui/icons/ChevronLeft";
import Pause from "@/shared/ui/icons/Pause";
import ChevronRight from "@/shared/ui/icons/ChevronRight";

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
    title: "DeepSeek-OCR: Contexts Optical Compression",
    authors: "Haoran Wei, Yaofeng Sun, Yukun Li (2025)",
  },
  {
    id: 2,
    imageUrl: "https://picsum.photos/1200/371?random=2",
    title: "Universities are embracing AI",
    authors: "John Doe, Jane Smith (2025)",
  },
  {
    id: 3,
    imageUrl: "https://picsum.photos/1200/371?random=3",
    title: "Ion stencils for advanced manufacturing",
    authors: "Alice Johnson, Bob Williams (2024)",
  },
];

export default function Home() {
  const [activeTag, setActiveTag] = useState("deepseek");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const handleTagClick = (tag: string) => {
    setActiveTag(tag);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselItems.length) % carouselItems.length
    );
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay((prev) => !prev);
  };

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

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

      <main className="flex flex-col max-w-[var(--layout-max-width)] px-[var(--layout-padding)] items-start gap-[var(--spacing-10)] mx-auto py-[var(--spacing-20)]">
        <div className="flex items-start gap-[var(--spacing-8)] self-stretch">
          <div className="flex items-center gap-[var(--spacing-8)] px-[var(--spacing-10)] py-[var(--spacing-8)] rounded-[var(--radius-12)] bg-[var(--color-surface-subtle)] w-fit">
            <button
              onClick={prevSlide}
              className="flex items-center hover:opacity-70 transition-opacity"
            >
              <div className="flex w-5 h-5 items-center gap-[10px] aspect-square">
                <ChevronLeft size={20} fillColor="currentColor" />
              </div>
            </button>

            <button
              onClick={toggleAutoPlay}
              className="flex items-center hover:opacity-70 transition-opacity"
            >
              <div className="flex w-5 h-5 items-center gap-[10px] aspect-square">
                <Pause size={20} />
              </div>
            </button>

            <button
              onClick={nextSlide}
              className="flex items-center hover:opacity-70 transition-opacity"
            >
              <div className="flex w-5 h-5 items-center gap-[10px] aspect-square">
                <ChevronRight size={20} fillColor="currentColor" />
              </div>
            </button>
          </div>

          <div className="flex items-center gap-[var(--spacing-8)] flex-wrap">
            <button
              onClick={() => handleTagClick("deepseek")}
              className={`flex px-[var(--spacing-14)] py-[var(--spacing-8)] items-center gap-[var(--spacing-4)] rounded-[var(--radius-12)] font-[Pretendard] text-sm font-medium leading-5 transition-all ${
                activeTag === "deepseek"
                  ? "bg-[var(--color-brand-default)] text-[var(--color-text-white)] hover:opacity-90"
                  : "bg-[var(--color-surface-default)] border border-[var(--color-border-default)] text-[var(--color-text-default)] hover:border-[var(--color-border-subtle)]"
              }`}
            >
              🤖 DeepSeek-OCR
            </button>
            <button
              onClick={() => handleTagClick("universities")}
              className={`flex px-[var(--spacing-14)] py-[var(--spacing-8)] items-center gap-[var(--spacing-4)] rounded-[var(--radius-12)] font-[Pretendard] text-sm font-medium leading-5 transition-all ${
                activeTag === "universities"
                  ? "bg-[var(--color-brand-default)] text-[var(--color-text-white)] hover:opacity-90"
                  : "bg-[var(--color-surface-default)] border border-[var(--color-border-default)] text-[var(--color-text-default)] hover:border-[var(--color-border-subtle)]"
              }`}
            >
              🤖 Universities are embracing AI
            </button>
            <button
              onClick={() => handleTagClick("ion")}
              className={`flex px-[var(--spacing-14)] py-[var(--spacing-8)] items-center gap-[var(--spacing-4)] rounded-[var(--radius-12)] font-[Pretendard] text-sm font-medium leading-5 transition-all ${
                activeTag === "ion"
                  ? "bg-[var(--color-brand-default)] text-[var(--color-text-white)] hover:opacity-90"
                  : "bg-[var(--color-surface-default)] border border-[var(--color-border-default)] text-[var(--color-text-default)] hover:border-[var(--color-border-subtle)]"
              }`}
            >
              🖊️ Ion stencils
            </button>
          </div>
        </div>

        <div className="flex items-start gap-[var(--spacing-24)] self-stretch pt-[var(--spacing-40)]">
          <div className="flex flex-col items-start gap-[var(--spacing-24)] flex-1">
            <h2 className="w-[469px] text-[var(--color-text-default)] font-[Pretendard] text-[24px] font-bold leading-[30px]">
              추천 논문
            </h2>

            <div className="flex flex-col items-start gap-[var(--spacing-24)] self-stretch">
              <PaperCard
                imageUrl="https://picsum.photos/228/128?random=1"
                title="Deaminative cross-coupling of amines by boryl radical β-scission"
                description="This is a description of the research paper. It will be truncated to two lines with ellipsis if it's too long to fit in the available space."
              />
              <PaperCard
                imageUrl="https://picsum.photos/228/128?random=1"
                title="Deaminative cross-coupling of amines by boryl radical β-scission"
                description="This is a description of the research paper. It will be truncated to two lines with ellipsis if it's too long to fit in the available space."
              />
              <PaperCard
                imageUrl="https://picsum.photos/228/128?random=1"
                title="Deaminative cross-coupling of amines by boryl radical β-scission"
                description="This is a description of the research paper. It will be truncated to two lines with ellipsis if it's too long to fit in the available space."
              />
            </div>
          </div>

          <aside className="flex flex-col items-start gap-[var(--spacing-20)]">
            <UserProfileCard
              username="iamfiro"
              subtitle="유저"
              profileImage="https://i.pravatar.cc/150?img=3"
            />
            <TrendingPapers
              papers={[
                {
                  id: 1,
                  title: "DeepSeek-OCR: Context Optical",
                  trendType: "single_up",
                },
                {
                  id: 2,
                  title: "Yuchan Han tried alcohol by ki...",
                  trendType: "double_up",
                },
                {
                  id: 3,
                  title: "Universities are embracing AI",
                  trendType: "double_down",
                },
                {
                  id: 4,
                  title: "Extreme confinement unleshe...",
                  trendType: "double_down",
                },
                {
                  id: 5,
                  title: "First known fossil hand of the...",
                  trendType: "single_up",
                },
              ]}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}
