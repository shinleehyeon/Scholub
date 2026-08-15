import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/widgets/header";
import { SubHeader } from "@/widgets/sub-header";
import { Input } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { Typography } from "@/shared/ui";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleRegister = () => {
    if (!email || !name || !password || !passwordConfirm) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    navigate("/profile-photo", {
      state: {
        email,
        password,
        name,
      },
    });
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
              회원가입
            </Typography.Headline>

            <Typography.Body color="subtle">
              회원가입하여 Scholub 커뮤니티를 이용하세요!
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
            />

            <Input
              label="닉네임"
              type="text"
              placeholder="홍길동"
              required
              fullWidth
              size="large"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            />

            <Input
              label="비밀번호 확인"
              type="password"
              placeholder="비밀번호를 다시 입력해주세요"
              required
              fullWidth
              size="large"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
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
            <Typography.Subtext color="default">
              계정이 있나요?{" "}
              <Link
                to="/login"
                style={{
                  color: "var(--color-text-brand-default)",
                  textDecorationLine: "underline",
                }}
              >
                로그인
              </Link>{" "}
              하기
            </Typography.Subtext>
          </div>
        </div>
      </div>
    </div>
  );
}
