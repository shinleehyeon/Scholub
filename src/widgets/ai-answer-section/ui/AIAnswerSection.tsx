import { Typography, Button } from "@/shared/ui";
import Sparkles from "@/shared/ui/icons/Sparkles";
import MessageBubble from "@/shared/ui/icons/MessageBubble";

interface AIAnswerSectionProps {
  className?: string;
}

export default function AIAnswerSection({ className }: AIAnswerSectionProps) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        padding: "var(--spacing-20)",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "10px",
        borderRadius: "var(--radius-14)",
        border: "1px solid var(--color-border-default)",
        width: "359px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "22px",
            height: "22px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Sparkles size={22} color="var(--color-brand-default)" />
        </div>
        <Typography.Body
          color="default"
          style={{
            fontFamily: "Pretendard",
            fontSize: "17px",
            fontWeight: 500,
            lineHeight: "24px",
            color: "var(--color-text-subtle)",
          }}
        >
          AI 답변
        </Typography.Body>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-20)",
          width: "100%",
        }}
      >
        <div
          style={{
            fontFamily: "Pretendard",
            fontSize: "17px",
            fontWeight: 500,
            lineHeight: "24px",
            color: "var(--color-text-default)",
          }}
        >
          RNN(Recurrent Neural Network, 순환 신경망)은 순서가 있는 데이터(시퀀스
          데이터)를 처리하기 위한 인공신경망의 한 종류입니다. 대표적으로 자연어
          처리(NLP), 음성 인식, 시계열 예측, 음악 생성 등에 널리 사용됩니다.
          <br />
          <span style={{ fontSize: "16px" }}>🧠</span> 기본 개념
          <br />
          <br />
          일반적인 신경망(Feedforward Neural Network)은 입력이 한 번 들어오면 한
          방향으로만 계산됩니다. 반면 RNN은 이전 단계의 출력(또는 은닉 상태,
          hidden state)을 다음 입력에 다시 전달합니다. 즉, 과거 정보를 기억하며
          순서가 있는 데이터를 이해할 수 있습니다.
        </div>
      </div>

      <Button
        variant="secondary"
        size="medium"
        leadingIcon={<MessageBubble color="var(--color-text-subtle)" />}
        onClick={() => {}}
        style={{
          marginTop: "var(--spacing-8)",
        }}
      >
        AI 탭으로 이동
      </Button>
    </div>
  );
}
