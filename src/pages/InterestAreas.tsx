import { useState } from "react";
import Header from "@/widgets/Header";
import SubHeader from "@/widgets/SubHeader";
import { Chip } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { Check } from "lucide-react";

const interestAreas = [
  "머신러닝",
  "강화학습",
  "컴퓨터비전",
  "분류",
  "자연어처리",
  "딥러닝",
  "데이터마이닝",
  "패턴인식",
  "신경망",
  "이미지처리",
  "음성인식",
  "추천시스템",
  "시계열분석",
  "앙상블학습",
];

export default function InterestAreas() {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div style={{ marginBottom: 0 }}>
        <SubHeader />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 121px)",
          padding: "var(--spacing-48) var(--spacing-24)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--spacing-32)",
            width: "100%",
            maxWidth: "600px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--spacing-10)",
            }}
          >
            <h1
              style={{
                color: "var(--color-text-default)",
                fontFamily: "Pretendard",
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "30px",
                margin: 0,
              }}
            >
              관심 분야
            </h1>

            <p
              style={{
                color: "var(--color-text-subtle)",
                textAlign: "center",
                fontFamily: "Pretendard",
                fontSize: "17px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "24px",
                margin: 0,
              }}
            >
              관심있는 논문을 추천드리기 위해
              <br />
              아래에서 관심 분야를 선택해주세요.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--spacing-12)",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {interestAreas.map((area) => {
              const isSelected = selectedAreas.includes(area);
              return (
                <Chip
                  key={area}
                  status={isSelected ? "selected" : "default"}
                  size="large"
                  leadingIcon={
                    isSelected ? (
                      <Check size={17} style={{ color: "inherit" }} />
                    ) : (
                      <span style={{ width: "17px", height: "17px" }} />
                    )
                  }
                  onClick={() => toggleArea(area)}
                  className="min-w-[120px] justify-center"
                >
                  {area}
                </Chip>
              );
            })}
          </div>

          <Button variant="primary" size="large" fullWidth>
            완료
          </Button>
        </div>
      </div>
    </div>
  );
}
