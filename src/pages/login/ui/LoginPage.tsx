import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/widgets/header";
import { SubHeader } from "@/widgets/sub-header";
import { Input } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { Typography } from "@/shared/ui";
import { authApi } from "@/shared/api/auth";
import { authStorage } from "@/shared/lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await authApi.login({
        email,
        password,
      });

      authStorage.setTokens(
        response.data.accessToken,
        response.data.refreshToken
      );

      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <Input
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              required
              fullWidth
              size="large"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  handleLogin();
                }
              }}
            />

            {error && (
              <Typography.Body
                color="subtle"
                style={{
                  color: "var(--color-text-error)",
                  fontSize: "14px",
                }}
              >
                {error}
              </Typography.Body>
            )}

            <Button
              variant="primary"
              size="large"
              fullWidth
              onClick={handleLogin}
              disabled={loading}
              pending={loading}
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
