import { useState } from "react";
import Header from "@/widgets/Header";
import ChevronLeft from "@/shared/ui/icons/ChevronLeft";
import Pause from "@/shared/ui/icons/Pause";
import ChevronRight from "@/shared/ui/icons/ChevronRight";

export default function Home() {
  const [activeTag, setActiveTag] = useState("deepseek");

  const handleTagClick = (tag: string) => {
    setActiveTag(tag);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="flex max-w-[var(--layout-max-width)] px-[var(--layout-padding)] flex-col items-start gap-[var(--spacing-10)] self-stretch mx-auto mt-[var(--spacing-20)]">
        <div
          className="flex h-[371px] px-[55px] pt-[251px] pb-[42px] flex-col justify-end items-start gap-[7px] self-stretch rounded-[var(--radius-16)]"
          style={{
            background: `
              linear-gradient(180deg, rgba(0, 0, 0, 0.00) 55.29%, #000 100%),
              linear-gradient(0deg, rgba(0, 0, 0, 0.10) 0%, rgba(0, 0, 0, 0.10) 100%),
              url('https://picsum.photos/1200/371') lightgray 50% / cover no-repeat
            `,
          }}
        >
          <h1 className="text-white font-[Pretendard] text-[32px] font-bold leading-[140%]">
            DeepSeek-OCR: Contexts Optical Compression
          </h1>

          <p className="text-white font-[Pretendard] text-[18px] font-medium leading-[26px]">
            Haoran Wei, Yaofeng Sun, Yukun Li (2025)
          </p>
        </div>

        <div className="flex items-start gap-[var(--spacing-8)] self-stretch">
          <div className="flex items-center gap-[var(--spacing-8)] px-[var(--spacing-10)] py-[var(--spacing-8)] rounded-[var(--radius-12)] bg-[var(--color-surface-subtle)] w-fit">
            <button className="flex items-center hover:opacity-70 transition-opacity">
              <div className="flex w-5 h-5 items-center gap-[10px] aspect-square">
                <ChevronLeft size={20} />
              </div>
            </button>

            <button className="flex items-center hover:opacity-70 transition-opacity">
              <div className="flex w-5 h-5 items-center gap-[10px] aspect-square">
                <Pause size={20} />
              </div>
            </button>

            <button className="flex items-center hover:opacity-70 transition-opacity">
              <div className="flex w-5 h-5 items-center gap-[10px] aspect-square">
                <ChevronRight size={20} />
              </div>
            </button>
          </div>

          <div className="flex items-center gap-[var(--spacing-8)] flex-wrap">
            <button
              onClick={() => handleTagClick("deepseek")}
              className={`flex px-[var(--spacing-14)] py-[var(--spacing-8)] items-center gap-[var(--spacing-4)] rounded-[var(--radius-12)] font-[Pretendard] text-sm font-medium leading-5 transition-all ${
                activeTag === "deepseek"
                  ? "bg-[var(--color-brand-default)] text-[var(--color-text-white)] hover:opacity-90"
                  : "bg-[var(--color-surface-default)] border border-[var(--color-border-default)] text-[var(--color-text-default)] hover:border-gray-400"
              }`}
            >
              🤖 DeepSeek-OCR
            </button>
            <button
              onClick={() => handleTagClick("universities")}
              className={`flex px-[var(--spacing-14)] py-[var(--spacing-8)] items-center gap-[var(--spacing-4)] rounded-[var(--radius-12)] font-[Pretendard] text-sm font-medium leading-5 transition-all ${
                activeTag === "universities"
                  ? "bg-[var(--color-brand-default)] text-[var(--color-text-white)] hover:opacity-90"
                  : "bg-[var(--color-surface-default)] border border-[var(--color-border-default)] text-[var(--color-text-default)] hover:border-gray-400"
              }`}
            >
              🤖 Universities are embracing AI
            </button>
            <button
              onClick={() => handleTagClick("ion")}
              className={`flex px-[var(--spacing-14)] py-[var(--spacing-8)] items-center gap-[var(--spacing-4)] rounded-[var(--radius-12)] font-[Pretendard] text-sm font-medium leading-5 transition-all ${
                activeTag === "ion"
                  ? "bg-[var(--color-brand-default)] text-[var(--color-text-white)] hover:opacity-90"
                  : "bg-[var(--color-surface-default)] border border-[var(--color-border-default)] text-[var(--color-text-default)] hover:border-gray-400"
              }`}
            >
              🖊️ Ion stencils
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
