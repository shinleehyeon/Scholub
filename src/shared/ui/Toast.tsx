import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { X } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  type: "error" | "success" | "info";
}

interface ToastContextType {
  showToast: (message: string, type?: "error" | "success" | "info") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: "error" | "success" | "info" = "error") => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 5000);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 10000,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "16px 20px",
              minWidth: "300px",
              maxWidth: "500px",
              borderRadius: "12px",
              backgroundColor:
                toast.type === "error"
                  ? "var(--color-surface-error)"
                  : toast.type === "success"
                  ? "var(--color-surface-brand-default)"
                  : "var(--color-surface-default)",
              color:
                toast.type === "error"
                  ? "var(--color-text-error)"
                  : toast.type === "success"
                  ? "var(--color-text-white)"
                  : "var(--color-text-default)",
              border:
                toast.type === "error"
                  ? "1px solid var(--color-border-error)"
                  : "1px solid var(--color-border-default)",
              boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.15)",
              animation: "slideIn 0.3s ease-out",
            }}
          >
            <div style={{ flex: 1, fontSize: "14px", fontWeight: 500 }}>
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "20px",
                height: "20px",
                padding: 0,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "inherit",
                opacity: 0.7,
              }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
