"use client";

import { useState } from "react";
import { ChatContext } from "./ChatContext";

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [selectedModel, setSelectedModel] = useState("gpt-4.1-mini");
    const [isNewChat, setIsNewChat] = useState(false);

    return (
        <ChatContext.Provider value={{ selectedModel, setSelectedModel, isNewChat, setIsNewChat }}>
            {children}
        </ChatContext.Provider>
    );
}
