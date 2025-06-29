"use client";

import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from "../../styles/Home.module.css";
import { ChatContext } from "../context/ChatContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatResponse {
    conversationId: string;
    message: string;
    promptTokens: number;
    completionTokens: number;
}

export const ChatClient = () => {
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { selectedModel, isNewChat, setIsNewChat } = useContext(ChatContext);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
    const [promptTokens, setPromptTokens] = useState(0);
    const [completionTokens, setCompletionTokens] = useState(0);
    const [input, setInput] = useState("");

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (isNewChat) {
            setConversationId(null);
            setMessages([]);
            setPromptTokens(0);
            setCompletionTokens(0);
            setInput("");
            setIsNewChat(false);
        }
    }, [isNewChat]);

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

    return (
        <>
            <main ref={scrollRef} className={styles.dialogueContainer}>
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`${styles.message} ${msg.sender === "user" ? styles.userBubble : styles.botBubble
                            }`}
                    >
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                ))}
                {loading && <p className={styles.loading}>Bob is thinking...</p>}
            </main>

            <footer className={styles.inputContainer}>
                <form className={styles.formRow}>
                    <Textarea
                        className="resize-none"
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);

                            e.target.style.height = "auto";
                            const maxHeight = 200;
                            const scrollHeight = e.target.scrollHeight;
                            e.target.style.height = Math.min(scrollHeight, maxHeight) + "px";
                        }}
                        placeholder="Type a message..."
                        onKeyDown={(e) => {
                            // Skip handling if this is part of IME composition
                            if (e.nativeEvent.isComposing) {
                                return;
                            }

                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                if (input.trim() && !loading) {
                                    // Create a synthetic form event
                                    const formEvent = {
                                        preventDefault: () => { },
                                    } as React.FormEvent;
                                    handleSubmit(formEvent);
                                }
                            }
                        }}
                        rows={1}
                    />
                    <Button
                        className="cursor-pointer h-auto"
                        onClick={() => {
                            if (input.trim()) {
                                const formEvent = {
                                    preventDefault: () => { },
                                } as React.FormEvent;
                                handleSubmit(formEvent);
                            }
                        }}
                        disabled={loading || !input.trim()}
                    >
                        Send
                    </Button>
                </form>
                <div className={styles.tokenInfoBar}>
                    <span>Prompt: {promptTokens}</span>
                    <span>Completion: {completionTokens}</span>
                </div>
            </footer>
        </>
    );
}
