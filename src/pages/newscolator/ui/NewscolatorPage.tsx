import { Header } from "@/widgets/header";
import { SubHeader } from "@/widgets/sub-header";
import LatestResearchCard from "@/entities/paper/ui/LatestResearchCard";
import { AIAnswerSection } from "@/widgets/ai-answer-section";

export default function NewscolatorPage() {
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
            {Array.from({ length: 20 }, (_, index) => (
              <LatestResearchCard
                key={index}
                imageUrl="https://picsum.photos/228/128?random=1"
                category="인공지능 > 머신러닝"
                title="Deaminative cross-coupling of amines by boryl radical β-scission"
                description="Amines are among the most common functional groups in bioactive molecules and pharmaceuticals,1-3 yet they are almost universally treated as synthetic endpoint..."
                likes={32}
                comments={32}
              />
            ))}
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
