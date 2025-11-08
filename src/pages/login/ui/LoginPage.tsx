import { Link } from "react-router-dom";
import { Header } from "@/widgets/header";
import { SubHeader } from "@/widgets/sub-header";
import { Input } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { Typography } from "@/shared/ui";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/");
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
            <Typography.Headline color="default" as="h1">
              로그인
            </Typography.Headline>

            <Typography.Body color="subtle">
              로그인하여 Scholub 커뮤니티를 이용하세요!
            </Typography.Body>
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
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              required
              fullWidth
              size="large"
            />

            <Button
              variant="primary"
              size="large"
              fullWidth
              onClick={handleLogin}
            >
              로그인
            </Button>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-4)",
            }}
          >
            <Typography.Subtext color="default">
              계정이 없나요?{" "}
              <Link
                to="/register"
                style={{
                  color: "var(--color-text-brand-default)",
                  textDecorationLine: "underline",
                }}
              >
                회원가입
              </Link>{" "}
              하기
            </Typography.Subtext>
          </div>
        </div>
      </div>
    </div>
  );
}
