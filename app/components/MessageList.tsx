"use client";

import { useRef, useEffect } from "react";
import { Bot, User } from "lucide-react";
import { ChatMessage } from "../../lib/api";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

/* Renders the full message thread or the welcome empty state */
export default function MessageList({ messages, isLoading }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* Empty state — shown before any message is sent */
  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 -mt-20">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
          <Bot className="w-10 h-10" />
        </div>
        <div className="text-center space-y-2 mt-2">
          <h2 className="text-2xl font-bold">Hi, I'm MedChat.</h2>
          <p className="text-[15px] text-gray-500 dark:text-gray-400">How can I help you today?</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 py-6 pb-20">
      {messages.map((msg, i) => (
        <div key={i} className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
          {/* Bot avatar on the left for assistant messages */}
          {msg.role === "assistant" && (
            <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white">
              <Bot className="w-5 h-5" />
            </div>
          )}

          {/* Message bubble */}
          <div
            className={`px-4 py-2.5 rounded-2xl max-w-[85%] ${
              msg.role === "user"
                ? "bg-blue-600 text-white rounded-br-sm"
                : "bg-gray-100 dark:bg-white/5 rounded-bl-sm"
            }`}
          >
            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
          </div>

          {/* User avatar on the right for user messages */}
          {msg.role === "user" && (
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 flex-shrink-0 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
          )}
        </div>
      ))}

      {/* Typing indicator while waiting for AI response */}
      {isLoading && (
        <div className="flex gap-4 justify-start">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white">
            <Bot className="w-5 h-5" />
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-gray-100 dark:bg-white/5 rounded-bl-sm flex items-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
            </div>
          </div>
        </div>
      )}

      {/* Invisible anchor for auto-scroll */}
      <div ref={endRef} />
    </div>
  );
}
