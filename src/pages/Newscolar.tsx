import Header from "@/widgets/Header";
import SubHeader from "@/widgets/SubHeader";
import PageLayout from "@/shared/ui/PageLayout";
import LatestResearchCard from "@/entities/paper/ui/LatestResearchCard";

export default function Newscolar() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div style={{ marginBottom: 0 }}>
        <SubHeader />
      </div>

      <PageLayout>
        <div
          style={{
            display: "flex",
            width: "721px",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "var(--spacing-24)",
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
      </PageLayout>
    </div>
  );
}
