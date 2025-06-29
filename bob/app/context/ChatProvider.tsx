"use client";

import { useState } from "react";
import { ChatContext } from "./ChatContext";

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [selectedModel, setSelectedModel] = useState("4.1 基础版");
    const [isNewChat, setIsNewChat] = useState(false);

    return (
        <ChatContext.Provider value={{ selectedModel, setSelectedModel, isNewChat, setIsNewChat }}>
            {children}
        </ChatContext.Provider>
    );
}
