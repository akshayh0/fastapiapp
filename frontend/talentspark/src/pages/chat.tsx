import { useState } from "react";
import { sendMessage } from "../Services/chatService";

const Chat = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("Awaiting your career strategy or skill-gap synthesis inquiry...");
  const [loading, setLoading] = useState(false);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText !== undefined ? queryText : question;
    if (!textToSend.trim()) return;

    setLoading(true);
    try {
      const response = await sendMessage({
        question: textToSend,
      });
      setAnswer(response.answer);
      if (queryText === undefined) {
        setQuestion("");
      }
    } catch (error) {
      console.error(error);
      alert("AI Assistant connection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (actionText: string) => {
    setQuestion(actionText);
    handleSend(actionText);
  };

  return (
    <div className="space-y-6 text-left">
      <style>{`
        .glass-panel {
          background: rgba(30, 41, 59, 0.4);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
      `}</style>

      {/* Response Box */}
      <div className="glass-panel p-8 rounded-3xl min-h-[160px] relative overflow-hidden" id="response-box">
        <div className="flex gap-4 mb-4 items-start relative z-10">
          <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-lg flex items-center justify-center">
            auto_awesome
          </span>
          <div className="flex-1">
            <p className="font-label-sm text-primary mb-2 text-xs uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              CAREER AI SYSTEM
            </p>
            <div className="text-body-md text-on-surface leading-relaxed text-sm whitespace-pre-line">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                  Synthesizing market models and skill paths...
                </span>
              ) : (
                answer
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 p-4 opacity-10 pointer-events-none select-none">
          <span className="material-symbols-outlined text-[120px] translate-y-1/3 translate-x-1/3">
            bolt
          </span>
        </div>
      </div>

      {/* Input Area */}
      <div className="glass-panel p-2 rounded-2xl border-white/20 focus-within:ring-2 focus-within:ring-primary/40 transition-all duration-300">
        <div className="flex items-center gap-2">
          <textarea
            className="flex-grow bg-transparent border-none focus:ring-0 px-4 py-3 text-on-surface placeholder:text-on-surface-variant/40 resize-none h-14 font-body-md text-sm outline-none"
            id="ai-input"
            placeholder="Ask your question (e.g. How can I transition into AI Engineering?)..."
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
            disabled={loading}
            className="bg-primary text-on-primary w-12 h-12 rounded-xl flex items-center justify-center shadow-lg hover:shadow-primary/30 active:scale-95 transition-all group cursor-pointer border-none"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
            ) : (
              <span className="material-symbols-outlined group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[20px]">
                send
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        {[
          "Optimize Resume",
          "Salary Negotiation",
          "Skill Analysis",
          "Market Outlook"
        ].map((action) => (
          <button
            key={action}
            onClick={() => handleQuickAction(action)}
            disabled={loading}
            className="px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/40 text-xs font-label-sm text-on-surface-variant hover:text-primary transition-all duration-300 active:scale-95 cursor-pointer"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Chat;