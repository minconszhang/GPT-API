"use client";

import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface HeaderProps {
    modelList: string[];
}


export const Header = ({ modelList }: HeaderProps) => {
    const { selectedModel, setSelectedModel, setIsNewChat } = useContext(ChatContext);

    return (
        <header className="flex justify-between items-center px-4 py-2 bg-background shadow-md">
            <div className="text-2xl">💬 BOB</div>
            <div className="flex gap-4 items-center">
                <Select
                    value={selectedModel}
                    onValueChange={(value) => setSelectedModel(value)}
                >
                    <SelectTrigger className="hover:bg-gray-100 focus:ring-0 focus-visible:ring-0 ">
                        <SelectValue placeholder="Select a model" />
                    </SelectTrigger>

                    <SelectContent>
                        {modelList.map((model) => (
                            <SelectItem key={model} value={model}>
                                {model}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button
                    className="cursor-pointer"
                    variant="outline"
                    onClick={() => setIsNewChat(true)}
                >
                    New Chat
                </Button>
            </div>
        </header>
    )
}
