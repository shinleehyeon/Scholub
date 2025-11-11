import { Header } from "@/widgets/header";
import { SubHeader } from "@/widgets/sub-header";
import { AIChat } from "@/widgets/ai-chat";
import { Button, Typography } from "@/shared/ui";
import Sparkles from "@/shared/ui/icons/Sparkles";
import SmileLike from "@/shared/ui/icons/SmileLike";
import FrownDislike from "@/shared/ui/icons/FrownDislike";
import DocumentPaper from "@/shared/ui/icons/DocumentPaper";
import DocumentIcon from "@/shared/ui/icons/DocumentIcon";
import MessageBubble from "@/shared/ui/icons/MessageBubble";
import ChevronRight from "@/shared/ui/icons/ChevronRight";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { papersApi } from "@/shared/api/papers";
import type { Paper } from "@/shared/api/papers";
import { useLanguage } from "@/shared/lib/language";
import { useToast } from "@/shared/ui/Toast";

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
            width: "25px",
            color: "var(--color-text-subtle)",
            fontFamily: "Pretendard",
            fontSize: "17px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "24px",
          }}
        >
          {numbering}
        </div>
        <Typography.Body
          kor={item.translatedLabel}
          style={{
            color: "#000",
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
  const { paperId } = useParams<{ paperId: string }>();
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
  const [isLiked, setIsLiked] = useState(false);
  const [isUnliked, setIsUnliked] = useState(false);
  const popupPositionRef = useRef(popupPosition);
  const selectedTextRef = useRef(selectedText);

  useEffect(() => {
    const fetchPaperDetail = async () => {
      if (!paperId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        window.scrollTo(0, 0);
        const paperData = await papersApi.getPaperDetail(paperId);
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
  }, [paperId]);

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
            background: #F7971D;
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
            background: #F7971D;
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
  const pages = "";
  const authors = paper.authors || [];

  return (
    <div className="min-h-screen bg-white paper-detail-page">
      <style>{`
        .paper-detail-page ::selection {
          background: rgba(247, 151, 29, 0.13);
          color: inherit;
        }
        .paper-detail-page ::-moz-selection {
          background: rgba(247, 151, 29, 0.13);
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
          paddingRight: showAIChat ? "532px" : "var(--padding)",
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
                color: "#322F29",
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
                  페이지
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
                    color: "#000",
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
                    color: "#000",
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
                    color: "#000",
                    fontFamily: "Pretendard",
                    fontSize: "17px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "24px",
                  }}
                >
                  {pages || "페이지 정보 없음"}
                </div>
                <div
                  style={{
                    color: "#000",
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
                leadingIcon={<Sparkles color="#ffffff" />}
                onClick={() => setShowAIChat(true)}
              >
                AI 뷰어
              </Button>
              <Button
                variant="secondary"
                size="medium"
                leadingIcon={<DocumentIcon />}
                onClick={() => {
                  if (paper.url) {
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
              >
                토론하러가기
              </Button>
              <div style={{ marginLeft: "auto" }}>
                <Button
                  variant="secondary"
                  size="medium"
                  onClick={() => setLanguage(language === "ko" ? "en" : "ko")}
                  style={{
                    color: "#F7971D",
                    background: "transparent",
                    border: "none",
                    textDecoration: "underline",
                    textDecorationColor: "#F7971D",
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
                color: "#322F29",
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
                color: "#322F29",
                fontFamily: "Pretendard",
                fontSize: "17px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "30px",
                whiteSpace: "pre-wrap",
                alignSelf: "stretch",
                position: "relative",
              }}
            >
              {language === "ko" && abstractContent.translatedContent
                ? abstractContent.translatedContent
                : abstractContent.content || ""}
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
                color: "#322F29",
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
                color: "#322F29",
                fontFamily: "Pretendard",
                fontSize: "17px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "30px",
                whiteSpace: "pre-wrap",
                alignSelf: "stretch",
                position: "relative",
              }}
            >
              {language === "ko" && introductionContent.translatedContent
                ? introductionContent.translatedContent
                : introductionContent.content || ""}
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
                color: "#322F29",
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
                color: "#322F29",
                fontFamily: "Pretendard",
                fontSize: "17px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "30px",
                whiteSpace: "pre-wrap",
                alignSelf: "stretch",
                position: "relative",
              }}
            >
              {language === "ko" && content.translatedContent
                ? content.translatedContent
                : content.content || ""}
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
                      color: "rgba(50, 47, 41, 0.80)",
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
                  color: "#322F29",
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
                  color: "#000",
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
                  if (!paperId) return;
                  try {
                    const result = await papersApi.toggleReaction(
                      paperId,
                      "LIKE"
                    );
                    setIsLiked(result.isReacted);
                    if (result.isReacted) {
                      setIsUnliked(false);
                    }
                    if (paper && result.likeCount !== undefined) {
                      setPaper({ ...paper, likeCount: result.likeCount });
                    }
                  } catch (error) {
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
                    color: "#322F29",
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
                  color={isLiked ? "var(--color-brand-default)" : "#A9A8A6"}
                />
                <div
                  style={{
                    color: "#322F29",
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
                  if (!paperId) return;
                  try {
                    const result = await papersApi.toggleReaction(
                      paperId,
                      "UNLIKE"
                    );
                    setIsUnliked(result.isReacted);
                    if (result.isReacted) {
                      setIsLiked(false);
                    }
                  } catch (error) {
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
                    color: "#322F29",
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
                  color={isUnliked ? "var(--color-brand-default)" : "#322F29"}
                />
                <div
                  style={{
                    color: "#322F29",
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
              color: "#322F29",
              fontFamily: "Pretendard",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "30px",
            }}
          >
            토론
          </div>

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
                  color: "#322F29",
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

            <Button variant="primary" size="medium">
              토론 시작하기
            </Button>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "var(--spacing-14)",
              alignSelf: "stretch",
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "var(--spacing-16) var(--spacing-20)",
                justifyContent: "space-between",
                alignItems: "center",
                alignSelf: "stretch",
                borderRadius: "var(--radius-16)",
                border: "1px solid var(--color-border-default)",
                background: "var(--color-surface-default)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-14)",
                }}
              >
                <DocumentPaper size={26} />

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
                      color: "#322F29",
                      fontFamily: "Pretendard",
                      fontSize: "17px",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "24px",
                    }}
                  >
                    구글 브레인은 해당 연구를 하기에 타당한가?
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--spacing-4)",
                    }}
                  >
                    <MessageBubble size={16} color="#7D7D7D" />
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
                      130+ 대화
                    </div>
                  </div>
                </div>
              </div>

              <ChevronRight size={24} fillColor="#7D7D7D" />
            </div>

            <div
              style={{
                display: "flex",
                padding: "var(--spacing-16) var(--spacing-20)",
                justifyContent: "space-between",
                alignItems: "center",
                alignSelf: "stretch",
                borderRadius: "var(--radius-16)",
                border: "1px solid var(--color-border-default)",
                background: "var(--color-surface-default)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-14)",
                }}
              >
                <DocumentPaper size={26} />

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
                      color: "#322F29",
                      fontFamily: "Pretendard",
                      fontSize: "17px",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "24px",
                    }}
                  >
                    구글 브레인은 해당 연구를 하기에 타당한가?
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--spacing-4)",
                    }}
                  >
                    <MessageBubble size={16} color="#7D7D7D" />
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
                      130+ 대화
                    </div>
                  </div>
                </div>
              </div>

              <ChevronRight size={24} fillColor="#7D7D7D" />
            </div>

            <div
              style={{
                display: "flex",
                padding: "var(--spacing-16) var(--spacing-20)",
                justifyContent: "space-between",
                alignItems: "center",
                alignSelf: "stretch",
                borderRadius: "var(--radius-16)",
                border: "1px solid var(--color-border-default)",
                background: "var(--color-surface-default)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-14)",
                }}
              >
                <DocumentPaper size={26} />

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
                      color: "#322F29",
                      fontFamily: "Pretendard",
                      fontSize: "17px",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "24px",
                    }}
                  >
                    구글 브레인은 해당 연구를 하기에 타당한가?
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--spacing-4)",
                    }}
                  >
                    <MessageBubble size={16} color="#7D7D7D" />
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
                      130+ 대화
                    </div>
                  </div>
                </div>
              </div>

              <ChevronRight size={24} fillColor="#7D7D7D" />
            </div>
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
              setSelectedTextForChat(selectedText);
              setShowAIChat(true);
              setPopupPosition(null);
              setSelectedText("");
            }}
          >
            <MessageBubble size={14} color="#7D7D7D" />
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
          paperId={paper.paperId || paperId}
          paperUrl={paper.url}
        />
      )}
    </div>
  );
}
