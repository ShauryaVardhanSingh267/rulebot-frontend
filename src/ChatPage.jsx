import React, { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowUp, Bot, User, Home, CheckCircle, AlertCircle, Info } from "lucide-react";

/** Toast Component */
const Toast = ({ message, type, onClose }) => {
  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    info: <Info size={20} />
  };

  const colors = {
    success: { bg: "#10b981", border: "#059669" },
    error: { bg: "#ef4444", border: "#dc2626" },
    info: { bg: "#3b82f6", border: "#2563eb" }
  };

  return (
    <div style={{
      ...toastStyles.toast,
      background: colors[type].bg,
      borderLeft: `4px solid ${colors[type].border}`
    }}>
      <div style={toastStyles.toastIcon}>
        {icons[type]}
      </div>
      <div style={toastStyles.toastMessage}>{message}</div>
      <button onClick={onClose} style={toastStyles.toastClose}>×</button>
    </div>
  );
};

const themes = {
  midnight: {
    background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
    surface: "rgba(255, 255, 255, 0.05)",
    surfaceBorder: "rgba(255, 255, 255, 0.1)",
    primary: "#6366f1",
    text: "#f8fafc",
    textMuted: "rgba(248, 250, 252, 0.5)",
    userBubble: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    botBubble: "linear-gradient(135deg, #1f2937, #374151)",
    inputBg: "rgba(99, 102, 241, 0.1)",
    inputBorder: "rgba(99, 102, 241, 0.3)",
    glow: "rgba(99, 102, 241, 0.6)"
  },
  ocean: {
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
    surface: "rgba(148, 163, 184, 0.05)",
    surfaceBorder: "rgba(148, 163, 184, 0.1)",
    primary: "#0ea5e9",
    text: "#f1f5f9",
    textMuted: "rgba(241, 245, 249, 0.5)",
    userBubble: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
    botBubble: "linear-gradient(135deg, #1e293b, #334155)",
    inputBg: "rgba(14, 165, 233, 0.1)",
    inputBorder: "rgba(14, 165, 233, 0.3)",
    glow: "rgba(14, 165, 233, 0.6)"
  },
  forest: {
    background: "linear-gradient(135deg, #0f1b0f 0%, #1a2e1a 50%, #2d5a2d 100%)",
    surface: "rgba(134, 239, 172, 0.05)",
    surfaceBorder: "rgba(134, 239, 172, 0.1)",
    primary: "#22c55e",
    text: "#f0fdf4",
    textMuted: "rgba(240, 253, 244, 0.5)",
    userBubble: "linear-gradient(135deg, #22c55e, #16a34a)",
    botBubble: "linear-gradient(135deg, #1a2e1a, #2d5a2d)",
    inputBg: "rgba(34, 197, 94, 0.1)",
    inputBorder: "rgba(34, 197, 94, 0.3)",
    glow: "rgba(34, 197, 94, 0.6)"
  },
  synthwave: {
    background: "linear-gradient(135deg, #1a0033, #660066, #ff3366)",
    surface: "rgba(255, 51, 102, 0.05)",
    surfaceBorder: "rgba(255, 51, 102, 0.1)",
    primary: "#ff0080",
    text: "#ffb3d9",
    textMuted: "rgba(255, 179, 217, 0.5)",
    userBubble: "linear-gradient(135deg, #ff3366, #ff6699)",
    botBubble: "linear-gradient(135deg, #660066, #990099)",
    inputBg: "rgba(255, 0, 128, 0.1)",
    inputBorder: "rgba(255, 0, 128, 0.3)",
    glow: "rgba(255, 0, 128, 0.6)"
  },
  arctic: {
    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
    surface: "rgba(255, 255, 255, 0.8)",
    surfaceBorder: "rgba(15, 23, 42, 0.1)",
    primary: "#3b82f6",
    text: "#0f172a",
    textMuted: "rgba(15, 23, 42, 0.5)",
    userBubble: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    botBubble: "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
    inputBg: "rgba(59, 130, 246, 0.1)",
    inputBorder: "rgba(59, 130, 246, 0.3)",
    glow: "rgba(59, 130, 246, 0.6)"
  }
};

const ChatPage = () => {
  const { slug } = useParams();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [botTyping, setBotTyping] = useState(false);
  const [botData, setBotData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const themeConfig = themes[botData?.theme] || themes.midnight;

  // Toast management
  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Dynamic scrollbar styling based on theme
  useEffect(() => {
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer && botData) {
      const uniqueId = `chat-scroll-${Date.now()}`;
      chatContainer.id = uniqueId;
      
      const existingStyle = document.getElementById('dynamic-chat-scrollbar-style');
      if (existingStyle) {
        existingStyle.remove();
      }
      
      const styleElement = document.createElement('style');
      styleElement.id = 'dynamic-chat-scrollbar-style';
      styleElement.innerHTML = `
        #${uniqueId}::-webkit-scrollbar {
          width: 6px;
        }
        #${uniqueId}::-webkit-scrollbar-thumb {
          background: ${themeConfig.userBubble};
          border-radius: 10px;
          box-shadow: 0 0 5px ${themeConfig.glow};
        }
        #${uniqueId}::-webkit-scrollbar-track {
          background: ${themeConfig.surface};
          border-radius: 10px;
        }
        #${uniqueId}::-webkit-scrollbar-thumb:hover {
          box-shadow: 0 0 10px ${themeConfig.glow};
        }
      `;
      document.head.appendChild(styleElement);
    }
  }, [botData?.theme, themeConfig]);

  // Load bot data on mount
  useEffect(() => {
    const loadBot = async () => {
      try {
        const response = await fetch(`http://192.168.0.191:5000/api/bots/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setBotData(data);
        } else {
          setError("Bot not found");
        }
      } catch (err) {
        setError("Failed to load bot");
        showToast("Couldn't connect to the bot server. Please try again later.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadBot();
  }, [slug]);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, botTyping]);

  const sendMessage = async () => {
    if (!message.trim() || botTyping) return;

    const userMessage = message;
    setMessage("");
    setChatHistory(prev => [...prev, { sender: "user", text: userMessage, timestamp: Date.now() }]);
    setBotTyping(true);

    try {
      const response = await fetch("http://192.168.0.191:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bot: slug, message: userMessage }),
      });
      
      if (!response.ok) {
        throw new Error("Server responded with an error");
      }
      
      const data = await response.json();

      setTimeout(() => {
        setBotTyping(false);
        
        // Enhanced fallback message with helpful hints
        let botResponse = data.answer;
        if (!botResponse || botResponse.toLowerCase().includes("i'm not sure") || botResponse.toLowerCase().includes("i don't know")) {
          botResponse = "I didn't quite catch that. Could you try asking about something else? You can ask me about various topics I've been trained on.";
        }
        
        setChatHistory(prev => [
          ...prev,
          { sender: "bot", text: botResponse, timestamp: Date.now() }
        ]);
        
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 100);
      }, 500 + Math.random() * 800);
    } catch (error) {
      setBotTyping(false);
      setChatHistory(prev => [
        ...prev,
        { sender: "bot", text: "Sorry, I'm having connection issues right now. Please try again in a moment.", timestamp: Date.now() }
      ]);
      showToast("Couldn't reach the bot server. Please check your connection.", "error");
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <div style={styles.loadingText}>Loading bot...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorCard}>
          <h2 style={styles.errorTitle}>Bot Not Found</h2>
          <p style={styles.errorMessage}>The bot you're looking for doesn't exist or has been removed.</p>
          <Link to="/" style={styles.homeLink}>
            <Home size={18} />
            Create Your Own Bot
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.container, background: themeConfig.background }}>
      {/* Toast Container */}
      <div style={toastStyles.toastContainer} className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {/* Header */}
      <div style={{ 
        ...styles.header,
        background: `linear-gradient(135deg, ${themeConfig.surface}, transparent)`,
        borderBottom: `1px solid ${themeConfig.surfaceBorder}`
      }}>
        <div style={{
          ...styles.botAvatar,
          background: themeConfig.primary,
          boxShadow: `0 0 20px ${themeConfig.glow}`
        }}>
          <Bot size={24} color="white" />
        </div>
        <div style={styles.headerInfo}>
          <h1 style={{ ...styles.botName, color: themeConfig.text }}>
            {botData.name}
          </h1>
          <div style={{ ...styles.status, color: themeConfig.textMuted }}>
            <span style={styles.onlineDot} />
            Online
          </div>
        </div>
        <Link to="/" style={{ ...styles.homeButton, border: `1px solid ${themeConfig.surfaceBorder}` }}>
          <Home size={18} color={themeConfig.text} />
        </Link>
      </div>

      {/* Chat Area */}
      <div style={styles.chatContainer} className="chat-container">
        <div style={styles.messagesContainer}>
          {chatHistory.length === 0 && (
            <div style={{
              ...styles.welcomeMessage,
              background: themeConfig.surface,
              border: `1px solid ${themeConfig.surfaceBorder}`,
              color: themeConfig.textMuted
            }}>
              <Bot size={32} color={themeConfig.primary} style={{ marginBottom: 12 }} />
              <div style={{ fontSize: "clamp(15px, 4vw, 16px)", fontWeight: 600, marginBottom: 4 }}>
                Hi! I'm {botData.name}
              </div>
              <div style={{ fontSize: "clamp(13px, 3vw, 14px)" }}>
                Ask me anything - I'm here to help!
              </div>
            </div>
          )}

          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              style={{
                ...styles.messageGroup,
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                marginLeft: msg.sender === "user" ? "auto" : "0",
                marginRight: msg.sender === "user" ? "0" : "auto"
              }}
            >
              {msg.sender === "bot" && (
                <div style={{
                  ...styles.avatar,
                  background: themeConfig.surface,
                  border: `2px solid ${themeConfig.primary}`
                }}>
                  <Bot size={16} color={themeConfig.primary} />
                </div>
              )}
              
              <div
                style={{
                  ...styles.messageBubble,
                  background: msg.sender === "user" ? themeConfig.userBubble : themeConfig.botBubble,
                  color: msg.sender === "user" ? "white" : (botData?.theme === "arctic" ? themeConfig.text : "white"),
                }}
              >
                {msg.text}
              </div>
              
              {msg.sender === "user" && (
                <div style={{
                  ...styles.avatar,
                  background: themeConfig.userBubble
                }}>
                  <User size={16} color="white" />
                </div>
              )}
            </div>
          ))}

          {botTyping && (
            <div style={{ ...styles.messageGroup, justifyContent: "flex-start" }}>
              <div style={{
                ...styles.avatar,
                background: themeConfig.surface,
                border: `2px solid ${themeConfig.primary}`
              }}>
                <Bot size={16} color={themeConfig.primary} />
              </div>
              <div style={{
                ...styles.typingBubble,
                background: themeConfig.surface,
                border: `1px solid ${themeConfig.surfaceBorder}`
              }}>
                <div className="typing-dots" style={styles.typingDots}>
                  <span style={{ background: themeConfig.primary }} />
                  <span style={{ background: themeConfig.primary }} />
                  <span style={{ background: themeConfig.primary }} />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div style={styles.inputContainer} className="input-container">
        <div style={{
          ...styles.inputWrapper,
          background: `${themeConfig.surface}cc`,
          border: `1px solid ${themeConfig.surfaceBorder}`,
        }}>
          <input
            ref={inputRef}
            type="text"
            placeholder={botTyping ? "Bot is typing..." : "Type your message..."}
            value={message}
            onChange={(e) => !botTyping && setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !botTyping && sendMessage()}
            style={{
              ...styles.messageInput,
              color: themeConfig.text,
            }}
            disabled={botTyping}
          />
          <button
            onClick={sendMessage}
            disabled={botTyping || !message.trim()}
            className="send-button"
            style={{
              ...styles.sendButton,
              background: (botTyping || !message.trim()) 
                ? "rgba(156, 163, 175, 0.5)" 
                : themeConfig.primary,
              boxShadow: (botTyping || !message.trim()) 
                ? "none" 
                : `0 4px 20px ${themeConfig.glow}`,
            }}
          >
            <ArrowUp size={20} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100vw",
    fontFamily: "'Inter', system-ui, sans-serif",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #0f0f23, #1a1a2e, #16213e)",
    color: "#f8fafc",
    padding: "clamp(16px, 4vw, 24px)"
  },
  
  loadingSpinner: {
    width: "clamp(36px, 8vw, 40px)",
    height: "clamp(36px, 8vw, 40px)",
    border: "4px solid rgba(99, 102, 241, 0.3)",
    borderTop: "4px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: 16
  },
  
  loadingText: {
    fontSize: "clamp(14px, 3.5vw, 16px)",
    fontWeight: 500
  },
  
  errorContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #0f0f23, #1a1a2e, #16213e)",
    padding: "clamp(16px, 4vw, 24px)"
  },
  
  errorCard: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: "clamp(24px, 6vw, 40px)",
    textAlign: "center",
    maxWidth: "min(400px, 90vw)",
    width: "100%"
  },
  
  errorTitle: {
    fontSize: "clamp(20px, 5vw, 24px)",
    fontWeight: 700,
    color: "#f8fafc",
    margin: "0 0 12px 0"
  },
  
  errorMessage: {
    fontSize: "clamp(14px, 3.5vw, 16px)",
    color: "rgba(248, 250, 252, 0.7)",
    marginBottom: 24,
    lineHeight: 1.5
  },
  
  homeLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "14px 24px",
    minHeight: 48,
    background: "#6366f1",
    color: "white",
    textDecoration: "none",
    borderRadius: 12,
    fontWeight: 600,
    fontSize: "clamp(14px, 3.5vw, 15px)",
    transition: "all 0.3s ease",
    WebkitTapHighlightColor: "transparent"
  },
  
  header: {
    display: "flex",
    alignItems: "center",
    padding: "clamp(16px, 4vw, 20px) clamp(16px, 4vw, 24px)",
    gap: "clamp(12px, 3vw, 16px)",
    flexShrink: 0
  },
  
  botAvatar: {
    width: "clamp(40px, 10vw, 48px)",
    height: "clamp(40px, 10vw, 48px)",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  
  headerInfo: {
    flex: 1,
    minWidth: 0
  },
  
  botName: {
    fontSize: "clamp(16px, 4.5vw, 20px)",
    fontWeight: 700,
    margin: 0,
    fontFamily: "'Orbitron', monospace",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  
  status: {
    fontSize: "clamp(12px, 3vw, 14px)",
    display: "flex",
    alignItems: "center",
    marginTop: 2
  },
  
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#22c55e",
    marginRight: 6,
    boxShadow: "0 0 10px #22c55e"
  },
  
  homeButton: {
    width: "clamp(40px, 10vw, 44px)",
    height: "clamp(40px, 10vw, 44px)",
    minWidth: 44,
    minHeight: 44,
    borderRadius: 10,
    background: "transparent",
    border: "1px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    transition: "all 0.3s ease",
    WebkitTapHighlightColor: "transparent"
  },
  
  chatContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "clamp(16px, 4vw, 24px) clamp(16px, 4vw, 24px) 100px clamp(16px, 4vw, 24px)",
    display: "flex",
    flexDirection: "column",
    gap: "clamp(12px, 3vw, 16px)",
    alignItems: "center",
    WebkitOverflowScrolling: "touch"
  },
  
  messagesContainer: {
    width: "100%",
    maxWidth: "min(800px, 100%)",
    display: "flex",
    flexDirection: "column",
    gap: "clamp(12px, 3vw, 16px)"
  },
  
  welcomeMessage: {
    padding: "clamp(20px, 5vw, 24px)",
    borderRadius: 16,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "center",
    maxWidth: "min(300px, 90%)"
  },
  
  messageGroup: {
    display: "flex",
    alignItems: "flex-end",
    gap: "clamp(8px, 2vw, 12px)",
    maxWidth: "min(85%, 600px)"
  },
  
  avatar: {
    width: "clamp(28px, 7vw, 32px)",
    height: "clamp(28px, 7vw, 32px)",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  },
  
  messageBubble: {
    padding: "clamp(10px, 2.5vw, 12px) clamp(14px, 3.5vw, 16px)",
    borderRadius: 18,
    fontSize: "clamp(13px, 3.5vw, 14px)",
    fontWeight: 500,
    lineHeight: 1.4,
    wordWrap: "break-word",
    wordBreak: "break-word",
    maxWidth: "100%"
  },
  
  typingBubble: {
    padding: "clamp(10px, 2.5vw, 12px) clamp(14px, 3.5vw, 16px)",
    borderRadius: 18,
    display: "flex",
    alignItems: "center"
  },
  
  typingDots: {
    display: "flex",
    gap: 4
  },
  
  inputContainer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "clamp(16px, 4vw, 20px) clamp(16px, 4vw, 24px) clamp(20px, 5vw, 24px) clamp(16px, 4vw, 24px)",
    background: "transparent",
    pointerEvents: "none",
    zIndex: 100
  },
  
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "clamp(8px, 2vw, 12px)",
    maxWidth: "min(800px, 100%)",
    margin: "0 auto",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: 24,
    padding: "clamp(6px, 1.5vw, 8px)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    pointerEvents: "auto"
  },
  
  messageInput: {
    flex: 1,
    padding: "clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)",
    borderRadius: 16,
    border: "none",
    outline: "none",
    fontSize: "clamp(13px, 3.5vw, 14px)",
    fontWeight: 500,
    background: "transparent",
    minHeight: 44
  },
  
  sendButton: {
    width: "clamp(44px, 11vw, 48px)",
    height: "clamp(44px, 11vw, 48px)",
    minWidth: 44,
    minHeight: 44,
    borderRadius: 24,
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    flexShrink: 0,
    WebkitTapHighlightColor: "transparent"
  }
};

const toastStyles = {
  toastContainer: {
    position: "fixed",
    top: "clamp(12px, 3vw, 20px)",
    right: "clamp(12px, 3vw, 20px)",
    left: "clamp(12px, 3vw, auto)",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    gap: 12
  },
  
  toast: {
    minWidth: "min(280px, calc(100vw - 48px))",
    maxWidth: "min(400px, calc(100vw - 48px))",
    padding: "clamp(14px, 3.5vw, 16px) clamp(16px, 4vw, 20px)",
    borderRadius: 12,
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: 12,
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
    animation: "slideIn 0.3s ease-out",
    fontFamily: "'Inter', sans-serif"
  },
  
  toastIcon: {
    flexShrink: 0
  },
  
  toastMessage: {
    flex: 1,
    fontSize: "clamp(13px, 3vw, 14px)",
    fontWeight: 500,
    lineHeight: 1.4
  },
  
  toastClose: {
    background: "rgba(255,255,255,0.2)",
    border: "none",
    color: "white",
    width: "clamp(24px, 6vw, 28px)",
    height: "clamp(24px, 6vw, 28px)",
    minWidth: 24,
    minHeight: 24,
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all 0.2s ease",
    WebkitTapHighlightColor: "transparent"
  }
};

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Orbitron:wght@400;700;800;900&display=swap');

* {
  box-sizing: border-box;
}

body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.typing-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) { animation-delay: 0s; }
.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0px);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-8px);
    opacity: 1;
  }
}

a:hover {
  transform: translateY(-1px);
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
}

button:disabled {
  cursor: not-allowed !important;
  transform: none !important;
}

input:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* Mobile-specific styles */
@media (max-width: 768px) {
  .chat-container {
    padding-bottom: clamp(120px, 25vh, 140px) !important;
  }
  
  .input-container {
    padding-bottom: clamp(24px, 6vw, 32px) !important;
  }
  
  .messagesContainer {
    padding-bottom: 20px;
  }
  
  .messageGroup {
    max-width: 90% !important;
  }
}

@media (max-width: 480px) {
  .toast-container {
    left: 8px !important;
    right: 8px !important;
  }
  
  .messageGroup {
    max-width: 95% !important;
  }
  
  .chat-container {
    gap: 10px !important;
  }
}

/* Touch feedback for mobile */
@media (hover: none) and (pointer: coarse) {
  button:active:not(:disabled) {
    transform: scale(0.95) !important;
    opacity: 0.8;
  }
  
  .send-button:active:not(:disabled) {
    transform: scale(0.9) !important;
  }
  
  a:active {
    transform: scale(0.97) !important;
  }
  
  /* Prevent double-tap zoom on buttons */
  button {
    touch-action: manipulation;
  }
  
  input {
    touch-action: manipulation;
  }
}

/* Smooth scrolling for iOS */
.chat-container {
  -webkit-overflow-scrolling: touch;
}

/* Input zoom prevention on iOS */
@supports (-webkit-touch-callout: none) {
  input {
    font-size: max(16px, 1em) !important;
  }
}

/* Safe area for notch devices */
@supports (padding: max(0px)) {
  .header {
    padding-top: max(clamp(16px, 4vw, 20px), env(safe-area-inset-top)) !important;
  }
  
  .input-container {
    padding-bottom: max(clamp(20px, 5vw, 24px), env(safe-area-inset-bottom)) !important;
  }
}
`;

document.head.appendChild(styleSheet);

export default ChatPage;