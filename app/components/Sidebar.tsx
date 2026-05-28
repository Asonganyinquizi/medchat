"use client";

import { Bot, Search, PanelLeftClose, MessageSquarePlus, Sun, Moon, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { AuthUser, ChatSession, clearAuth } from "../../lib/api";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId: string;
  authUser: AuthUser | null;
  onNewChat: () => void;
  onLoadSession: (id: string) => void;
}

export default function Sidebar({
  isOpen, onClose, sessions, currentSessionId, authUser, onNewChat, onLoadSession,
}: SidebarProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <>
      {/* Backdrop overlay — closes sidebar on click */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}

      {/* Sidebar panel */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-[#f9f9f9] dark:bg-[#1a1a1a] shadow-2xl flex flex-col border-r border-gray-200 dark:border-white/5 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header: logo + search/close buttons */}
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-500 font-bold text-lg">
            <Bot className="w-6 h-6" />
            <span>medChat</span>
          </div>
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
            <button className="hover:text-black dark:hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="hover:text-black dark:hover:text-white transition-colors">
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* New chat button */}
        <div className="px-3 py-2">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-white/10 dark:hover:bg-white/20 text-sm font-medium transition-colors"
          >
            <MessageSquarePlus className="w-4 h-4" />
            New chat
          </button>
        </div>

        {/* Scrollable past chats list */}
        <div className="flex-1 overflow-y-auto px-3 py-2 sidebar-scroll">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-1">Past Chats</h3>
          <ul className="space-y-1">
            {sessions.map((session) => (
              <li key={session.id}>
                <button
                  onClick={() => onLoadSession(session.id)}
                  className={`w-full text-left px-2 py-2 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-white/5 truncate transition-colors ${
                    currentSessionId === session.id ? "bg-gray-200 dark:bg-white/10" : ""
                  }`}
                >
                  {session.summary || "New Chat"}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer: user info + theme toggle + logout */}
        <div className="p-3 border-t border-gray-200 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {authUser ? (
              <>
                {/* Avatar with first letter of user's name */}
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                  {authUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium truncate max-w-[120px]">{authUser.name}</span>
              </>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Sign in to save chats
              </button>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-md transition-colors text-gray-500 dark:text-gray-400"
              title="Toggle Theme"
            >
              {resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {authUser && (
              <button
                onClick={handleLogout}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-md transition-colors text-gray-500 dark:text-gray-400"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
