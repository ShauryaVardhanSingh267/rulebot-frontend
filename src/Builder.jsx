import React, { useMemo, useState, useRef, useEffect } from "react";
import { ArrowUp, Plus, X, Bot, User, Copy, Sparkles, Zap, AlertCircle, CheckCircle, Info } from "lucide-react";

/** Helper: make a URL slug from the bot name */
const slugify = (s) =>
  (s || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Simple local matcher for the preview */
const findPreviewAnswer = (pairs, userMsg) => {
  const q = (userMsg || "").toLowerCase().trim();
  let best = null;
  let bestScore = 0;

  for (const { question, answer } of pairs) {
    if (!question || !answer) continue;
    const qq = question.toLowerCase();
    let score = 0;
    if (q.includes(qq)) score = qq.length;
    else if (qq.includes(q)) score = q.length;
    else if (q && qq.includes(q.split(/\s+/)[0])) score = q.split(/\s+/)[0].length;

    if (score > bestScore) {
      bestScore = score;
      best = answer;
    }
  }
  return best || "I didn't catch that. Try rephrasing your question or asking about the topics I know about.";
};

/** Toast Component */
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    info: <Info size={20} />
  };

  const colors = {
    success: { bg: '#d1fae5', border: '#34d399', text: '#065f46' },
    error: { bg: '#fee2e2', border: '#f87171', text: '#991b1b' },
    info: { bg: '#dbeafe', border: '#60a5fa', text: '#1e40af' }
  };

  const color = colors[type] || colors.info;

  return (
    <div style={{
      position: 'fixed',
      top: "clamp(12px, 3vw, 24px)",
      right: "clamp(12px, 3vw, 24px)",
      left: "clamp(12px, 3vw, auto)",
      background: color.bg,
      border: `2px solid ${color.border}`,
      borderRadius: 12,
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      minWidth: "min(300px, calc(100vw - 48px))",
      maxWidth: "min(400px, calc(100vw - 48px))",
      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
      zIndex: 10000,
      animation: 'slideIn 0.3s ease-out'
    }}>
      <div style={{ color: color.text, display: 'flex', alignItems: 'center' }}>
        {icons[type]}
      </div>
      <div style={{ flex: 1, color: color.text, fontSize: 14, fontWeight: 600 }}>
        {message}
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: color.text,
          cursor: 'pointer',
          padding: 4,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <X size={18} />
      </button>
    </div>
  );
};

/** Success Modal Component */
const SuccessModal = ({ link, onClose, onCopy }) => {
  const openChatbot = () => {
    window.open(link, '_blank');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10001,
      padding: "clamp(16px, 4vw, 24px)",
      backdropFilter: 'blur(4px)',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: 24,
        padding: "clamp(24px, 6vw, 32px)",
        maxWidth: "min(500px, 90vw)",
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        animation: 'scaleIn 0.3s ease-out'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: 24
        }}>
          <div style={{
            width: 64,
            height: 64,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)'
          }}>
            <CheckCircle size={32} color="white" />
          </div>
          <h2 style={{
            fontSize: "clamp(20px, 5vw, 24px)",
            fontWeight: 800,
            color: '#0f172a',
            margin: '0 0 8px 0',
            fontFamily: "'Orbitron', monospace"
          }}>
            🎉 Bot Created Successfully!
          </h2>
          <p style={{
            fontSize: "clamp(14px, 3.5vw, 16px)",
            color: '#64748b',
            margin: 0
          }}>
            Your bot is ready to chat. Share this link:
          </p>
        </div>

        <div style={{
          background: '#f1f5f9',
          border: '2px solid #e2e8f0',
          borderRadius: 16,
          padding: "clamp(12px, 3vw, 16px)",
          marginBottom: 20,
          wordBreak: 'break-all',
          fontSize: "clamp(12px, 3vw, 14px)",
          fontFamily: "'JetBrains Mono', monospace",
          color: '#334155',
          fontWeight: 500
        }}>
          {link}
        </div>

        <div style={{
          display: 'flex',
          gap: 12,
          flexDirection: 'column'
        }}>
          <button
            onClick={openChatbot}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '18px 24px',
              minHeight: 58,
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              border: 'none',
              borderRadius: 12,
              color: 'white',
              fontSize: "clamp(15px, 4vw, 16px)",
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 6px 24px rgba(59, 130, 246, 0.4)',
              transition: 'all 0.3s ease',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            <Bot size={20} />
            Open Chatbot
          </button>
          <button
            onClick={onCopy}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '16px 24px',
              minHeight: 54,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              borderRadius: 12,
              color: 'white',
              fontSize: "clamp(15px, 4vw, 16px)",
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 6px 24px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.3s ease',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            <Copy size={20} />
            Copy Link
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '14px 24px',
              minHeight: 50,
              background: '#ffffff',
              border: '2px solid #e2e8f0',
              borderRadius: 12,
              color: '#64748b',
              fontSize: "clamp(14px, 3.5vw, 15px)",
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/** Enhanced theme configurations */
const themes = {
  midnight: {
    name: "Midnight",
    background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
    surface: "rgba(255, 255, 255, 0.05)",
    surfaceBorder: "rgba(255, 255, 255, 0.1)",
    primary: "#6366f1",
    primaryGlow: "rgba(99, 102, 241, 0.4)",
    secondary: "#8b5cf6",
    accent: "#06b6d4",
    text: "#f8fafc",
    textSecondary: "rgba(248, 250, 252, 0.7)",
    textMuted: "rgba(248, 250, 252, 0.5)",
    userBubble: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    botBubble: "linear-gradient(135deg, #1f2937, #374151)",
    inputBg: "rgba(99, 102, 241, 0.1)",
    inputBorder: "rgba(99, 102, 241, 0.3)",
    scrollThumb: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    scrollTrack: "rgba(99, 102, 241, 0.1)",
    glow: "rgba(99, 102, 241, 0.6)"
  },
  ocean: {
    name: "Ocean",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
    surface: "rgba(148, 163, 184, 0.05)",
    surfaceBorder: "rgba(148, 163, 184, 0.1)",
    primary: "#0ea5e9",
    primaryGlow: "rgba(14, 165, 233, 0.4)",
    secondary: "#06b6d4",
    accent: "#3b82f6",
    text: "#f1f5f9",
    textSecondary: "rgba(241, 245, 249, 0.7)",
    textMuted: "rgba(241, 245, 249, 0.5)",
    userBubble: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
    botBubble: "linear-gradient(135deg, #1e293b, #334155)",
    inputBg: "rgba(14, 165, 233, 0.1)",
    inputBorder: "rgba(14, 165, 233, 0.3)",
    scrollThumb: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
    scrollTrack: "rgba(14, 165, 233, 0.1)",
    glow: "rgba(14, 165, 233, 0.6)"
  },
  forest: {
    name: "Forest",
    background: "linear-gradient(135deg, #0f1b0f 0%, #1a2e1a 50%, #2d5a2d 100%)",
    surface: "rgba(134, 239, 172, 0.05)",
    surfaceBorder: "rgba(134, 239, 172, 0.1)",
    primary: "#22c55e",
    primaryGlow: "rgba(34, 197, 94, 0.4)",
    secondary: "#16a34a",
    accent: "#84cc16",
    text: "#f0fdf4",
    textSecondary: "rgba(240, 253, 244, 0.7)",
    textMuted: "rgba(240, 253, 244, 0.5)",
    userBubble: "linear-gradient(135deg, #22c55e, #16a34a)",
    botBubble: "linear-gradient(135deg, #1a2e1a, #2d5a2d)",
    inputBg: "rgba(34, 197, 94, 0.1)",
    inputBorder: "rgba(34, 197, 94, 0.3)",
    scrollThumb: "linear-gradient(135deg, #22c55e, #16a34a)",
    scrollTrack: "rgba(34, 197, 94, 0.1)",
    glow: "rgba(34, 197, 94, 0.6)"
  },
  synthwave: {
    name: "Synthwave",
    background: "linear-gradient(135deg, #1a0033, #660066, #ff3366)",
    surface: "rgba(255, 51, 102, 0.05)",
    surfaceBorder: "rgba(255, 51, 102, 0.1)",
    primary: "#ff0080",
    primaryGlow: "rgba(255, 0, 128, 0.4)",
    secondary: "#cc0066",
    accent: "#ff3366",
    text: "#ffb3d9",
    textSecondary: "rgba(255, 179, 217, 0.7)",
    textMuted: "rgba(255, 179, 217, 0.5)",
    userBubble: "linear-gradient(135deg, #ff3366, #ff6699)",
    botBubble: "linear-gradient(135deg, #660066, #990099)",
    inputBg: "rgba(255, 0, 128, 0.1)",
    inputBorder: "rgba(255, 0, 128, 0.3)",
    scrollThumb: "linear-gradient(135deg, #ff0080, #ff3366)",
    scrollTrack: "rgba(255, 0, 128, 0.1)",
    glow: "rgba(255, 0, 128, 0.6)"
  },
  arctic: {
    name: "Arctic",
    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
    surface: "rgba(255, 255, 255, 0.8)",
    surfaceBorder: "rgba(15, 23, 42, 0.1)",
    primary: "#3b82f6",
    primaryGlow: "rgba(59, 130, 246, 0.3)",
    secondary: "#1d4ed8",
    accent: "#0ea5e9",
    text: "#0f172a",
    textSecondary: "rgba(15, 23, 42, 0.7)",
    textMuted: "rgba(15, 23, 42, 0.5)",
    userBubble: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    botBubble: "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
    inputBg: "rgba(59, 130, 246, 0.1)",
    inputBorder: "rgba(59, 130, 246, 0.3)",
    scrollThumb: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    scrollTrack: "rgba(59, 130, 246, 0.1)",
    glow: "rgba(59, 130, 246, 0.6)"
  }
};

/** Enhanced Q&A Import Parser Component */
const QAImporter = ({ onImport }) => {
  const [importText, setImportText] = useState("");
  const [parsedPairs, setParsedPairs] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [parseError, setParseError] = useState(false);

  const cleanContent = (rawText) => {
    return rawText
      .replace(/^#{1,6}\s+.*$/gm, '')
      .replace(/^\s*[\d\-\*\+]\.\s*$/gm, '')
      .replace(/\n\s*\n/g, '\n')
      .replace(/^[\-\*=]{3,}$/gm, '')
      .replace(/^[A-Z\s]{3,30}:?\s*$/gm, '')
      .trim();
  };

  const isLikelyQuestion = (text) => {
    const questionWords = ['what', 'how', 'when', 'where', 'why', 'who', 'which', 'can', 'could', 'would', 'should', 'do', 'does', 'did', 'is', 'are', 'will'];
    const firstWords = text.toLowerCase().split(' ').slice(0, 2);
    return questionWords.some(word => firstWords.includes(word));
  };

  const parseQAPairs = (text) => {
    if (!text.trim()) return [];

    const processedText = cleanContent(text);

    const enhancedPatterns = [
      {
        name: "**Q:** ... **A:** ...",
        regex: /\*\*Q:\*\*\s*(.+?)\s*\*\*A:\*\*\s*(.+?)(?=\*\*Q:|\n\s*\n|$)/gis,
      },
      {
        name: "Q: ... A: ...",
        regex: /(?:^|\n)\s*Q:\s*(.+?)\s*A:\s*(.+?)(?=\n\s*Q:|\n\s*\n|$)/gis,
      },
      {
        name: "Question: ... Answer: ...",
        regex: /(?:^|\n)\s*Question:\s*(.+?)\s*Answer:\s*(.+?)(?=\n\s*Question:|\n\s*\n|$)/gis,
      },
      {
        name: "Numbered Q&A",
        regex: /(?:^|\n)\s*\d+\.?\s*(?:\*\*Q:\*\*|Q:)?\s*(.+?\?)\s*(?:\*\*A:\*\*|A:)?\s*(.+?)(?=\n\s*\d+\.|\n\s*\n|$)/gis,
      },
      {
        name: "Simple Question-Answer pairs",
        regex: /(.+\?)\s*\n?\s*([^?\n]+?)(?=.+\?|\n\s*\n|$)/gis,
      }
    ];

    for (const pattern of enhancedPatterns) {
      const matches = [...processedText.matchAll(pattern.regex)];
      if (matches.length > 0) {
        const pairs = matches.map(match => ({
          question: match[1].trim().replace(/^\*\*Q:\*\*\s*|^Q:\s*|^\d+\.?\s*/gi, '').trim(),
          answer: match[2].trim().replace(/^\*\*A:\*\*\s*|^A:\s*/gi, '').trim()
        }));

        return pairs.filter(pair => {
          const q = pair.question;
          const a = pair.answer;

          if (!q || !a) return false;
          if (!q.includes('?') && !isLikelyQuestion(q)) return false;
          if (a.length < 3) return false;
          if (a.toUpperCase() === a && a.length < 50) return false;
          if (q.toUpperCase() === q && q.length < 50 && !q.includes('?')) return false;

          return true;
        });
      }
    }

    return [];
  };

  const handleParse = () => {
    const pairs = parseQAPairs(importText);
    if (pairs.length > 0) {
      setParsedPairs(pairs);
      setShowPreview(true);
      setParseError(false);
    } else {
      setParseError(true);
      setShowPreview(false);
    }
  };

  const handleImport = () => {
    onImport(parsedPairs);
    setImportText("");
    setParsedPairs([]);
    setShowPreview(false);
    setParseError(false);
  };

  const handleClear = () => {
    setImportText("");
    setParsedPairs([]);
    setShowPreview(false);
    setParseError(false);
  };

  const copyPrompt = () => {
    const prompt = `Create exactly 50 Q&A pairs about customer service. Format each pair as:
**Q:** [question here]
**A:** [answer here]

Do not add section headers, categories, or numbering. Just the raw Q&A pairs with no extra formatting or separators.`;
    
    navigator.clipboard.writeText(prompt).then(() => {
      const btn = document.activeElement;
      const original = btn.textContent;
      btn.textContent = "Copied!";
      setTimeout(() => btn.textContent = original, 2000);
    });
  };

  return (
    <div style={importStyles.importSection} className="import-section">
      <div style={importStyles.importHeader}>
        <h3 style={importStyles.importTitle}>Import Q&A Pairs</h3>
        <p style={importStyles.importSubtitle}>
          Paste Q&A pairs from ChatGPT or other sources - we'll automatically detect the format and clean messy content
        </p>
      </div>

      <div style={importStyles.importContent}>
        <div style={importStyles.promptSection}>
          <h4 style={importStyles.promptTitle}>Pro Tip: Use This ChatGPT Prompt</h4>
          <div style={importStyles.promptBox} className="prompt-box">
            <code style={importStyles.promptText}>
              Create exactly {'{number}'} Q&A pairs about {'{topic}'}. Format each pair as:<br/>
              **Q:** [question here]<br/>
              **A:** [answer here]<br/><br/>
              Do not add section headers, categories, or numbering. Just the raw Q&A pairs with no extra formatting or separators.
            </code>
            <button onClick={copyPrompt} style={importStyles.copyPromptBtn} className="copy-prompt-btn">
              Copy Prompt
            </button>
          </div>
        </div>

        <textarea
          style={importStyles.importTextarea}
          placeholder="Paste your Q&A pairs here... 

Examples that work:
**Q:** What is your name?
**A:** I'm John Smith.

Q: What do you do?
A: I work as a software engineer.

1. What's your hobby? I love playing guitar.
2. Where are you from? I'm from California.

Our smart parser will handle messy ChatGPT output with section headers, numbering, and other formatting issues!"
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          rows={8}
        />

        <div style={importStyles.importActions}>
          <button onClick={handleParse} style={importStyles.parseButton} disabled={!importText.trim()}>
            Parse Q&A Pairs
          </button>
          <button onClick={handleClear} style={importStyles.clearButton}>
            Clear
          </button>
        </div>

        {parseError && (
          <div style={importStyles.errorCard}>
            <div style={importStyles.errorTitle}>Content detected that isn't Q&A pairs</div>
            <div style={importStyles.errorText}>
              Your text contains section headers, categories, or other formatting that we couldn't parse. Try using our optimized prompt above, or manually clean your text to contain only Q&A pairs.
            </div>
            <div style={importStyles.errorHelp}>
              Try reformatting your text to match Q&A patterns, or add pairs manually below.
            </div>
          </div>
        )}

        {showPreview && (
          <div style={importStyles.previewCard}>
            <div style={importStyles.previewHeader}>
              <div style={importStyles.previewTitle}>
                Found {parsedPairs.length} Q&A pairs
              </div>
              <div style={importStyles.previewActions}>
                <button onClick={handleImport} style={importStyles.importButton}>
                  Import All Pairs
                </button>
              </div>
            </div>
            <div style={importStyles.previewList}>
              {parsedPairs.slice(0, 5).map((pair, i) => (
                <div key={i} style={importStyles.previewItem}>
                  <div style={importStyles.previewQ}>Q: {pair.question}</div>
                  <div style={importStyles.previewA}>A: {pair.answer}</div>
                </div>
              ))}
              {parsedPairs.length > 5 && (
                <div style={importStyles.previewMore}>
                  ...and {parsedPairs.length - 5} more pairs
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/** The chat preview component */
const PreviewChat = ({ botName, theme, pairs }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [botTyping, setBotTyping] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);

  const themeConfig = themes[theme] || themes.midnight;

  useEffect(() => {
    const chatBox = chatBoxRef.current;
    if (chatBox) {
      const uniqueId = `chat-scroll-${Date.now()}`;
      chatBox.id = uniqueId;
      
      const existingStyle = document.getElementById('dynamic-scrollbar-style');
      if (existingStyle) {
        existingStyle.remove();
      }
      
      const styleElement = document.createElement('style');
      styleElement.id = 'dynamic-scrollbar-style';
      styleElement.innerHTML = `
        #${uniqueId}::-webkit-scrollbar {
          width: 6px;
        }
        #${uniqueId}::-webkit-scrollbar-thumb {
          background: ${themeConfig.scrollThumb};
          border-radius: 10px;
          box-shadow: 0 0 5px ${themeConfig.glow};
        }
        #${uniqueId}::-webkit-scrollbar-track {
          background: ${themeConfig.scrollTrack};
          border-radius: 10px;
        }
        #${uniqueId}::-webkit-scrollbar-thumb:hover {
          box-shadow: 0 0 10px ${themeConfig.glow};
        }
      `;
      document.head.appendChild(styleElement);
    }
  }, [theme, themeConfig]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, botTyping]);

  const send = async () => {
    if (!message.trim() || botTyping) return;
    const userText = message;
    setMessage("");
    setChat((c) => [...c, { sender: "user", text: userText, timestamp: Date.now() }]);
    setBotTyping(true);

    setTimeout(() => {
      const reply = findPreviewAnswer(pairs, userText);
      setChat((c) => [...c, { sender: "bot", text: reply, timestamp: Date.now() }]);
      setBotTyping(false);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }, 600 + Math.random() * 800);
  };

  return (
    <div style={styles.previewContainer} className="preview-container">
      <div style={{ 
        ...styles.previewCard, 
        background: themeConfig.background,
        border: `1px solid ${themeConfig.surfaceBorder}`,
        boxShadow: `0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px ${themeConfig.surfaceBorder}`
      }}>
        <div style={{ 
          ...styles.previewHeader,
          borderBottom: `1px solid ${themeConfig.surfaceBorder}`,
          background: `linear-gradient(135deg, ${themeConfig.surface}, transparent)`
        }}>
          <div style={{
            ...styles.botAvatar,
            background: themeConfig.primary,
            boxShadow: `0 0 20px ${themeConfig.glow}, 0 0 40px ${themeConfig.primaryGlow}`
          }}>
            <Bot size={24} color="white" />
          </div>
          <div style={styles.headerInfo}>
            <div style={{ 
              ...styles.botName,
              color: themeConfig.text,
              textShadow: `0 0 10px ${themeConfig.glow}`
            }}>
              {botName || "Your Bot"}
            </div>
            <div style={{ 
              ...styles.status,
              color: themeConfig.textMuted
            }}>
              <span style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#22c55e",
                display: "inline-block",
                marginRight: 6,
                boxShadow: "0 0 10px #22c55e"
              }} />
              Online • {themeConfig.name}
            </div>
          </div>
        </div>

        <div ref={chatBoxRef} style={styles.chatContainer}>
          {chat.length === 0 && (
            <div style={{
              ...styles.welcomeMessage,
              color: themeConfig.textMuted,
              background: themeConfig.surface,
              border: `1px solid ${themeConfig.surfaceBorder}`,
              boxShadow: `0 4px 20px ${themeConfig.primaryGlow}`
            }}>
              <Sparkles size={20} style={{ 
                marginBottom: 8, 
                color: themeConfig.primary,
                filter: `drop-shadow(0 0 5px ${themeConfig.glow})`
              }} />
              <div style={{ fontSize: 14, fontWeight: 500 }}>Welcome! Ask me anything</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>I'm here to help with your questions</div>
            </div>
          )}
          
          {chat.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.messageGroup,
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                marginLeft: msg.sender === "bot" ? "0" : "auto",
                marginRight: msg.sender === "user" ? "0" : "auto"
              }}
            >
              {msg.sender === "bot" && (
                <div style={{
                  ...styles.avatar,
                  background: themeConfig.surface,
                  border: `2px solid ${themeConfig.primary}`,
                  boxShadow: `0 0 15px ${themeConfig.glow}`
                }}>
                  <Bot size={16} color={themeConfig.primary} />
                </div>
              )}
              
              <div
                style={{
                  ...styles.messageBubble,
                  background: msg.sender === "user" ? themeConfig.userBubble : themeConfig.botBubble,
                  color: msg.sender === "user" ? "white" : (theme === "arctic" ? themeConfig.text : "white"),
                  boxShadow: `0 4px 20px ${msg.sender === "user" ? themeConfig.glow : "rgba(0,0,0,0.2)"}`
                }}
              >
                {msg.text}
              </div>
              
              {msg.sender === "user" && (
                <div style={{
                  ...styles.avatar,
                  background: themeConfig.userBubble,
                  border: `2px solid ${themeConfig.accent}`,
                  boxShadow: `0 0 15px ${themeConfig.glow}`
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
                border: `2px solid ${themeConfig.primary}`,
                boxShadow: `0 0 15px ${themeConfig.glow}`
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
          <div ref={endRef} />
        </div>

        <div style={{
          ...styles.inputContainer,
          borderTop: `1px solid ${themeConfig.surfaceBorder}`,
          background: `linear-gradient(135deg, ${themeConfig.surface}, transparent)`
        }}>
          <div style={styles.inputWrapper}>
            <input
              ref={inputRef}
              value={message}
              onChange={(e) => !botTyping && setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !botTyping && send()}
              placeholder={botTyping ? "Bot is typing..." : "Type your message..."}
              style={{
                ...styles.messageInput,
                background: themeConfig.inputBg,
                border: `1px solid ${themeConfig.inputBorder}`,
                color: themeConfig.text,
                boxShadow: `0 0 0 0px ${themeConfig.glow}`
              }}
              disabled={botTyping}
            />
            <button
              onClick={send}
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
                cursor: (botTyping || !message.trim()) 
                  ? "not-allowed" 
                  : "pointer"
              }}
            >
              <ArrowUp size={20} color="white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Builder = () => {
  const [botName, setBotName] = useState("");
  const [theme, setTheme] = useState("arctic");
  const [pairs, setPairs] = useState([{ question: "", answer: "" }]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const slug = useMemo(() => slugify(botName), [botName]);

  // Toast helper functions
  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleImportPairs = (importedPairs) => {
    const validPairs = pairs.filter(p => p.question || p.answer);
    setPairs([...validPairs, ...importedPairs]);
    showToast(`Successfully imported ${importedPairs.length} Q&A pairs!`, 'success');
  };

  const addPair = () => {
    // Optional: validate current pairs before adding new one
    const lastPair = pairs[pairs.length - 1];
    if (lastPair && (!lastPair.question.trim() || !lastPair.answer.trim())) {
      showToast('Please complete the current Q&A pair before adding a new one', 'error');
      // Highlight the empty fields
      setValidationErrors({
        [`question-${pairs.length - 1}`]: !lastPair.question.trim(),
        [`answer-${pairs.length - 1}`]: !lastPair.answer.trim()
      });
      return;
    }
    setPairs((p) => [...p, { question: "", answer: "" }]);
    setValidationErrors({});
  };

  const removePair = (i) => setPairs((p) => (p.length > 1 ? p.filter((_, idx) => idx !== i) : p));
  
  const updatePair = (i, field, val) => {
    setPairs((p) => {
      const next = [...p];
      next[i] = { ...next[i], [field]: val };
      return next;
    });
    // Clear validation error for this field when user starts typing
    if (validationErrors[`${field}-${i}`]) {
      setValidationErrors(prev => {
        const next = { ...prev };
        delete next[`${field}-${i}`];
        return next;
      });
    }
  };

  const copyLink = async () => {
    const link = `${window.location.origin}/chat/${slug || "your-bot"}`;
    try {
      await navigator.clipboard.writeText(link);
      showToast("Link copied to clipboard!", 'success');
    } catch {
      showToast("Could not copy link automatically", 'error');
    }
  };

  const copyGeneratedLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      showToast("Link copied to clipboard!", 'success');
    } catch {
      showToast("Could not copy link automatically", 'error');
    }
  };

  const validateInputs = () => {
    const errors = {};
    let isValid = true;

    // Validate bot name
    if (!botName.trim()) {
      showToast("Please enter a bot name", 'error');
      errors.botName = true;
      isValid = false;
    }

    // Validate Q&A pairs
    const validPairs = pairs.filter(p => p.question.trim() && p.answer.trim());
    if (validPairs.length === 0) {
      showToast("Add at least one complete Q&A pair", 'error');
      
      // Mark all empty fields
      pairs.forEach((pair, i) => {
        if (!pair.question.trim()) errors[`question-${i}`] = true;
        if (!pair.answer.trim()) errors[`answer-${i}`] = true;
      });
      
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const generateBot = async () => {
    // Validate inputs first
    if (!validateInputs()) {
      return;
    }

    setIsGenerating(true);
    showToast("Generating your bot...", 'info');

    try {
      const response = await fetch('http://192.168.0.191:5000/api/bots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: botName, 
          slug, 
          theme, 
          pairs: pairs.filter(p => p.question.trim() && p.answer.trim())
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        const fullLink = `${window.location.origin}${data.link}`;
        setGeneratedLink(fullLink);
        setShowSuccessModal(true);
        showToast(`🎉 Bot generated successfully!`, 'success');
        setValidationErrors({});
      } else {
        showToast(`Error: ${data.error}`, 'error');
      }
    } catch (error) {
      showToast('Couldn\'t reach the server. Make sure your backend is running.', 'error');
      console.error('Connection error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={styles.app} className="app">
      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          link={generatedLink}
          onClose={() => setShowSuccessModal(false)}
          onCopy={copyGeneratedLink}
        />
      )}

      {/* Toast notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      {/* Builder Panel */}
      <div style={styles.builderPanel} className="builder-panel">
        <div style={styles.builderContent} className="builder-content-scrollbar">
          {/* Header */}
          <div style={styles.builderHeader} className="builder-header">
            <div style={styles.logo} className="logo">
              <Zap size={28} color="#ffffff" />
            </div>
            <div>
              <h1 style={styles.title}>RuleBot Builder</h1>
              <p style={styles.subtitle}>Create intelligent chatbots with custom responses</p>
            </div>
          </div>

          {/* Form */}
          <div style={styles.formSection}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Bot Name</label>
              <input
                style={{
                  ...styles.input,
                  borderColor: validationErrors.botName ? '#ef4444' : '#d1d5db',
                  boxShadow: validationErrors.botName ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : 'none'
                }}
                placeholder="e.g., Customer Support Assistant"
                value={botName}
                onChange={(e) => {
                  setBotName(e.target.value);
                  if (validationErrors.botName) {
                    setValidationErrors(prev => ({ ...prev, botName: false }));
                  }
                }}
                onBlur={() => {
                  if (!botName.trim()) {
                    setValidationErrors(prev => ({ ...prev, botName: true }));
                  }
                }}
              />
              {validationErrors.botName && (
                <span style={styles.errorHint}>Bot name is required</span>
              )}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>URL Slug</label>
              <div style={styles.slugContainer}>
                <span style={styles.slugPrefix}>rulebot.com/</span>
                <input 
                  style={styles.slugInput} 
                  value={slug} 
                  readOnly 
                  placeholder="auto-generated"
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Theme</label>
              <div style={styles.themeGrid} className="theme-grid">
                {Object.entries(themes).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setTheme(key)}
                    className="theme-button"
                    style={{
                      ...styles.themeButton,
                      background: config.background,
                      border: theme === key 
                        ? `2px solid ${config.primary}` 
                        : "2px solid transparent",
                      boxShadow: theme === key 
                        ? `0 0 20px ${config.glow}` 
                        : "0 4px 12px rgba(0,0,0,0.1)",
                      transform: theme === key ? "scale(1.05)" : "scale(1)"
                    }}
                  >
                    <div style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: config.primary,
                      marginBottom: 8,
                      boxShadow: `0 0 10px ${config.glow}`
                    }} />
                    <span style={{ 
                      color: config.text, 
                      fontSize: 12, 
                      fontWeight: 600,
                      textShadow: theme === key ? `0 0 10px ${config.glow}` : "none"
                    }}>
                      {config.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Import Q&A Section */}
            <QAImporter onImport={handleImportPairs} />

            {/* Q&A Section */}
            <div style={styles.qaSection}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Knowledge Base</h3>
                <button onClick={addPair} style={styles.addButton}>
                  <Plus size={18} />
                  Add Q&A
                </button>
              </div>

              <div style={styles.qaList} className="qa-list qa-list-scrollbar">
                {pairs.map((pair, index) => (
                  <div key={index} style={styles.qaCard}>
                    <div style={styles.qaCardHeader}>
                      <span style={styles.qaNumber}>#{index + 1}</span>
                      {pairs.length > 1 && (
                        <button 
                          onClick={() => removePair(index)} 
                          style={styles.removeButton}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    <div style={styles.qaInputGroup}>
                      <label style={styles.qaLabel}>Question</label>
                      <input
                        style={{
                          ...styles.qaInput,
                          borderColor: validationErrors[`question-${index}`] ? '#ef4444' : '#d1d5db',
                          boxShadow: validationErrors[`question-${index}`] ? '0 0 0 2px rgba(239, 68, 68, 0.1)' : 'none'
                        }}
                        placeholder="What question should trigger this response?"
                        value={pair.question}
                        onChange={(e) => updatePair(index, "question", e.target.value)}
                      />
                      {validationErrors[`question-${index}`] && (
                        <span style={styles.errorHint}>Question is required</span>
                      )}
                    </div>
                    <div style={styles.qaInputGroup}>
                      <label style={styles.qaLabel}>Answer</label>
                      <textarea
                        style={{
                          ...styles.qaInput, 
                          minHeight: 80, 
                          resize: "vertical",
                          borderColor: validationErrors[`answer-${index}`] ? '#ef4444' : '#d1d5db',
                          boxShadow: validationErrors[`answer-${index}`] ? '0 0 0 2px rgba(239, 68, 68, 0.1)' : 'none'
                        }}
                        className="qa-textarea-scrollbar"
                        placeholder="How should the bot respond?"
                        value={pair.answer}
                        onChange={(e) => updatePair(index, "answer", e.target.value)}
                      />
                      {validationErrors[`answer-${index}`] && (
                        <span style={styles.errorHint}>Answer is required</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={styles.actions} className="actions">
              <button 
                onClick={generateBot} 
                style={{
                  ...styles.primaryButton,
                  opacity: isGenerating ? 0.7 : 1,
                  cursor: isGenerating ? 'not-allowed' : 'pointer'
                }}
                disabled={isGenerating}
              >
                <Sparkles size={18} />
                {isGenerating ? 'Generating...' : 'Generate Bot'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      <div style={styles.previewPanel} className="preview-panel">
        <PreviewChat botName={botName} theme={theme} pairs={pairs} />
      </div>
    </div>
  );
};

const styles = {
  app: {
    display: "flex",
    flexDirection: "row",
    height: "100vh",
    width: "100vw",
    fontFamily: "'Inter', system-ui, sans-serif",
    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    overflow: "hidden",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  
  builderPanel: {
    width: "520px",
    minWidth: "520px",
    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
    borderRight: "1px solid rgba(15, 23, 42, 0.15)",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 0 40px rgba(0,0,0,0.1)",
    height: "100vh",
    overflow: "hidden"
  },
  
  builderContent: {
    padding: "clamp(16px, 4vw, 32px)",
    paddingBottom: "clamp(100px, 20vh, 120px)",
    height: "100%",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "clamp(16px, 3vw, 24px)"
  },
  
  builderHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    paddingBottom: "20px",
    borderBottom: "1px solid rgba(15, 23, 42, 0.15)",
    flexShrink: 0
  },
  
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 20px rgba(59, 130, 246, 0.3)"
  },
  
  title: {
    fontSize: "clamp(20px, 5vw, 24px)",
    fontWeight: 800,
    color: "#0f172a",
    margin: 0,
    lineHeight: 1.2,
    fontFamily: "'Orbitron', monospace"
  },
  
  subtitle: {
    fontSize: "clamp(12px, 3vw, 14px)",
    color: "rgba(15, 23, 42, 0.7)",
    margin: "4px 0 0 0",
    fontWeight: 500
  },
  
  formSection: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    flex: 1,
    minHeight: 0
  },
  
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  
  label: {
    fontSize: 14,
    fontWeight: 700,
    color: "#374151",
    letterSpacing: "0.5px",
    textTransform: "uppercase"
  },
  
  input: {
    padding: "14px 16px",
    border: "1px solid #d1d5db",
    borderRadius: 12,
    fontSize: "clamp(13px, 3vw, 14px)",
    fontWeight: 500,
    color: "#1f2937",
    background: "#ffffff",
    transition: "all 0.3s ease",
    outline: "none",
    minHeight: 48
  },

  errorHint: {
    fontSize: 12,
    color: "#ef4444",
    fontWeight: 600,
    marginTop: 4
  },
  
  slugContainer: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #d1d5db",
    borderRadius: 12,
    background: "#f9fafb",
    overflow: "hidden"
  },
  
  slugPrefix: {
    padding: "14px 16px",
    background: "#f3f4f6",
    color: "#6b7280",
    fontSize: 14,
    fontWeight: 500,
    borderRight: "1px solid #d1d5db",
    fontFamily: "'JetBrains Mono', monospace"
  },
  
  slugInput: {
    flex: 1,
    padding: "14px 16px",
    border: "none",
    fontSize: 14,
    fontWeight: 500,
    color: "#6b7280",
    background: "transparent",
    outline: "none",
    fontFamily: "'JetBrains Mono', monospace"
  },
  
  themeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
    gap: "12px",
    width: "100%"
  },
  
  themeButton: {
    width: "100%",
    minWidth: "85px",
    height: "80px",
    padding: "12px 6px",
    borderRadius: 16,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    outline: "none",
    backdropFilter: "blur(10px)"
  },
  
  qaSection: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: "#0f172a",
    margin: 0,
    fontFamily: "'Orbitron', monospace"
  },
  
  addButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    minHeight: 44,
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    color: "#475569",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    WebkitTapHighlightColor: "transparent"
  },
  
  qaList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    maxHeight: "300px",
    overflowY: "auto",
    paddingRight: "4px"
  },
  
  qaCard: {
    padding: "20px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
  },
  
  qaCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  
  qaNumber: {
    fontSize: 12,
    fontWeight: 700,
    color: "#3b82f6",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  
  removeButton: {
    width: 32,
    height: 32,
    minWidth: 44,
    minHeight: 44,
    border: "1px solid #fecaca",
    background: "#fef2f2",
    borderRadius: 8,
    color: "#dc2626",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    WebkitTapHighlightColor: "transparent"
  },
  
  qaInputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  
  qaLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  
  qaInput: {
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    fontSize: 14,
    color: "#374151",
    background: "#ffffff",
    resize: "none",
    outline: "none",
    fontFamily: "inherit",
    transition: "all 0.2s ease",
    minHeight: 48
  },
  
  actions: {
    display: "flex",
    gap: "16px",
    paddingTop: "20px",
    paddingBottom: "20px",
    justifyContent: "center"
  },
  
  primaryButton: {
    width: "100%",
    maxWidth: 400,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "16px 24px",
    minHeight: 54,
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    border: "none",
    borderRadius: 12,
    color: "white",
    fontSize: "clamp(14px, 3.5vw, 15px)",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(59, 130, 246, 0.25)",
    transition: "all 0.3s ease",
    WebkitTapHighlightColor: "transparent"
  },
  
  secondaryButton: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "16px 24px",
    minHeight: 54,
    background: "#ffffff",
    border: "1px solid #d1d5db",
    borderRadius: 12,
    color: "#374151",
    fontSize: "clamp(14px, 3.5vw, 15px)",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.3s ease",
    WebkitTapHighlightColor: "transparent"
  },
  
  previewPanel: {
    flex: 1,
    padding: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    overflow: "hidden"
  },
  
  previewContainer: {
    width: "100%",
    maxWidth: "500px",
    height: "90vh",
    maxHeight: "700px"
  },
  
  previewCard: {
    height: "100%",
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    backdropFilter: "blur(20px)"
  },
  
  previewHeader: {
    padding: "20px 24px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flexShrink: 0
  },
  
  botAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  
  headerInfo: {
    flex: 1
  },
  
  botName: {
    fontSize: 18,
    fontWeight: 700,
    margin: 0,
    lineHeight: 1.3,
    fontFamily: "'Orbitron', monospace"
  },
  
  status: {
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    marginTop: 2
  },
  
  chatContainer: {
    flex: 1,
    padding: "24px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  
  welcomeMessage: {
    padding: "20px",
    borderRadius: 16,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backdropFilter: "blur(10px)"
  },
  
  messageGroup: {
    display: "flex",
    alignItems: "flex-end",
    gap: "12px",
    maxWidth: "85%",
    marginLeft: 0,
    marginRight: 0
  },
  
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  },
  
  messageBubble: {
    padding: "12px 16px",
    borderRadius: 18,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1.4,
    wordWrap: "break-word",
    maxWidth: "100%"
  },
  
  typingBubble: {
    padding: "12px 16px",
    borderRadius: 18,
    display: "flex",
    alignItems: "center"
  },
  
  typingDots: {
    display: "flex",
    gap: "4px"
  },
  
  inputContainer: {
    padding: "20px 24px",
    flexShrink: 0
  },
  
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  
  messageInput: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: 20,
    border: "1px solid",
    outline: "none",
    fontSize: 14,
    fontWeight: 500,
    transition: "all 0.15s ease",
    minHeight: 48
  },
  
  sendButton: {
    width: 55,
    height: 55,
    minWidth: 48,
    minHeight: 48,
    borderRadius: 22,
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    outline: "none",
    flexShrink: 0,
    WebkitTapHighlightColor: "transparent"
  }
};

const importStyles = {
  importSection: {
    marginBottom: 32,
    padding: "clamp(16px, 4vw, 24px)",
    background: "rgba(59, 130, 246, 0.05)",
    border: "1px solid rgba(59, 130, 246, 0.2)",
    borderRadius: 16,
  },

  importHeader: {
    marginBottom: 20
  },

  importTitle: {
    fontSize: "clamp(16px, 4vw, 18px)",
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 8px 0",
    fontFamily: "'Orbitron', monospace"
  },

  importSubtitle: {
    fontSize: "clamp(12px, 3vw, 14px)",
    color: "rgba(15, 23, 42, 0.7)",
    margin: 0,
    fontWeight: 500
  },

  importContent: {
    display: "flex",
    flexDirection: "column",
    gap: 16
  },

  promptSection: {
    background: "rgba(0,204,255,0.1)",
    border: "1px solid rgba(0,204,255,0.3)",
    borderRadius: 12,
    padding: "clamp(12px, 3vw, 16px)",
    marginBottom: 12
  },

  promptTitle: {
    color: "#0369a1",
    fontSize: "clamp(12px, 3vw, 14px)",
    margin: "0 0 8px 0",
    fontWeight: 600
  },

  promptBox: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start"
  },

  promptText: {
    flex: 1,
    background: "rgba(0,0,0,0.1)",
    padding: "clamp(10px, 2.5vw, 12px)",
    borderRadius: 8,
    color: "#374151",
    fontSize: "clamp(11px, 2.5vw, 12px)",
    lineHeight: 1.4,
    display: "block",
    fontFamily: "'JetBrains Mono', monospace"
  },

  copyPromptBtn: {
    background: "#0369a1",
    color: "white",
    border: "none",
    borderRadius: 6,
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: "clamp(11px, 2.5vw, 12px)",
    fontWeight: 600,
    whiteSpace: "nowrap",
    minHeight: 44,
    WebkitTapHighlightColor: "transparent"
  },

  importTextarea: {
    width: "100%",
    padding: "16px",
    border: "1px solid #d1d5db",
    borderRadius: 12,
    fontSize: "clamp(13px, 3vw, 14px)",
    fontFamily: "'Inter', sans-serif",
    background: "#ffffff",
    resize: "vertical",
    minHeight: 120,
    outline: "none",
    boxSizing: "border-box"
  },

  importActions: {
    display: "flex",
    gap: 12
  },

  parseButton: {
    flex: 1,
    padding: "12px 24px",
    minHeight: 48,
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: 10,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    WebkitTapHighlightColor: "transparent"
  },

  clearButton: {
    flex: 1,
    padding: "12px 24px",
    minHeight: 48,
    background: "transparent",
    color: "#6b7280",
    border: "1px solid #d1d5db",
    borderRadius: 10,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    WebkitTapHighlightColor: "transparent"
  },

  errorCard: {
    padding: "clamp(16px, 4vw, 20px)",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 12,
    color: "#dc2626"
  },

  errorTitle: {
    fontSize: "clamp(14px, 3.5vw, 16px)",
    fontWeight: 700,
    marginBottom: 8
  },

  errorText: {
    fontSize: "clamp(13px, 3vw, 14px)",
    marginBottom: 16
  },

  errorHelp: {
    fontSize: "clamp(13px, 3vw, 14px)",
    fontStyle: "italic"
  },

  previewCard: {
    padding: "clamp(16px, 4vw, 20px)",
    background: "#f0f9ff",
    border: "1px solid #bae6fd",
    borderRadius: 12
  },

  previewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16
  },

  previewTitle: {
    fontSize: "clamp(14px, 3.5vw, 16px)",
    fontWeight: 700,
    color: "#0369a1"
  },

  previewActions: {
    display: "flex",
    gap: 8
  },

  importButton: {
    padding: "10px 20px",
    minHeight: 44,
    background: "#0369a1",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontWeight: 600,
    cursor: "pointer",
    WebkitTapHighlightColor: "transparent"
  },

  previewList: {
    display: "flex",
    flexDirection: "column",
    gap: 12
  },

  previewItem: {
    padding: "clamp(10px, 2.5vw, 12px)",
    background: "#ffffff",
    border: "1px solid #e0f2fe",
    borderRadius: 8
  },

  previewQ: {
    fontSize: "clamp(13px, 3vw, 14px)",
    fontWeight: 600,
    color: "#0369a1",
    marginBottom: 4
  },

  previewA: {
    fontSize: "clamp(13px, 3vw, 14px)",
    color: "#374151"
  },

  previewMore: {
    padding: 12,
    textAlign: "center",
    color: "#6b7280",
    fontSize: "clamp(13px, 3vw, 14px)",
    fontStyle: "italic"
  }
};

// CSS animations and styles
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Orbitron:wght@400;700;800;900&display=swap');

* {
  box-sizing: border-box;
}

body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

#root {
  height: 100vh;
  width: 100vw;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0px);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
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

.builder-content-scrollbar::-webkit-scrollbar {
  width: 8px !important;
}

.builder-content-scrollbar::-webkit-scrollbar-track {
  background: rgba(59, 130, 246, 0.1) !important;
  border-radius: 10px !important;
}

.builder-content-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
  border-radius: 10px !important;
}

.builder-content-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8) !important;
}

.qa-list-scrollbar::-webkit-scrollbar {
  width: 6px !important;
}

.qa-list-scrollbar::-webkit-scrollbar-track {
  background: rgba(59, 130, 246, 0.1) !important;
  border-radius: 10px !important;
}

.qa-list-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
  border-radius: 10px !important;
}

.qa-list-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8) !important;
}

.qa-textarea-scrollbar::-webkit-scrollbar {
  width: 6px !important;
  height: 6px !important;
}

.qa-textarea-scrollbar::-webkit-scrollbar-track {
  background: rgba(59, 130, 246, 0.1) !important;
  border-radius: 10px !important;
}

.qa-textarea-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
  border-radius: 10px !important;
}

.qa-textarea-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8) !important;
}

input:focus, textarea:focus {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
}

button:active:not(:disabled) {
  transform: translateY(0px);
}

button:disabled {
  cursor: not-allowed !important;
  transform: none !important;
  opacity: 0.6;
}

input:disabled, textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

* {
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.2s ease, border-color 0.2s ease;
}

::selection {
  background: rgba(59, 130, 246, 0.3);
}

::placeholder {
  color: rgba(107, 114, 128, 0.7);
  font-weight: 400;
}

/* ========== MOBILE RESPONSIVE STYLES ========== */
@media (max-width: 1024px) {
  .app {
    flex-direction: column !important;
  }
  
  .builder-panel {
    width: 100% !important;
    min-width: 100% !important;
    height: auto !important;
    max-height: 60vh !important;
    border-right: none !important;
    border-bottom: 1px solid rgba(15, 23, 42, 0.15) !important;
  }
  
  .preview-panel {
    width: 100% !important;
    height: 40vh !important;
    padding: 16px !important;
  }
  
  .preview-container {
    max-height: 100% !important;
    height: 100% !important;
  }
}

@media (max-width: 768px) {
  .builder-panel {
    max-height: 100vh !important;
  }
  
  .preview-panel {
    display: none !important;
  }
  
  .theme-grid {
    grid-template-columns: repeat(3, 1fr) !important;
  }
  
  .qa-list {
    max-height: 200px !important;
  }
  
  .actions {
    margin-top: 20px !important;
    margin-bottom: 20px !important;
  }
  
  .actions button {
    width: 100% !important;
    max-width: 100% !important;
    min-height: 58px !important;
    font-size: 16px !important;
  }
}

@media (max-width: 480px) {
  .builder-header {
    flex-direction: row !important;
    gap: 12px !important;
  }
  
  .logo {
    width: 40px !important;
    height: 40px !important;
  }
  
  .theme-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 8px !important;
  }
  
  .theme-button {
    min-width: 70px !important;
    height: 70px !important;
  }
  
  .qa-card {
    padding: 16px !important;
  }
  
  .import-section {
    padding: 16px !important;
    margin-bottom: 16px !important;
  }
  
  .qa-list {
    max-height: 180px !important;
  }
  
  .prompt-box {
    flex-direction: column !important;
  }
  
  .copy-prompt-btn {
    width: 100% !important;
  }
}

/* Touch feedback for mobile */
@media (hover: none) and (pointer: coarse) {
  button:active:not(:disabled) {
    transform: scale(0.97) !important;
    opacity: 0.8;
  }
  
  .theme-button:active {
    transform: scale(0.95) !important;
  }
  
  .send-button:active:not(:disabled) {
    transform: scale(0.9) !important;
  }
}
`;

document.head.appendChild(styleSheet);

export default Builder;