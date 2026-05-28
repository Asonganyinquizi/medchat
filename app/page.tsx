"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, ChatMessage, ChatSession, AuthUser, getUser } from "../lib/api";
import Sidebar from "./components/Sidebar";
import ChatHeader from "./components/ChatHeader";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";

// Fallback UUID generator for non-HTTPS mobile environments
const generateUUID = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      });

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Bootstrap: load user + sessions on mount
  useEffect(() => {
    setMounted(true);
    const user = getUser();
    if (user) {
      setAuthUser(user);
      loadSessions();
    }
    setCurrentSessionId(generateUUID());
  }, []);

  const loadSessions = async () => {
    try {
      setSessions(await api.getAllSessions());
    } catch (e) {
      console.error(e);
    }
  };

  const startNewChat = () => {
    setCurrentSessionId(generateUUID());
    setMessages([]);
    setIsSidebarOpen(false);
  };

  const loadSession = async (id: string) => {
    setCurrentSessionId(id);
    setIsSidebarOpen(false);
    try {
      setMessages(await api.getSessionMessages(id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    // Redirect unauthenticated users to login
    if (!authUser) return router.push("/login");

    const userMsg = message.trim();
    setMessage("");
    setIsLoading(true);

    // Optimistically append the user message
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: userMsg, timestamp: new Date().toISOString() },
    ]);

    try {
      const res = await api.sendMessage(currentSessionId, userMsg);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + "ai", role: "assistant", content: res.reply, timestamp: res.timestamp },
      ]);
      loadSessions(); // refresh sidebar in case a new session was created
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Prevent hydration mismatch from theme
  if (!mounted) return null;

  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-white dark:bg-black text-black dark:text-white transition-colors duration-200">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        authUser={authUser}
        onNewChat={startNewChat}
        onLoadSession={loadSession}
      />

      <div className="flex flex-col flex-1 h-full w-full">
        <ChatHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onNewChat={startNewChat}
        />

        <main className="flex-1 flex flex-col overflow-y-auto p-4 md:px-20 lg:px-48 relative">
          <MessageList messages={messages} isLoading={isLoading} />
        </main>

        <ChatInput
          message={message}
          isLoading={isLoading}
          onChange={setMessage}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}
