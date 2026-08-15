import { type ReactNode } from "react";
import X from "@/shared/ui/icons/X";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: ReactNode;
  showCloseButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "var(--color-surface-default, #FFFFFF)",
          borderRadius: "var(--radius-16)",
          padding: "var(--spacing-24)",
          maxWidth: "400px",
          width: "90%",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--spacing-16)",
          }}
        >
          <h2
            style={{
              color: "var(--color-text-default, #322F29)",
              fontFamily: "Pretendard",
              fontSize: "20px",
              fontWeight: 600,
              lineHeight: "28px",
              margin: 0,
            }}
          >
            {title}
          </h2>
          {showCloseButton && (
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
          )}
        </div>
        <div
          style={{
            color: "var(--color-text-default, #322F29)",
            fontFamily: "Pretendard",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "20px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

