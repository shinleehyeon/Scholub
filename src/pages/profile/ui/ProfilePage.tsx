import { useState, useEffect } from "react";
import { Header } from "@/widgets/header";
import { SubHeader } from "@/widgets/sub-header";
import { Avatar, Button, Typography } from "@/shared/ui";
import LatestResearchCard from "@/entities/paper/ui/LatestResearchCard";
import { profileApi, type UserProfile, type Paper } from "@/shared/api/profile";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [reactionPapers, setReactionPapers] = useState<Paper[]>([]);
  const [commentPapers, setCommentPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const [profileData, reactions, comments] = await Promise.all([
          profileApi.getProfile(),
          profileApi.getReactionPapers(),
          profileApi.getCommentPapers(),
        ]);
        setProfile(profileData);
        setReactionPapers(reactions);
        setCommentPapers(comments);
      } catch (err) {
        setError(err instanceof Error ? err.message : "프로필을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);
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
                src={profile?.avatarUrl || "https://picsum.photos/100/100?random=profile"}
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
                  {profile?.name || "로딩 중..."}
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
                {profile?.reactionCount || 0}개
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
                {profile?.commentCount || 0}개
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
              {loading ? (
                <Typography.Body color="subtle">로딩 중...</Typography.Body>
              ) : error ? (
                <Typography.Body color="subtle">{error}</Typography.Body>
              ) : reactionPapers.length > 0 ? (
                reactionPapers.map((paper) => (
                  <LatestResearchCard
                    key={paper.id}
                    imageUrl={paper.imageUrl}
                    category={paper.category}
                    title={paper.title}
                    description={paper.description}
                    likes={paper.likes}
                    comments={paper.comments}
                  />
                ))
              ) : (
                <Typography.Body color="subtle">반응한 논문이 없습니다.</Typography.Body>
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
              내가 댓글 작성한 논문
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
              {loading ? (
                <Typography.Body color="subtle">로딩 중...</Typography.Body>
              ) : error ? (
                <Typography.Body color="subtle">{error}</Typography.Body>
              ) : commentPapers.length > 0 ? (
                commentPapers.map((paper) => (
                  <LatestResearchCard
                    key={paper.id}
                    imageUrl={paper.imageUrl}
                    category={paper.category}
                    title={paper.title}
                    description={paper.description}
                    likes={paper.likes}
                    comments={paper.comments}
                  />
                ))
              ) : (
                <Typography.Body color="subtle">댓글 작성한 논문이 없습니다.</Typography.Body>
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
