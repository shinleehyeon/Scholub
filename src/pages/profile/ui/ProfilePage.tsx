import { Header } from "@/widgets/header";
import { SubHeader } from "@/widgets/sub-header";
import { Avatar, Button } from "@/shared/ui";
import LatestResearchCard from "@/entities/paper/ui/LatestResearchCard";

export default function ProfilePage() {
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
            gap: "var(--Spacing-32, 32px)",
          }}
        >
          <div
            style={{
              color: "#000",
              fontFamily: "Pretendard",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "30px",
            }}
          >
            프로필
          </div>

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
                gap: "var(--Spacing-20, 20px)",
              }}
            >
              <Avatar
                src="https://picsum.photos/100/100?random=profile"
                alt="프로필 이미지"
                size={100}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "var(--Spacing-6, 6px)",
                }}
              >
                <div
                  style={{
                    color: "#000",
                    fontFamily: "Pretendard",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "30px",
                  }}
                >
                  환경 피로
                </div>
                <div
                  style={{
                    color: "var(--Text-subtle, #7D7D7D)",
                    fontFamily: "Pretendard",
                    fontSize: "18px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "24px",
                  }}
                >
                  지메일
                </div>
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
              gap: "var(--Spacing-24, 24px)",
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
              <div
                style={{
                  color: "var(--Text-subtle, #7D7D7D)",
                  fontFamily: "Pretendard",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "140%",
                }}
              >
                논문 반응
              </div>
              <div
                style={{
                  color: "#000",
                  fontFamily: "Pretendard",
                  fontSize: "24px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "30px",
                }}
              >
                32개
              </div>
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
              <div
                style={{
                  color: "var(--Text-subtle, #7D7D7D)",
                  fontFamily: "Pretendard",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "140%",
                }}
              >
                댓글
              </div>
              <div
                style={{
                  color: "#000",
                  fontFamily: "Pretendard",
                  fontSize: "24px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "30px",
                }}
              >
                12개
              </div>
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
            <div
              style={{
                color: "#000",
                fontFamily: "Pretendard",
                fontSize: "18px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "24px",
                alignSelf: "stretch",
                textAlign: "left",
              }}
            >
              내가 반응한 논문
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-24)",
                width: "100%",
                marginTop: "12px",
              }}
            >
              {Array.from({ length: 3 }, (_, index) => (
                <LatestResearchCard
                  key={index}
                  imageUrl="https://picsum.photos/228/128?random=1"
                  category="인공지능"
                  title="Deaminative cross-coupling of amines by boryl radical β-scission"
                  description="Amines are among the most common functional groups in bioactive molecules and pharmaceuticals,1-3 yet they are almost universally treated as synthetic endpoint..."
                  likes={32}
                  comments={32}
                />
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                marginTop: "var(--Spacing-24, 24px)",
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
            <div
              style={{
                color: "#000",
                fontFamily: "Pretendard",
                fontSize: "18px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "24px",
                alignSelf: "stretch",
                textAlign: "left",
              }}
            >
              내가 댓글 작성한 논문
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-24)",
                width: "100%",
                marginTop: "12px",
              }}
            >
              {Array.from({ length: 3 }, (_, index) => (
                <LatestResearchCard
                  key={index}
                  imageUrl="https://picsum.photos/228/128?random=2"
                  category="인공지능"
                  title="Deaminative cross-coupling of amines by boryl radical β-scission"
                  description="Amines are among the most common functional groups in bioactive molecules and pharmaceuticals,1-3 yet they are almost universally treated as synthetic endpoint..."
                  likes={32}
                  comments={32}
                />
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                marginTop: "var(--Spacing-24, 24px)",
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
