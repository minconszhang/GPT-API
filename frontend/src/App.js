import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";

const backendUrl = "http://127.0.0.1:3888";
const MODELS = ["gpt-4.1-mini", "gpt-4.1-nano"];

function App() {
  const [selectedModel, setSelectedModel] = useState(MODELS[1]);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [promptTokens, setPromptTokens] = useState(0);
  const [completionTokens, setCompletionTokens] = useState(0);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Locally reflect user message
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setLoading(true);

    try {
      const res = await axios.post(`${backendUrl}/api/chat`, {
        model: selectedModel,
        userMessage: input,
        conversationId: conversationId,
      });

      setConversationId(res.data.conversationId);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: res.data.message },
      ]);
      setPromptTokens(res.data.promptTokens);
      setCompletionTokens(res.data.completionTokens);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error, please try again." },
      ]);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  // Reset conversation state
  const startNewChat = () => {
    setConversationId(null);
    setMessages([]);
    setPromptTokens(0);
    setCompletionTokens(0);
    setInput("");
  };

  return (
    <div className="app-container">
      <header className="header">
        <select
          className="select-model"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          {MODELS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <button
          className="new-chat-button"
          onClick={startNewChat}
          disabled={loading}
        >
          Start New Chat
        </button>
      </header>

      <main ref={scrollRef} className="dialogue-container">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.sender}`}>
            <strong>{m.sender === "user" ? "You" : "Bot"}:</strong>
            <ReactMarkdown>{m.text}</ReactMarkdown>
          </div>
        ))}
        {loading && <p className="loading">Bot is typing...</p>}
      </main>

      <footer className="input-container">
        <form onSubmit={handleSubmit} className="form">
          <input
            className="form-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={loading}
          />
          <button className="form-button" type="submit" disabled={loading}>
            Send
          </button>
        </form>

        <div className="token-container">
          <span className="token-info">Prompt: {promptTokens} </span>
          <span className="token-info">Completion: {completionTokens}</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
