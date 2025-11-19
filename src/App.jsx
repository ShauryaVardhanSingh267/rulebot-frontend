import { useState, useRef, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [botTyping, setBotTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, botTyping]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setChatHistory((prev) => [...prev, { sender: "user", text: message }]);
    const userMessage = message;
    setMessage("");

    try {
      setBotTyping(true);
      const res = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bot: "cozy-cafe", message: userMessage }),
      });
      const data = await res.json();

      setTimeout(() => {
        setBotTyping(false);

        setChatHistory((prev) => [
          ...prev,
          { sender: "bot", text: data.answer || "No response from bot." },
        ]);
      }, 500);
    } catch (error) {
      setBotTyping(false);
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", text: "Error: Unable to reach backend." },
      ]);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.fadeTop}></div>
      <h2 style={styles.header}>
        <span style={{ color: "#1DA1F2" }}>Cha</span>
        <span style={{ color: "#00e676" }}>tty</span>
      </h2>

      <div style={styles.chatBox}>
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              animation: "fadeIn 0.5s ease",
              ...(msg.sender === "user"
                ? { justifyContent: "flex-end" }
                : { justifyContent: "flex-start" }),
            }}
          >
            {msg.sender === "bot" && <div style={styles.botIcon}></div>}

            <div
              style={{
                ...styles.message,
                ...(msg.sender === "user" ? styles.userMsg : styles.botMsg),
                ...styles.messageHover,
              }}
            >
              {msg.text}
            </div>

            {msg.sender === "user" && <div style={styles.userIcon}></div>}
          </div>
        ))}

        {botTyping && (
          <div style={styles.botTypingRow}>
            <div style={styles.botIcon}></div>
            <div style={styles.typingDots}>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div style={styles.inputArea}>
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={styles.input}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>

      {/* Inline keyframe styles for animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .typingDots span {
            animation: blink 1.4s infinite;
            font-size: 18px;
            padding: 0 2px;
          }
          .typingDots span:nth-child(1) { animation-delay: 0s; }
          .typingDots span:nth-child(2) { animation-delay: 0.2s; }
          .typingDots span:nth-child(3) { animation-delay: 0.4s; }
          @keyframes blink {
            0% { opacity: 0.2; }
            50% { opacity: 1; }
            100% { opacity: 0.2; }
          }
        `}
      </style>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "90%",
    margin: "20px auto",
    fontFamily: "'Poppins', sans-serif",
    background: "linear-gradient(160deg, #000000, #0d0d0d 70%)",
    borderRadius: "16px",
    padding: "20px",
    color: "#fff",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
  },
  fadeTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "80px",
    background: "linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0))",
    zIndex: 1,
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
    fontWeight: "700",
    fontSize: "50px",
    letterSpacing: "1px",
    textShadow:
      "0 0 10px rgba(0,230,118,0.6), 0 0 20px rgba(29,161,242,0.5)",
    zIndex: 2,
    position: "relative",
  },
  chatBox: {
    height: "300px",
    overflowY: "auto",
    padding: "10px",
    marginBottom: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    scrollbarWidth: "thin",
    scrollbarColor: "#1DA1F2 #000000",
  },
  message: {
    padding: "10px 14px",
    borderRadius: "18px",
    maxWidth: "75%",
    wordWrap: "break-word",
    fontSize: "14px",
    transition: "all 0.3s ease",
  },
  messageHover: {
    boxShadow: "0 0 10px rgba(255,255,255,0.4)",
  },
  userMsg: {
    background: "linear-gradient(135deg, #00c853, #00e676)",
    alignSelf: "flex-end",
    color: "#fff",
  },
  botMsg: {
    background: "linear-gradient(135deg, #1DA1F2, #007BFF)",
    alignSelf: "flex-start",
    color: "#fff",
  },
  botIcon: {
    width: "30px",
    height: "30px",
    background: "radial-gradient(circle at center, #1DA1F2, #005BBB)",
    borderRadius: "50%",
    border: "2px solid #fff",
    boxShadow: "0 0 10px rgba(29,161,242,0.7)",
  },
  userIcon: {
    width: "30px",
    height: "30px",
    background: "radial-gradient(circle at center, #00e676, #00c853)",
    borderRadius: "50%",
    border: "2px solid #fff",
    boxShadow: "0 0 10px rgba(0,230,118,0.6)",
  },
  botTypingRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    justifyContent: "flex-start",
  },
  typingDots: {
    display: "flex",
    alignItems: "center",
    gap: "2px",
    fontSize: "20px",
  },
  typingText: {
    fontSize: "14px",
    color: "#888",
    fontStyle: "italic",
  },
  inputArea: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "20px",
    border: "1px solid #444",
    fontSize: "14px",
    backgroundColor: "#1A1A1A",
    color: "#fff",
    outline: "none",
    transition: "border 0.3s ease",
  },
  button: {
    padding: "10px 16px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, #1DA1F2, #007BFF)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
};

export default App;
