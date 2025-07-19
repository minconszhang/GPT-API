'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { ChatContext } from '../context/ChatContext';
import { Textarea } from '@/components/ui/textarea';
import { twMerge } from 'tailwind-merge';

export const ChatClient = () => {
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { selectedModel, isNewChat, setIsNewChat } = useContext(ChatContext);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<
        { sender: string; text: string }[]
    >([]);
    const [promptTokens, setPromptTokens] = useState(0);
    const [completionTokens, setCompletionTokens] = useState(0);
    const [input, setInput] = useState('');

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
            setInput('');
            setIsNewChat(false);
        }
    }, [isNewChat]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setMessages(prev => [
            ...prev,
            { sender: 'user', text: input },
            { sender: 'bot', text: '' },
        ]);
        setInput('');
        setLoading(true);

        try {
            const baseUrl = '/api/chat';
            const params = new URLSearchParams({
                model: selectedModel,
                userMessage: input,
            });
            if (conversationId) {
                params.append('conversationId', conversationId);
            }
            const url = `${baseUrl}?${params.toString()}`;

            const es = new EventSource(url);
            let fullText = '';

            es.addEventListener('meta', event => {
                const meta = JSON.parse(event.data);
                setConversationId(meta.conversationId);
                setPromptTokens(prev => prev + meta.inputTokens);
                setCompletionTokens(prev => prev + meta.outputTokens);
            });

            es.onmessage = event => {
                if (event.data === '[DONE]') {
                    setLoading(false);
                    es.close();
                    return;
                }
                fullText += event.data;
                setMessages(prev => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    if (last && last.sender === 'bot') {
                        updated[updated.length - 1] = {
                            ...last,
                            text: fullText,
                        };
                    }
                    return updated;
                });
            };

            es.onerror = () => {
                setLoading(false);
                es.close();
                setMessages(prev => [
                    ...prev,
                    { sender: 'bot', text: 'Oops, something went wrong.' },
                ]);
            };
        } catch (err) {
            console.error(err);
            setMessages(prev => [
                ...prev,
                { sender: 'bot', text: 'Oops, something went wrong.' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <main
                ref={scrollRef}
                className='flex-1 mx-auto w-full overflow-y-auto p-4 flex flex-col gap-3 md:w-1/2'
            >
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={twMerge(
                            'max-w-full whitespace-pre-wrap overflow-wrap-anywhere word-break-break-word text-md font-light',
                            msg.sender === 'user'
                                ? 'px-4 py-1.5 self-end bg-gray-100 text-black rounded-2xl'
                                : 'self-start text-black'
                        )}
                    >
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                ))}
                {loading && (
                    <p className='text-center text-muted italic'>
                        Bob is thinking...
                    </p>
                )}
            </main>

            <footer className='w-full mx-auto p-6 bg-background md:w-1/2'>
                <form className='flex gap-2'>
                    <Textarea
                        className='rounded-2xl resize-none focus-visible:ring-0 focus-visible:ring-offset-0'
                        value={input}
                        onChange={e => {
                            setInput(e.target.value);

                            e.target.style.height = 'auto';
                            const maxHeight = 200;
                            const scrollHeight = e.target.scrollHeight;
                            e.target.style.height =
                                Math.min(scrollHeight, maxHeight) + 'px';
                        }}
                        placeholder='Type a message...'
                        onKeyDown={e => {
                            // Skip handling if this is part of IME composition
                            if (e.nativeEvent.isComposing) {
                                return;
                            }

                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (input.trim() && !loading) {
                                    // Create a synthetic form event
                                    const formEvent = {
                                        preventDefault: () => {},
                                    } as React.FormEvent;
                                    handleSubmit(formEvent);
                                }
                            }
                        }}
                        rows={1}
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className='self-center rounded-full cursor-pointer'
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
                        <img 
                            src="/arrow-up-circle.svg" 
                            alt="Send message" 
                            width={20} 
                            height={20}
                            className="size-9"
                        />
                    </Button>
                </form>
                <div className='mt-1 flex justify-end gap-4 text-sm text-muted'>
                    <span>Prompt: {promptTokens}</span>
                    <span>Completion: {completionTokens}</span>
                </div>
            </footer>
        </>
    );
};
