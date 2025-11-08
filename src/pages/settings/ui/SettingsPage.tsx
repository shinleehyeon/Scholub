import { useState } from "react";
import type { KeyboardEvent } from "react";
import { Header } from "@/widgets/header";
import { SubHeader } from "@/widgets/sub-header";
import { Typography, Input, Chip, Button } from "@/shared/ui";
import X from "@/shared/ui/icons/X";
import { Check } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "notification">(
    "general"
  );
  const [journals, setJournals] = useState<string[]>([]);
  const [journalInput, setJournalInput] = useState("");
  const [minYear, setMinYear] = useState("");
  const [excludedFields] = useState<string[]>([
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
  ]);
  const [selectedFields, setSelectedFields] = useState<Set<string>>(
    new Set(["머신러닝"])
  );

  const handleAddJournal = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && journalInput.trim()) {
      setJournals([...journals, journalInput.trim()]);
      setJournalInput("");
    }
  };

  const handleRemoveJournal = (index: number) => {
    setJournals(journals.filter((_, i) => i !== index));
  };

  const handleToggleField = (field: string) => {
    const newSelected = new Set(selectedFields);
    if (newSelected.has(field)) {
      newSelected.delete(field);
    } else {
      newSelected.add(field);
    }
    setSelectedFields(newSelected);
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
            width: "721px",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "var(--spacing-24)",
          }}
        >
          <Typography.Headline
            color="default"
            style={{
              fontWeight: 700,
            }}
          >
            설정
          </Typography.Headline>

          <div
            style={{
              display: "flex",
              gap: "var(--spacing-10)",
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              style={{
                display: "flex",
                padding: "var(--spacing-10) var(--spacing-20)",
                justifyContent: "center",
                alignItems: "center",
                gap: "var(--spacing-10)",
                borderRadius: "var(--radius-9999)",
                background:
                  activeTab === "general"
                    ? "var(--color-surface-subtle)"
                    : "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Typography.Body color="subtle">일반</Typography.Body>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("notification")}
              style={{
                display: "flex",
                padding: "var(--spacing-10) var(--spacing-20)",
                justifyContent: "center",
                alignItems: "center",
                gap: "var(--spacing-10)",
                borderRadius: "var(--radius-9999)",
                background:
                  activeTab === "notification"
                    ? "var(--color-surface-subtle)"
                    : "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Typography.Body color="subtle">알림</Typography.Body>
            </button>
          </div>

          {activeTab === "general" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "var(--spacing-40)",
                alignSelf: "stretch",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "var(--spacing-12)",
                  alignSelf: "stretch",
                }}
              >
                <Typography.Body color="default">
                  관심 있는 저널
                </Typography.Body>

                <Input
                  placeholder="저널 이름을 입력후 엔터"
                  size="large"
                  value={journalInput}
                  onChange={(e) => setJournalInput(e.target.value)}
                  onKeyDown={handleAddJournal}
                  style={{ width: "267px" }}
                />

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "var(--spacing-8)",
                  }}
                >
                  {journals.map((journal, index) => (
                    <Chip
                      key={index}
                      status="default"
                      size="large"
                      trailingIcon={
                        <X
                          onClick={() => handleRemoveJournal(index)}
                          style={{
                            cursor: "pointer",
                            color: "var(--color-text-default)",
                          }}
                        />
                      }
                    >
                      {journal}
                    </Chip>
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "var(--spacing-12)",
                  alignSelf: "stretch",
                }}
              >
                <Typography.Body color="default">
                  최소 출판 연도
                </Typography.Body>

                <Input
                  placeholder="최소 출판 연도를 입력해주세요 (예 1990)"
                  size="large"
                  value={minYear}
                  onChange={(e) => setMinYear(e.target.value)}
                  style={{ width: "267px" }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "var(--spacing-12)",
                  alignSelf: "stretch",
                }}
              >
                <Typography.Body color="default">제외 할 분야</Typography.Body>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "var(--spacing-8)",
                  }}
                >
                  {excludedFields.map((field) => (
                    <Chip
                      key={field}
                      status={
                        selectedFields.has(field) ? "selected" : "default"
                      }
                      size="large"
                      useErrorColor={true}
                      leadingIcon={
                        selectedFields.has(field) ? (
                          <Check
                            size={18}
                            style={{ color: "var(--color-text-white)" }}
                          />
                        ) : undefined
                      }
                      onClick={() => handleToggleField(field)}
                      className="min-w-[120px] justify-center"
                    >
                      {field}
                    </Chip>
                  ))}
                </div>
              </div>

              <Button variant="primary" size="large">
                눌러서 저장하기
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
