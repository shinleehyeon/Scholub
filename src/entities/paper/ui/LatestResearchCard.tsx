import { useState, useEffect, useRef } from "react";
import Heart from "@/shared/ui/icons/Heart";
import Message from "@/shared/ui/icons/Message";
import { Typography } from "@/shared/ui";
import { papersApi } from "@/shared/api/papers";
import { useToast } from "@/shared/ui/Toast";

interface LatestResearchCardProps {
  paperId: string;
  imageUrl: string;
  category: string;
  title: string;
  description: string;
  likes?: number;
  comments?: number;
  isLiked?: boolean;
  onLikeChange?: (paperId: string, isLiked: boolean) => void;
}

export default function LatestResearchCard({
  paperId,
  imageUrl,
  category,
  title,
  description,
  likes: initialLikes = 0,
  comments = 32,
  isLiked: initialIsLiked = false,
  onLikeChange,
}: LatestResearchCardProps) {
  const { showToast } = useToast();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);
  const hasUserInteracted = useRef(false);
  const previousPaperId = useRef(paperId);

  // paperId가 변경되면 상호작용 플래그 리셋 및 초기 상태 설정
  useEffect(() => {
    if (previousPaperId.current !== paperId) {
      hasUserInteracted.current = false;
      previousPaperId.current = paperId;
      setIsLiked(initialIsLiked);
      setLikes(initialLikes);
    }
  }, [paperId, initialIsLiked, initialLikes]);

  // prop이 변경될 때 상태 동기화 (사용자 상호작용이 없을 때만)
  useEffect(() => {
    if (!hasUserInteracted.current) {
      setIsLiked(initialIsLiked);
    }
  }, [initialIsLiked]);

  useEffect(() => {
    if (!hasUserInteracted.current) {
      setLikes(initialLikes);
    }
  }, [initialLikes]);

  const handleLikeClick = async () => {
    // 중복 클릭 방지
    if (isLoading) return;

    if (!paperId || paperId.trim() === "") {
      showToast("논문 ID가 유효하지 않습니다.", "error");
      return;
    }

    // 사용자 상호작용 플래그 설정
    hasUserInteracted.current = true;

    // 낙관적 업데이트: 즉시 UI 반영
    const previousIsLiked = isLiked;
    const previousLikes = likes;
    const newIsLiked = !previousIsLiked;
    const newLikes = newIsLiked
      ? previousLikes + 1
      : Math.max(0, previousLikes - 1);

    // 즉시 로딩 상태로 변경하여 중복 클릭 방지
    setIsLoading(true);
    setIsLiked(newIsLiked);
    setLikes(newLikes);

    // 부모 컴포넌트에 상태 변경 알림 (즉시)
    if (onLikeChange) {
      onLikeChange(paperId, newIsLiked);
    }

    try {
      // 현재 상태에 따라 LIKE 또는 UNLIKE 전송
      const reactionType = previousIsLiked ? "UNLIKE" : "LIKE";
      const result = await papersApi.toggleReaction(paperId, reactionType);

      console.log("API 응답:", result);

      // API 응답이 성공하면 낙관적 업데이트 유지
      // 좋아요 수가 응답에 포함되어 있으면 사용
      if (result.likeCount !== undefined) {
        setLikes(result.likeCount);
      }
      // isLiked는 낙관적 업데이트를 유지 (이미 위에서 업데이트했으므로 변경 없음)

      // 부모 컴포넌트에 최종 상태 알림 (낙관적 업데이트 상태 사용)
      if (onLikeChange) {
        onLikeChange(paperId, newIsLiked);
      }
    } catch (error) {
      // 에러 발생 시 롤백
      setIsLiked(previousIsLiked);
      setLikes(previousLikes);

      // 부모 컴포넌트에 롤백 알림
      if (onLikeChange) {
        onLikeChange(paperId, previousIsLiked);
      }

      console.error("좋아요 실패:", error);

      let errorMessage = "좋아요 처리에 실패했습니다.";
      if (error instanceof Error) {
        const message = error.message;

        // API 에러 메시지 처리
        if (
          message.includes("Invalid reference") ||
          message.includes("does not exist")
        ) {
          errorMessage = "해당 논문을 찾을 수 없습니다.";
        } else if (
          message.includes("401") ||
          message.includes("Unauthorized")
        ) {
          errorMessage = "로그인이 필요합니다.";
        } else if (message.includes("400") || message.includes("Bad Request")) {
          errorMessage = "잘못된 요청입니다. 논문 ID를 확인해주세요.";
        } else {
          errorMessage = message;
        }
      }

      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--spacing-24)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          flex: 1,
        }}
      >
        <Typography.Subtext color="brand" className="mb-[var(--spacing-4)]">
          {category}
        </Typography.Subtext>

        <Typography.BodyLarge color="default" className="mb-[var(--spacing-4)]">
          {title}
        </Typography.BodyLarge>

        <Typography.Subtext
          color="subtle"
          className="mb-[var(--spacing-12)] line-clamp-2"
        >
          {description}
        </Typography.Subtext>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-12)",
          }}
        >
          <button
            onClick={handleLikeClick}
            disabled={isLoading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-4)",
              background: "transparent",
              border: "none",
              cursor: isLoading ? "not-allowed" : "pointer",
              padding: 0,
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            <Heart size={14} filled={isLiked} />
            <Typography.Subtext color="subtle">{likes}</Typography.Subtext>
          </button>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-4)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <Message size={14} />
            <Typography.Subtext color="subtle">{comments}</Typography.Subtext>
          </button>
        </div>
      </div>

      <div
        style={{
          width: "228px",
          height: "128px",
          borderRadius: "var(--radius-10)",
          background: `url(${imageUrl}) lightgray 50% / cover no-repeat`,
          flexShrink: 0,
        }}
      />
    </div>
  );
}
