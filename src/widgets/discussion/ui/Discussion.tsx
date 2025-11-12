import { useState, useRef } from "react";
import MessageBubble from "@/shared/ui/icons/MessageBubble";
import X from "@/shared/ui/icons/X";
import Send from "@/shared/ui/icons/Send";

interface DiscussionProps {
  title?: string;
  conversationCount?: number;
  onClose?: () => void;
  hasAIChat?: boolean;
}

export default function Discussion({
  title = "구글 브레인은 해당 연구를 하기에 타당한가?",
  conversationCount = 130,
  onClose,
  hasAIChat = false,
}: DiscussionProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
        {/* 오른쪽 정렬 메시지 (사용자) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "var(--spacing-8)",
            alignSelf: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              maxWidth: "315px",
              padding: "var(--spacing-10) var(--spacing-12)",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              borderRadius: "var(--radius-14)",
              background: "var(--color-surface-brand-default, #F7971D)",
            }}
          >
            <div
              style={{
                color: "var(--color-text-white, #FFF)",
                fontFamily: "Pretendard",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "20px",
                wordBreak: "break-word",
              }}
            >
              RNN(Recurrent Neural Network, 순환 신경망)은 순서가 있는
              데이터(시퀀스 데이터)를 처리하기 위한 인공신경망의 한 종류입니다.
            </div>
          </div>
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
            9:23 AM
          </div>
        </div>

        {/* 왼쪽 정렬 메시지들 (다른 사용자들) */}
        {[1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "var(--spacing-8)",
              alignSelf: "flex-start",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #90EE90 0%, #87CEEB 100%)",
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
                  color: "var(--color-text-subtle, #7D7D7D)",
                  fontFamily: "Pretendard",
                  fontSize: "12px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "16px",
                }}
              >
                도도도도로롱 | 9:23 AM
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
                  background: "var(--color-surface-default, #FFFFFF)",
                  border: "1px solid var(--color-border-default, #EDEDED)",
                }}
              >
                <div
                  style={{
                    color: "var(--color-text-default, #322F29)",
                    fontFamily: "Pretendard",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "20px",
                    wordBreak: "break-word",
                  }}
                >
                  RNN(Recurrent Neural Network, 순환 신경망)은 순서가 있는
                  데이터(시퀀스 데이터)를 처리하기 위한 인공신경망의 한
                  종류입니다.
                </div>
              </div>
            </div>
          </div>
        ))}
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
                if (message.trim()) {
                  console.log("메시지 전송:", message);
                  setMessage("");
                  if (textareaRef.current) {
                    textareaRef.current.style.height = "auto";
                  }
                }
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
            onClick={() => {
              if (message.trim()) {
                console.log("메시지 전송:", message);
                setMessage("");
                if (textareaRef.current) {
                  textareaRef.current.style.height = "auto";
                }
              }
            }}
            style={{
              display: "flex",
              padding: "var(--spacing-8) var(--spacing-12)",
              alignItems: "center",
              gap: "var(--spacing-6)",
              borderRadius: "var(--radius-9999)",
              background: "var(--color-surface-brand-default, #F7971D)",
              border: "none",
              cursor: "pointer",
              alignSelf: "flex-end",
            }}
          >
            <Send size={16} color="var(--color-text-white, #FFF)" />
            <div
              style={{
                color: "var(--color-text-white, #FFF)",
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
