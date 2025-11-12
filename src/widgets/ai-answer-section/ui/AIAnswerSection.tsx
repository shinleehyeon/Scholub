import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Typography, Button } from "@/shared/ui";
import Sparkles from "@/shared/ui/icons/Sparkles";
import MessageBubble from "@/shared/ui/icons/MessageBubble";
import { papersApi } from "@/shared/api/papers";

interface AIAnswerSectionProps {
  className?: string;
  searchQuery?: string;
}

export default function AIAnswerSection({
  className,
  searchQuery,
}: AIAnswerSectionProps) {
  const [aiAnswer, setAiAnswer] = useState<string>("");
  const [isThinking, setIsThinking] = useState(false);
  const [citations, setCitations] = useState<
    Array<{ title: string; url: string; snippet: string }> | undefined
  >(undefined);

  useEffect(() => {
    const fetchAIAnswer = async () => {
      if (!searchQuery || !searchQuery.trim()) {
        setAiAnswer("");
        setCitations(undefined);
        setIsThinking(false);
        return;
      }

      try {
        setIsThinking(true);
        setAiAnswer("");

        // OpenAI 형식으로 메시지 생성
        const openAIMessages = [
          {
            role: "user" as const,
            content: searchQuery.trim(),
          },
        ];

        let fullContent = "";
        let isFirstChunk = true;

        try {
          console.log("스트리밍 시작:", { openAIMessages });
          // 스트리밍 API 호출
          for await (const chunk of papersApi.searchPapersAIStream({
            messages: openAIMessages,
            model: "sonar-pro",
            temperature: 0.2,
          })) {
            console.log("스트리밍 청크 받음:", chunk);
            if (chunk.content) {
              fullContent += chunk.content;
              console.log("전체 내용 업데이트:", fullContent.substring(0, 100));

              // 첫 번째 글자를 받을 때 상태 업데이트 시작
              if (isFirstChunk) {
                isFirstChunk = false;
                console.log("첫 번째 청크 받음, 답변 표시 시작");
              }
              setAiAnswer(fullContent);
            }
            if (chunk.citations) {
              console.log("Citations 받음:", chunk.citations);
              setCitations(chunk.citations);
            }
          }
          console.log("스트리밍 완료:", {
            fullContent: fullContent.substring(0, 100),
            citations,
          });
        } catch (streamError) {
          // 스트리밍 실패 시 일반 API로 폴백
          console.warn("스트리밍 실패, 일반 API로 폴백:", streamError);

          const response = await papersApi.searchPapersAI({
            messages: openAIMessages,
            model: "sonar-pro",
            temperature: 0.2,
          });

          const aiContent =
            response.choices?.[0]?.message?.content ||
            "응답을 받을 수 없습니다.";
          const responseCitations = response.citations || [];

          setAiAnswer(aiContent);
          setCitations(
            responseCitations.length > 0 ? responseCitations : undefined
          );
        }
      } catch (error) {
        console.error("AI 답변 오류:", error);
        setAiAnswer("죄송합니다. AI 답변을 가져오는 중 오류가 발생했습니다.");
      } finally {
        setIsThinking(false);
      }
    };

    fetchAIAnswer();
  }, [searchQuery]);

  return (
    <div
      className={className}
      style={{
        display: "flex",
        padding: "var(--spacing-20)",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "10px",
        borderRadius: "var(--radius-14)",
        border: "1px solid var(--color-border-default)",
        width: "480px",
        maxHeight: "600px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            width: "22px",
            height: "22px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Sparkles size={22} color="var(--color-brand-default)" />
        </div>
        <Typography.Body
          color="default"
          style={{
            fontFamily: "Pretendard",
            fontSize: "17px",
            fontWeight: 500,
            lineHeight: "24px",
            color: "var(--color-text-subtle)",
          }}
        >
          AI 답변
        </Typography.Body>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-20)",
          width: "100%",
          overflowY: "auto",
          flex: 1,
          minHeight: 0,
        }}
      >
        {isThinking ? (
          <div
            style={{
              alignSelf: "flex-start",
              color: "var(--color-text-subtle)",
              fontFamily: "Pretendard",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "24px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            생성중
            <span
              style={{
                display: "inline-flex",
                gap: "2px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-text-subtle)",
                  animation: "thinking-dot 1.4s infinite ease-in-out",
                  animationDelay: "0s",
                }}
              />
              <span
                style={{
                  display: "inline-block",
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-text-subtle)",
                  animation: "thinking-dot 1.4s infinite ease-in-out",
                  animationDelay: "0.2s",
                }}
              />
              <span
                style={{
                  display: "inline-block",
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-text-subtle)",
                  animation: "thinking-dot 1.4s infinite ease-in-out",
                  animationDelay: "0.4s",
                }}
              />
            </span>
            <style>
              {`
                @keyframes thinking-dot {
                  0%, 80%, 100% {
                    transform: scale(0);
                    opacity: 0.5;
                  }
                  40% {
                    transform: scale(1);
                    opacity: 1;
                  }
                }
              `}
            </style>
          </div>
        ) : aiAnswer ? (
          <>
            <div
              style={{
                color: "var(--color-text-default)",
                fontFamily: "Pretendard",
                fontSize: "17px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "22px",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p
                      style={{
                        margin: "0 0 4px 0",
                        lineHeight: "22px",
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
                        margin: "8px 0 4px 0",
                        lineHeight: "28px",
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
                        margin: "8px 0 3px 0",
                        lineHeight: "26px",
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
                        margin: "8px 0 3px 0",
                        lineHeight: "24px",
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
                        margin: "6px 0 2px 0",
                        lineHeight: "22px",
                      }}
                    >
                      {children}
                    </h4>
                  ),
                  ul: ({ children }) => (
                    <ul
                      style={{
                        margin: "2px 0",
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
                        margin: "2px 0",
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
                        margin: "0 0 2px 0",
                        lineHeight: "22px",
                        paddingLeft: "4px",
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
                        margin: "8px 0",
                        fontSize: "15px",
                        fontFamily: "monospace",
                        lineHeight: "22px",
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
                        margin: "8px 0",
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
                  strong: ({ children }) => (
                    <strong style={{ fontWeight: 600 }}>{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em style={{ fontStyle: "italic" }}>{children}</em>
                  ),
                }}
              >
                {aiAnswer}
              </ReactMarkdown>
            </div>
            {citations && citations.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--spacing-8)",
                  padding: "var(--spacing-12)",
                  background: "var(--color-surface-subtle)",
                  borderRadius: "var(--radius-8)",
                  marginTop: "var(--spacing-8)",
                }}
              >
                <Typography.Caption
                  color="subtle"
                  style={{
                    fontFamily: "Pretendard",
                    fontSize: "12px",
                    fontWeight: 600,
                    lineHeight: "16px",
                    color: "var(--color-text-subtle)",
                  }}
                >
                  참고 논문
                </Typography.Caption>
                {citations.map((citation, index) => (
                  <a
                    key={index}
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      textDecoration: "none",
                      color: "var(--color-text-default)",
                    }}
                  >
                    <Typography.Caption
                      color="default"
                      style={{
                        fontFamily: "Pretendard",
                        fontSize: "12px",
                        fontWeight: 500,
                        lineHeight: "16px",
                        color: "var(--color-brand-default)",
                      }}
                    >
                      {citation.title}
                    </Typography.Caption>
                    {citation.snippet && (
                      <Typography.Caption
                        color="subtle"
                        style={{
                          fontFamily: "Pretendard",
                          fontSize: "11px",
                          fontWeight: 400,
                          lineHeight: "14px",
                          color: "var(--color-text-subtle)",
                        }}
                      >
                        {citation.snippet}
                      </Typography.Caption>
                    )}
                  </a>
                ))}
              </div>
            )}
          </>
        ) : (
          <Typography.Body
            color="subtle"
            style={{
              fontFamily: "Pretendard",
              fontSize: "17px",
              fontWeight: 400,
              lineHeight: "24px",
            }}
          >
            검색어를 입력하면 AI 답변을 받을 수 있습니다.
          </Typography.Body>
        )}
      </div>

      {aiAnswer && (
        <Button
          variant="secondary"
          size="medium"
          leadingIcon={<MessageBubble color="var(--color-text-subtle)" />}
          onClick={() => {}}
          style={{
            marginTop: "var(--spacing-8)",
            flexShrink: 0,
          }}
        >
          AI 탭으로 이동
        </Button>
      )}
    </div>
  );
}
