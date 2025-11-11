import { useState } from "react";
import MessageBubble from "@/shared/ui/icons/MessageBubble";
import X from "@/shared/ui/icons/X";
import Send from "@/shared/ui/icons/Send";

interface DiscussionProps {
  title?: string;
  conversationCount?: number;
  onClose?: () => void;
}

export default function Discussion({
  title = "구글 브레인은 해당 연구를 하기에 타당한가?",
  conversationCount = 130,
  onClose,
}: DiscussionProps) {
  const [message, setMessage] = useState("");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "600px",
        height: "600px",
        border: "1px solid var(--color-border-default)",
        borderRadius: "var(--radius-16)",
        background: "var(--color-surface-default)",
      }}
    >
      {/* 헤더 */}
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

      {/* 메시지 영역 */}
      <div
        style={{
          display: "flex",
          padding: "var(--spacing-20) var(--spacing-14)",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "var(--spacing-14)",
          flex: "1 0 0",
          alignSelf: "stretch",
          overflowY: "auto",
        }}
      >
        {/* 내가 보낸 메시지 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "var(--spacing-8)",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "315px",
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

        {/* 상대가 보낸 메시지 */}
        <div
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
              background: "var(--color-surface-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background:
                  "url('https://via.placeholder.com/34x34/CCCCCC/666666?text=K')",
                backgroundSize: "cover",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "var(--spacing-8)",
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
                width: "315px",
                padding: "var(--spacing-10) var(--spacing-12)",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                borderRadius: "var(--radius-14)",
                background: "var(--color-surface-subtle, #F9F9F9)",
              }}
            >
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
                RNN(Recurrent Neural Network, 순환 신경망)은 순서가 있는
                데이터(시퀀스 데이터)를 처리하기 위한 인공신경망의 한
                종류입니다.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 입력 영역 */}
      <div
        style={{
          display: "flex",
          padding: "var(--spacing-20) var(--spacing-14)",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "var(--spacing-14)",
          flex: "1 0 0",
          alignSelf: "stretch",
          borderTop: "1px solid var(--color-border-default)",
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
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메시지를 입력하세요"
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
                : "var(--color-text-subtle, #7D7D7D)",
            }}
            className="placeholder:text-[var(--color-text-subtle)] placeholder:font-[Pretendard] placeholder:text-[17px] placeholder:font-medium placeholder:leading-[24px]"
          />
          <button
            type="button"
            onClick={() => {
              if (message.trim()) {
                console.log("메시지 전송:", message);
                setMessage("");
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
