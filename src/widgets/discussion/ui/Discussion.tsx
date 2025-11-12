import { useState, useRef, useEffect } from "react";
import MessageBubble from "@/shared/ui/icons/MessageBubble";
import X from "@/shared/ui/icons/X";
import Send from "@/shared/ui/icons/Send";
import Avatar from "@/shared/ui/Avatar";
import type { DiscussionMessage } from "@/shared/api/papers";
import { papersApi } from "@/shared/api/papers";
import { profileApi, type UserProfile } from "@/shared/api/profile";

interface DiscussionProps {
  discussionId?: string;
  title?: string;
  conversationCount?: number;
  messages?: DiscussionMessage[];
  loading?: boolean;
  onClose?: () => void;
}

export default function Discussion({
  discussionId,
  title = "구글 브레인은 해당 연구를 하기에 타당한가?",
  conversationCount = 130,
  messages: externalMessages = [],
  onClose,
}: DiscussionProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [userProfiles, setUserProfiles] = useState<
    Record<string, { name: string; profileImageUrl?: string }>
  >({});
  const [messages, setMessages] = useState<DiscussionMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadedDiscussionId, setLoadedDiscussionId] = useState<string | null>(
    null
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 현재 사용자 프로필 가져오기
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const profile = await profileApi.getProfile();
        setCurrentUser(profile);
        // 현재 사용자 정보를 userProfiles에 추가
        setUserProfiles((prev) => ({
          ...prev,
          [profile.id]: {
            name: profile.name,
            profileImageUrl: profile.profileImageUrl,
          },
        }));
      } catch (error) {
        console.error("사용자 프로필 가져오기 실패:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  // 메시지 초기 로드 (한 번만 실행)
  useEffect(() => {
    if (!discussionId) {
      // 외부에서 전달된 메시지 사용
      if (externalMessages.length > 0) {
        setMessages(externalMessages);
      }
      return;
    }

    // 이미 로드한 discussionId면 다시 로드하지 않음
    if (loadedDiscussionId === discussionId) {
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const messagesData = await papersApi.getDiscussionMessages(
          discussionId,
          1,
          20
        );
        setMessages(messagesData.messages || []);
        setLoadedDiscussionId(discussionId);
      } catch (error) {
        console.error("메시지 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [discussionId, loadedDiscussionId, externalMessages]);

  // 메시지에서 사용자 ID 추출 및 사용자 정보 가져오기
  useEffect(() => {
    if (!messages.length || !currentUser) return;

    const fetchUserProfiles = async () => {
      const userIds = new Set<string>();
      messages.forEach((msg) => {
        if (msg.userId && msg.userId !== currentUser.id) {
          userIds.add(msg.userId);
        }
      });

      // 이미 가져온 사용자는 제외
      const missingUserIds = Array.from(userIds).filter(
        (id) => !userProfiles[id]
      );

      if (missingUserIds.length === 0) return;

      // 사용자 프로필 가져오기
      const newProfiles: Record<
        string,
        { name: string; profileImageUrl?: string }
      > = {};

      await Promise.all(
        missingUserIds.map(async (userId) => {
          try {
            const profile = await profileApi.getUserProfile(userId);
            if (profile && profile.name) {
              newProfiles[userId] = {
                name: profile.name,
                profileImageUrl: profile.profileImageUrl,
              };
            } else {
              // 프로필을 가져올 수 없으면 일단 빈 객체로 설정 (나중에 재시도)
              console.warn(`사용자 프로필을 가져올 수 없음: ${userId}`);
            }
          } catch (error) {
            console.error(`사용자 프로필 가져오기 실패 (${userId}):`, error);
            // 에러 발생 시에도 일단 빈 객체로 설정
          }
        })
      );

      if (Object.keys(newProfiles).length > 0) {
        setUserProfiles((prev) => ({ ...prev, ...newProfiles }));
      }
    };

    fetchUserProfiles();
  }, [messages, currentUser, userProfiles]);

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  // 메시지 전송 함수 (낙관적 업데이트)
  const handleSendMessage = async () => {
    if (!message.trim() || !discussionId || sending || !currentUser) {
      return;
    }

    const messageContent = message.trim();
    setSending(true);

    // 낙관적 업데이트: 즉시 UI에 메시지 추가
    const optimisticMessage: DiscussionMessage = {
      id: `temp-${Date.now()}`,
      discussionId: discussionId,
      userId: currentUser.id,
      content: messageContent,
      isEdited: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 낙관적 메시지를 즉시 추가
    setMessages((prev) => [...prev, optimisticMessage]);

    // 입력 필드 초기화
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      // 서버에 메시지 전송
      const createdMessage = await papersApi.createDiscussionMessage(
        discussionId,
        messageContent
      );

      // 낙관적 메시지를 실제 메시지로 교체
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== optimisticMessage.id);
        return [...filtered, createdMessage].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
    } catch (error) {
      console.error("메시지 전송 실패:", error);
      alert("메시지 전송에 실패했습니다. 다시 시도해주세요.");
      // 실패 시 낙관적 메시지 제거
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== optimisticMessage.id)
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        width: "512px",
        height: "calc(100vh - 121px)",
        flexDirection: "column",
        position: "fixed",
        top: "121px",
        right: 0,
        borderLeft: "1px solid var(--color-border-default)",
        background: "var(--color-surface-default)",
        boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.05)",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: "flex",
          padding: "var(--spacing-14)",
          justifyContent: "space-between",
          alignItems: "center",
          alignSelf: "stretch",
          borderBottom: "1px solid var(--color-border-default, #EDEDED)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-8)",
          }}
        >
          <MessageBubble size={20} color="var(--color-text-default)" />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "var(--spacing-4)",
            }}
          >
            <div
              style={{
                color: "#322F29",
                fontFamily: "Pretendard",
                fontSize: "17px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "24px",
              }}
            >
              {title}
            </div>
            <div
              style={{
                color: "var(--color-text-subtle, #7D7D7D)",
                fontFamily: "Pretendard",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "20px",
              }}
            >
              {conversationCount}+ 대화
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "4px",
          }}
        >
          <X size={20} color="var(--color-text-default)" />
        </button>
      </div>

      <div
        style={{
          display: "flex",
          padding: "var(--spacing-20) var(--spacing-14)",
          flexDirection: "column",
          gap: "var(--spacing-14)",
          flex: 1,
          alignSelf: "stretch",
          overflowY: "auto",
          minHeight: 0,
        }}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "var(--spacing-20)",
              color: "var(--color-text-subtle, #7D7D7D)",
              fontFamily: "Pretendard",
              fontSize: "14px",
            }}
          >
            메시지를 불러오는 중...
          </div>
        ) : messages.length === 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "var(--spacing-20)",
              color: "var(--color-text-subtle, #7D7D7D)",
              fontFamily: "Pretendard",
              fontSize: "14px",
            }}
          >
            아직 메시지가 없습니다.
          </div>
        ) : (
          messages.map((msg) => {
            const isCurrentUser = currentUser?.id === msg.userId;
            const userProfile = userProfiles[msg.userId];

            // 사용자 이름 결정: 현재 사용자는 이름, 다른 사용자는 프로필에서 가져온 이름 또는 로딩 중 표시
            let displayName: string;
            if (isCurrentUser) {
              displayName = currentUser?.name || "나";
            } else if (userProfile?.name) {
              displayName = userProfile.name;
            } else {
              // 프로필을 아직 가져오지 못한 경우 "사용자"로 표시 (ID 대신)
              displayName = "사용자";
            }

            const profileImageUrl = isCurrentUser
              ? currentUser?.profileImageUrl
              : userProfile?.profileImageUrl;

            return (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "var(--spacing-8)",
                  alignSelf: isCurrentUser ? "flex-end" : "flex-start",
                  flexDirection: isCurrentUser ? "row-reverse" : "row",
                }}
              >
                {profileImageUrl ? (
                  <Avatar src={profileImageUrl} alt={displayName} size={34} />
                ) : (
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      background: isCurrentUser
                        ? "linear-gradient(135deg, #F7971D 0%, #FFB84D 100%)"
                        : "linear-gradient(135deg, #90EE90 0%, #87CEEB 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      border: "2px solid var(--color-surface-default)",
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: "#FFD700",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      ⭐
                    </div>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isCurrentUser ? "flex-end" : "flex-start",
                    gap: "var(--spacing-4)",
                  }}
                >
                  <div
                    style={{
                      color: "var(--color-text-subtle, #7D7D7D)",
                      fontFamily: "Pretendard",
                      fontSize: "12px",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "16px",
                    }}
                  >
                    {displayName} | {formatDate(msg.createdAt)}
                    {msg.isEdited && " (수정됨)"}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      maxWidth: "315px",
                      padding: "var(--spacing-10) var(--spacing-12)",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                      borderRadius: "var(--radius-14)",
                      background: isCurrentUser
                        ? "var(--color-surface-brand-default, #F7971D)"
                        : "var(--color-surface-default, #FFFFFF)",
                      border: isCurrentUser
                        ? "none"
                        : "1px solid var(--color-border-default, #EDEDED)",
                    }}
                  >
                    <div
                      style={{
                        color: isCurrentUser
                          ? "var(--color-text-white, #FFF)"
                          : "var(--color-text-default, #322F29)",
                        fontFamily: "Pretendard",
                        fontSize: "14px",
                        fontStyle: "normal",
                        fontWeight: 500,
                        lineHeight: "20px",
                        wordBreak: "break-word",
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div
        style={{
          display: "flex",
          padding: "var(--spacing-14)",
          flexDirection: "column",
          gap: "var(--spacing-12)",
          alignSelf: "stretch",
          borderTop: "1px solid var(--color-border-default, #EDEDED)",
          background: "var(--color-surface-default)",
        }}
      >
        <div
          style={{
            display: "flex",
            padding: "var(--spacing-14) var(--spacing-16)",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "var(--spacing-8)",
            alignSelf: "stretch",
            borderRadius: "var(--radius-16)",
            background: "var(--color-surface-subtle, #F9F9F9)",
          }}
        >
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메시지를 입력하세요"
            rows={1}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: "Pretendard",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "20px",
              color: "var(--color-text-default, #322F29)",
              resize: "none",
              overflow: "hidden",
              minHeight: "20px",
              maxHeight: "120px",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
            }}
          />
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!message.trim() || sending || !discussionId}
            style={{
              display: "flex",
              padding: "var(--spacing-8) var(--spacing-12)",
              alignItems: "center",
              gap: "var(--spacing-6)",
              borderRadius: "var(--radius-9999)",
              background:
                !message.trim() || sending || !discussionId
                  ? "var(--color-surface-subtle, #F9F9F9)"
                  : "var(--color-surface-brand-default, #F7971D)",
              border: "none",
              cursor:
                !message.trim() || sending || !discussionId
                  ? "not-allowed"
                  : "pointer",
              alignSelf: "flex-end",
              opacity: !message.trim() || sending || !discussionId ? 0.6 : 1,
            }}
          >
            <Send
              size={16}
              color={
                !message.trim() || sending || !discussionId
                  ? "var(--color-text-subtle, #7D7D7D)"
                  : "var(--color-text-white, #FFF)"
              }
            />
            <div
              style={{
                color:
                  !message.trim() || sending || !discussionId
                    ? "var(--color-text-subtle, #7D7D7D)"
                    : "var(--color-text-white, #FFF)",
                fontFamily: "Pretendard",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "20px",
              }}
            >
              {sending ? "전송 중..." : "보내기"}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
