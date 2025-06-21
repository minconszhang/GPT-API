// page.tsx
"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from "../styles/Home.module.css";

export default function Page() {
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [promptTokens, setPromptTokens] = useState(0);
  const [completionTokens, setCompletionTokens] = useState(0);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    axios.get("/api/model-list").then((res: { data: string[] }) => {
      setModels(res.data);
      setSelectedModel(res.data[0]);
    });
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus textarea when loading finishes
  useEffect(() => {
    if (!loading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [loading]);

  interface ChatResponse {
    conversationId: string;
    message: string;
    promptTokens: number;
    completionTokens: number;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post<ChatResponse>("/api/chat", {
        model: selectedModel,
        userMessage: input,
        conversationId,
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
        { sender: "bot", text: "Oops, something went wrong." },
      ]);
    } finally {
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
        <div className={styles.logo}>💬 Chat Bob</div>
        <div className={styles.controls}>
          <select
            className={styles.selectModel}
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={loading}
          >
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
          <button
            className={styles.newChatBtn}
            onClick={startNewChat}
            disabled={loading}
          >
            New Chat
          </button>
        </div>
      </header>

      <main ref={scrollRef} className={styles.dialogueContainer}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${styles.message} ${
              msg.sender === "user" ? styles.userBubble : styles.botBubble
            }`}
          >
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ))}
        {loading && <p className={styles.loading}>Bob is thinking...</p>}
      </main>

      <footer className={styles.inputContainer}>
        <form className={styles.formRow}>
          <textarea
            className={`${styles.formInput} ${styles.textareaInput}`}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);

              e.target.style.height = "auto";
              const maxHeight = 200;
              const scrollHeight = e.target.scrollHeight;
              e.target.style.height = Math.min(scrollHeight, maxHeight) + "px";
            }}
            placeholder="Type a message..."
            disabled={loading}
            onKeyDown={(e) => {
              // Skip handling if this is part of IME composition
              if (e.nativeEvent.isComposing) {
                return;
              }

              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (input.trim()) {
                  // Create a synthetic form event
                  const formEvent = {
                    preventDefault: () => {},
                  } as React.FormEvent;
                  handleSubmit(formEvent);
                }
              }
            }}
            rows={1}
            ref={textareaRef}
          />
          <button
            className={styles.sendBtn}
            type="button"
            onClick={() => {
              if (input.trim()) {
                const formEvent = {
                  preventDefault: () => {},
                } as React.FormEvent;
                handleSubmit(formEvent);
              }
            }}
            disabled={loading || !input.trim()}
          >
            Send
          </button>
        </form>
        <div className={styles.tokenInfoBar}>
          <span>Prompt: {promptTokens}</span>
          <span>Completion: {completionTokens}</span>
        </div>
      </footer>
    </div>
  );
}
