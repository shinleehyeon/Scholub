import { useState, useEffect } from "react";
import type { KeyboardEvent } from "react";
import { Header } from "@/widgets/header";
import { SubHeader } from "@/widgets/sub-header";
import { Typography, Input, Chip, Button, Switch } from "@/shared/ui";
import X from "@/shared/ui/icons/X";
import { Check } from "lucide-react";
import { preferencesApi } from "@/shared/api/preferences";
import { categoriesApi } from "@/shared/api/categories";
import { useToast } from "@/shared/ui/Toast";

export default function SettingsPage() {
  const { showToast } = useToast();
  const [journals, setJournals] = useState<string[]>([]);
  const [journalInput, setJournalInput] = useState("");
  const [minYear, setMinYear] = useState("");
  const [excludedFields, setExcludedFields] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const categories = await categoriesApi.getCategories();
        setExcludedFields(categories.map((cat) => cat.category));
      } catch (error) {
        console.error("카테고리 로드 실패:", error);
        setExcludedFields([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setLoading(true);
        const preferences = await preferencesApi.getPreferences();

        if (preferences.interestedCategories) {
          setJournals(preferences.interestedCategories);
        }

        if (preferences.minYear !== undefined && preferences.minYear !== null) {
          setMinYear(preferences.minYear.toString());
        }

        if (preferences.excludedCategories) {
          setSelectedFields(new Set(preferences.excludedCategories));
        }

        if (preferences.enableNotifications !== undefined) {
          setNotificationsEnabled(preferences.enableNotifications);
        }
      } catch (error) {
        console.error("설정 로드 실패:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "설정을 불러오는데 실패했습니다.";
        showToast(errorMessage, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [showToast]);

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

  const handleSave = async () => {
    try {
      setSaving(true);
      const minYearNumber = minYear ? parseInt(minYear, 10) : undefined;

      await preferencesApi.updatePreferences({
        interestedCategories: journals.length > 0 ? journals : undefined,
        excludedCategories: Array.from(selectedFields),
        minYear: minYearNumber,
        enableNotifications: notificationsEnabled,
      });

      showToast("설정이 저장되었습니다.", "success");
    } catch (error) {
      console.error("설정 저장 실패:", error);
      const errorMessage =
        error instanceof Error ? error.message : "설정 저장에 실패했습니다.";
      showToast(errorMessage, "error");
    } finally {
      setSaving(false);
    }
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
                관심 있는 카테고리
              </Typography.Body>

              <Input
                placeholder="카테고리를 입력후 엔터"
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
              <Typography.Body color="default">최소 출판 연도</Typography.Body>

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
                {loadingCategories ? (
                  <Typography.Body color="subtle">로딩 중...</Typography.Body>
                ) : excludedFields.length > 0 ? (
                  excludedFields.map((field) => (
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
                    >
                      {field}
                    </Chip>
                  ))
                ) : (
                  <Typography.Body color="subtle">
                    카테고리를 불러올 수 없습니다.
                  </Typography.Body>
                )}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "var(--spacing-20)",
                alignSelf: "stretch",
                paddingTop: "var(--spacing-20)",
                borderTop: "1px solid var(--color-border-default)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Typography.Body color="default">알림</Typography.Body>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
            </div>

            <Button
              variant="primary"
              size="large"
              onClick={handleSave}
              disabled={saving || loading}
            >
              {saving ? "저장 중..." : "눌러서 저장하기"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
