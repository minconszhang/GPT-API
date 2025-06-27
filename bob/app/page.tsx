// page.tsx
"use client";

import { useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import { Header } from "./components/Header";
import { ChatClient,ChatClientHandle } from "./components/ChatClient";

export default function Page() {
  const [selectedModel, setSelectedModel] = useState<string>("");

  const chatClientRef = useRef<ChatClientHandle>(null);

  const resetChat = () => {
    chatClientRef.current?.startNewChat();
  };

  return (
    <div className={styles.appContainer}>
      <Header resetChat={resetChat} selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
      <ChatClient ref={chatClientRef} selectedModel={selectedModel} />
    </div>
  );
}
