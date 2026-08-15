import { createContext, useContext, useState, type ReactNode } from "react";

interface DiscussionContextType {
  isDiscussionOpen: boolean;
  discussionMessage: string;
  openDiscussion: (content?: string) => void;
  closeDiscussion: () => void;
  setDiscussionMessage: (content: string) => void;
}

const DiscussionContext = createContext<DiscussionContextType | undefined>(
  undefined
);

export function DiscussionProvider({ children }: { children: ReactNode }) {
  const [isDiscussionOpen, setIsDiscussionOpen] = useState(false);
  const [discussionMessage, setDiscussionMessage] = useState("");

  const openDiscussion = (content?: string) => {
    if (content) {
      setDiscussionMessage(content);
    }
    setIsDiscussionOpen(true);
  };

  const closeDiscussion = () => {
    setIsDiscussionOpen(false);
    setDiscussionMessage("");
  };

  return (
    <DiscussionContext.Provider
      value={{
        isDiscussionOpen,
        discussionMessage,
        openDiscussion,
        closeDiscussion,
        setDiscussionMessage,
      }}
    >
      {children}
    </DiscussionContext.Provider>
  );
}

export function useDiscussion() {
  const context = useContext(DiscussionContext);
  if (context === undefined) {
    throw new Error("useDiscussion must be used within a DiscussionProvider");
  }
  return context;
}
