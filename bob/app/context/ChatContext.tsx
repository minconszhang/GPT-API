import { createContext } from "react";

export interface ChatContextType {
    selectedModel: string;
    setSelectedModel: (m: string) => void;
    isNewChat: boolean;
    setIsNewChat: (b: boolean) => void;
}

export const ChatContext = createContext<ChatContextType>({
    selectedModel: "gpt-4.1-mini",
    setSelectedModel: () => { },
    isNewChat: false,
    setIsNewChat: () => { },
});
