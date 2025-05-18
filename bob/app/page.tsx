"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from "../styles/Home.module.css";

const MODELS = ["gpt-4.1-mini", "gpt-4.1-nano"];
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Page() {
  const [selectedModel, setSelectedModel] = useState(MODELS[1]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [promptTokens, setPromptTokens] = useState(0);
  const [completionTokens, setCompletionTokens] = useState(0);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  interface Message {
    sender: string;
    text: string;
  }

  interface ChatResponse {
    conversationId: string;
    message: string;
    promptTokens: number;
    completionTokens: number;
  }

  interface ChatRequest {
    model: string;
    userMessage: string;
    conversationId: string | null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setLoading(true);

    try {
      const res = await axios.post<ChatResponse>(`${backendUrl}/api/chat`, {
        model: selectedModel,
        userMessage: input,
        conversationId,
      } as ChatRequest);

      setConversationId(res.data.conversationId);
      setMessages((prev) => [
        ...prev,
        { sender: "Bob", text: res.data.message },
      ]);
      setPromptTokens(res.data.promptTokens);
      setCompletionTokens(res.data.completionTokens);
    } catch (err: unknown) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "Bob", text: "Error, please try again." },
      ]);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setConversationId(null);
    setMessages([]);
    setPromptTokens(0);
    setCompletionTokens(0);
    setInput("");
  };

  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <select
          className={styles.selectModel}
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          disabled={loading}
        >
          {MODELS.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
        <button
          className={styles.formButton}
          onClick={startNewChat}
          disabled={loading}
        >
          Start New Chat
        </button>
      </header>

      <main ref={scrollRef} className={styles.dialogueContainer}>
        {messages.map((model, i) => (
          <div key={i} className={`${styles.message} ${styles[model.sender]}`}>
            <strong>{model.sender === "user" ? "You" : "Bob"}:</strong>
            <ReactMarkdown>{model.text}</ReactMarkdown>
          </div>
        ))}
        {loading && <p className={styles.loading}>Bob is thinking...</p>}
      </main>

      <footer className={styles.inputContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            className={styles.formInput}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={loading}
          />
          <button
            className={styles.formButton}
            type="submit"
            disabled={loading}
          >
            Send
          </button>
        </form>

        <div className={styles.tokenContainer}>
          <span className={styles.tokenInfo}>Prompt: {promptTokens}</span>
          <span className={styles.tokenInfo}>
            Completion: {completionTokens}
          </span>
        </div>
      </footer>
    </div>
  );
}
