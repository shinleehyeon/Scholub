import { useState, useEffect } from "react";
import { Header } from "@/widgets/header";
import { SubHeader } from "@/widgets/sub-header";
import { Avatar, Button, Typography, PaperCardSkeleton, Skeleton } from "@/shared/ui";
import LatestResearchCard from "@/entities/paper/ui/LatestResearchCard";
import { profileApi, type UserProfile } from "@/shared/api/profile";
import { useToast } from "@/shared/ui/Toast";

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

            <Button variant="secondary" size="medium">
              프로필 사진 수정
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
    </div>
  );
}
