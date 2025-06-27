"use client";

import styles from "../../styles/Home.module.css";
import axios from "axios";
import { useEffect, useState } from "react";

interface HeaderProps {
    resetChat: () => void;
    selectedModel: string;
    setSelectedModel: (model: string) => void;
}

export default function Header({ resetChat, selectedModel, setSelectedModel }: HeaderProps) {
    const [modelsLoading, setModelsLoading] = useState(true);
    const [models, setModels] = useState<string[]>([]);

    useEffect(() => {
        setModelsLoading(true);
        axios.get("/api/model-list")
            .then((res: { data: string[] }) => {
                setModels(res.data);
                setSelectedModel(res.data[0]);
                setModelsLoading(false);
            })
            .catch((error) => {
                console.error("Failed to load models:", error);
                const defaultModels = ["gpt-4.1-mini"];
                setModels(defaultModels);
                setSelectedModel(defaultModels[0]);
                setModelsLoading(false);
            });
    }, []);

    return (
        <header className={styles.header}>
            <div className={styles.logo}>💬 Chat Bob</div>
            <div className={styles.controls}>
                <select
                    className={styles.selectModel}
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    disabled={modelsLoading}
                >
                    {modelsLoading ? (
                        <option>Loading models...</option>
                    ) : (
                        models.map((model) => (
                            <option key={model} value={model}>
                                {model}
                            </option>
                        ))
                    )}
                </select>
                <button
                    className={styles.newChatBtn}
                    onClick={resetChat}
                    disabled={modelsLoading}
                >
                    New Chat
                </button>
            </div>
        </header>
    )
}
