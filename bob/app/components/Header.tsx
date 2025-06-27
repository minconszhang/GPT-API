"use client";

import styles from "../../styles/Home.module.css";
import { useContext} from "react";
import { ChatContext } from "../context/ChatContext";

interface HeaderProps {
    modelList: string[];
}

export const Header = ({ modelList }: HeaderProps) => {
    const { selectedModel, setSelectedModel, setIsNewChat } = useContext(ChatContext);

    return (
        <header className={styles.header}>
            <div className={styles.logo}>💬 Chat Bob</div>
            <div className={styles.controls}>
                <select
                    className={styles.selectModel}
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}

                >
                    {modelList.map((model) => (
                        <option key={model} value={model}>
                            {model}
                        </option>
                    ))}
                </select>
                <button
                    className={styles.newChatBtn}
                    onClick={() => setIsNewChat(true)}

                >
                    New Chat
                </button>
            </div>
        </header>
    )
}
