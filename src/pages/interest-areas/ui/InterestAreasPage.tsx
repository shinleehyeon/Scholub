import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/widgets/header";
import { SubHeader } from "@/widgets/sub-header";
import { Chip } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { Input } from "@/shared/ui";
import { Typography } from "@/shared/ui";
import { useToast } from "@/shared/ui/Toast";
import { Check, Plus } from "lucide-react";
import { categoriesApi } from "@/shared/api/categories";
import { profileApi } from "@/shared/api/profile";
import { authApi } from "@/shared/api/auth";
import { authStorage } from "@/shared/lib/auth";
import type { Category } from "@/shared/api/categories";

interface RegisterState {
  email: string;
  password: string;
  name: string;
  profilePicture?: File;
}

export default function InterestAreas() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [registerData, setRegisterData] = useState<RegisterState | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const state = location.state as RegisterState | null;
    if (state && state.email && state.password && state.name) {
      setRegisterData(state);
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const categoriesData = await categoriesApi.getCategories();
        setCategories(categoriesData);

        if (!state) {
          try {
            const profile = await profileApi.getProfile();
            if (profile.interestedCategories) {
              setSelectedAreas(profile.interestedCategories);
            }
          } catch (error) {
            console.error("프로필 로드 실패:", error);
          }
        }
      } catch (error) {
        console.error("카테고리 로드 실패:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "카테고리를 불러오는데 실패했습니다.";
        showToast(errorMessage, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location]);

  const toggleArea = (areaId: string) => {
    setSelectedAreas((prev) =>
      prev.includes(areaId)
        ? prev.filter((a) => a !== areaId)
        : [...prev, areaId]
    );
  };

  const handleComplete = async () => {
    try {
      setSaving(true);

      if (registerData) {
        setIsRegistering(true);
        try {
          const response = await authApi.register({
            email: registerData.email,
            password: registerData.password,
            name: registerData.name,
            profilePicture: registerData.profilePicture,
            interestedCategories: selectedAreas,
          });

          authStorage.setTokens(
            response.data.accessToken,
            response.data.refreshToken
          );

          showToast("회원가입에 성공했습니다!", "success");
          navigate("/");
        } catch (error) {
          console.error("회원가입 실패:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "회원가입에 실패했습니다. 다시 시도해주세요.";
          showToast(errorMessage, "error");
          setIsRegistering(false);
          return;
        }
      } else {
        await profileApi.updateInterestedCategories(selectedAreas);
        showToast("관심 카테고리가 저장되었습니다!", "success");
        navigate("/");
      }
    } catch (error) {
      console.error("관심 카테고리 저장 실패:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "관심 카테고리 저장에 실패했습니다. 다시 시도해주세요.";
      showToast(errorMessage, "error");
    } finally {
      setSaving(false);
      setIsRegistering(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      return;
    }

    try {
      setAddingCategory(true);
      const newCategory: Category = {
        category: newCategoryName.trim(),
        count: 0,
      };
      setCategories((prev) => [...prev, newCategory]);
      setNewCategoryName("");
    } catch (error) {
      console.error("카테고리 추가 실패:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "카테고리 추가에 실패했습니다. 다시 시도해주세요.";
      showToast(errorMessage, "error");
    } finally {
      setAddingCategory(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddCategory();
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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 121px)",
          padding: "var(--spacing-48) var(--spacing-24)",
          marginTop: "121px",
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
            <Typography.Headline
              color="default"
              as="h1"
              style={{
                scrollMarginTop: "121px",
              }}
            >
              관심 분야
            </Typography.Headline>

            <Typography.Body color="subtle" className="text-center">
              관심있는 논문을 추천드리기 위해
              <br />
              아래에서 관심 분야를 선택해주세요.
            </Typography.Body>
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
            {loading ? (
              <div>로딩 중...</div>
            ) : categories.length > 0 ? (
              categories.map((category) => {
                const isSelected = selectedAreas.includes(category.category);
                return (
                  <Chip
                    key={category.category}
                    status={isSelected ? "selected" : "default"}
                    size="large"
                    leadingIcon={
                      isSelected ? (
                        <Check size={17} style={{ color: "inherit" }} />
                      ) : (
                        <span style={{ width: "17px", height: "17px" }} />
                      )
                    }
                    onClick={() => toggleArea(category.category)}
                  >
                    {category.category}
                  </Chip>
                );
              })
            ) : (
              <div>카테고리를 불러올 수 없습니다.</div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: "var(--spacing-12)",
              width: "100%",
              alignItems: "flex-end",
            }}
          >
            <Input
              fullWidth
              placeholder="새로운 관심 분야를 입력하세요"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={addingCategory}
            />
            <Button
              variant="primary"
              size="medium"
              onClick={handleAddCategory}
              disabled={!newCategoryName.trim() || addingCategory}
              leadingIcon={<Plus size={16} />}
            >
              추가
            </Button>
          </div>

          <Button
            variant="primary"
            size="large"
            fullWidth
            onClick={handleComplete}
            disabled={saving || loading || isRegistering}
            pending={saving || isRegistering}
          >
            {isRegistering ? "회원가입 중..." : saving ? "저장 중..." : "완료"}
          </Button>
        </div>
      </div>
    </div>
  );
}
