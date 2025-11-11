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

// 목차 항목 타입 (실제 API 응답 구조)
interface TableOfContentsItem {
  label: string;
  translatedLabel: string;
  subContents?: Array<{
    label: string;
    translatedLabel?: string;
  }>;
}

// 목차 항목 컴포넌트
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
  // 번호 생성: depth 0이면 1, 2, 3..., depth 1이면 1.1, 1.2...
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
        {/* 번호 */}
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
        {/* 제목 */}
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
  // 텍스트 선택 시 좌우 오렌지 바 표시를 위한 ref
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

  // API 호출
  useEffect(() => {
    const fetchPaperDetail = async () => {
      if (!paperId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // 페이지 진입 시 스크롤을 맨 위로 이동
        window.scrollTo(0, 0);
        const paperData = await papersApi.getPaperDetail(paperId);
        setPaper(paperData);
        // 좋아요/싫어요 상태 초기화
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

  // ref 업데이트
  useEffect(() => {
    popupPositionRef.current = popupPosition;
    selectedTextRef.current = selectedText;
  }, [popupPosition, selectedText]);

  useEffect(() => {
    // 텍스트 선택 위치 계산 함수
    const getIconPosition = () => {
      const selection = window.getSelection();

      if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
        // 현재 선택한 범위
        const range = selection.getRangeAt(0);

        if (selection.focusNode) {
          // 반대 방향 드래그 여부
          const isBackward =
            selection.anchorNode === selection.focusNode
              ? selection.anchorOffset > selection.focusOffset
              : selection.anchorNode?.compareDocumentPosition(
                  selection.focusNode
                ) === Node.DOCUMENT_POSITION_PRECEDING;

          const rects = range.getClientRects();
          const rect = rects[isBackward ? 0 : rects.length - 1];

          return {
            x: isBackward ? rect.left : rect.left + rect.width, // X 좌표
            y: rect.top, // Y 좌표
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
      // 팝업 내부 클릭은 무시
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
      // 팝업이 없으면 무시
      if (!popupPositionRef.current || !selectedTextRef.current) {
        return;
      }

      // 이미 애니메이션 프레임이 예약되어 있으면 무시 (throttle 효과)
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
          // 선택된 텍스트 위치 업데이트
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

        // 기존 바 제거
        containerRef.current
          .querySelectorAll(".selection-border-left, .selection-border-right")
          .forEach((el) => el.remove());

        // 바 그리기
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

        // 팝업 표시 (최소 2글자)
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

  // API 응답 데이터 매핑
  const paperContent = (paper.content as PaperContent) || {};
  const tableOfContents = paperContent.tableOfContents || [];
  const contents = paperContent.contents || [];
  const thumbnailUrl =
    paper.thumbnailUrl ||
    paper.imageUrl ||
    paper.coverImage ||
    "https://via.placeholder.com/250x271/CCCCCC/666666?text=No+Image";
  const publishedYear = paper.issuedAt
    ? new Date(paper.issuedAt).getFullYear().toString()
    : "";
  const pages = ""; // API에서 제공되지 않을 수 있음
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
        {/* 이미지와 글자 레이아웃 */}
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
          {/* 왼쪽 - 썸네일 */}
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

          {/* 오른쪽 - 글자 레이아웃 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "var(--spacing-12)",
              flex: 1,
            }}
          >
            {/* 카테고리 */}
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
              {paper.categories[0] || ""}
            </div>

            {/* 제목 */}
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

            {/* 요약 */}
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

            {/* 메타데이터 레이아웃 */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--spacing-14)",
                width: "100%",
              }}
            >
              {/* 왼쪽 - 회색 라벨들 */}
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

              {/* 오른쪽 - 검은색 값들 */}
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

            {/* 버튼 레이아웃 */}
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

        {/* 목차 섹션 */}
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
          {/* 목차 제목 */}
          <div
            style={{
              color: "#322F29",
              fontFamily: "Pretendard",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "30px",
            }}
          >
            목차
          </div>

          {/* 구분선 */}
          <div
            style={{
              background: "var(--color-border-default)",
              width: "100%",
              height: "1px",
              alignSelf: "stretch",
            }}
          />

          {/* 목차 항목들 */}
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

        {/* 본문 섹션 */}
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
            {/* 본문 제목 */}
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

            {/* 본문 내용 */}
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

            {/* 이미지가 있는 경우 */}
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

        {/* 피드백 섹션 */}
        <div
          style={{
            display: "flex",
            padding: "var(--spacing-24) var(--spacing-12)",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--spacing-24)",
            alignSelf: "stretch",
            borderRadius: "var(--radius-14)",
            background: "var(--color-surface-subtle)",
            maxWidth: "1200px",
            width: "100%",
            margin: "0 auto",
          }}
        >
          {/* 위쪽 글자 영역 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--spacing-4)",
            }}
          >
            {/* 논문 제목 */}
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
            {/* 질문 */}
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

          {/* 피드백 옵션들 */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "-1px",
              background: "var(--color-surface-subtle)",
            }}
          >
            {/* 좋아요 */}
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

            {/* 싫어요 */}
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

        {/* 토론 섹션 */}
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
          {/* 토론 제목 */}
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

          {/* 활성화 토론 카드 */}
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
            {/* 왼쪽 글자 영역 */}
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

            {/* 오른쪽 버튼 */}
            <Button variant="primary" size="medium">
              토론 시작하기
            </Button>
          </div>

          {/* 토론 카드들 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "var(--spacing-14)",
              alignSelf: "stretch",
            }}
          >
            {/* 토론 카드 1 */}
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
              {/* 왼쪽 영역 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-14)",
                }}
              >
                <DocumentPaper size={26} />
                {/* 글자 레이아웃 */}
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

              {/* 오른쪽 아이콘 */}
              <ChevronRight size={24} fillColor="#7D7D7D" />
            </div>

            {/* 토론 카드 2 */}
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
              {/* 왼쪽 영역 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-14)",
                }}
              >
                <DocumentPaper size={26} />
                {/* 글자 레이아웃 */}
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

              {/* 오른쪽 아이콘 */}
              <ChevronRight size={24} fillColor="#7D7D7D" />
            </div>

            {/* 토론 카드 3 */}
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
              {/* 왼쪽 영역 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-14)",
                }}
              >
                <DocumentPaper size={26} />
                {/* 글자 레이아웃 */}
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

              {/* 오른쪽 아이콘 */}
              <ChevronRight size={24} fillColor="#7D7D7D" />
            </div>
          </div>
        </div>
      </div>

      {/* 텍스트 선택 팝업 */}
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
              // 채팅으로 전송 기능 구현
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

      {/* AI 채팅 위젯 */}
      {showAIChat && (
        <AIChat
          onClose={() => {
            setShowAIChat(false);
            setSelectedTextForChat("");
          }}
          initialMessage={selectedTextForChat}
          paperTitle={paper.title}
        />
      )}
    </div>
  );
}
