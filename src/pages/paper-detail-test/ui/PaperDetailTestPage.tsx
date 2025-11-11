import { Header } from "@/widgets/header";
import { SubHeader } from "@/widgets/sub-header";
import { AIChat } from "@/widgets/ai-chat";
import { Button } from "@/shared/ui";
import Sparkles from "@/shared/ui/icons/Sparkles";
import SmileLike from "@/shared/ui/icons/SmileLike";
import FrownDislike from "@/shared/ui/icons/FrownDislike";
import DocumentPaper from "@/shared/ui/icons/DocumentPaper";
import DocumentIcon from "@/shared/ui/icons/DocumentIcon";
import MessageBubble from "@/shared/ui/icons/MessageBubble";
import ChevronRight from "@/shared/ui/icons/ChevronRight";
import { useEffect, useRef, useState } from "react";

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
          {item.translatedLabel}
        </div>
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

export default function PaperDetailTestPage() {

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
  const popupPositionRef = useRef(popupPosition);
  const selectedTextRef = useRef(selectedText);

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

  const testPaper = {
    categories: [
      "Computer Vision and Pattern Recognition",
      "Artificial Intelligence",
      "Human-Computer Interaction",
      "H.5.2; H.5.1; I.4.8; I.2.6",
    ],
    title:
      "AI Assisted AR Assembly: Object Recognition and Computer Vision for Augmented Reality Assisted Assembly",
    summary:
      "We present an AI-assisted Augmented Reality assembly workflow that uses deep learning-based object recognition to identify different assembly components and display step-by-step instructions. For each assembly step, the system displays a bounding box around the corresponding components in the physical space, and where the component should be placed. By connecting assembly instructions with the real-time location of relevant components, the system eliminates the need for manual searching, sorting, or labeling of different components before each assembly. To demonstrate the feasibility of using object recognition for AR-assisted assembly, we highlight a case study involving the assembly of LEGO sculptures.",
    thumbnailUrl:
      "https://scholub.alpa.dev/thumbnails/69ffc3f8-3341-45c0-b6c3-b76638912768.webp",
    authors: [
      "Alexander Htet Kyaw",
      "Haotian Ma",
      "Sasa Zivkovic",
      "Jenny Sabin",
    ],
    publishedYear: "2025.11",
    pages: "17p",
    doi: "arXiv:2511.05394v1",
    content: {
      tableOfContents: [
        {
          label: "Introduction",
          translatedLabel: "소개",
          subContents: [
            {
              label: "Our Results",
              translatedLabel: "결과",
            },
            {
              label: "Related Works",
              translatedLabel: "관련 연구",
            },
          ],
        },
        {
          label: "Preliminaries",
          translatedLabel: "전제 조건",
        },
        {
          label: "The Main Result",
          translatedLabel: "주요 결과",
        },
        {
          label: "The Algorithm",
          translatedLabel: "알고리즘",
        },
      ],
      contents: [
        {
          content:
            "We give a deterministic O(mlog2/3 n)-time algorithm for single-source shortest paths (SSSP) on directed graphs with real non-negative edge weights in the comparison-addition model. This is the first result to break the O(m+nlog n) time bound of Dijkstra's algorithm on sparse graphs, showing that Dijkstra's algorithm is not optimal for SSSP.",
          label: "Abstract",
          translatedContent:
            "우리는 비교-덧셈 모델에서 실수 양수 가중치를 가진 방향 그래프의 단일 소스 최단 경로(SSSP)를 위한 결정론적 O(mlog2/3 n) 시간 알고리즘을 제시합니다. 이는 희소 그래프에서 Dijkstra 알고리즘의 O(m+nlog n) 시간 복잡도를 깨는 첫 번째 결과로, Dijkstra 알고리즘이 SSSP에 대해 최적이 아님을 보여줍니다.",
          translatedLabel: "초록",
        },
        {
          content:
            "Researchers from Google Brain and the University of Toronto have proposed a new natural language processing (NLP) model called 'Transformer' that will bring a revolutionary turning point to the field of artificial intelligence.\nUnlike existing recurrent neural networks (RNN) or convolutional neural networks (CNN), this model operates solely on an 'Attention' mechanism that can grasp the relationships between all words in a sentence at once without sequential computation, and is evaluated as presenting a new paradigm for AI language models.\n\nThe research team compiled their findings into a paper titled 'Attention Is All You Need' and published it on arXiv, a preprint paper site, on the 13th.\nThe paper emphasizes that the Transformer architecture provides a faster, more efficient, and parallelizable learning structure than existing models in various natural language processing tasks such as translation, summarization, and question answering.\nThis model dramatically improves contextual understanding by allowing each word in the input sentence to learn its relationship with other words through 'attention'.\n\nThe Transformer architecture presented in the paper is divided into two parts: 'Encoder' and 'Decoder', with each component centered on Multi-Head Attention and Feed-Forward Neural Networks.\nThis architecture became the foundation for large language models that emerged later, such as BERT, GPT, T5, RoBERTa, LLaMA, and Gemini, and played a decisive role in the development of today's generative AI technology.\n\nTransformer is not just a technical innovation, but is evaluated as a turning point that completely shifted the central axis of deep learning research paradigm from 'recurrence to attention'.\nIn particular, immediately after the paper was published, researchers and industries worldwide quickly adopted this architecture, and it is being widely applied in various fields such as machine translation, text generation, image caption generation, and multimodal AI.",
          label: "Introduction",
          translatedContent:
            "구글 브레인(Google Brain)과 캐나다 토론토대학교(University of Toronto) 연구진이 인공지능 분야에 혁신적인 전환점을 가져올 새로운 자연어처리(NLP) 모델 '트랜스포머(Transformer)'를 제안했다.\n이 모델은 기존의 순환신경망(RNN)이나 합성곱신경망(CNN)과 달리 순차적 계산 없이 문장 내 모든 단어 간의 관계를 한 번에 파악할 수 있는 '어텐션(Attention)' 메커니즘만으로 작동한다는 점에서, 인공지능 언어 모델의 새로운 패러다입을 제시했다는 평가를 받고 있다.\n\n연구팀은 해당 연구 결과를 Attention Is All You Need라는 제목의 논문으로 정리해 지난 13일 사전 공개 논문 사이트인 arXiv에 게재했다.\n논문에서는 트랜스포머 구조가 번역, 요약, 질의응답 등 다양한 자연어처리 작업에서 기존 모델보다 더 빠르고, 효율적이며, 병렬화가 가능한 학습 구조를 제공한다는 점을 강조했다.\n이 모델은 입력 문장의 각 단어가 다른 단어와의 관계를 스스로 '주의(attention)'를 통해 학습함으로써, 문맥 이해 능력을 비약적으로 향상시킨다.\n\n논문에서 제시된 트랜스포머 구조는 '인코더(Encoder)'와 '디코더(Decoder)'라는 두 부분으로 나뉘며, 각 구성 요소는 멀티헤드 어텐션(Multi-Head Attention)과 피드포워드 신경망(Feed-Forward Neural Network)을 핵심으로 한다.\n이러한 구조는 이후 등장한 BERT, GPT, T5, RoBERTa, LLaMA, Gemini 등 대형 언어 모델의 기반이 되었으며, 오늘날의 생성형 AI 기술 발전에 결정적인 역할을 했다.\n\n트랜스포머는 단순히 기술적인 혁신에 그치지 않고, 딥러닝 연구 패러다임의 중심축을 '순환에서 어텐션으로'완전히 이동시킨 전화점으로 평가받고 있다.\n특히, 논문이 발표된 직후 전 세계 연구자들과 산업계가 빠르게 이 구조를 채택하며, 머신 트랜슬레이션(기계 번역), 문장 생성, 이미지 캡션 생성, 멀티모달 AI 등 다양한 분야에서 폭넓게 응용되고 있다.",
          translatedLabel: "본문",
          imageUrl:
            "https://via.placeholder.com/800x400/CCCCCC/666666?text=AI+Image",
          imageCaption: "▲ 인공지능 추상화 이미지(출처=ChatGPT)",
        },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-white paper-detail-test-page">
      <style>{`
        .paper-detail-test-page ::selection {
          background: rgba(247, 151, 29, 0.13);
          color: inherit;
        }
        .paper-detail-test-page ::-moz-selection {
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
                background: `url(${testPaper.thumbnailUrl}) lightgray 50% / cover no-repeat`,
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
              {testPaper.categories[0]}
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
              {testPaper.title}
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
              {testPaper.summary}
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
                  {testPaper.authors.slice(0, 3).join(", ")}{" "}
                  <span
                    style={{
                      color: "var(--color-text-subtle)",
                    }}
                  >
                    외 {testPaper.authors.length - 3}명
                  </span>
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
                  {testPaper.publishedYear}
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
                  {testPaper.pages}
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
                  {testPaper.doi}
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
            {testPaper.content.tableOfContents.map((item, index) => (
              <TableOfContentsItem key={index} item={item} index={index} />
            ))}
          </div>
        </div>

        {testPaper.content.contents.map((content, index) => (
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
              {content.translatedLabel}
            </div>

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
                color: "#000",
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
              {content.translatedContent}
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
              {testPaper.title}
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
              style={{
                display: "flex",
                width: "110px",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
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
              <SmileLike size={50} />
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
                13명
              </div>
            </div>

            <div
              style={{
                display: "flex",
                width: "110px",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
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
              <FrownDislike size={50} />
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
                1명
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
          paperTitle={testPaper.title}
        />
      )}
    </div>
  );
}
