import { Typography } from "@/shared/ui";
import Sparkles from "@/shared/ui/icons/Sparkles";

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
      {/* Header with Sparkles icon */}
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

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-20)",
          width: "100%",
        }}
      >
        <Typography.Body
          color="default"
          style={{
            fontFamily: "Pretendard",
            fontSize: "17px",
            fontWeight: 500,
            lineHeight: "24px",
            color: "var(--color-text-default)",
          }}
        >
          RNN(Recurrent Neural Network, 순환 신경망)은 순서가 있는 데이터(시퀀스
          데이터)를 처리하기 위한 인공신경망의 한 종류입니다.
          <br />
          <br />
          대표적으로 자연어 처리(NLP), 음성 인식, 시계열 예측, 음악 생성 등에
          널리 사용됩니다.
        </Typography.Body>

        {/* Section Heading with Brain emoji */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-8)",
            marginTop: "var(--spacing-4)",
          }}
        >
          <span style={{ fontSize: "16px" }}>🧠</span>
          <Typography.Body
            color="default"
            style={{
              fontFamily: "Pretendard",
              fontSize: "17px",
              fontWeight: 500,
              lineHeight: "24px",
              color: "var(--color-text-default)",
            }}
          >
            기본 개념
          </Typography.Body>
        </div>

        <Typography.Body
          color="default"
          style={{
            fontFamily: "Pretendard",
            fontSize: "17px",
            fontWeight: 500,
            lineHeight: "24px",
            color: "var(--color-text-default)",
          }}
        >
          일반적인 신경망(Feedforward Neural Network)은 입력이 한 번 들어오면 한
          방향으로만 계산됩니다.
          <br />
          <br />
          반면 RNN은 이전 단계의 출력(또는 은닉 상태, hidden state)을 다음
          입력에 다시 전달합니다.
          <br />
          <br />
          즉, 과거 정보를 기억하며 순서가 있는 데이터를 이해할 수 있습니다.
        </Typography.Body>
      </div>

      {/* Footer Button */}
      <div
        style={{
          display: "flex",
          padding: "var(--spacing-10) var(--spacing-16)",
          justifyContent: "center",
          alignItems: "center",
          gap: "var(--spacing-8)",
          borderRadius: "var(--radius-14)",
          background: "var(--color-surface-subtle)",
          cursor: "pointer",
          marginTop: "var(--spacing-8)",
        }}
        onClick={() => {
          // TODO: AI 탭으로 이동 로직 구현
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.07939 2.60672C5.36358 1.67102 6.93975 1.22475 8.52381 1.34833C10.1079 1.47192 11.5958 2.15722 12.7193 3.28076C13.8429 4.4043 14.5282 5.89218 14.6518 7.47627C14.7754 9.0604 14.3291 10.6365 13.3934 11.9207C12.4577 13.2049 11.0941 14.1127 9.54835 14.4805C8.09621 14.8259 6.57305 14.6735 5.22177 14.0525L1.54746 15.2981C1.30716 15.3795 1.04145 15.3175 0.862029 15.1381C0.682609 14.9587 0.620598 14.693 0.702056 14.4527L1.94758 10.7783C1.32663 9.42707 1.17422 7.90394 1.51968 6.45181C1.88744 4.90603 2.7952 3.54243 4.07939 2.60672ZM8.42015 2.67763C7.15288 2.57876 5.89192 2.93578 4.86458 3.68434C3.83723 4.4329 3.11102 5.52378 2.81682 6.7604C2.52261 7.997 2.67976 9.29807 3.25994 10.4291C3.34227 10.5896 3.35605 10.7766 3.29814 10.9474L2.39835 13.6018L5.05274 12.702C5.22357 12.6441 5.41056 12.6579 5.57106 12.7402C6.70208 13.3204 8.00308 13.4775 9.23975 13.1833C10.4763 12.8891 11.5672 12.1629 12.3158 11.1355C13.0643 10.1082 13.4213 8.84727 13.3225 7.58C13.2236 6.3127 12.6754 5.1224 11.7765 4.22357C10.8777 3.32474 9.68741 2.77649 8.42015 2.67763Z"
            fill="#7D7D7D"
          />
        </svg>
        <span
          style={{
            color: "var(--color-text-subtle)",
            fontFamily: "Pretendard",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "140%",
          }}
        >
          AI 탭으로 이동
        </span>
      </div>
    </div>
  );
}
