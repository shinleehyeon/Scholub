import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Sparkles from "@/shared/ui/icons/Sparkles";
import Close from "@/shared/ui/icons/Close";
import Send from "@/shared/ui/icons/Send";
import X from "@/shared/ui/icons/X";
import ExternalLink from "@/shared/ui/icons/ExternalLink";
import { papersApi } from "@/shared/api/papers";

interface AIChatProps {
  onClose?: () => void;
  initialMessage?: string;
  paperTitle?: string;
  id?: string;
  paperUrl?: string;
}

export default function AIChat({
  onClose,
  initialMessage,
  paperTitle,
  id,
  paperUrl,
}: AIChatProps) {
  const [message, setMessage] = useState("");
  const [contextText, setContextText] = useState<string>("");
  const [isHoveringContext, setIsHoveringContext] = useState(false);
  const [messages, setMessages] = useState<
    Array<{
      text: string;
      isUser: boolean;
      citations?: Array<{ title: string; url: string; snippet: string }>;
    }>
  >([]);
  const [isThinking, setIsThinking] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (initialMessage) {
      setContextText(initialMessage);
    }
  }, [initialMessage]);

  useEffect(() => {
    const startSession = async () => {
      if (id && !sessionId) {
        try {
          const result = await papersApi.startChatSession(id);
          setSessionId(result.activityId);
        } catch (error) {
          console.error("채팅 세션 시작 실패:", error);
        }
      }
    };
    startSession();
  }, [id, sessionId]);

  const suggestedQuestions = [
    "이 논문의 주요 기여도는 무엇인가요?",
    "연구 방법론을 자세히 설명해주세요",
    "실험 결과의 의미는 무엇인가요?",
  ];

  const handleSendMessage = async () => {
    const fullMessage = contextText
      ? `${contextText}\n${message}`.trim()
      : message.trim();
    if (!fullMessage) return;

    // 사용자 메시지 추가
    setMessages((prev) => [...prev, { text: fullMessage, isUser: true }]);
    const userMessage = fullMessage;
    setMessage("");
    setContextText("");
    setIsThinking(true);

    try {
      // OpenAI 형식: 전체 대화 히스토리를 messages 배열로 변환
      // 프론트엔드에서 관리하는 messages를 OpenAI 형식으로 변환
      const openAIMessages = messages.map((msg) => ({
        role: msg.isUser ? ("user" as const) : ("assistant" as const),
        content: msg.text,
      }));

      // 첫 메시지인 경우 PDF URL을 포함
      // 이후 메시지에서는 대화 히스토리에 이미 포함되어 있으므로 별도로 포함하지 않음
      const isFirstMessage = messages.length === 0;

      // 현재 사용자 메시지 추가
      if (isFirstMessage && paperUrl) {
        // OpenAI 파일 첨부 형식: content를 배열로 만들어 파일 URL 포함
        openAIMessages.push({
          role: "user" as const,
          content: [
            {
              type: "input_text",
              text: userMessage,
            },
            {
              type: "input_file",
              file_url: paperUrl,
            },
          ],
        });
      } else {
        // 일반 메시지: 문자열 형식
        openAIMessages.push({
          role: "user" as const,
          content: userMessage,
        });
      }

      let fullContent = "";
      let citations:
        | Array<{ title: string; url: string; snippet: string }>
        | undefined;
      let isFirstChunk = true;
      let streamingMessageId: number | null = null;

      try {
        console.log("스트리밍 시작:", { openAIMessages, paperUrl });
        // 스트리밍 API 호출 시도
        // 첫 메시지인 경우에만 file_url 파라미터로 PDF URL 전달
        const isFirstMessage = messages.length === 0;
        for await (const chunk of papersApi.searchPapersAIStream({
          messages: openAIMessages,
          model: "sonar-pro",
          temperature: 0.2,
          ...(isFirstMessage && paperUrl && { file_url: paperUrl }),
        })) {
          console.log("스트리밍 청크 받음:", chunk);
          if (chunk.content) {
            fullContent += chunk.content;
            console.log("전체 내용 업데이트:", fullContent);

            // 첫 번째 글자를 받을 때만 메시지박스 생성
            if (isFirstChunk) {
              isFirstChunk = false;
              setIsThinking(false); // 첫 청크를 받으면 "생각중" 표시 종료
              setMessages((prev) => {
                const newId = prev.length;
                streamingMessageId = newId;
                return [
                  ...prev,
                  {
                    text: fullContent,
                    isUser: false,
                    citations: chunk.citations || citations,
                  },
                ];
              });
            } else {
              // 이후에는 기존 메시지 업데이트
              setMessages((prev) => {
                const updated = [...prev];
                if (
                  streamingMessageId !== null &&
                  updated[streamingMessageId]
                ) {
                  updated[streamingMessageId] = {
                    text: fullContent,
                    isUser: false,
                    citations: chunk.citations || citations,
                  };
                }
                return updated;
              });
            }
          }
          if (chunk.citations) {
            console.log("Citations 받음:", chunk.citations);
            citations = chunk.citations;
          }
        }
        console.log("스트리밍 완료:", { fullContent, citations });

        // 최종 메시지 업데이트 (citations 포함)
        if (streamingMessageId !== null) {
          setMessages((prev) => {
            const updated = [...prev];
            if (updated[streamingMessageId!]) {
              updated[streamingMessageId!] = {
                text: fullContent,
                isUser: false,
                citations:
                  citations && citations.length > 0 ? citations : undefined,
              };
            }
            return updated;
          });
        }
      } catch (streamError) {
        // 스트리밍 실패 시 일반 API로 폴백
        console.warn("스트리밍 실패, 일반 API로 폴백:", streamError);

        const response = await papersApi.searchPapersAI({
          messages: openAIMessages,
          model: "sonar-pro",
          temperature: 0.2,
        });

        const aiContent =
          response.choices?.[0]?.message?.content || "응답을 받을 수 없습니다.";
        const responseCitations = response.citations || [];

        // 폴백 시에도 메시지가 없으면 생성
        setMessages((prev) => {
          if (streamingMessageId === null) {
            return [
              ...prev,
              {
                text: aiContent,
                isUser: false,
                citations:
                  responseCitations.length > 0 ? responseCitations : undefined,
              },
            ];
          } else {
            const updated = [...prev];
            updated[streamingMessageId] = {
              text: aiContent,
              isUser: false,
              citations:
                responseCitations.length > 0 ? responseCitations : undefined,
            };
            return updated;
          }
        });
      }
    } catch (error) {
      console.error("AI 채팅 오류:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "죄송합니다. 메시지를 처리하는 중 오류가 발생했습니다.",
          isUser: false,
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        width: "512px",
        height: "calc(100vh - 121px)",
        padding: "var(--spacing-16)",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        top: "121px",
        right: 0,
        borderLeft: "1px solid var(--color-border-default)",
        background: "var(--color-surface-subtle)",
        boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.05)",
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: "flex",
          padding: "0 var(--spacing-4)",
          justifyContent: "space-between",
          alignItems: "center",
          alignSelf: "stretch",
        }}
      >
        <div
          style={{
            color: "var(--color-text-subtle)",
            fontFamily: "Pretendard",
            fontSize: "24px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "30px",
          }}
        >
          AI 채팅
        </div>
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
          <Close size={24} color="var(--color-text-subtle)" />
        </button>
      </div>

      {messages.length === 0 ? (
        <div
          style={{
            display: "flex",
            padding: "var(--spacing-100) 0",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--spacing-10)",
            }}
          >
            <Sparkles size={31} color="var(--color-brand-default)" />
            <div
              style={{
                color: "#000",
                fontFamily: "Pretendard",
                fontSize: "26px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "140%",
              }}
            >
              AI 질문
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
              Scholub AI에게 궁금한 것을 물어보세요
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--spacing-8)",
                marginTop: "var(--spacing-24)",
              }}
            >
              {suggestedQuestions.map((question, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    padding: "var(--spacing-14) var(--spacing-24)",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    borderRadius: "var(--radius-32)",
                    border: "1px solid var(--color-border-default)",
                    background: "var(--color-surface-default)",
                    cursor: "pointer",
                  }}
                  onClick={() => setMessage(question)}
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
                    {question}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            padding: "var(--spacing-20) 0",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "var(--spacing-12)",
            flex: "1 0 0",
            alignSelf: "stretch",
            overflowY: "auto",
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "var(--spacing-16) var(--spacing-20)",
                gap: "var(--spacing-12)",
                borderRadius: msg.isUser
                  ? "var(--radius-16)"
                  : "var(--radius-20)",
                border: "1px solid var(--color-border-default)",
                background: msg.isUser
                  ? "var(--color-surface-default)"
                  : "#F7971D",
                width: msg.isUser ? "auto" : "359px",
                alignSelf: msg.isUser ? "flex-end" : "flex-start",
              }}
            >
              {msg.isUser ? (
                <div
                  style={{
                    color: "var(--color-text-default)",
                    fontFamily: "Pretendard",
                    fontSize: "17px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "24px",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.text}
                </div>
              ) : (
                <div
                  style={{
                    color: "#FFFFFF",
                    fontFamily: "Pretendard",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "19px",
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
                            lineHeight: "19px",
                            color: "#FFFFFF",
                            fontSize: "14px",
                          }}
                        >
                          {children}
                        </p>
                      ),
                      h1: ({ children }) => (
                        <h1
                          style={{
                            fontSize: "18px",
                            fontWeight: 600,
                            margin: "8px 0 4px 0",
                            lineHeight: "22px",
                            color: "#FFFFFF",
                          }}
                        >
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2
                          style={{
                            fontSize: "16px",
                            fontWeight: 600,
                            margin: "8px 0 3px 0",
                            lineHeight: "20px",
                            color: "#FFFFFF",
                          }}
                        >
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3
                          style={{
                            fontSize: "15px",
                            fontWeight: 600,
                            margin: "8px 0 3px 0",
                            lineHeight: "19px",
                            color: "#FFFFFF",
                          }}
                        >
                          {children}
                        </h3>
                      ),
                      h4: ({ children }) => (
                        <h4
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            margin: "6px 0 2px 0",
                            lineHeight: "18px",
                            color: "#FFFFFF",
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
                            lineHeight: "19px",
                            paddingLeft: "4px",
                            color: "#FFFFFF",
                            fontSize: "14px",
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
                            fontSize: "13px",
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
                            fontSize: "13px",
                            fontFamily: "monospace",
                            lineHeight: "20px",
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
                            color: "#FFFFFF",
                            textDecoration: "underline",
                            textUnderlineOffset: "2px",
                            opacity: 0.9,
                          }}
                        >
                          {children}
                        </a>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote
                          style={{
                            borderLeft: "3px solid rgba(255, 255, 255, 0.3)",
                            paddingLeft: "12px",
                            margin: "8px 0",
                            fontStyle: "italic",
                            color: "#FFFFFF",
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
                    {msg.text}
                  </ReactMarkdown>
                </div>
              )}
              {msg.citations && msg.citations.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--spacing-8)",
                    paddingTop: "var(--spacing-12)",
                    borderTop: "1px solid rgba(255, 255, 255, 0.3)",
                  }}
                >
                  <div
                    style={{
                      color: "#FFFFFF",
                      fontFamily: "Pretendard",
                      fontSize: "14px",
                      fontStyle: "normal",
                      fontWeight: 600,
                      lineHeight: "20px",
                    }}
                  >
                    출처:
                  </div>
                  {msg.citations.map((citation, citationIndex) => (
                    <a
                      key={citationIndex}
                      href={citation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-4)",
                        padding: "var(--spacing-8) var(--spacing-12)",
                        borderRadius: "var(--radius-8)",
                        background: "#E6891A",
                        textDecoration: "none",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          color: "#FFFFFF",
                          fontFamily: "Pretendard",
                          fontSize: "15px",
                          fontStyle: "normal",
                          fontWeight: 600,
                          lineHeight: "20px",
                        }}
                      >
                        {citation.title}
                      </div>
                      {citation.snippet && (
                        <div
                          style={{
                            color: "rgba(255, 255, 255, 0.9)",
                            fontFamily: "Pretendard",
                            fontSize: "13px",
                            fontStyle: "normal",
                            fontWeight: 400,
                            lineHeight: "18px",
                          }}
                        >
                          {citation.snippet}
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          {isThinking && (
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
              <span>생각중</span>
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
          )}
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "var(--spacing-10)",
          alignSelf: "stretch",
        }}
      >
        {paperTitle && (
          <div
            onClick={() => {
              if (paperUrl) {
                window.open(paperUrl, "_blank");
              }
            }}
            style={{
              display: "flex",
              padding: "var(--spacing-14) var(--spacing-16)",
              alignItems: "center",
              gap: "var(--spacing-4)",
              alignSelf: "stretch",
              borderRadius: "var(--radius-14)",
              border: "1px solid var(--color-border-default)",
              background: "var(--color-surface-subtle)",
              overflow: "hidden",
              cursor: paperUrl ? "pointer" : "default",
            }}
          >
            <div
              style={{
                color: "var(--color-text-subtle)",
                textOverflow: "ellipsis",
                fontFamily: "Pretendard",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "20px",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 1,
                flex: "1 0 0",
                overflow: "hidden",
              }}
            >
              {paperTitle}
            </div>
            <ExternalLink size={20} color="var(--color-text-subtle)" />
          </div>
        )}

        <div
          style={{
            display: "flex",
            padding: "var(--spacing-14) var(--spacing-16)",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "var(--spacing-8)",
            alignSelf: "stretch",
            borderRadius: "var(--radius-16)",
            background: "var(--color-surface-default)",
          }}
        >
          {contextText && (
            <div
              onMouseEnter={() => setIsHoveringContext(true)}
              onMouseLeave={() => setIsHoveringContext(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-8)",
                padding: "var(--spacing-8) var(--spacing-12)",
                borderRadius: "var(--radius-8)",
                background: "var(--color-surface-brand-subtle)",
                width: "fit-content",
                maxWidth: "100%",
                cursor: "pointer",
              }}
              onClick={() => setContextText("")}
            >
              {isHoveringContext ? (
                <X size={16} color="var(--color-brand-default)" />
              ) : (
                <div
                  style={{
                    color: "var(--color-brand-default)",
                    fontFamily: "Pretendard",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "20px",
                    flexShrink: 0,
                  }}
                >
                  @
                </div>
              )}
              <div
                style={{
                  color: "var(--color-text-default)",
                  fontFamily: "Pretendard",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "20px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "300px",
                }}
              >
                {contextText}
              </div>
            </div>
          )}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="이 논문의 주요 기여도는 무엇인가요?"
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: "Pretendard",
              fontSize: "17px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "24px",
              resize: "none",
              minHeight: "60px",
              color: message
                ? "var(--color-text-default)"
                : "var(--color-text-subtle)",
            }}
            className="placeholder:text-[var(--color-text-subtle)] placeholder:font-[Pretendard] placeholder:text-[17px] placeholder:font-medium placeholder:leading-[24px]"
          />
          <button
            type="button"
            onClick={handleSendMessage}
            style={{
              display: "flex",
              padding: "var(--spacing-8) var(--spacing-12)",
              alignItems: "center",
              gap: "var(--spacing-6)",
              borderRadius: "var(--radius-9999)",
              background: "var(--color-surface-brand-default)",
              border: "none",
              cursor: "pointer",
              alignSelf: "flex-end",
            }}
          >
            <Send size={16} color="var(--color-text-white)" />
            <div
              style={{
                color: "var(--color-text-white)",
                fontFamily: "Pretendard",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "20px",
              }}
            >
              보내기
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
