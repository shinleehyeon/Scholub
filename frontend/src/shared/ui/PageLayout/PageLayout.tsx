import { type ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div
      style={{
        display: "flex",
        padding: "10px var(--padding, 24px)",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex: "1 0 0",
        alignSelf: "stretch",
      }}
    >
      {children}
    </div>
  );
}
