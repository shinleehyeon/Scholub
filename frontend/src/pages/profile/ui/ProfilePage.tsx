import { useState, useEffect, useRef } from "react";
import { Header } from "@/widgets/header";
import { SubHeader } from "@/widgets/sub-header";
import {
  Avatar,
  Button,
  Typography,
  PaperCardSkeleton,
  Skeleton,
  Input,
} from "@/shared/ui";
import LatestResearchCard from "@/entities/paper/ui/LatestResearchCard";
import { profileApi, type UserProfile } from "@/shared/api/profile";
import { useToast } from "@/shared/ui/Toast";
import Camera from "@/shared/ui/icons/Camera";
import Close from "@/shared/ui/icons/Close";

export default function ProfilePage() {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [reactionPapers, setReactionPapers] = useState<
    Array<{
      id: string;
      title: string;
      description: string;
      category: string;
      imageUrl: string;
      likes: number;
      comments: number;
      isLiked: boolean;
    }>
  >([]);
  const [commentPapers, setCommentPapers] = useState<
    Array<{
      id: string;
      title: string;
      description: string;
      category: string;
      imageUrl: string;
      likes: number;
      comments: number;
      isLiked: boolean;
    }>
  >([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingReactions, setLoadingReactions] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoadingProfile(true);
        const profileData = await profileApi.getProfile();
        setProfile(profileData);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "프로필을 불러오는데 실패했습니다.";
        showToast(errorMessage, "error");
      } finally {
        setLoadingProfile(false);
      }

      try {
        setLoadingReactions(true);
        const reactions = await profileApi.getReactionPapers();

        const formattedPapers = reactions.map((paper) => {
          const imageUrl =
            paper.thumbnailUrl ||
            paper.imageUrl ||
            paper.coverImage ||
            "https://via.placeholder.com/228x128/CCCCCC/666666?text=No+Image";

          const category =
            paper.category ||
            (paper.categories ? paper.categories.join(" > ") : "분류 없음");

          const description = paper.description || paper.summary || "";

          return {
            id: paper.id,
            title: paper.title,
            description,
            category,
            imageUrl,
            likes: paper.likes || paper.likeCount || 0,
            comments: paper.comments || paper.commentCount || 0,
            isLiked: paper.myReaction?.isLiked || false,
          };
        });

        setReactionPapers(formattedPapers);
      } catch (err) {
        console.error("반응한 논문 로드 실패:", err);
        setReactionPapers([]);
      } finally {
        setLoadingReactions(false);
      }

      try {
        setLoadingComments(true);
        const discussed = await profileApi.getDiscussedPapers();

        const formattedPapers = discussed.map((paper) => {
          const imageUrl =
            paper.thumbnailUrl ||
            paper.imageUrl ||
            paper.coverImage ||
            "https://via.placeholder.com/228x128/CCCCCC/666666?text=No+Image";

          const category =
            paper.category ||
            (paper.categories ? paper.categories.join(" > ") : "분류 없음");

          const description = paper.description || paper.summary || "";

          return {
            id: paper.id,
            title: paper.title,
            description,
            category,
            imageUrl,
            likes: paper.likes || paper.likeCount || 0,
            comments: paper.comments || paper.commentCount || 0,
            isLiked: paper.myReaction?.isLiked || false,
          };
        });

        setCommentPapers(formattedPapers);
      } catch (err) {
        console.error("토론한 논문 로드 실패:", err);
        setCommentPapers([]);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchProfileData();
  }, [showToast]);

  const fetchReactionPapers = async () => {
    try {
      setLoadingReactions(true);
      const reactions = await profileApi.getReactionPapers();

      const formattedPapers = reactions.map((paper) => {
        const imageUrl =
          paper.thumbnailUrl ||
          paper.imageUrl ||
          paper.coverImage ||
          "https://via.placeholder.com/228x128/CCCCCC/666666?text=No+Image";

        const category =
          paper.category ||
          (paper.categories ? paper.categories.join(" > ") : "분류 없음");

        const description = paper.description || paper.summary || "";

        const isLiked = paper.myReaction?.isLiked ?? true;

        console.log("반응한 논문:", {
          id: paper.id,
          title: paper.title,
          myReaction: paper.myReaction,
          isLiked,
        });

        return {
          id: paper.id,
          paperId: paper.paperId || paper.id,
          title: paper.title,
          description,
          category,
          imageUrl,
          likes: paper.likes || paper.likeCount || 0,
          comments: paper.comments || paper.commentCount || 0,
          isLiked,
        };
      });

      setReactionPapers(formattedPapers);
    } catch (err) {
      console.error("반응한 논문 로드 실패:", err);
      setReactionPapers([]);
    } finally {
      setLoadingReactions(false);
    }
  };

  const handleReactionLikeChange = async (id: string, isLiked: boolean) => {
    setReactionPapers((prev) => {
      if (!isLiked) {
        return prev.filter((paper) => paper.id !== id);
      } else {
        return prev.map((paper) =>
          paper.id === id ? { ...paper, isLiked: true } : paper
        );
      }
    });

    if (!isLiked) {
      try {
        await fetchReactionPapers();
      } catch (err) {
        console.error("반응한 논문 목록 갱신 실패:", err);
      }
    }
  };

  const handleEditProfile = () => {
    setEditName(profile?.name || "");
    setPreviewUrl(profile?.profileImageUrl || null);
    setSelectedFile(null);
    setIsEditModalOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 체크 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast("파일 크기는 5MB를 초과할 수 없습니다.", "error");
        return;
      }

      // 파일 타입 체크
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validTypes.includes(file.type)) {
        showToast("JPG, JPEG, PNG, GIF, WEBP 형식만 지원됩니다.", "error");
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);

      const updateData: { name?: string; profilePicture?: File } = {};

      if (editName.trim() && editName !== profile?.name) {
        updateData.name = editName.trim();
      }

      if (selectedFile) {
        updateData.profilePicture = selectedFile;
      }

      if (Object.keys(updateData).length === 0) {
        showToast("변경된 내용이 없습니다.", "info");
        setIsEditModalOpen(false);
        return;
      }

      const updatedProfile = await profileApi.updateProfile(updateData);
      setProfile(updatedProfile);
      showToast("프로필이 업데이트되었습니다.", "success");
      setIsEditModalOpen(false);

      // 미리보기 URL 정리
      if (previewUrl && selectedFile) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedFile(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "프로필 업데이트에 실패했습니다.";
      showToast(errorMessage, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCloseModal = () => {
    if (previewUrl && selectedFile) {
      URL.revokeObjectURL(previewUrl);
    }
    setIsEditModalOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="min-h-screen bg-white" style={{ marginTop: "121px" }}>
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
            width: "1000px",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "var(--spacing-32)",
          }}
        >
          <Typography.Headline
            color="default"
            style={{
              fontWeight: 700,
            }}
          >
            프로필
          </Typography.Headline>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              alignSelf: "stretch",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-20)",
              }}
            >
              <Avatar
                src={profile?.profileImageUrl || ""}
                alt="프로필 이미지"
                size={100}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "var(--spacing-6)",
                }}
              >
                <Typography.Headline color="default">
                  {loadingProfile ? (
                    <Skeleton width="120px" height="30px" />
                  ) : (
                    profile?.name || ""
                  )}
                </Typography.Headline>
                <Typography.BodyLarge color="subtle">
                  {profile?.email || ""}
                </Typography.BodyLarge>
              </div>
            </div>

            <Button
              variant="secondary"
              size="medium"
              onClick={handleEditProfile}
            >
              프로필 수정
            </Button>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-24)",
              alignSelf: "stretch",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "var(--spacing-4)",
              }}
            >
              <Typography.Subtext
                color="subtle"
                style={{
                  lineHeight: "140%",
                }}
              >
                논문 반응
              </Typography.Subtext>
              <Typography.Headline color="default">
                {reactionPapers.length}개
              </Typography.Headline>
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
              <Typography.Subtext
                color="subtle"
                style={{
                  lineHeight: "140%",
                }}
              >
                토론 참여
              </Typography.Subtext>
              <Typography.Headline color="default">
                {commentPapers.length}개
              </Typography.Headline>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "48px",
              alignSelf: "stretch",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Typography.BodyLarge
                color="default"
                style={{
                  alignSelf: "stretch",
                  textAlign: "left",
                }}
              >
                내가 반응한 논문
              </Typography.BodyLarge>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--spacing-24)",
                  width: "100%",
                  marginTop: "var(--spacing-12)",
                }}
              >
                {loadingReactions ? (
                  <Typography.Body color="subtle">로딩 중...</Typography.Body>
                ) : reactionPapers.length > 0 ? (
                  reactionPapers.map((paper) => (
                    <LatestResearchCard
                      key={paper.id}
                      id={paper.id}
                      imageUrl={paper.imageUrl || ""}
                      category={paper.category || "분류 없음"}
                      title={paper.title || ""}
                      description={paper.description || ""}
                      likes={paper.likes || 0}
                      comments={paper.comments || 0}
                      isLiked={paper.isLiked || false}
                      onLikeChange={handleReactionLikeChange}
                    />
                  ))
                ) : (
                  <Typography.Body color="subtle">
                    반응한 논문이 없습니다.
                  </Typography.Body>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  marginTop: "var(--spacing-24)",
                }}
              >
                <Button variant="secondary" size="medium">
                  더보기
                </Button>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Typography.BodyLarge
                color="default"
                style={{
                  alignSelf: "stretch",
                  textAlign: "left",
                }}
              >
                내가 토론한 논문
              </Typography.BodyLarge>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--spacing-24)",
                  width: "100%",
                  marginTop: "var(--spacing-12)",
                }}
              >
                {loadingComments ? (
                  <>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <PaperCardSkeleton key={i} />
                    ))}
                  </>
                ) : commentPapers.length > 0 ? (
                  commentPapers.map((paper) => (
                    <LatestResearchCard
                      key={paper.id}
                      id={paper.id}
                      imageUrl={paper.imageUrl || ""}
                      category={paper.category || "분류 없음"}
                      title={paper.title || ""}
                      description={paper.description || ""}
                      likes={paper.likes || 0}
                      comments={paper.comments || 0}
                      isLiked={paper.isLiked || false}
                    />
                  ))
                ) : (
                  <Typography.Body color="subtle">
                    댓글 작성한 논문이 없습니다.
                  </Typography.Body>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  marginTop: "var(--spacing-24)",
                }}
              >
                <Button variant="secondary" size="medium">
                  더보기
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 프로필 수정 모달 */}
      {isEditModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "var(--radius-12)",
              padding: "var(--spacing-32)",
              width: "500px",
              maxWidth: "90%",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "var(--spacing-24)",
              }}
            >
              <Typography.Headline color="default">
                프로필 수정
              </Typography.Headline>
              <button
                onClick={handleCloseModal}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "var(--spacing-4)",
                }}
              >
                <Close size={24} />
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-24)",
              }}
            >
              {/* 프로필 사진 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "var(--spacing-12)",
                }}
              >
                <div style={{ position: "relative" }}>
                  <Avatar
                    src={previewUrl || profile?.profileImageUrl || ""}
                    alt="프로필 이미지"
                    size={120}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      backgroundColor: "var(--color-brand-default)",
                      border: "3px solid white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Camera size={18} color="white" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                  />
                </div>
                <Typography.Subtext color="subtle">
                  JPG, JPEG, PNG, GIF, WEBP (최대 5MB)
                </Typography.Subtext>
              </div>

              {/* 이름 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--spacing-8)",
                }}
              >
                <Typography.Body color="default">이름</Typography.Body>
                <Input
                  size="large"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="이름을 입력하세요"
                />
              </div>

              {/* 버튼 */}
              <div
                style={{
                  display: "flex",
                  gap: "var(--spacing-12)",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="secondary"
                  size="medium"
                  onClick={handleCloseModal}
                  disabled={saving}
                >
                  취소
                </Button>
                <Button
                  variant="primary"
                  size="medium"
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? "저장 중..." : "저장"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
