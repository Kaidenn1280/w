import React, { useState, useRef, useEffect, type KeyboardEvent, type CSSProperties } from "react";

type ChatMessage = {
  role: "user" | "bot";
  content: string;
};

const GeminiChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      content: "Hi! I'm a Gemini-powered bot. Ask me anything. 🤖",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    // Add user message to UI immediately
    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: text },
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          history: messages, // Send conversation history
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        console.error("Chat error:", data.error || response.statusText);
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: "Sorry, I'm having trouble connecting right now. 😓" },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "bot", content: data.reply },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Oops! Network error. Please check if the backend is running." },
      ]);
    } finally {
      setLoading(false);
    }
  };


  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      void sendMessage();
    }
  };

  // Styles
  const containerStyle: CSSProperties = {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    zIndex: 9999,
    fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
  };

  const toggleButtonStyle: CSSProperties = {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    border: "none",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: isOpen ? "rotate(180deg) scale(0.9)" : "rotate(0deg) scale(1)",
  };

  const chatWindowStyle: CSSProperties = {
    position: "absolute",
    bottom: "80px",
    right: "0",
    width: "380px",
    maxWidth: "calc(100vw - 48px)",
    background: "linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)",
    borderRadius: "20px",
    boxShadow: "0 10px 40px rgba(102, 126, 234, 0.25), 0 0 0 1px rgba(102, 126, 234, 0.1)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
    transformOrigin: "bottom right",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    pointerEvents: isOpen ? "auto" : "none",
    visibility: isOpen ? "visible" : "hidden",
  };

  const headerStyle: CSSProperties = {
    padding: "16px 20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    fontWeight: 600,
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    letterSpacing: "0.3px",
  };

  const closeButtonStyle: CSSProperties = {
    background: "rgba(255,255,255,0.2)",
    border: "none",
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#fff",
    transition: "all 0.2s ease",
  };

  const messagesContainerStyle: CSSProperties = {
    padding: "16px",
    height: "350px",
    overflowY: "auto",
    background: "linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%)",
  };

  const inputContainerStyle: CSSProperties = {
    display: "flex",
    borderTop: "1px solid rgba(102, 126, 234, 0.1)",
    padding: "12px 16px",
    gap: "10px",
    background: "#fff",
  };

  const inputStyle: CSSProperties = {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "12px",
    border: "2px solid rgba(102, 126, 234, 0.2)",
    outline: "none",
    fontSize: "14px",
    transition: "all 0.2s ease",
    background: "#fafbff",
  };

  const sendButtonStyle: CSSProperties = {
    padding: "12px 20px",
    borderRadius: "12px",
    border: "none",
    background: loading
      ? "linear-gradient(135deg, #a0aec0 0%, #718096 100%)"
      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    cursor: loading ? "not-allowed" : "pointer",
    fontWeight: 600,
    fontSize: "14px",
    transition: "all 0.3s ease",
    boxShadow: loading ? "none" : "0 4px 15px rgba(102, 126, 234, 0.3)",
  };

  const getUserMessageStyle = (): CSSProperties => ({
    marginBottom: "12px",
    padding: "12px 16px",
    borderRadius: "18px 18px 4px 18px",
    lineHeight: 1.5,
    maxWidth: "85%",
    whiteSpace: "pre-wrap",
    marginLeft: "auto",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    fontSize: "14px",
    boxShadow: "0 2px 10px rgba(102, 126, 234, 0.2)",
    animation: "slideInRight 0.3s ease",
  });

  const getBotMessageStyle = (): CSSProperties => ({
    marginBottom: "12px",
    padding: "12px 16px",
    borderRadius: "18px 18px 18px 4px",
    lineHeight: 1.5,
    maxWidth: "85%",
    whiteSpace: "pre-wrap",
    marginRight: "auto",
    background: "#fff",
    color: "#374151",
    fontSize: "14px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
    border: "1px solid rgba(102, 126, 234, 0.1)",
    animation: "slideInLeft 0.3s ease",
  });

  return (
    <>
      {/* CSS Keyframes for animations */}
      <style>
        {`
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
          
          @keyframes typingDot {
            0%, 60%, 100% {
              opacity: 0.3;
              transform: scale(0.8);
            }
            30% {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          .chatbot-toggle:hover {
            transform: scale(1.1) !important;
            box-shadow: 0 6px 30px rgba(102, 126, 234, 0.5) !important;
          }
          
          .chatbot-input:focus {
            border-color: #667eea !important;
            background: #fff !important;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15) !important;
          }
          
          .chatbot-send:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
          }
          
          .chatbot-close:hover {
            background: rgba(255,255,255,0.3) !important;
            transform: rotate(90deg);
          }
          
          .chatbot-messages::-webkit-scrollbar {
            width: 6px;
          }
          
          .chatbot-messages::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .chatbot-messages::-webkit-scrollbar-thumb {
            background: rgba(102, 126, 234, 0.3);
            border-radius: 3px;
          }
          
          .chatbot-messages::-webkit-scrollbar-thumb:hover {
            background: rgba(102, 126, 234, 0.5);
          }
        `}
      </style>

      <div style={containerStyle}>
        {/* Chat Window */}
        <div style={chatWindowStyle}>
          {/* Header */}
          <div style={headerStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>✨</span>
              <span>Gemini Assistant</span>
            </div>
            <button
              className="chatbot-close"
              style={closeButtonStyle}
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages" style={messagesContainerStyle}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={m.role === "user" ? getUserMessageStyle() : getBotMessageStyle()}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div style={getBotMessageStyle()}>
                <div style={{ display: "flex", gap: "4px", padding: "4px 0" }}>
                  <span style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#667eea",
                    animation: "typingDot 1.4s infinite",
                    animationDelay: "0ms"
                  }} />
                  <span style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#667eea",
                    animation: "typingDot 1.4s infinite",
                    animationDelay: "200ms"
                  }} />
                  <span style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#667eea",
                    animation: "typingDot 1.4s infinite",
                    animationDelay: "400ms"
                  }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={inputContainerStyle}>
            <input
              className="chatbot-input"
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={inputStyle}
            />
            <button
              className="chatbot-send"
              onClick={() => void sendMessage()}
              disabled={loading}
              style={sendButtonStyle}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          className="chatbot-toggle"
          style={toggleButtonStyle}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          {isOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          )}
        </button>
      </div>
    </>
  );
};

export default GeminiChatbot;
