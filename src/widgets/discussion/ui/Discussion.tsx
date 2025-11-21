import { useState, useRef, useEffect } from "react";
import MessageBubble from "@/shared/ui/icons/MessageBubble";
import X from "@/shared/ui/icons/X";
import Send from "@/shared/ui/icons/Send";
import Avatar from "@/shared/ui/Avatar";
import { Modal } from "@/shared/ui/Modal";
import type { DiscussionMessage } from "@/shared/api/papers";
import { papersApi } from "@/shared/api/papers";
import { profileApi, type UserProfile } from "@/shared/api/profile";
import { profanityFilter } from "@/shared/lib/profanity-filter";
import { useDiscussion } from "@/shared/lib/discussion-context";

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
  const [contextMenu, setContextMenu] = useState<{
    messageId: string;
    x: number;
    y: number;
  } | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [isProfanityModalOpen, setIsProfanityModalOpen] = useState(false);
  const { discussionMessage, setDiscussionMessage } = useDiscussion();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  // 낙관적 메시지 추적: tempId -> { content, timestamp, serverId? }
  // serverId는 서버 응답을 받으면 저장됨
  const pendingOptimisticMessages = useRef<
    Map<
      string,
      {
        content: string;
        timestamp: number;
        serverId?: string; // 서버에서 받은 실제 메시지 ID
      }
    >
  >(new Map());
  const shouldAutoScrollRef = useRef(true);
  const fetchMessagesRef = useRef<
    ((isInitialLoad?: boolean) => Promise<void>) | null
  >(null);

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

  // AI 답변 인용 메시지 처리
  useEffect(() => {
    if (discussionMessage) {
      setMessage(discussionMessage);
      setDiscussionMessage("");
      // textarea 높이 조정
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
      }
    }
  }, [discussionMessage, setDiscussionMessage]);

  // 메시지 초기 로드 및 폴링 (웹소켓처럼 새 메시지만 추가)
  useEffect(() => {
    if (!discussionId) {
      // 외부에서 전달된 메시지 사용
      if (externalMessages.length > 0) {
        setMessages(externalMessages);
      }
      return;
    }

    const fetchMessages = async (isInitialLoad = false) => {
      // 메시지 전송 중이면 폴링 스킵 (낙관적 업데이트 보호)
      // 전송 중에는 폴링을 완전히 스킵하여 낙관적 메시지가 사라지지 않도록 함
      if (!isInitialLoad && sending) {
        return;
      }

      // fetchMessages 함수를 ref에 저장하여 메시지 전송 완료 후 호출 가능하도록 함
      fetchMessagesRef.current = fetchMessages;

      try {
        if (isInitialLoad) {
          setLoading(true);
        }
        const messagesData = await papersApi.getDiscussionMessages(
          discussionId,
          1,
          20
        );
        const serverMessages = messagesData.messages || [];

        setMessages((prev) => {
          // 유효하지 않은 메시지 제거
          const validPrev = prev.filter((msg) => msg != null && msg.id != null);

          // 방법 4: 서버 응답에 메시지 ID가 있을 때만 업데이트
          // pendingOptimisticMessages에 등록된 모든 낙관적 메시지 ID (tempId)
          const optimisticTempIds = new Set(
            Array.from(pendingOptimisticMessages.current.keys())
          );

          // 서버 응답에 있는 실제 메시지 ID들 (서버에서 받은 ID)
          const serverMessageIds = new Set(
            serverMessages.map((msg) => msg?.id).filter(Boolean)
          );

          // 낙관적 메시지(temp-로 시작하는 ID) 추출
          // 서버 응답에 해당 메시지 ID가 없으면 유지, 있으면 교체 예정
          const optimisticMessages = validPrev.filter((msg) => {
            if (!msg || !msg.id) return false;
            // temp-로 시작하는 메시지만 낙관적 메시지로 간주
            if (!msg.id.startsWith("temp-")) return false;

            // 이 낙관적 메시지에 대응하는 서버 ID가 있는지 확인
            const tempInfo = pendingOptimisticMessages.current.get(msg.id);
            if (!tempInfo) return true; // 정보가 없으면 유지

            // 서버 응답에 실제 메시지 ID가 있으면 교체 대상 (제외)
            if (tempInfo.serverId && serverMessageIds.has(tempInfo.serverId)) {
              return false; // 서버 응답에 있으면 제외 (교체됨)
            }

            // 서버 응답에 없으면 유지
            return true;
          });

          // 낙관적 메시지를 제외한 일반 메시지만 처리
          const nonOptimisticMessages = validPrev.filter(
            (msg) =>
              msg &&
              msg.id &&
              !msg.id.startsWith("temp-") &&
              !optimisticTempIds.has(msg.id)
          );

          // 초기 로드면 서버 메시지로 설정 (낙관적 메시지는 유지)
          if (isInitialLoad && nonOptimisticMessages.length === 0) {
            const validServerMessages = serverMessages.filter(
              (msg) => msg != null && msg.id != null
            );
            // 낙관적 메시지와 함께 반환
            return [...validServerMessages, ...optimisticMessages].sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            );
          }

          // 기존 서버 메시지 ID 추출 (낙관적 메시지 제외)
          const existingMessageIds = new Set(
            nonOptimisticMessages.map((msg) => msg.id)
          );

          // 유효한 서버 메시지만 필터링
          const validServerMessages = serverMessages.filter(
            (msg) => msg != null && msg.id != null
          );

          // 새로 추가된 메시지만 찾기
          // 먼저 pendingOptimisticMessages를 확인하여 서버 응답에 나타난 낙관적 메시지 찾기
          const matchedOptimisticIds = new Set<string>(); // 삭제될 낙관적 메시지 ID

          console.log("[폴링] 낙관적 UI 감지 시작:", {
            pendingOptimisticMessagesCount:
              pendingOptimisticMessages.current.size,
            pendingOptimisticMessages: Array.from(
              pendingOptimisticMessages.current.entries()
            ).map(([id, info]) => ({
              optimisticId: id,
              serverId: info.serverId,
              content: info.content,
            })),
            serverMessageIds: Array.from(serverMessageIds),
            serverMessages: validServerMessages.map((msg) => ({
              id: msg.id,
              content: msg.content,
              userId: msg.userId,
            })),
          });

          // pendingOptimisticMessages를 순회하면서 서버 응답의 메시지 내용으로 매칭
          // 프론트엔드에서만 처리: 서버 응답의 메시지 내용과 낙관적 메시지 내용을 비교
          pendingOptimisticMessages.current.forEach((tempInfo, tempId) => {
            // 서버 응답에서 같은 내용의 메시지 찾기
            const matchedServerMessage = validServerMessages.find(
              (serverMsg) => {
                // 내용이 같고, 현재 사용자의 메시지인지 확인
                return (
                  serverMsg.content.trim() === tempInfo.content.trim() &&
                  serverMsg.userId === currentUser?.id
                );
              }
            );

            if (matchedServerMessage) {
              // 서버 응답에 같은 내용의 메시지가 있으면 삭제 대상
              matchedOptimisticIds.add(tempId);
              console.log("[폴링] 낙관적 UI 매칭됨 (내용 기반) - 교체 예정:", {
                optimisticId: tempId,
                serverMessageId: matchedServerMessage.id,
                content: tempInfo.content,
              });
            } else {
              console.log("[폴링] 낙관적 UI 매칭 안됨:", {
                optimisticId: tempId,
                content: tempInfo.content,
                currentUserId: currentUser?.id,
                serverMessagesWithSameContent: validServerMessages
                  .filter(
                    (msg) => msg.content.trim() === tempInfo.content.trim()
                  )
                  .map((msg) => ({
                    id: msg.id,
                    userId: msg.userId,
                  })),
              });
            }
          });

          console.log(
            "[폴링] 매칭된 낙관적 UI ID:",
            Array.from(matchedOptimisticIds)
          );

          const newMessages: DiscussionMessage[] = [];
          validServerMessages.forEach((msg) => {
            if (!msg) return;
            // 이미 있는 메시지는 제외 (중복 방지)
            if (existingMessageIds.has(msg.id)) return;

            // 낙관적 메시지 목록에도 이미 있는지 확인 (이미 교체되었을 수 있음)
            const existsInOptimistic = optimisticMessages.some(
              (optMsg) => optMsg && optMsg.id === msg.id
            );
            if (existsInOptimistic) return;

            // 이 메시지가 낙관적 메시지의 서버 응답인지 확인 (내용 기반)
            const isOptimisticMessage = Array.from(
              pendingOptimisticMessages.current.values()
            ).some(
              (tempInfo) =>
                tempInfo.content.trim() === msg.content.trim() &&
                msg.userId === currentUser?.id
            );

            if (isOptimisticMessage) {
              // 낙관적 메시지의 서버 응답 → 새 메시지로 추가 (낙관적 메시지가 삭제되고 이것으로 교체됨)
              newMessages.push(msg);
            } else {
              // 낙관적 메시지와 관련 없는 새 메시지 → 일반적으로 추가
              newMessages.push(msg);
            }
          });

          // 기존 메시지 중 업데이트된 내용이 있는지 확인 (낙관적 메시지 제외)
          const updatedMessages = validServerMessages.filter((serverMsg) => {
            // 낙관적 메시지의 서버 ID는 업데이트 대상에서 제외 (교체로 처리됨)
            // matchedOptimisticIds에 해당하는 서버 메시지는 교체용이므로 업데이트 제외
            let isOptimisticServerId = false;
            pendingOptimisticMessages.current.forEach((tempInfo) => {
              if (tempInfo.serverId === serverMsg.id) {
                isOptimisticServerId = true;
              }
            });
            if (isOptimisticServerId) return false;

            const existingMsg = nonOptimisticMessages.find(
              (m) => m && m.id === serverMsg.id
            );
            return (
              existingMsg &&
              (existingMsg.content !== serverMsg.content ||
                existingMsg.isEdited !== serverMsg.isEdited ||
                existingMsg.updatedAt !== serverMsg.updatedAt)
            );
          });

          // 변경사항이 없으면 이전 상태 참조 유지 (리렌더링 방지)
          // 방법 4: 교체될 낙관적 메시지가 있는지 먼저 확인
          const hasReplacement = Array.from(
            pendingOptimisticMessages.current.values()
          ).some(
            (tempInfo) =>
              tempInfo.serverId && serverMessageIds.has(tempInfo.serverId)
          );

          if (
            newMessages.length === 0 &&
            updatedMessages.length === 0 &&
            !hasReplacement
          ) {
            // 변경사항이 전혀 없으면 이전 참조 그대로 반환 (전체 새로고침 방지)
            return prev;
          }

          // 기존 메시지 업데이트 (낙관적 메시지는 이미 제외됨)
          // 변경된 메시지만 교체하고 나머지는 참조 유지 (리렌더링 최소화)
          const updatedNonOptimistic = nonOptimisticMessages.map((msg) => {
            if (!msg || !msg.id) return msg;
            // 수정 중인 메시지는 서버 응답으로 업데이트하지 않음 (사용자가 수정 중이므로)
            if (editingMessageId && msg.id === editingMessageId) {
              return msg; // 참조 유지
            }
            const updated = updatedMessages.find((m) => m && m.id === msg.id);
            // 변경사항이 없으면 원본 참조 유지
            return updated || msg;
          });

          // 방법 4 핵심: 낙관적 메시지 처리
          // 서버 응답에 해당 메시지 ID가 있으면 삭제, 없으면 유지
          const finalOptimisticMessages = optimisticMessages.filter((msg) => {
            // 삭제 대상이 아닌 낙관적 메시지만 유지
            const shouldKeep = !matchedOptimisticIds.has(msg.id);
            if (!shouldKeep) {
              console.log("[폴링] 낙관적 UI 삭제:", {
                optimisticId: msg.id,
                content: msg.content,
              });
            }
            return shouldKeep;
          });

          console.log("[폴링] 낙관적 메시지 처리:", {
            beforeCount: optimisticMessages.length,
            matchedCount: matchedOptimisticIds.size,
            afterCount: finalOptimisticMessages.length,
            keptOptimisticIds: finalOptimisticMessages.map((m) => m.id),
          });

          // 폴링에서 서버 응답에 메시지 ID가 나타나면 낙관적 UI를 삭제
          matchedOptimisticIds.forEach((tempId) => {
            const tempInfo = pendingOptimisticMessages.current.get(tempId);
            if (tempInfo?.serverId) {
              // 서버 응답에 메시지 ID가 나타났으므로 낙관적 메시지 삭제
              // 실제 메시지는 이미 newMessages에 포함되어 있음
              console.log("[폴링] pendingOptimisticMessages에서 제거:", {
                optimisticId: tempId,
                serverId: tempInfo.serverId,
              });
              pendingOptimisticMessages.current.delete(tempId);
            }
          });

          // 새 메시지 (이미 메시지 목록에 있는 메시지는 제외하여 중복 방지)
          const existingAllMessageIds = new Set([
            ...nonOptimisticMessages.map((m) => m.id),
            ...optimisticMessages.map((m) => m.id),
          ]);

          const otherNewMessages = newMessages.filter(
            (msg) => !existingAllMessageIds.has(msg.id)
          );

          // 최적화: 변경사항이 없으면 이전 참조 유지
          if (
            updatedNonOptimistic === nonOptimisticMessages &&
            otherNewMessages.length === 0 &&
            finalOptimisticMessages.length === optimisticMessages.length
          ) {
            // 모든 메시지가 변경되지 않았으면 이전 참조 그대로 반환
            return prev;
          }

          // 기존 메시지 ID 맵 생성 (참조 유지 확인용)
          const existingMessageMap = new Map(
            validPrev.map((msg) => [msg.id, msg])
          );

          // 최종 메시지 배열 구성 (참조 최대한 유지)
          const result: DiscussionMessage[] = [];

          // 1. 업데이트된 일반 메시지 (변경된 것만 교체)
          updatedNonOptimistic.forEach((msg) => {
            if (!msg || !msg.id) return;
            const existing = existingMessageMap.get(msg.id);
            // 참조가 같으면 유지, 다르면 교체
            result.push(existing === msg ? existing : msg);
          });

          // 2. 새 메시지 추가
          otherNewMessages.forEach((msg) => {
            result.push(msg);
          });

          // 3. 유지되는 낙관적 메시지 (참조 유지)
          finalOptimisticMessages.forEach((msg) => {
            const existing = existingMessageMap.get(msg.id);
            result.push(existing || msg);
          });

          // 시간순 정렬 (필요한 경우에만)
          const needsSort = otherNewMessages.length > 0;
          if (needsSort) {
            return result.sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            );
          }

          return result;
        });

        if (isInitialLoad) {
          setLoadedDiscussionId(discussionId);
          shouldAutoScrollRef.current = true; // 초기 로드 시 자동 스크롤 활성화
        }
      } catch (error) {
        console.error("메시지 가져오기 실패:", error);
      } finally {
        if (isInitialLoad) {
          setLoading(false);
        }
      }
    };

    // 초기 로드
    if (loadedDiscussionId !== discussionId) {
      fetchMessages(true);
    }

    // 3초마다 폴링 (새 메시지만 추가, 전송 중에는 스킵)
    const pollingInterval = setInterval(() => {
      fetchMessages(false);
    }, 3000);

    return () => {
      clearInterval(pollingInterval);
    };
  }, [
    discussionId,
    loadedDiscussionId,
    externalMessages,
    sending,
    editingMessageId,
    currentUser,
  ]);

  // 메시지 변경 시 자동 스크롤 (초기 로드 및 새 메시지 추가 시)
  useEffect(() => {
    if (!messages.length || !messagesContainerRef.current) return;

    // 초기 로드이거나 새 메시지가 추가된 경우에만 자동 스크롤
    if (shouldAutoScrollRef.current) {
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop =
            messagesContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [messages.length]);

  // 초기 로드 완료 시 자동 스크롤
  useEffect(() => {
    if (!loading && messages.length > 0 && messagesContainerRef.current) {
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop =
            messagesContainerRef.current.scrollHeight;
          shouldAutoScrollRef.current = true;
        }
      }, 200);
    }
  }, [loading, messages.length]);

  // 메시지에서 사용자 ID 추출 및 사용자 정보 가져오기
  useEffect(() => {
    if (!messages.length || !currentUser) return;

    const fetchUserProfiles = async () => {
      const userIds = new Set<string>();
      messages.forEach((msg) => {
        if (msg && msg.userId && msg.userId !== currentUser.id) {
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

  // 컨텍스트 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // 수정 모드로 전환될 때 textarea 포커스 및 높이 조정
  useEffect(() => {
    if (editingMessageId && editTextareaRef.current) {
      editTextareaRef.current.focus();
      editTextareaRef.current.style.height = "auto";
      editTextareaRef.current.style.height = `${editTextareaRef.current.scrollHeight}px`;
      // 커서를 텍스트 끝으로 이동
      editTextareaRef.current.setSelectionRange(
        editTextareaRef.current.value.length,
        editTextareaRef.current.value.length
      );
    }
  }, [editingMessageId]);

  // 메시지 수정
  const handleEditMessage = async (messageId: string) => {
    if (!discussionId || !editingContent.trim()) return;

    try {
      const updatedMessage = await papersApi.updateDiscussionMessage(
        discussionId,
        messageId,
        editingContent.trim()
      );

      console.log("수정된 메시지 응답:", updatedMessage);

      // 수정된 메시지만 업데이트 (전체 새로고침 방지)
      if (!updatedMessage) {
        console.error("메시지 수정 응답이 없습니다.");
        alert("메시지 수정에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      // 메시지 업데이트
      setMessages((prev) => {
        // null/undefined 필터링
        const validMessages = prev.filter(
          (msg) => msg != null && msg.id != null
        );

        // 수정된 메시지의 인덱스 찾기
        const messageIndex = validMessages.findIndex(
          (msg) => msg && msg.id === messageId
        );
        if (messageIndex === -1) {
          console.error("수정할 메시지를 찾을 수 없습니다:", messageId);
          return validMessages; // 메시지를 찾을 수 없으면 변경 없음
        }

        console.log("메시지 업데이트 전:", validMessages[messageIndex]);
        console.log("메시지 업데이트 후:", updatedMessage);

        // 수정된 메시지만 교체하고 나머지는 그대로 유지 (참조 유지로 재렌더링 방지)
        const updated = [...validMessages];
        updated[messageIndex] = updatedMessage;
        console.log("업데이트된 메시지 배열:", updated);
        return updated;
      });

      // 수정 모드 종료 (메시지 업데이트 후)
      setEditingMessageId(null);
      setEditingContent("");
    } catch (error) {
      console.error("메시지 수정 실패:", error);
      alert("메시지 수정에 실패했습니다. 다시 시도해주세요.");
      // 에러 발생 시에도 수정 모드 종료
      setEditingMessageId(null);
      setEditingContent("");
    }
  };

  // 메시지 삭제
  const handleDeleteMessage = async (messageId: string) => {
    if (!discussionId) return;

    if (!confirm("정말 이 메시지를 삭제하시겠습니까?")) {
      return;
    }

    try {
      await papersApi.deleteDiscussionMessage(discussionId, messageId);
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      setContextMenu(null);
    } catch (error) {
      console.error("메시지 삭제 실패:", error);
      alert("메시지 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 메시지 전송 함수 (낙관적 업데이트)
  const handleSendMessage = async () => {
    if (!message.trim() || !discussionId || sending || !currentUser) {
      return;
    }

    const messageContent = message.trim();

    // 욕설 감지
    if (profanityFilter.isProfane(messageContent)) {
      setIsProfanityModalOpen(true);
      return;
    }
    const optimisticId = `temp-${Date.now()}`;
    const timestamp = Date.now();
    setSending(true); // 폴링 일시 중단

    // 낙관적 메시지 추적에 추가 (폴링에서 보호하기 위해)
    pendingOptimisticMessages.current.set(optimisticId, {
      content: messageContent,
      timestamp: timestamp,
    });

    console.log("[낙관적 UI] 메시지 전송 - 낙관적 UI ID 저장:", {
      optimisticId,
      content: messageContent,
      timestamp,
      pendingOptimisticMessages: Array.from(
        pendingOptimisticMessages.current.keys()
      ),
    });

    // 낙관적 업데이트: 즉시 UI에 메시지 추가
    const optimisticMessage: DiscussionMessage = {
      id: optimisticId,
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

    // 메시지 전송 후 자동 스크롤
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
    }, 100);

    try {
      // 서버에 메시지 전송
      const createdMessage = await papersApi.createDiscussionMessage(
        discussionId,
        messageContent
      );

      // 서버 응답이 유효한 경우에만 업데이트
      // id가 없으면 그냥 넘어가고 낙관적 메시지 유지
      if (createdMessage && createdMessage.id) {
        // 낙관적 메시지를 실제 메시지로 교체 (참조 최적화)
        setMessages((prev) => {
          // 유효하지 않은 메시지 제거
          const validPrev = prev.filter((msg) => msg != null && msg.id != null);

          // 낙관적 메시지 찾기
          const optimisticIndex = validPrev.findIndex(
            (msg) => msg && msg.id === optimisticId
          );

          // 낙관적 메시지가 없으면 (이미 폴링으로 교체되었을 수 있음) 그냥 반환
          if (optimisticIndex === -1) {
            // 서버 메시지가 이미 있는지 확인
            const serverMessageExists = validPrev.some(
              (msg) => msg && msg.id === createdMessage.id
            );
            if (serverMessageExists) {
              return validPrev; // 이미 있으면 변경 없음
            }
            // 없으면 추가
            return [...validPrev, createdMessage].sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            );
          }

          // 프론트엔드에서만 처리: 서버 응답을 받아도 serverId를 저장하지 않음
          // 폴링에서 메시지 내용으로 매칭하여 교체함
          console.log("[서버 응답] 메시지 전송 완료:", {
            optimisticId,
            serverMessageId: createdMessage.id,
            content: messageContent,
            note: "폴링에서 내용 기반으로 매칭하여 교체됨",
          });

          // 낙관적 메시지를 실제 메시지로 교체 (UI 즉시 업데이트)
          // 하지만 pendingOptimisticMessages는 유지하여 폴링에서도 교체할 수 있도록 함
          const updated = [...validPrev];
          updated[optimisticIndex] = createdMessage;

          // 시간순 정렬
          const sorted = updated.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

          // 메시지 교체 후 자동 스크롤
          setTimeout(() => {
            if (messagesContainerRef.current) {
              messagesContainerRef.current.scrollTop =
                messagesContainerRef.current.scrollHeight;
            }
          }, 100);

          return sorted;
        });
      }
      // createdMessage.id가 없으면 그냥 넘어감 (낙관적 메시지 유지)

      // 메시지 전송 완료 후 서버에 저장되는 시간을 고려하여 약간의 지연 후 폴링 재개
      // 이렇게 하면 폴링이 실행될 때 서버에 메시지가 이미 저장되어 있을 가능성이 높음
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("메시지 전송 실패:", error);
      alert("메시지 전송에 실패했습니다. 다시 시도해주세요.");
      // 실패 시 낙관적 메시지 제거
      setMessages((prev) =>
        prev.filter(
          (msg) => msg != null && msg.id != null && msg.id !== optimisticId
        )
      );
      // 추적에서도 제거
      pendingOptimisticMessages.current.delete(optimisticId);
    } finally {
      // 폴링 재개
      setSending(false);

      // 메시지 전송 완료 후 즉시 한 번 폴링을 실행하여 서버에 저장된 메시지를 확인
      // 이렇게 하면 낙관적 메시지가 서버 응답으로 교체될 수 있음
      setTimeout(() => {
        if (fetchMessagesRef.current) {
          fetchMessagesRef.current(false);
        }
      }, 300);
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
        zIndex: 999,
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
        ref={messagesContainerRef}
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
          messages
            .filter((msg) => msg != null && msg.id != null)
            .map((msg) => {
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
                    position: "relative",
                  }}
                  onContextMenu={(e) => {
                    if (isCurrentUser) {
                      e.preventDefault();
                      setContextMenu({
                        messageId: msg.id,
                        x: e.clientX,
                        y: e.clientY,
                      });
                    }
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
                      position: "relative",
                      flex: 1,
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
                    {editingMessageId === msg.id ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-8)",
                          maxWidth: "315px",
                        }}
                      >
                        <textarea
                          ref={editTextareaRef}
                          value={editingContent}
                          onChange={(e) => {
                            setEditingContent(e.target.value);
                            if (editTextareaRef.current) {
                              editTextareaRef.current.style.height = "auto";
                              editTextareaRef.current.style.height = `${editTextareaRef.current.scrollHeight}px`;
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleEditMessage(msg.id);
                            }
                            if (e.key === "Escape") {
                              setEditingMessageId(null);
                              setEditingContent("");
                            }
                          }}
                          style={{
                            width: "100%",
                            minHeight: "40px",
                            maxHeight: "200px",
                            padding: "var(--spacing-10) var(--spacing-12)",
                            borderRadius: "var(--radius-14)",
                            border:
                              "1px solid var(--color-border-default, #EDEDED)",
                            background: "var(--color-surface-default, #FFFFFF)",
                            color: "var(--color-text-default, #322F29)",
                            fontFamily: "Pretendard",
                            fontSize: "14px",
                            fontStyle: "normal",
                            fontWeight: 500,
                            lineHeight: "20px",
                            resize: "none",
                            outline: "none",
                          }}
                          autoFocus
                        />
                        <div
                          style={{
                            display: "flex",
                            gap: "var(--spacing-8)",
                            justifyContent: "flex-end",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setEditingMessageId(null);
                              setEditingContent("");
                            }}
                            style={{
                              padding: "var(--spacing-6) var(--spacing-12)",
                              borderRadius: "var(--radius-8)",
                              border:
                                "1px solid var(--color-border-default, #EDEDED)",
                              background:
                                "var(--color-surface-default, #FFFFFF)",
                              color: "var(--color-text-default, #322F29)",
                              fontFamily: "Pretendard",
                              fontSize: "14px",
                              fontWeight: 500,
                              cursor: "pointer",
                            }}
                          >
                            취소
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditMessage(msg.id)}
                            style={{
                              padding: "var(--spacing-6) var(--spacing-12)",
                              borderRadius: "var(--radius-8)",
                              border: "none",
                              background:
                                "var(--color-surface-brand-default, #F7971D)",
                              color: "var(--color-text-white, #FFF)",
                              fontFamily: "Pretendard",
                              fontSize: "14px",
                              fontWeight: 500,
                              cursor: "pointer",
                            }}
                          >
                            저장
                          </button>
                        </div>
                      </div>
                    ) : (
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
                    )}
                  </div>
                </div>
              );
            })
        )}
      </div>

      {/* 컨텍스트 메뉴 */}
      {contextMenu && (
        <div
          style={{
            position: "fixed",
            top: Math.min(contextMenu.y, window.innerHeight - 100),
            left: Math.min(contextMenu.x + 20, window.innerWidth - 140),
            background: "var(--color-surface-default, #FFFFFF)",
            border: "1px solid var(--color-border-default, #EDEDED)",
            borderRadius: "var(--radius-8)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            zIndex: 50,
            minWidth: "120px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => {
              const message = messages.find(
                (m) => m.id === contextMenu.messageId
              );
              if (message) {
                setEditingMessageId(message.id);
                setEditingContent(message.content);
                setContextMenu(null);
              }
            }}
            style={{
              width: "100%",
              padding: "var(--spacing-10) var(--spacing-12)",
              border: "none",
              borderBottom: "1px solid var(--color-border-default, #EDEDED)",
              background: "transparent",
              color: "var(--color-text-default, #322F29)",
              fontFamily: "Pretendard",
              fontSize: "14px",
              fontWeight: 500,
              textAlign: "left",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "var(--color-surface-subtle, #F5F5F5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            수정
          </button>
          <button
            type="button"
            onClick={() => handleDeleteMessage(contextMenu.messageId)}
            style={{
              width: "100%",
              padding: "var(--spacing-10) var(--spacing-12)",
              border: "none",
              background: "transparent",
              color: "var(--color-text-danger, #DC3545)",
              fontFamily: "Pretendard",
              fontSize: "14px",
              fontWeight: 500,
              textAlign: "left",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "var(--color-surface-subtle, #F5F5F5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            삭제
          </button>
        </div>
      )}

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

      {/* 욕설 감지 모달 */}
      <Modal
        isOpen={isProfanityModalOpen}
        onClose={() => setIsProfanityModalOpen(false)}
        title="부적절한 언어 감지"
      >
        <p style={{ marginBottom: "var(--spacing-16)" }}>
          메시지에 부적절한 언어가 포함되어 있습니다. 건전한 토론 문화를 위해
          다른 표현을 사용해 주세요.
        </p>
        <button
          type="button"
          onClick={() => setIsProfanityModalOpen(false)}
          style={{
            width: "100%",
            padding: "var(--spacing-10) var(--spacing-16)",
            borderRadius: "var(--radius-8)",
            border: "none",
            background: "var(--color-surface-brand-default, #F7971D)",
            color: "var(--color-text-white, #FFF)",
            fontFamily: "Pretendard",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          확인
        </button>
      </Modal>
    </div>
  );
}
