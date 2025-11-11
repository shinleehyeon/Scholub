import { useState, useEffect } from "react";
import { Header } from "@/widgets/header";
import { SubHeader } from "@/widgets/sub-header";
import { Avatar, Button, Typography } from "@/shared/ui";
import LatestResearchCard from "@/entities/paper/ui/LatestResearchCard";
import { profileApi, type UserProfile } from "@/shared/api/profile";
import { useToast } from "@/shared/ui/Toast";

export default function ProfilePage() {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [reactionPapers, setReactionPapers] = useState<
    Array<{
      id: string;
      paperId: string;
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
      paperId: string;
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
      // 프로필 정보는 반드시 로드
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

      // 반응한 논문 목록 (실패해도 계속 진행)
      try {
        setLoadingReactions(true);
        const reactions = await profileApi.getReactionPapers();

        // API 응답을 Paper 형식으로 변환
        const formattedPapers = reactions.map((paper) => {
          // 이미지 URL 구성
          const imageUrl =
            paper.thumbnailUrl ||
            paper.imageUrl ||
            paper.coverImage ||
            "https://via.placeholder.com/228x128/CCCCCC/666666?text=No+Image";

          // 카테고리 포맷팅
          const category =
            paper.category ||
            (paper.categories ? paper.categories.join(" > ") : "분류 없음");

          // 설명
          const description = paper.description || paper.summary || "";

          return {
            id: paper.id,
            paperId: paper.paperId || paper.id,
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
        // 에러는 조용히 처리 (프로필은 표시되어야 함)
      } finally {
        setLoadingReactions(false);
      }

      // 토론한 논문 목록 (실패해도 계속 진행)
      try {
        setLoadingComments(true);
        const discussed = await profileApi.getDiscussedPapers();

        // API 응답을 Paper 형식으로 변환
        const formattedPapers = discussed.map((paper) => {
          // 이미지 URL 구성
          const imageUrl =
            paper.thumbnailUrl ||
            paper.imageUrl ||
            paper.coverImage ||
            "https://via.placeholder.com/228x128/CCCCCC/666666?text=No+Image";

          // 카테고리 포맷팅
          const category =
            paper.category ||
            (paper.categories ? paper.categories.join(" > ") : "분류 없음");

          // 설명
          const description = paper.description || paper.summary || "";

          return {
            id: paper.id,
            paperId: paper.paperId || paper.id,
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
        // 에러는 조용히 처리 (프로필은 표시되어야 함)
      } finally {
        setLoadingComments(false);
      }
    };

    fetchProfileData();
  }, [showToast]);

  // 반응한 논문 목록만 다시 불러오기
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

        // "내가 반응한 논문"이므로 항상 isLiked는 true여야 함
        // 하지만 API 응답에 myReaction이 없을 수도 있으므로 기본값을 true로 설정
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

  // 하트 클릭 시 호출되는 핸들러
  const handleReactionLikeChange = async (
    paperId: string,
    isLiked: boolean
  ) => {
    // 낙관적 업데이트: 즉시 UI 반영
    setReactionPapers((prev) => {
      if (!isLiked) {
        // 하트가 취소되면 목록에서 제거
        return prev.filter((paper) => paper.paperId !== paperId);
      } else {
        // 하트가 추가되면 목록에 있으면 상태만 업데이트, 없으면 추가하지 않음 (이미 목록에 있으므로)
        return prev.map((paper) =>
          paper.paperId === paperId ? { ...paper, isLiked: true } : paper
        );
      }
    });

    // API 요청이 완료된 후 서버 상태와 동기화
    // 하트가 취소되면 목록을 다시 불러와서 최신 상태 확인
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
            width: "721px",
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
                  {loadingProfile ? "로딩 중..." : profile?.name || ""}
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
                댓글
              </Typography.Subtext>
              <Typography.Headline color="default">
                {commentPapers.length}개
              </Typography.Headline>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              alignSelf: "stretch",
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
                    paperId={paper.paperId || paper.id}
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
              alignSelf: "stretch",
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
                <Typography.Body color="subtle">로딩 중...</Typography.Body>
              ) : commentPapers.length > 0 ? (
                commentPapers.map((paper) => (
                  <LatestResearchCard
                    key={paper.id}
                    paperId={paper.paperId || paper.id}
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
  );
}
