"use client";

import { Brain, Globe, Plus, ArrowUp } from "lucide-react";

interface ChatInputProps {
  message: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
}

/* Bottom input bar with DeepThink/Search toggles and send button */
export default function ChatInput({ message, isLoading, onChange, onSend }: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Send on Enter, allow Shift+Enter for newlines
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const canSend = !!message.trim() && !isLoading;

  return (
    <div className="p-4 w-full max-w-3xl mx-auto pb-6">
      <div className="bg-[#f4f4f4] dark:bg-[#1f1f1f] rounded-3xl p-3 shadow-sm border border-transparent dark:border-white/5 transition-colors duration-200">
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message MedChat..."
            className="w-full bg-transparent text-[16px] outline-none px-2 py-1 placeholder-gray-500 dark:placeholder-gray-400"
          />

          <div className="flex items-center justify-between">
            {/* Feature toggles */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors">
                <Brain className="w-4 h-4" />
                <span>DeepThink</span>
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-sm font-medium transition-colors">
                <Globe className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                <span className="text-blue-600 dark:text-blue-500">Search</span>
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500 dark:text-gray-400">
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={onSend}
                disabled={!canSend}
                className={`p-2 rounded-full transition-colors ${
                  canSend
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 dark:bg-gray-600 text-white cursor-default"
                }`}
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
