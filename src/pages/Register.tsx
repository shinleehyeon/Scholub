import { Link, useNavigate } from "react-router-dom";
import Header from "@/widgets/Header";
import SubHeader from "@/widgets/SubHeader";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";

export default function Register() {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/interest-areas");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div style={{ marginBottom: 0 }}>
        <SubHeader />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 121px)",
          padding: "var(--spacing-48) var(--spacing-24)",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "350px",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--spacing-24)",
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
            <h1
              style={{
                color: "var(--color-text-default)",
                fontFamily: "Pretendard",
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "30px",
                margin: 0,
              }}
            >
              회원가입
            </h1>

            <p
              style={{
                color: "var(--color-text-subtle)",
                fontFamily: "Pretendard",
                fontSize: "17px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "24px",
                margin: 0,
              }}
            >
              회원가입하여 Scholub 커뮤니티를 이용하세요!
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-24)",
              width: "100%",
            }}
          >
            <Input
              label="이메일"
              type="email"
              placeholder="mail@example.com"
              required
              fullWidth
              size="large"
            />

            <Input
              label="닉네임"
              type="text"
              placeholder="홍길동"
              required
              fullWidth
              size="large"
            />

            <Input
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              required
              fullWidth
              size="large"
            />

            <Input
              label="비밀번호 확인"
              type="password"
              placeholder="비밀번호를 다시 입력해주세요"
              required
              fullWidth
              size="large"
            />

            <Button
              variant="primary"
              size="large"
              fullWidth
              onClick={handleRegister}
            >
              회원가입
            </Button>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-4)",
            }}
          >
            <span
              style={{
                color: "var(--color-text-default)",
                fontFamily: "Pretendard",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "20px",
              }}
            >
              계정이 있나요?{" "}
              <Link
                to="/login"
                style={{
                  color: "var(--color-text-brand-default)",
                  fontFamily: "Pretendard",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "20px",
                  textDecorationLine: "underline",
                  textDecorationStyle: "solid",
                  textDecorationSkipInk: "auto",
                  textDecorationThickness: "auto",
                  textUnderlineOffset: "auto",
                  textUnderlinePosition: "from-font",
                }}
              >
                로그인
              </Link>{" "}
              하기
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
