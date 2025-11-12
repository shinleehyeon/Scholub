import { useState, useEffect } from "react";
import Sparkles from "@/shared/ui/icons/Sparkles";
import Close from "@/shared/ui/icons/Close";
import Send from "@/shared/ui/icons/Send";
import X from "@/shared/ui/icons/X";
import ExternalLink from "@/shared/ui/icons/ExternalLink";
import { papersApi } from "@/shared/api/papers";

interface AIChatProps {
  onClose?: () => void;
  initialMessage?: string;
  paperTitle?: string;
  paperId?: string;
  paperUrl?: string;
  hasDiscussion?: boolean;
}

export default function AIChat({
  onClose,
  initialMessage,
  paperTitle,
  paperId,
  paperUrl,
  hasDiscussion = false,
}: AIChatProps) {
  const [message, setMessage] = useState("");
  const [contextText, setContextText] = useState<string>("");
  const [isHoveringContext, setIsHoveringContext] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ text: string; isUser: boolean }>
  >([]);
  const [isThinking, setIsThinking] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (initialMessage) {
      setContextText(initialMessage);
    }
  }, [initialMessage]);

  useEffect(() => {
    const startSession = async () => {
      if (paperId && !sessionId) {
        try {
          const result = await papersApi.startChatSession(paperId);
          setSessionId(result.activityId);
        } catch (error) {
          console.error("채팅 세션 시작 실패:", error);
        }
      }
    };
    startSession();
  }, [paperId, sessionId]);

  const suggestedQuestions = [
    "이 논문의 주요 기여도는 무엇인가요?",
    "연구 방법론을 자세히 설명해주세요",
    "실험 결과의 의미는 무엇인가요?",
  ];

  const handleSendMessage = () => {
    const fullMessage = contextText
      ? `${contextText}\n${message}`.trim()
      : message.trim();
    if (fullMessage) {
      setMessages([...messages, { text: fullMessage, isUser: true }]);
      setMessage("");
      setContextText("");
      setIsThinking(true);

      setTimeout(() => {
        setIsThinking(false);
        setMessages((prev) => [
          ...prev,
          { text: "AI 응답 메시지입니다.", isUser: false },
        ]);
      }, 2000);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        width: "512px",
        height: "calc(100vh - 121px)",
        padding: "var(--spacing-16)",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        top: "121px",
        right: 0,
        borderLeft: "1px solid var(--color-border-default)",
        background: "var(--color-surface-subtle)",
        boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.05)",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: "flex",
          padding: "0 var(--spacing-4)",
          justifyContent: "space-between",
          alignItems: "center",
          alignSelf: "stretch",
        }}
      >
        <div
          style={{
            color: "var(--color-text-subtle)",
            fontFamily: "Pretendard",
            fontSize: "24px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "30px",
          }}
        >
          AI 채팅
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
          <Close size={24} color="var(--color-text-subtle)" />
        </button>
      </div>

      {messages.length === 0 ? (
        <div
          style={{
            display: "flex",
            padding: "var(--spacing-100) 0",
            alignItems: "center",
            gap: "10px",
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
            <Sparkles size={31} color="var(--color-brand-default)" />
            <div
              style={{
                color: "#000",
                fontFamily: "Pretendard",
                fontSize: "26px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "140%",
              }}
            >
              AI 질문
            </div>
            <div
              style={{
                color: "var(--color-text-subtle)",
                fontFamily: "Pretendard",
                fontSize: "17px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "24px",
              }}
            >
              Scholub AI에게 궁금한 것을 물어보세요
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--spacing-8)",
                marginTop: "var(--spacing-24)",
              }}
            >
              {suggestedQuestions.map((question, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    padding: "var(--spacing-14) var(--spacing-24)",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    borderRadius: "var(--radius-32)",
                    border: "1px solid var(--color-border-default)",
                    background: "var(--color-surface-default)",
                    cursor: "pointer",
                  }}
                  onClick={() => setMessage(question)}
                >
                  <div
                    style={{
                      color: "var(--color-text-default)",
                      fontFamily: "Pretendard",
                      fontSize: "17px",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "24px",
                    }}
                  >
                    {question}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            padding: "var(--spacing-20) 0",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "var(--spacing-12)",
            flex: "1 0 0",
            alignSelf: "stretch",
            overflowY: "auto",
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                padding: msg.isUser
                  ? "var(--spacing-16) var(--spacing-20)"
                  : "var(--spacing-16) var(--spacing-20)",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                borderRadius: msg.isUser
                  ? "var(--radius-16)"
                  : "var(--radius-20)",
                border: "1px solid var(--color-border-default)",
                background: msg.isUser
                  ? "var(--color-surface-default)"
                  : "var(--color-surface-brand-default)",
                width: msg.isUser ? "auto" : "359px",
                alignSelf: msg.isUser ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  color: msg.isUser
                    ? "var(--color-text-default)"
                    : "var(--color-text-white)",
                  fontFamily: "Pretendard",
                  fontSize: "17px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "24px",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isThinking && (
            <div
              style={{
                alignSelf: "flex-start",
                color: "var(--color-text-subtle)",
                fontFamily: "Pretendard",
                fontSize: "18px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "24px",
              }}
            >
              생각중
            </div>
          )}
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "var(--spacing-10)",
          alignSelf: "stretch",
        }}
      >
        {paperTitle && (
          <div
            onClick={() => {
              if (paperUrl) {
                window.open(paperUrl, "_blank");
              }
            }}
            style={{
              display: "flex",
              padding: "var(--spacing-14) var(--spacing-16)",
              alignItems: "center",
              gap: "var(--spacing-4)",
              alignSelf: "stretch",
              borderRadius: "var(--radius-14)",
              border: "1px solid var(--color-border-default)",
              background: "var(--color-surface-subtle)",
              overflow: "hidden",
              cursor: paperUrl ? "pointer" : "default",
            }}
          >
            <div
              style={{
                color: "var(--color-text-subtle)",
                textOverflow: "ellipsis",
                fontFamily: "Pretendard",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "20px",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 1,
                flex: "1 0 0",
                overflow: "hidden",
              }}
            >
              {paperTitle}
            </div>
            <ExternalLink size={20} color="var(--color-text-subtle)" />
          </div>
        )}

        <div
          style={{
            display: "flex",
            padding: "var(--spacing-14) var(--spacing-16)",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "var(--spacing-8)",
            alignSelf: "stretch",
            borderRadius: "var(--radius-16)",
            background: "var(--color-surface-default)",
          }}
        >
          {contextText && (
            <div
              onMouseEnter={() => setIsHoveringContext(true)}
              onMouseLeave={() => setIsHoveringContext(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-8)",
                padding: "var(--spacing-8) var(--spacing-12)",
                borderRadius: "var(--radius-8)",
                background: "var(--color-surface-brand-subtle)",
                width: "fit-content",
                maxWidth: "100%",
                cursor: "pointer",
              }}
              onClick={() => setContextText("")}
            >
              {isHoveringContext ? (
                <X size={16} color="var(--color-brand-default)" />
              ) : (
                <div
                  style={{
                    color: "var(--color-brand-default)",
                    fontFamily: "Pretendard",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "20px",
                    flexShrink: 0,
                  }}
                >
                  @
                </div>
              )}
              <div
                style={{
                  color: "var(--color-text-default)",
                  fontFamily: "Pretendard",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "20px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "300px",
                }}
              >
                {contextText}
              </div>
            </div>
          )}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="이 논문의 주요 기여도는 무엇인가요?"
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: "Pretendard",
              fontSize: "17px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "24px",
              resize: "none",
              minHeight: "60px",
              color: message
                ? "var(--color-text-default)"
                : "var(--color-text-subtle)",
            }}
            className="placeholder:text-[var(--color-text-subtle)] placeholder:font-[Pretendard] placeholder:text-[17px] placeholder:font-medium placeholder:leading-[24px]"
          />
          <button
            type="button"
            onClick={handleSendMessage}
            style={{
              display: "flex",
              padding: "var(--spacing-8) var(--spacing-12)",
              alignItems: "center",
              gap: "var(--spacing-6)",
              borderRadius: "var(--radius-9999)",
              background: "var(--color-surface-brand-default)",
              border: "none",
              cursor: "pointer",
              alignSelf: "flex-end",
            }}
          >
            <Send size={16} color="var(--color-text-white)" />
            <div
              style={{
                color: "var(--color-text-white)",
                fontFamily: "Pretendard",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "20px",
              }}
            >
              보내기
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
