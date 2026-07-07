import { useState, useRef, useEffect } from "react";
import { sendMessage } from "../Services/chatService";
import { ragAsk } from "../Services/ragService";

interface Message {
  sender: "user" | "ai";
  text: string;
}

const Chat = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hello! I am your Career AI Assistant. Select a mode above and ask me anything about your professional roadmap or indexed job markets.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [chatMode, setChatMode] = useState<"standard" | "rag">("standard");

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText !== undefined ? queryText : question;
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: Message = { sender: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    
    if (queryText === undefined) {
      setQuestion("");
    }

    setLoading(true);
    try {
      // Gather previous conversation turns excluding the generic greetings
      const chatTurns = messages.filter(
        (m) =>
          !m.text.includes("Hello! I am your Career AI Assistant") &&
          !m.text.includes("General Assistant active") &&
          !m.text.includes("RAG mode active")
      );

      let promptPayload = textToSend;
      if (chatTurns.length > 0) {
        const formattedHistory = chatTurns
          .map((msg) => `${msg.sender === "user" ? "Human" : "Assistant"}: ${msg.text}`)
          .join("\n");
        promptPayload = `Previous Conversation History:\n${formattedHistory}\n\nHuman: ${textToSend}`;
      }

      let responseText = "";
      if (chatMode === "rag") {
        const response = await ragAsk(promptPayload);
        responseText = response.answer;
      } else {
        const response = await sendMessage({
          question: promptPayload,
        });
        responseText = response.answer;
      }
      
      // Add AI response
      setMessages((prev) => [...prev, { sender: "ai", text: responseText }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "ERROR: Failed to establish contact with the career intelligence core. Please check network connections.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (actionText: string) => {
    handleSend(actionText);
  };

  const clearHistory = () => {
    setMessages([
      {
        sender: "ai",
        text:
          chatMode === "rag"
            ? "RAG mode active. Ask me details about salaries, technical requirements, or job locations!"
            : "General Assistant active. Ask me about career choices, resumes, or interview tactics!",
      },
    ]);
  };

  return (
    <div className="space-y-6 text-left animate-fade-in-up">
      {/* Control Actions Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        {/* Mode Selector */}
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/5 w-fit">
          <button
            onClick={() => {
              setChatMode("standard");
              setMessages([
                {
                  sender: "ai",
                  text: "General Assistant active. Ask me about career choices, resumes, or interview tactics!",
                },
              ]);
            }}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border-none flex items-center gap-2 ${
              chatMode === "standard"
                ? "bg-primary text-white shadow-md"
                : "text-on-surface-variant hover:text-white bg-transparent"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">forum</span>
            General AI
          </button>
          <button
            onClick={() => {
              setChatMode("rag");
              setMessages([
                {
                  sender: "ai",
                  text: "RAG mode active. Ask me details about salaries, technical requirements, or job locations!",
                },
              ]);
            }}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border-none flex items-center gap-2 ${
              chatMode === "rag"
                ? "bg-primary text-white shadow-md"
                : "text-on-surface-variant hover:text-white bg-transparent"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">database</span>
            Job Knowledge (RAG)
          </button>
        </div>

        {/* Action button */}
        <button
          onClick={clearHistory}
          disabled={loading}
          title="Clear chat history"
          className="p-2 bg-[#F4F5F2] hover:bg-[#DDE0DA] text-[#767B82] hover:text-[#14171A] border border-[#DDE0DA] rounded cursor-pointer flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
        </button>
      </div>

      {/* Chat Conversation History Panel */}
      <div className="antigravity-card p-6 pt-8 min-h-[350px] max-h-[450px] overflow-y-auto flex flex-col gap-4 relative">
        <div className="folder-tab">DOCKET HISTORY LOG</div>

        {messages.map((msg, index) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={index}
              className={`flex w-full animate-fade-in-up ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              {isUser ? (
                // User Message bubble - Clean & Flat
                <div className="bg-[#F4F5F2] border border-[#DDE0DA] text-[#14171A] rounded-lg rounded-tr-none py-2.5 px-4 max-w-[80%] text-sm leading-relaxed whitespace-pre-line font-medium shadow-none">
                  {msg.text}
                </div>
              ) : (
                // AI Bot Message bubble - Clean & Flat
                <div className="flex gap-3 items-start max-w-[90%] bg-white border border-[#DDE0DA] rounded-lg rounded-tl-none py-3 px-4 shadow-none">
                  <div className="flex-1 space-y-1">
                    <p
                      className="font-mono text-[#3F5B44] font-bold text-[9px] uppercase tracking-widest flex items-center gap-1.5"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      <span className="stamp-badge">
                        {chatMode === "rag" ? "RAG ENGINE" : "CORE AI"}
                      </span>
                    </p>
                    <div className="text-body-md text-[#14171A] leading-relaxed text-sm whitespace-pre-line">
                      {msg.text}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Pulsing Dots */}
        {loading && (
          <div className="flex justify-start animate-fade-in-up">
            <div className="flex gap-3 items-start max-w-[90%] bg-white border border-[#DDE0DA] rounded-lg rounded-tl-none py-3 px-4 shadow-none">
              <div className="flex-1">
                <p
                  className="font-mono text-[#3F5B44] font-bold text-[9px] uppercase tracking-widest mb-1.5"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Calculating Output
                </p>
                <div className="flex items-center gap-1.5 py-1 px-1 text-[#767B82]">
                  <div className="w-1.5 h-1.5 bg-[#3F5B44] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-1.5 h-1.5 bg-[#3F5B44] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-1.5 h-1.5 bg-[#3F5B44] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Input Area */}
      <div className="antigravity-card p-2 pt-6 relative">
        <div className="folder-tab">COMMAND TRANSMITTER</div>
        <div className="flex items-center gap-2">
          <textarea
            className="flex-grow bg-transparent border-none focus:ring-0 px-4 py-2 text-[#14171A] placeholder:text-[#767B82]/40 resize-none h-14 font-body-md text-sm outline-none"
            id="ai-input"
            placeholder={
              chatMode === "rag"
                ? "Ask about job requirements (e.g. Which Python jobs offer over 100k?)..."
                : "Ask your question (e.g. How can I transition into AI Engineering?)..."
            }
            rows={1}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={loading}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !question.trim()}
            className="bg-[#3F5B44] text-white w-10 h-10 rounded flex items-center justify-center shadow-none hover:opacity-90 active:scale-95 transition-all duration-100 cursor-pointer border-none disabled:opacity-50 disabled:pointer-events-none shrink-0"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
            ) : (
              <span className="material-symbols-outlined text-[18px]">send</span>
            )}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2.5">
        {(chatMode === "rag"
          ? [
              "Show me Remote React jobs",
              "Which jobs require AWS skills?",
              "Highest paying python positions",
              "Entry level software engineer listings"
            ]
          : [
              "Optimize Resume",
              "Salary Negotiation",
              "Skill Analysis",
              "Market Outlook"
            ]
        ).map((action) => (
          <button
            key={action}
            onClick={() => handleQuickAction(action)}
            disabled={loading}
            className="px-3.5 py-1.5 border border-[#DDE0DA] bg-white text-[#767B82] hover:text-[#14171A] hover:border-[#767B82] rounded font-mono text-xs cursor-pointer transition-colors"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Chat;