import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Heart from "@/shared/ui/icons/Heart";
import Message from "@/shared/ui/icons/Message";
import { Typography } from "@/shared/ui";
import { papersApi } from "@/shared/api/papers";
import { useToast } from "@/shared/ui/Toast";

interface LatestResearchCardProps {
  id: string;
  imageUrl: string;
  category: string;
  title: string;
  description: string;
  likes?: number;
  comments?: number;
  isLiked?: boolean;
  onLikeChange?: (id: string, isLiked: boolean) => void;
}

export default function LatestResearchCard({
  id,
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
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);
  const hasUserInteracted = useRef(false);
  const previousId = useRef(id);

  useEffect(() => {
    if (previousId.current !== id) {
      hasUserInteracted.current = false;
      previousId.current = id;
      setIsLiked(initialIsLiked);
      setLikes(initialLikes);
    }
  }, [id, initialIsLiked, initialLikes]);

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
    if (isLoading) return;

    if (!id || id.trim() === "") {
      showToast("논문 ID가 유효하지 않습니다.", "error");
      return;
    }

    hasUserInteracted.current = true;

    const previousIsLiked = isLiked;
    const previousLikes = likes;
    const newIsLiked = !previousIsLiked;
    const newLikes = newIsLiked
      ? previousLikes + 1
      : Math.max(0, previousLikes - 1);

    setIsLoading(true);
    setIsLiked(newIsLiked);
    setLikes(newLikes);

    if (onLikeChange) {
      onLikeChange(id, newIsLiked);
    }

    try {
      const reactionType = previousIsLiked ? "UNLIKE" : "LIKE";
      const result = await papersApi.toggleReaction(id, reactionType);

      console.log("API 응답:", result);

      if (result.likeCount !== undefined) {
        setLikes(result.likeCount);
      }

      if (onLikeChange) {
        onLikeChange(id, newIsLiked);
      }
    } catch (error) {
      setIsLiked(previousIsLiked);
      setLikes(previousLikes);

      if (onLikeChange) {
        onLikeChange(id, previousIsLiked);
      }

      console.error("좋아요 실패:", error);

      let errorMessage = "좋아요 처리에 실패했습니다.";
      if (error instanceof Error) {
        const message = error.message;

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

  const handleCardClick = () => {
    if (id) {
      navigate(`/papers/${id}`);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--spacing-24)",
        cursor: "pointer",
      }}
      onClick={handleCardClick}
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
          {category.split(" > ").slice(0, 3).join(" > ")}
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
            onClick={(e) => {
              e.stopPropagation();
              handleLikeClick();
            }}
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
            onClick={(e) => e.stopPropagation()}
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
