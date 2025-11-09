import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/widgets/header";
import { SubHeader } from "@/widgets/sub-header";
import { Avatar, Button, Typography } from "@/shared/ui";
import Camera from "@/shared/ui/icons/Camera";

export default function ProfilePhotoPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleNext = () => {
    navigate("/interest-areas");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div style={{ marginBottom: 0 }}>
        <SubHeader />
      </div>
      <div
        className="flex items-center justify-center"
        style={{ minHeight: "calc(100vh - 121px)" }}
      >
        <div
          style={{
            display: "flex",
            width: "400px",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--spacing-32)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--spacing-8)",
            }}
          >
            <Typography.Headline
              color="default"
              style={{
                fontFamily: "Pretendard",
                fontSize: "24px",
                fontWeight: 500,
                lineHeight: "30px",
                color: "var(--color-text-default)",
              }}
            >
              프로필 사진
            </Typography.Headline>
            <Typography.Body
              color="subtle"
              style={{
                fontFamily: "Pretendard",
                fontSize: "17px",
                fontWeight: 500,
                lineHeight: "24px",
                color: "var(--color-text-subtle)",
                textAlign: "center",
              }}
            >
              나중에 설정에서도 변경할 수 있어요
            </Typography.Body>
          </div>

          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Avatar
              src={
                profileImage || "https://picsum.photos/146/146?random=profile"
              }
              alt="프로필 이미지"
              size={146}
            />
            <button
              onClick={handleCameraClick}
              style={{
                display: "flex",
                width: "45px",
                height: "45px",
                padding: "12px 11px 11px 12px",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                right: "0",
                bottom: "0",
                borderRadius: "var(--radius-9999)",
                border: "1px solid var(--color-border-default)",
                background: "var(--color-surface-subtle)",
                cursor: "pointer",
              }}
            >
              <Camera size={22} color="var(--color-text-subtle)" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          <button
            onClick={handleDeleteImage}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <Typography.Body
              color="subtle"
              style={{
                fontFamily: "Pretendard",
                fontSize: "17px",
                fontWeight: 500,
                lineHeight: "24px",
                color: "var(--color-text-subtle)",
              }}
            >
              기존 이미지 삭제하기
            </Typography.Body>
          </button>

          <Button
            variant="primary"
            size="large"
            onClick={handleNext}
            style={{
              width: "100%",
            }}
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}
