import { Header } from "@/widgets/header";
import { SubHeader } from "@/widgets/sub-header";
import { AIChat } from "@/widgets/ai-chat";
import { Discussion } from "@/widgets/discussion";
import { Button, Typography, TextLineSkeleton, PopularPaperCardSkeleton, ListItemSkeleton } from "@/shared/ui";
import Sparkles from "@/shared/ui/icons/Sparkles";
import SmileLike from "@/shared/ui/icons/SmileLike";
import FrownDislike from "@/shared/ui/icons/FrownDislike";
import DocumentPaper from "@/shared/ui/icons/DocumentPaper";
import DocumentIcon from "@/shared/ui/icons/DocumentIcon";
import MessageBubble from "@/shared/ui/icons/MessageBubble";
import ChevronRight from "@/shared/ui/icons/ChevronRight";
import Close from "@/shared/ui/icons/Close";
import { Input } from "@/shared/ui";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { papersApi } from "@/shared/api/papers";
import type { Paper } from "@/shared/api/papers";
import { useLanguage } from "@/shared/lib/language";
import { useToast } from "@/shared/ui/Toast";
import PopularPaperCard from "@/entities/paper/ui/PopularPaperCard";
import ReactMarkdown from "react-markdown";

interface TableOfContentsItem {
  label: string;
  translatedLabel: string;
  subContents?: Array<{
    label: string;
    translatedLabel?: string;
  }>;
}

const TableOfContentsItem = ({
  item,
  depth = 0,
  index = 0,
  parentNumber = "",
}: {
  item: TableOfContentsItem;
  depth?: number;
  index?: number;
  parentNumber?: string;
}) => {
  const paddingLeft = 12 + depth * 12;
  const numbering =
    depth === 0 ? `${index + 1}` : `${parentNumber}.${index + 1}`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "var(--spacing-6)",
      }}
    >
      <div
        style={{
          display: "flex",
          paddingLeft: `${paddingLeft}px`,
          alignItems: "flex-start",
          gap: "var(--spacing-10)",
        }}
      >
        <div
          style={{
            minWidth: "25px",
            color: "var(--color-text-subtle)",
            fontFamily: "Pretendard",
            fontSize: "17px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "24px",
            textAlign: "right",
          }}
        >
          {numbering}
        </div>
        <Typography.Body
          kor={item.translatedLabel}
          style={{
            color: "var(--color-text-default)",
            flex: 1,
          }}
        >
          {item.label}
        </Typography.Body>
      </div>
      {item.subContents && item.subContents.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "var(--spacing-6)",
          }}
        >
          {item.subContents.map((subItem, subIndex) => (
            <TableOfContentsItem
              key={subIndex}
              item={{
                label: subItem.label,
                translatedLabel: subItem.translatedLabel || subItem.label,
              }}
              depth={depth + 1}
              index={subIndex}
              parentNumber={numbering}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface PaperContent {
  tableOfContents?: TableOfContentsItem[];
  tableOfContentsTitle?: string;
  translatedTableOfContentsTitle?: string;
  contents?: Array<{
    content?: string;
    label?: string;
    translatedContent?: string;
    translatedLabel?: string;
    imageUrl?: string;
    imageCaption?: string;
  }>;
}

export default function PaperDetailPage() {
  const { paperId: id } = useParams<{ paperId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { language, setLanguage } = useLanguage();
  const { showToast } = useToast();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [popupPosition, setPopupPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectedText, setSelectedText] = useState<string>("");
  const [showAIChat, setShowAIChat] = useState<boolean>(false);
  const [selectedTextForChat, setSelectedTextForChat] = useState<string>("");
  const [showDiscussion, setShowDiscussion] = useState<boolean>(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState<{
    id: string;
    title: string;
    messageCount: number;
  } | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isUnliked, setIsUnliked] = useState(false);
  const [showDiscussionModal, setShowDiscussionModal] = useState(false);
  const [discussionTitle, setDiscussionTitle] = useState("");
  const [discussionContent, setDiscussionContent] = useState("");
  const [isCreatingDiscussion, setIsCreatingDiscussion] = useState(false);
  const [discussions, setDiscussions] = useState<
    Array<{
      id: string;
      paperId: string;
      title: string;
      content: string;
      creatorId: string;
      participantCount: number;
      messageCount: number;
      createdAt: string;
      updatedAt: string;
    }>
  >([]);
  const [loadingDiscussions, setLoadingDiscussions] = useState(false);
  const [similarPapers, setSimilarPapers] = useState<Paper[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const popupPositionRef = useRef(popupPosition);
  const selectedTextRef = useRef(selectedText);
  const viewRecordedRef = useRef(false);
  const discussionSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!id || !paper || viewRecordedRef.current) {
      return;
    }

    const timer = setTimeout(
      async () => {
        try {
          await papersApi.recordPaperView(id);
          viewRecordedRef.current = true;
          console.log("논문 조회 기록 완료:", id);
        } catch (error) {
          console.error("논문 조회 기록 실패:", error);
        }
      },
      5 * 60 * 1000
    );

    return () => {
      clearTimeout(timer);
    };
  }, [id, paper]);

  useEffect(() => {
    const fetchPaperDetail = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        window.scrollTo(0, 0);
        const paperData = await papersApi.getPaperDetail(id);
        setPaper(paperData);
        setIsLiked(paperData.myReaction?.isLiked || false);
        setIsUnliked(paperData.myReaction?.isUnliked || false);
      } catch (error) {
        console.error("논문 상세 정보 로드 실패:", error);
        setPaper(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPaperDetail();
    // paper 로드 시 showDiscussion 초기화 (새 페이지로 이동할 때)
    // 단, 쿼리스트링에 discussion이 있으면 초기화하지 않음
    const discussionId = searchParams.get("discussion");
    if (!discussionId) {
      setShowDiscussion(false);
      setSelectedDiscussion(null);
    }
  }, [id, searchParams]);

  useEffect(() => {
    const fetchDiscussions = async () => {
      if (!paper) return;

      const idToUse = paper.id;
      if (!idToUse) return;

      setLoadingDiscussions(true);
      try {
        const discussionsData = await papersApi.getDiscussions(idToUse);
        setDiscussions(discussionsData);
      } catch (error) {
        console.error("토론 목록 가져오기 실패:", error);
        setDiscussions([]);
      } finally {
        setLoadingDiscussions(false);
      }
    };

    fetchDiscussions();
  }, [paper]);

  useEffect(() => {
    const fetchSimilarPapers = async () => {
      if (!paper?.id) return;

      setLoadingSimilar(true);
      try {
        const papers = await papersApi.getSimilarPapers(paper.id, 20);
        setSimilarPapers(papers);
      } catch (error) {
        console.error("유사 논문 로드 실패:", error);
        setSimilarPapers([]);
      } finally {
        setLoadingSimilar(false);
      }
    };

    fetchSimilarPapers();
  }, [paper]);

  // URL 쿼리스트링에서 discussion ID 확인하여 모달 열기
  useEffect(() => {
    const discussionId = searchParams.get("discussion");

    console.log("쿼리스트링 확인:", {
      discussionId,
      paperId: id,
      hasPaper: !!paper,
      showDiscussion,
      currentDiscussionId: selectedDiscussion?.id,
      searchParamsString: searchParams.toString(),
      fullUrl: window.location.href,
    });

    if (discussionId && paper) {
      // 이미 같은 discussion이 열려있으면 스킵
      if (showDiscussion && selectedDiscussion?.id === discussionId) {
        console.log("이미 같은 discussion이 열려있음, 스킵");
        return;
      }

      const openDiscussion = async () => {
        try {
          console.log("Discussion 모달 열기 시도:", discussionId);
          const discussionData = await papersApi.getDiscussion(discussionId);
          console.log("Discussion 데이터 받음:", discussionData);

          setSelectedDiscussion({
            id: discussionData.id,
            title: discussionData.title,
            messageCount: discussionData.messageCount,
          });
          setShowDiscussion(true);
          console.log("Discussion 모달 열기 완료");

          // 쿼리스트링에서 discussion 파라미터 제거 (URL 정리)
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.delete("discussion");
          setSearchParams(newSearchParams, { replace: true });
        } catch (error) {
          console.error("토론 정보 가져오기 실패:", error);
          showToast("토론을 불러오는데 실패했습니다.", "error");
          // 에러 발생 시에도 쿼리스트링 정리
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.delete("discussion");
          setSearchParams(newSearchParams, { replace: true });
        }
      };

      openDiscussion();
    } else if (discussionId && !paper) {
      console.log(
        "Discussion ID는 있지만 paper가 아직 로드되지 않음, 대기 중..."
      );
    } else if (!discussionId) {
      console.log("쿼리스트링에 discussion 파라미터 없음");
    }
  }, [
    id,
    paper,
    searchParams.toString(),
    showDiscussion,
    selectedDiscussion?.id,
    setSearchParams,
    showToast,
  ]);

  useEffect(() => {
    popupPositionRef.current = popupPosition;
    selectedTextRef.current = selectedText;
  }, [popupPosition, selectedText]);

  useEffect(() => {
    const getIconPosition = () => {
      const selection = window.getSelection();

      if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);

        if (selection.focusNode) {
          const isBackward =
            selection.anchorNode === selection.focusNode
              ? selection.anchorOffset > selection.focusOffset
              : selection.anchorNode?.compareDocumentPosition(
                  selection.focusNode
                ) === Node.DOCUMENT_POSITION_PRECEDING;

          const rects = range.getClientRects();
          const rect = rects[isBackward ? 0 : rects.length - 1];

          return {
            x: isBackward ? rect.left : rect.left + rect.width,
            y: rect.top,
          };
        }
      } else {
        return {
          x: 0,
          y: 0,
        };
      }
    };

    let scrollAnimationFrame: number | null = null;

    const handleMouseDown = (e: MouseEvent) => {
      if (popupRef.current && popupRef.current.contains(e.target as Node)) {
        return;
      }
      setPopupPosition(null);
      setSelectedText("");
      if (containerRef.current) {
        containerRef.current
          .querySelectorAll(".selection-border-left, .selection-border-right")
          .forEach((el) => el.remove());
      }
    };

    const handleScroll = () => {
      if (!popupPositionRef.current || !selectedTextRef.current) {
        return;
      }

      if (scrollAnimationFrame !== null) {
        return;
      }

      scrollAnimationFrame = requestAnimationFrame(() => {
        const selection = window.getSelection();

        if (
          selection &&
          selection.rangeCount > 0 &&
          !selection.isCollapsed &&
          selection.toString().trim() === selectedTextRef.current
        ) {
          const position = getIconPosition();
          if (position && position.x !== 0 && position.y !== 0) {
            setPopupPosition(position);
          }
        }

        scrollAnimationFrame = null;
      });
    };

    const handleMouseUp = () => {
      setTimeout(() => {
        const selection = window.getSelection();

        if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
          if (containerRef.current) {
            containerRef.current
              .querySelectorAll(
                ".selection-border-left, .selection-border-right"
              )
              .forEach((el) => el.remove());
          }
          return;
        }

        const selectedTextValue = selection.toString().trim();
        if (!selectedTextValue) {
          if (containerRef.current) {
            containerRef.current
              .querySelectorAll(
                ".selection-border-left, .selection-border-right"
              )
              .forEach((el) => el.remove());
          }
          return;
        }

        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer.parentElement;

        if (
          !container ||
          !containerRef.current ||
          !containerRef.current.contains(container)
        ) {
          if (containerRef.current) {
            containerRef.current
              .querySelectorAll(
                ".selection-border-left, .selection-border-right"
              )
              .forEach((el) => el.remove());
          }
          return;
        }

        containerRef.current
          .querySelectorAll(".selection-border-left, .selection-border-right")
          .forEach((el) => el.remove());

        try {
          const containerRect = container.getBoundingClientRect();

          const startRange = range.cloneRange();
          startRange.collapse(true);
          const startRect = startRange.getBoundingClientRect();

          const endRange = range.cloneRange();
          endRange.collapse(false);
          const endRect = endRange.getBoundingClientRect();

          const leftBar = document.createElement("div");
          leftBar.className = "selection-border-left";
          leftBar.style.cssText = `
            position: absolute;
            left: ${startRect.left - containerRect.left}px;
            top: ${startRect.top - containerRect.top}px;
            bottom: ${containerRect.bottom - startRect.bottom}px;
            width: 1.5px;
            background: var(--color-brand-default);
            pointer-events: none;
            z-index: 1000;
          `;
          container.style.position = "relative";
          container.appendChild(leftBar);

          const rightBar = document.createElement("div");
          rightBar.className = "selection-border-right";
          rightBar.style.cssText = `
            position: absolute;
            left: ${endRect.right - containerRect.left}px;
            top: ${endRect.top - containerRect.top}px;
            bottom: ${containerRect.bottom - endRect.bottom}px;
            width: 1.5px;
            background: var(--color-brand-default);
            pointer-events: none;
            z-index: 1000;
          `;
          container.appendChild(rightBar);
        } catch (e) {
          console.error("Selection highlight error:", e);
        }

        if (selectedTextValue.length >= 2) {
          const position = getIconPosition();
          if (position && position.x !== 0 && position.y !== 0) {
            setPopupPosition(position);
            setSelectedText(selectedTextValue);
          }
        }
      }, 10);
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll);
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
      if (scrollAnimationFrame !== null) {
        cancelAnimationFrame(scrollAnimationFrame);
      }
      if (containerRef.current) {
        containerRef.current
          .querySelectorAll(".selection-border-left, .selection-border-right")
          .forEach((el) => el.remove());
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white paper-detail-page">
        <Header />
        <SubHeader />
        <div
          style={{
            display: "flex",
            padding: "var(--spacing-32) var(--padding)",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--spacing-32)",
            alignSelf: "stretch",
            marginTop: "121px",
          }}
        >
          <div
            style={{
              color: "var(--color-text-subtle)",
              fontFamily: "Pretendard",
              fontSize: "17px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "24px",
            }}
          >
            로딩 중...
          </div>
        </div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="min-h-screen bg-white paper-detail-page">
        <Header />
        <SubHeader />
        <div
          style={{
            display: "flex",
            padding: "var(--spacing-32) var(--padding)",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--spacing-32)",
            alignSelf: "stretch",
            marginTop: "121px",
          }}
        >
          <div
            style={{
              color: "var(--color-text-subtle)",
              fontFamily: "Pretendard",
              fontSize: "17px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "24px",
            }}
          >
            논문을 찾을 수 없습니다.
          </div>
        </div>
      </div>
    );
  }

  const paperContent = (paper.content as PaperContent) || {};
  const rawContents = paperContent.contents || [];

  const abstractContent = rawContents.find(
    (c) => c.label?.toLowerCase() === "abstract"
  );
  const introductionContent = rawContents.find(
    (c) => c.label?.toLowerCase() === "introduction"
  );

  const tableOfContents = paperContent.tableOfContents || [];
  const tableOfContentsTitle =
    paperContent.translatedTableOfContentsTitle ||
    paperContent.tableOfContentsTitle ||
    "목차";

  const contents = rawContents.filter(
    (content) =>
      content.label?.toLowerCase() !== "abstract" &&
      content.label?.toLowerCase() !== "introduction"
  );
  const thumbnailUrl =
    paper.thumbnailUrl ||
    paper.imageUrl ||
    paper.coverImage ||
    "https://via.placeholder.com/250x271/CCCCCC/666666?text=No+Image";
  const publishedYear = paper.issuedAt
    ? new Date(paper.issuedAt).getFullYear().toString()
    : "";
  const authors = paper.authors || [];

  return (
    <div className="min-h-screen bg-white paper-detail-page">
      <style>{`
        .paper-detail-page ::selection {
          background: var(--color-brand-subtle);
          color: inherit;
        }
        .paper-detail-page ::-moz-selection {
          background: var(--color-brand-subtle);
          color: inherit;
        }
      `}</style>
      <Header />
      <SubHeader />
      <div
        ref={containerRef}
        style={{
          display: "flex",
          padding: "var(--spacing-32) var(--padding)",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--spacing-32)",
          alignSelf: "stretch",
          marginTop: "121px",
          paddingRight:
            showAIChat || showDiscussion ? "532px" : "var(--padding)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "var(--spacing-24)",
            alignSelf: "stretch",
            maxWidth: "1200px",
            width: "100%",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "300px",
              padding: "29px 25px 0 25px",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "var(--radius-14)",
              background: "var(--color-surface-subtle)",
            }}
          >
            <div
              style={{
                width: "250px",
                height: "271px",
                flexShrink: 0,
                aspectRatio: "250/271",
                borderRadius: "var(--radius-10) var(--radius-10) 0 0",
                background: `url(${thumbnailUrl}) lightgray 50% / cover no-repeat`,
                boxShadow: "0 -2px 10px 0 rgba(0, 0, 0, 0.05)",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "var(--spacing-12)",
              flex: 1,
            }}
          >
            <div
              style={{
                color: "var(--color-text-brand-default)",
                fontFamily: "Pretendard",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "20px",
                width: "100%",
              }}
            >
              {paper.categories.length > 0
                ? paper.categories.slice(0, 2).join(", ") +
                  (paper.categories.length > 2 ? ", ..." : "")
                : ""}
            </div>

            <div
              style={{
                color: "var(--color-text-default)",
                fontFamily: "Pretendard",
                fontSize: "26px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "140%",
                width: "100%",
              }}
            >
              {paper.title}
            </div>

            <div
              style={{
                color: "var(--color-text-subtle)",
                fontFamily: "Pretendard",
                fontSize: "17px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "24px",
                width: "100%",
              }}
            >
              {paper.summary || paper.translatedSummary || ""}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--spacing-14)",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "var(--spacing-8)",
                }}
              >
                <div
                  style={{
                    color: "var(--color-text-subtle)",
                    fontFamily: "Pretendard",
                    fontSize: "17px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "24px",
                  }}
                >
                  저자
                </div>
                <div
                  style={{
                    color: "var(--color-text-subtle)",
                    fontFamily: "Pretendard",
                    fontSize: "17px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "24px",
                  }}
                >
                  발행연도
                </div>
                <div
                  style={{
                    color: "var(--color-text-subtle)",
                    fontFamily: "Pretendard",
                    fontSize: "17px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "24px",
                  }}
                >
                  DOI
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "var(--spacing-8)",
                }}
              >
                <div
                  style={{
                    color: "var(--color-text-default)",
                    fontFamily: "Pretendard",
                    fontSize: "17px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "24px",
                  }}
                >
                  {authors.length > 0
                    ? authors.slice(0, 3).join(", ") +
                      (authors.length > 3 ? ` 외 ${authors.length - 3}명` : "")
                    : "저자 정보 없음"}
                </div>
                <div
                  style={{
                    color: "var(--color-text-default)",
                    fontFamily: "Pretendard",
                    fontSize: "17px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "24px",
                  }}
                >
                  {publishedYear || "발행연도 정보 없음"}
                </div>
                <div
                  style={{
                    color: "var(--color-text-default)",
                    fontFamily: "Pretendard",
                    fontSize: "17px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "24px",
                  }}
                >
                  {paper.doi || "DOI 정보 없음"}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-12)",
                width: "100%",
                marginTop: "var(--spacing-8)",
              }}
            >
              <Button
                variant="primary"
                size="medium"
                leadingIcon={<Sparkles color="var(--color-text-white)" />}
                onClick={() => {
                  if (showDiscussion) {
                    setShowDiscussion(false);
                    setSelectedDiscussion(null);
                  }
                  setShowAIChat(true);
                }}
              >
                AI 뷰어
              </Button>
              <Button
                variant="secondary"
                size="medium"
                leadingIcon={<DocumentIcon />}
                onClick={() => {
                  if (paper.pdfUrl) {
                    window.open(paper.pdfUrl, "_blank");
                  } else if (paper.url) {
                    window.open(paper.url, "_blank");
                  }
                }}
              >
                원문 보기
              </Button>
              <Button
                variant="secondary"
                size="medium"
                leadingIcon={<DocumentIcon />}
                onClick={() => {
                  if (discussionSectionRef.current) {
                    discussionSectionRef.current.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
              >
                토론하러가기
              </Button>
              <div style={{ marginLeft: "auto" }}>
                <Button
                  variant="secondary"
                  size="medium"
                  onClick={() => setLanguage(language === "ko" ? "en" : "ko")}
                  style={{
                    color: "var(--color-text-brand-default)",
                    background: "transparent",
                    border: "none",
                    textDecoration: "underline",
                    textDecorationColor: "var(--color-text-brand-default)",
                    textUnderlineOffset: "4px",
                  }}
                >
                  전체 번역
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "var(--spacing-14)",
            alignSelf: "stretch",
            maxWidth: "1200px",
            width: "100%",
            margin: "0 auto",
          }}
        >
          <Typography.Headline
            kor={paperContent.translatedTableOfContentsTitle}
            style={{
              scrollMarginTop: "121px",
            }}
          >
            {tableOfContentsTitle}
          </Typography.Headline>

          <div
            style={{
              background: "var(--color-border-default)",
              width: "100%",
              height: "1px",
              alignSelf: "stretch",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "var(--spacing-14)",
              alignSelf: "stretch",
            }}
          >
            {tableOfContents.map((item, index) => (
              <TableOfContentsItem key={index} item={item} index={index} />
            ))}
          </div>
        </div>

        {abstractContent && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "var(--spacing-14)",
              alignSelf: "stretch",
              maxWidth: "1200px",
              width: "100%",
              margin: "0 auto",
            }}
          >
            <Typography.Headline
              kor={abstractContent.translatedLabel}
              style={{
                color: "var(--color-text-default)",
                scrollMarginTop: "121px",
              }}
            >
              {abstractContent.label || ""}
            </Typography.Headline>

            <div
              style={{
                background: "var(--color-border-default)",
                width: "100%",
                height: "1px",
                alignSelf: "stretch",
              }}
            />

            <div
              ref={(el) => {
                if (el)
                  contentRefs.current[rawContents.indexOf(abstractContent)] =
                    el;
              }}
              style={{
                color: "var(--color-text-default)",
                fontFamily: "Pretendard",
                fontSize: "17px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "30px",
                alignSelf: "stretch",
                position: "relative",
              }}
            >
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p
                      style={{
                        margin: "0 0 12px 0",
                        lineHeight: "30px",
                        color: "var(--color-text-default)",
                        fontSize: "17px",
                      }}
                    >
                      {children}
                    </p>
                  ),
                  h1: ({ children }) => (
                    <h1
                      style={{
                        fontSize: "24px",
                        fontWeight: 600,
                        margin: "16px 0 8px 0",
                        lineHeight: "32px",
                        color: "var(--color-text-default)",
                      }}
                    >
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2
                      style={{
                        fontSize: "22px",
                        fontWeight: 600,
                        margin: "14px 0 6px 0",
                        lineHeight: "28px",
                        color: "var(--color-text-default)",
                      }}
                    >
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3
                      style={{
                        fontSize: "20px",
                        fontWeight: 600,
                        margin: "12px 0 4px 0",
                        lineHeight: "26px",
                        color: "var(--color-text-default)",
                      }}
                    >
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4
                      style={{
                        fontSize: "18px",
                        fontWeight: 600,
                        margin: "10px 0 4px 0",
                        lineHeight: "24px",
                        color: "var(--color-text-default)",
                      }}
                    >
                      {children}
                    </h4>
                  ),
                  ul: ({ children }) => (
                    <ul
                      style={{
                        margin: "8px 0",
                        paddingLeft: "24px",
                        listStyleType: "disc",
                      }}
                    >
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol
                      style={{
                        margin: "8px 0",
                        paddingLeft: "24px",
                        listStyleType: "decimal",
                      }}
                    >
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li
                      style={{
                        margin: "0 0 4px 0",
                        lineHeight: "30px",
                        paddingLeft: "4px",
                        color: "var(--color-text-default)",
                        fontSize: "17px",
                      }}
                    >
                      {children}
                    </li>
                  ),
                  code: ({ children }) => (
                    <code
                      style={{
                        background: "var(--color-surface-subtle)",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "15px",
                        fontFamily: "monospace",
                        color: "var(--color-text-default)",
                      }}
                    >
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre
                      style={{
                        background: "var(--color-surface-subtle)",
                        padding: "12px",
                        borderRadius: "8px",
                        overflow: "auto",
                        margin: "12px 0",
                        fontSize: "15px",
                        fontFamily: "monospace",
                        lineHeight: "24px",
                        color: "var(--color-text-default)",
                      }}
                    >
                      {children}
                    </pre>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "var(--color-brand-default)",
                        textDecoration: "underline",
                        textUnderlineOffset: "2px",
                      }}
                    >
                      {children}
                    </a>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote
                      style={{
                        borderLeft: "3px solid var(--color-border-default)",
                        paddingLeft: "12px",
                        margin: "12px 0",
                        fontStyle: "italic",
                        color: "var(--color-text-subtle)",
                      }}
                    >
                      {children}
                    </blockquote>
                  ),
                  hr: () => (
                    <hr
                      style={{
                        border: "none",
                        borderTop: "1px solid var(--color-border-default)",
                        margin: "16px 0",
                      }}
                    />
                  ),
                }}
              >
                {language === "ko" && abstractContent.translatedContent
                  ? abstractContent.translatedContent
                  : abstractContent.content || ""}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {introductionContent && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "var(--spacing-14)",
              alignSelf: "stretch",
              maxWidth: "1200px",
              width: "100%",
              margin: "0 auto",
            }}
          >
            <Typography.Headline
              kor={introductionContent.translatedLabel}
              style={{
                color: "var(--color-text-default)",
                scrollMarginTop: "121px",
              }}
            >
              {introductionContent.label || ""}
            </Typography.Headline>

            <div
              style={{
                background: "var(--color-border-default)",
                width: "100%",
                height: "1px",
                alignSelf: "stretch",
              }}
            />

            <div
              ref={(el) => {
                if (el)
                  contentRefs.current[
                    rawContents.indexOf(introductionContent)
                  ] = el;
              }}
              style={{
                color: "var(--color-text-default)",
                fontFamily: "Pretendard",
                fontSize: "17px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "30px",
                alignSelf: "stretch",
                position: "relative",
              }}
            >
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p
                      style={{
                        margin: "0 0 12px 0",
                        lineHeight: "30px",
                        color: "var(--color-text-default)",
                        fontSize: "17px",
                      }}
                    >
                      {children}
                    </p>
                  ),
                  h1: ({ children }) => (
                    <h1
                      style={{
                        fontSize: "24px",
                        fontWeight: 600,
                        margin: "16px 0 8px 0",
                        lineHeight: "32px",
                        color: "var(--color-text-default)",
                      }}
                    >
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2
                      style={{
                        fontSize: "22px",
                        fontWeight: 600,
                        margin: "14px 0 6px 0",
                        lineHeight: "28px",
                        color: "var(--color-text-default)",
                      }}
                    >
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3
                      style={{
                        fontSize: "20px",
                        fontWeight: 600,
                        margin: "12px 0 4px 0",
                        lineHeight: "26px",
                        color: "var(--color-text-default)",
                      }}
                    >
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4
                      style={{
                        fontSize: "18px",
                        fontWeight: 600,
                        margin: "10px 0 4px 0",
                        lineHeight: "24px",
                        color: "var(--color-text-default)",
                      }}
                    >
                      {children}
                    </h4>
                  ),
                  ul: ({ children }) => (
                    <ul
                      style={{
                        margin: "8px 0",
                        paddingLeft: "24px",
                        listStyleType: "disc",
                      }}
                    >
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol
                      style={{
                        margin: "8px 0",
                        paddingLeft: "24px",
                        listStyleType: "decimal",
                      }}
                    >
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li
                      style={{
                        margin: "0 0 4px 0",
                        lineHeight: "30px",
                        paddingLeft: "4px",
                        color: "var(--color-text-default)",
                        fontSize: "17px",
                      }}
                    >
                      {children}
                    </li>
                  ),
                  code: ({ children }) => (
                    <code
                      style={{
                        background: "var(--color-surface-subtle)",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "15px",
                        fontFamily: "monospace",
                        color: "var(--color-text-default)",
                      }}
                    >
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre
                      style={{
                        background: "var(--color-surface-subtle)",
                        padding: "12px",
                        borderRadius: "8px",
                        overflow: "auto",
                        margin: "12px 0",
                        fontSize: "15px",
                        fontFamily: "monospace",
                        lineHeight: "24px",
                        color: "var(--color-text-default)",
                      }}
                    >
                      {children}
                    </pre>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "var(--color-brand-default)",
                        textDecoration: "underline",
                        textUnderlineOffset: "2px",
                      }}
                    >
                      {children}
                    </a>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote
                      style={{
                        borderLeft: "3px solid var(--color-border-default)",
                        paddingLeft: "12px",
                        margin: "12px 0",
                        fontStyle: "italic",
                        color: "var(--color-text-subtle)",
                      }}
                    >
                      {children}
                    </blockquote>
                  ),
                  hr: () => (
                    <hr
                      style={{
                        border: "none",
                        borderTop: "1px solid var(--color-border-default)",
                        margin: "16px 0",
                      }}
                    />
                  ),
                }}
              >
                {language === "ko" && introductionContent.translatedContent
                  ? introductionContent.translatedContent
                  : introductionContent.content || ""}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {contents.map((content, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "var(--spacing-14)",
              alignSelf: "stretch",
              maxWidth: "1200px",
              width: "100%",
              margin: "0 auto",
            }}
          >
            <Typography.Headline
              kor={content.translatedLabel}
              style={{
                color: "var(--color-text-default)",
                scrollMarginTop: "121px",
              }}
            >
              {content.label || ""}
            </Typography.Headline>

            <div
              style={{
                background: "var(--color-border-default)",
                width: "100%",
                height: "1px",
                alignSelf: "stretch",
              }}
            />

            <div
              ref={(el) => {
                contentRefs.current[index] = el;
              }}
              style={{
                color: "var(--color-text-default)",
                fontFamily: "Pretendard",
                fontSize: "17px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "30px",
                alignSelf: "stretch",
                position: "relative",
              }}
            >
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p
                      style={{
                        margin: "0 0 12px 0",
                        lineHeight: "30px",
                        color: "var(--color-text-default)",
                        fontSize: "17px",
                      }}
                    >
                      {children}
                    </p>
                  ),
                  h1: ({ children }) => (
                    <h1
                      style={{
                        fontSize: "24px",
                        fontWeight: 600,
                        margin: "16px 0 8px 0",
                        lineHeight: "32px",
                        color: "var(--color-text-default)",
                      }}
                    >
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2
                      style={{
                        fontSize: "22px",
                        fontWeight: 600,
                        margin: "14px 0 6px 0",
                        lineHeight: "28px",
                        color: "var(--color-text-default)",
                      }}
                    >
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3
                      style={{
                        fontSize: "20px",
                        fontWeight: 600,
                        margin: "12px 0 4px 0",
                        lineHeight: "26px",
                        color: "var(--color-text-default)",
                      }}
                    >
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4
                      style={{
                        fontSize: "18px",
                        fontWeight: 600,
                        margin: "10px 0 4px 0",
                        lineHeight: "24px",
                        color: "var(--color-text-default)",
                      }}
                    >
                      {children}
                    </h4>
                  ),
                  ul: ({ children }) => (
                    <ul
                      style={{
                        margin: "8px 0",
                        paddingLeft: "24px",
                        listStyleType: "disc",
                      }}
                    >
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol
                      style={{
                        margin: "8px 0",
                        paddingLeft: "24px",
                        listStyleType: "decimal",
                      }}
                    >
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li
                      style={{
                        margin: "0 0 4px 0",
                        lineHeight: "30px",
                        paddingLeft: "4px",
                        color: "var(--color-text-default)",
                        fontSize: "17px",
                      }}
                    >
                      {children}
                    </li>
                  ),
                  code: ({ children }) => (
                    <code
                      style={{
                        background: "var(--color-surface-subtle)",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "15px",
                        fontFamily: "monospace",
                        color: "var(--color-text-default)",
                      }}
                    >
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre
                      style={{
                        background: "var(--color-surface-subtle)",
                        padding: "12px",
                        borderRadius: "8px",
                        overflow: "auto",
                        margin: "12px 0",
                        fontSize: "15px",
                        fontFamily: "monospace",
                        lineHeight: "24px",
                        color: "var(--color-text-default)",
                      }}
                    >
                      {children}
                    </pre>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "var(--color-brand-default)",
                        textDecoration: "underline",
                        textUnderlineOffset: "2px",
                      }}
                    >
                      {children}
                    </a>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote
                      style={{
                        borderLeft: "3px solid var(--color-border-default)",
                        paddingLeft: "12px",
                        margin: "12px 0",
                        fontStyle: "italic",
                        color: "var(--color-text-subtle)",
                      }}
                    >
                      {children}
                    </blockquote>
                  ),
                  hr: () => (
                    <hr
                      style={{
                        border: "none",
                        borderTop: "1px solid var(--color-border-default)",
                        margin: "16px 0",
                      }}
                    />
                  ),
                }}
              >
                {language === "ko" && content.translatedContent
                  ? content.translatedContent
                  : content.content || ""}
              </ReactMarkdown>
            </div>

            {content.imageUrl && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "14px",
                  alignSelf: "stretch",
                }}
              >
                <img
                  src={content.imageUrl}
                  alt={content.imageCaption || ""}
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
                {content.imageCaption && (
                  <div
                    style={{
                      color: "var(--color-text-default)",
                      opacity: 0.8,
                      textAlign: "center",
                      fontFamily: "Pretendard",
                      fontSize: "12px",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "16px",
                      alignSelf: "stretch",
                    }}
                  >
                    {content.imageCaption}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "var(--spacing-14)",
            alignSelf: "stretch",
            maxWidth: "1200px",
            width: "100%",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              paddingTop: "var(--spacing-24)",
              paddingBottom: "var(--spacing-24)",
              paddingLeft: "var(--spacing-12)",
              paddingRight: "var(--spacing-12)",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--spacing-24)",
              alignSelf: "stretch",
              borderRadius: "var(--radius-14)",
              background: "var(--color-surface-subtle)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--spacing-4)",
              }}
            >
              <div
                style={{
                  color: "var(--color-text-default)",
                  fontFamily: "Pretendard",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "20px",
                  textAlign: "center",
                }}
              >
                {paper.title}
              </div>
              <div
                style={{
                  color: "var(--color-text-default)",
                  fontFamily: "Pretendard",
                  fontSize: "17px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "24px",
                  textAlign: "center",
                }}
              >
                논문 잘 읽으셨나요?
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "-1px",
                background: "var(--color-surface-subtle)",
              }}
            >
              <div
                onClick={async () => {
                  if (!paper?.id) return;

                  const previousIsLiked = isLiked;
                  const previousIsUnliked = isUnliked;
                  const previousLikeCount = paper.likeCount || 0;
                  const previousUnlikeCount = paper.unlikeCount || 0;

                  const newIsLiked = !isLiked;
                  setIsLiked(newIsLiked);

                  if (newIsLiked) {
                    setIsUnliked(false);
                    const newLikeCount = previousLikeCount + 1;
                    const newUnlikeCount = previousIsUnliked
                      ? Math.max(0, previousUnlikeCount - 1)
                      : previousUnlikeCount;
                    setPaper({
                      ...paper,
                      likeCount: newLikeCount,
                      unlikeCount: newUnlikeCount,
                    });
                  } else {
                    const newLikeCount = Math.max(0, previousLikeCount - 1);
                    setPaper({
                      ...paper,
                      likeCount: newLikeCount,
                    });
                  }

                  try {
                    await papersApi.toggleReaction(paper.id, "LIKE");

                    const stats = await papersApi.getReactionStats(paper.id);

                    setPaper({
                      ...paper,
                      likeCount: stats.likeCount,
                      unlikeCount: stats.unlikeCount,
                    });
                  } catch (error) {
                    setIsLiked(previousIsLiked);
                    setIsUnliked(previousIsUnliked);
                    setPaper({
                      ...paper,
                      likeCount: previousLikeCount,
                      unlikeCount: previousUnlikeCount,
                    });

                    console.error("좋아요 토글 실패:", error);
                    let errorMessage = "좋아요 처리에 실패했습니다.";
                    if (error instanceof Error) {
                      if (
                        error.message.includes("Invalid reference") ||
                        error.message.includes("does not exist")
                      ) {
                        errorMessage = "해당 논문을 찾을 수 없습니다.";
                      } else {
                        errorMessage = error.message;
                      }
                    }
                    showToast(errorMessage, "error");
                  }
                }}
                style={{
                  display: "flex",
                  width: "110px",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    color: "var(--color-text-default)",
                    textAlign: "center",
                    fontFamily: "Pretendard",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "20px",
                  }}
                >
                  좋아요
                </div>
                <SmileLike
                  size={50}
                  color={
                    isLiked
                      ? "var(--color-brand-default)"
                      : "var(--color-text-subtle)"
                  }
                />
                <div
                  style={{
                    color: "var(--color-text-default)",
                    textAlign: "center",
                    fontFamily: "Pretendard",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "20px",
                  }}
                >
                  {paper?.likeCount || 0}명
                </div>
              </div>

              <div
                onClick={async () => {
                  if (!paper?.id) return;

                  const previousIsLiked = isLiked;
                  const previousIsUnliked = isUnliked;
                  const previousLikeCount = paper.likeCount || 0;
                  const previousUnlikeCount = paper.unlikeCount || 0;

                  const newIsUnliked = !isUnliked;
                  setIsUnliked(newIsUnliked);

                  if (newIsUnliked) {
                    setIsLiked(false);
                    const newUnlikeCount = previousUnlikeCount + 1;
                    const newLikeCount = previousIsLiked
                      ? Math.max(0, previousLikeCount - 1)
                      : previousLikeCount;
                    setPaper({
                      ...paper,
                      unlikeCount: newUnlikeCount,
                      likeCount: newLikeCount,
                    });
                  } else {
                    const newUnlikeCount = Math.max(0, previousUnlikeCount - 1);
                    setPaper({
                      ...paper,
                      unlikeCount: newUnlikeCount,
                    });
                  }

                  try {
                    await papersApi.toggleReaction(paper.id, "UNLIKE");

                    const stats = await papersApi.getReactionStats(paper.id);

                    setPaper({
                      ...paper,
                      likeCount: stats.likeCount,
                      unlikeCount: stats.unlikeCount,
                    });
                  } catch (error) {
                    setIsLiked(previousIsLiked);
                    setIsUnliked(previousIsUnliked);
                    setPaper({
                      ...paper,
                      likeCount: previousLikeCount,
                      unlikeCount: previousUnlikeCount,
                    });

                    console.error("싫어요 토글 실패:", error);
                    let errorMessage = "싫어요 처리에 실패했습니다.";
                    if (error instanceof Error) {
                      if (
                        error.message.includes("Invalid reference") ||
                        error.message.includes("does not exist")
                      ) {
                        errorMessage = "해당 논문을 찾을 수 없습니다.";
                      } else {
                        errorMessage = error.message;
                      }
                    }
                    showToast(errorMessage, "error");
                  }
                }}
                style={{
                  display: "flex",
                  width: "110px",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    color: "var(--color-text-default)",
                    textAlign: "center",
                    fontFamily: "Pretendard",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "20px",
                  }}
                >
                  싫어요
                </div>
                <FrownDislike
                  size={50}
                  color={
                    isUnliked
                      ? "var(--color-brand-default)"
                      : "var(--color-text-subtle)"
                  }
                />
                <div
                  style={{
                    color: "var(--color-text-default)",
                    textAlign: "center",
                    fontFamily: "Pretendard",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "20px",
                  }}
                >
                  {paper?.unlikeCount || 0}명
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={discussionSectionRef}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "var(--spacing-14)",
            alignSelf: "stretch",
            maxWidth: "1200px",
            width: "100%",
            margin: "0 auto",
            marginTop: "var(--spacing-32)",
            scrollMarginTop: "121px",
          }}
        >
          <div
            style={{
              color: "var(--color-text-default)",
              fontFamily: "Pretendard",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "30px",
            }}
          >
            토론
          </div>

          {loadingDiscussions ? (
            <div
              style={{
                display: "flex",
                padding: "var(--spacing-16) var(--spacing-20)",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "stretch",
                borderRadius: "var(--radius-16)",
                border: "1px solid var(--color-border-default)",
                background: "var(--color-surface-subtle)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--spacing-12)",
                  width: "100%",
                }}
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  <ListItemSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : discussions.length === 0 ? (
            <div
              style={{
                display: "flex",
                padding: "var(--spacing-16) var(--spacing-20)",
                justifyContent: "space-between",
                alignItems: "center",
                alignSelf: "stretch",
                borderRadius: "var(--radius-16)",
                border: "1px solid var(--color-border-default)",
                background: "var(--color-surface-subtle)",
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
                    color: "var(--color-text-default)",
                    fontFamily: "Pretendard",
                    fontSize: "17px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "24px",
                  }}
                >
                  아직 활성화된 토론이 없어요.
                </div>
                <div
                  style={{
                    color: "var(--color-text-subtle)",
                    fontFamily: "Pretendard",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "20px",
                  }}
                >
                  위 버튼을 눌러 지금 바로 토론을 시작하세요
                </div>
              </div>

              <Button
                variant="primary"
                size="medium"
                onClick={() => {
                  setShowDiscussionModal(true);
                }}
              >
                토론 시작하기
              </Button>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-12)",
                alignSelf: "stretch",
              }}
            >
              <Button
                variant="secondary"
                size="medium"
                onClick={() => {
                  setShowDiscussionModal(true);
                }}
                style={{
                  alignSelf: "flex-start",
                }}
              >
                토론 추가하기
              </Button>

              {discussions.map((discussion) => (
                <div
                  key={discussion.id}
                  style={{
                    display: "flex",
                    padding: "var(--spacing-16) var(--spacing-20)",
                    justifyContent: "space-between",
                    alignItems: "center",
                    alignSelf: "stretch",
                    borderRadius: "var(--radius-16)",
                    border: "1px solid var(--color-border-default)",
                    background: "var(--color-surface-default)",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (showAIChat) {
                      setShowAIChat(false);
                      setSelectedTextForChat("");
                    }
                    setSelectedDiscussion({
                      id: discussion.id,
                      title: discussion.title,
                      messageCount: discussion.messageCount,
                    });
                    setShowDiscussion(true);
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--spacing-14)",
                      flex: 1,
                    }}
                  >
                    <DocumentPaper size={26} />

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "var(--spacing-4)",
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          color: "var(--color-text-default)",
                          fontFamily: "Pretendard",
                          fontSize: "17px",
                          fontStyle: "normal",
                          fontWeight: 500,
                          lineHeight: "24px",
                        }}
                      >
                        {discussion.title}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "var(--spacing-4)",
                          color: "var(--color-text-subtle, #7D7D7D)",
                          fontFamily: "Pretendard",
                          fontSize: "14px",
                          fontStyle: "normal",
                          fontWeight: 500,
                          lineHeight: "20px",
                        }}
                      >
                        <MessageBubble
                          size={16}
                          color="var(--color-text-subtle)"
                        />
                        {discussion.messageCount}+ 대화
                      </div>
                    </div>
                  </div>

                  <ChevronRight
                    size={24}
                    fillColor="var(--color-text-subtle)"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "var(--spacing-14)",
            alignSelf: "stretch",
            maxWidth: "1200px",
            width: "100%",
            margin: "0 auto",
            marginTop: "var(--spacing-32)",
          }}
        >
          <div
            style={{
              color: "var(--color-text-default)",
              fontFamily: "Pretendard",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "30px",
            }}
          >
            유사 논문
          </div>

          <div
            style={{
              display: "flex",
              gap: "var(--spacing-16)",
              overflowX: "auto",
              width: "100%",
              paddingBottom: "var(--spacing-8)",
            }}
            className="scrollbar-hide"
          >
            {loadingSimilar ? (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <PopularPaperCardSkeleton key={i} />
                ))}
              </>
            ) : similarPapers.length > 0 ? (
              similarPapers.map((paper) => {
                const imageUrl =
                  paper.thumbnailUrl ||
                  paper.imageUrl ||
                  paper.coverImage ||
                  "https://via.placeholder.com/300x169/CCCCCC/666666?text=No+Image";
                const category =
                  paper.categories.length > 0
                    ? paper.categories.slice(0, 2).join(", ") +
                      (paper.categories.length > 2 ? ", ..." : "")
                    : "분류 없음";
                const subtitle = paper.summary || "";

                return (
                  <PopularPaperCard
                    key={paper.id}
                    id={paper.id}
                    imageUrl={imageUrl}
                    title={paper.title}
                    subtitle={subtitle}
                    category={category}
                  />
                );
              })
            ) : (
              <div
                style={{
                  color: "var(--color-text-subtle)",
                  fontFamily: "Pretendard",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "20px",
                }}
              >
                유사 논문이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>

      {popupPosition && popupPosition.x !== 0 && popupPosition.y !== 0 && (
        <div
          ref={popupRef}
          style={{
            position: "fixed",
            left: `${popupPosition.x + 20}px`,
            top: `${popupPosition.y - 40}px`,
            display: "flex",
            padding: "var(--spacing-6) var(--spacing-10)",
            alignItems: "center",
            gap: "var(--spacing-8)",
            borderRadius: "var(--radius-10)",
            border: "1px solid var(--color-border-default)",
            background: "var(--color-surface-default)",
            boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.10)",
            zIndex: 10000,
            transform: "translateX(-50%)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-4)",
              color: "var(--color-text-subtle)",
              fontFamily: "Pretendard",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "20px",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (showDiscussion) {
                setShowDiscussion(false);
                setSelectedDiscussion(null);
              }
              setSelectedTextForChat(selectedText);
              setShowAIChat(true);
              setPopupPosition(null);
              setSelectedText("");
            }}
          >
            <MessageBubble size={14} color="var(--color-text-subtle)" />
            채팅으로 전송
          </div>
        </div>
      )}

      {showAIChat && (
        <AIChat
          onClose={() => {
            setShowAIChat(false);
            setSelectedTextForChat("");
          }}
          initialMessage={selectedTextForChat}
          paperTitle={paper.title}
          id={paper.id}
          paperUrl={paper.pdfUrl || paper.url}
        />
      )}

      {showDiscussion && selectedDiscussion && (
        <Discussion
          discussionId={selectedDiscussion.id}
          title={selectedDiscussion.title}
          conversationCount={selectedDiscussion.messageCount}
          onClose={() => {
            setShowDiscussion(false);
            setSelectedDiscussion(null);
          }}
        />
      )}

      {showDiscussionModal && (
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
            zIndex: 10001,
          }}
          onClick={() => {
            if (!isCreatingDiscussion) {
              setShowDiscussionModal(false);
              setDiscussionTitle("");
              setDiscussionContent("");
            }
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              maxWidth: "600px",
              padding: "var(--spacing-24)",
              borderRadius: "var(--radius-16)",
              background: "var(--color-surface-default)",
              border: "1px solid var(--color-border-default)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              gap: "var(--spacing-20)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  color: "var(--color-text-default)",
                  fontFamily: "Pretendard",
                  fontSize: "24px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "30px",
                }}
              >
                {discussions.length === 0 ? "토론 시작하기" : "토론 추가하기"}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!isCreatingDiscussion) {
                    setShowDiscussionModal(false);
                    setDiscussionTitle("");
                    setDiscussionContent("");
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  border: "none",
                  cursor: isCreatingDiscussion ? "not-allowed" : "pointer",
                  padding: "4px",
                  opacity: isCreatingDiscussion ? 0.5 : 1,
                }}
                disabled={isCreatingDiscussion}
              >
                <Close size={24} color="var(--color-text-default)" />
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-16)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--spacing-6)",
                }}
              >
                <label
                  style={{
                    color: "var(--color-text-default)",
                    fontFamily: "Pretendard",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "20px",
                  }}
                >
                  제목
                </label>
                <Input
                  value={discussionTitle}
                  onChange={(e) => setDiscussionTitle(e.target.value)}
                  placeholder="토론 제목을 입력하세요"
                  fullWidth
                  disabled={isCreatingDiscussion}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--spacing-6)",
                }}
              >
                <label
                  style={{
                    color: "var(--color-text-default)",
                    fontFamily: "Pretendard",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "20px",
                  }}
                >
                  내용
                </label>
                <textarea
                  value={discussionContent}
                  onChange={(e) => setDiscussionContent(e.target.value)}
                  placeholder="토론 내용을 입력하세요"
                  disabled={isCreatingDiscussion}
                  style={{
                    width: "100%",
                    minHeight: "200px",
                    padding: "var(--spacing-14)",
                    borderRadius: "var(--radius-14)",
                    border: "1px solid var(--color-border-default)",
                    background: "var(--color-surface-default)",
                    color: "var(--color-text-default)",
                    fontFamily: "Pretendard",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "20px",
                    resize: "vertical",
                    outline: "none",
                    transition: "border-color 0.2s ease-in-out",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--color-text-default)";
                    e.target.style.boxShadow =
                      "0 0 0 2px rgba(21, 21, 21, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--color-border-default)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "var(--spacing-12)",
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="secondary"
                size="medium"
                onClick={() => {
                  if (!isCreatingDiscussion) {
                    setShowDiscussionModal(false);
                    setDiscussionTitle("");
                    setDiscussionContent("");
                  }
                }}
                disabled={isCreatingDiscussion}
              >
                취소
              </Button>
              <Button
                variant="primary"
                size="medium"
                onClick={async () => {
                  if (!id) {
                    showToast("논문 ID가 없습니다.", "error");
                    return;
                  }

                  if (!discussionTitle.trim()) {
                    showToast("제목을 입력해주세요.", "error");
                    return;
                  }

                  if (!discussionContent.trim()) {
                    showToast("내용을 입력해주세요.", "error");
                    return;
                  }

                  setIsCreatingDiscussion(true);
                  try {
                    const idToUse = paper?.id;
                    if (!idToUse) {
                      showToast("논문 ID를 찾을 수 없습니다.", "error");
                      setIsCreatingDiscussion(false);
                      return;
                    }
                    const result = await papersApi.createDiscussion(
                      idToUse,
                      discussionTitle.trim(),
                      discussionContent.trim()
                    );
                    console.log("토론 생성 성공:", result);
                    showToast("토론이 생성되었습니다.", "success");
                    setShowDiscussionModal(false);
                    setDiscussionTitle("");
                    setDiscussionContent("");
                    if (paper?.id) {
                      try {
                        const discussionsData = await papersApi.getDiscussions(
                          paper.id
                        );
                        setDiscussions(discussionsData);
                      } catch (error) {
                        console.error("토론 목록 새로고침 실패:", error);
                      }
                    }
                  } catch (error) {
                    console.error("토론 생성 실패:", error);
                    let errorMessage = "토론 생성에 실패했습니다.";
                    if (error instanceof Error) {
                      errorMessage = error.message;
                    }
                    showToast(errorMessage, "error");
                  } finally {
                    setIsCreatingDiscussion(false);
                  }
                }}
                pending={isCreatingDiscussion}
                disabled={isCreatingDiscussion}
              >
                생성하기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
