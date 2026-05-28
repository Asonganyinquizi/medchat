"use client";

import { Menu, SquarePen } from "lucide-react";

interface ChatHeaderProps {
  onOpenSidebar: () => void;
  onNewChat: () => void;
}

/* Top bar: hamburger menu | title | new chat icon */
export default function ChatHeader({ onOpenSidebar, onNewChat }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/10">
      <button
        onClick={onOpenSidebar}
        className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      <h1 className="text-[17px] font-semibold tracking-wide">New chat</h1>

      <button
        onClick={onNewChat}
        className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
      >
        <SquarePen className="w-5 h-5" />
      </button>
    </header>
  );
}
