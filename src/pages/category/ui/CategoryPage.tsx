import { useParams } from "react-router-dom";
import { Header } from "@/widgets/header";
import { SubHeader } from "@/widgets/sub-header";
import LatestResearchCard from "@/entities/paper/ui/LatestResearchCard";
import Tag from "@/shared/ui/icons/Tag";
import { Typography } from "@/shared/ui";

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  // URL 인코딩된 카테고리 이름을 디코딩
  const categoryName = categoryId ? decodeURIComponent(categoryId) : "";

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div style={{ marginBottom: 0 }}>
        <SubHeader />
      </div>

      <div
        style={{
          display: "flex",
          padding: "var(--spacing-24) var(--padding)",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--spacing-32)",
          alignSelf: "stretch",
          maxWidth: "var(--layout-max-width)",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-14)",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "var(--spacing-12)",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "var(--radius-14)",
              background: "var(--color-surface-brand-subtle)",
            }}
          >
            <Tag size={24} color="#F7971D" />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "var(--spacing-4)",
            }}
          >
            <Typography.Subtext color="subtle">카테고리</Typography.Subtext>
            <Typography.Body
              style={{
                color: "#000",
                fontFamily: "Pretendard",
                fontSize: "17px",
                fontWeight: 500,
                lineHeight: "24px",
              }}
            >
              {categoryName}
            </Typography.Body>
          </div>

          <div
            style={{
              width: "1px",
              height: "52px",
              background: "var(--color-border-default)",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "var(--spacing-4)",
            }}
          >
            <Typography.Caption
              style={{
                color: "var(--color-text-subtle)",
                fontFamily: "Pretendard",
                fontSize: "12px",
                fontWeight: 500,
                lineHeight: "16px",
              }}
            >
              논문
            </Typography.Caption>
            <Typography.BodyLarge
              style={{
                color: "#000",
                fontFamily: "Pretendard",
                fontSize: "18px",
                fontWeight: 500,
                lineHeight: "24px",
              }}
            >
              52개
            </Typography.BodyLarge>
          </div>
        </div>

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
              imageUrl="https://via.placeholder.com/228x128/CCCCCC/666666?text=No+Image"
              category={`${categoryName} > 머신러닝`}
              title="Deaminative cross-coupling of amines by boryl radical β-scission"
              description="Amines are among the most common functional groups in bioactive molecules and pharmaceuticals,1-3 yet they are almost universally treated as synthetic endpoint..."
              likes={32}
              comments={32}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
