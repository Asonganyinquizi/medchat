"use client";

import React, { useState, useEffect, useRef } from "react";
import { Menu, Plus, Globe, Brain, ArrowUp, SquarePen, Bot, Search, PanelLeftClose, MoreHorizontal, Sun, Moon, MessageSquarePlus, User, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { api, ChatMessage, ChatSession, AuthUser, getUser, clearAuth } from "../lib/api";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fallback for generating UUID on non-HTTPS mobile devices
  const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  useEffect(() => {
    setMounted(true);
    const user = getUser();
    if (user) {
      setAuthUser(user);
      loadSessions();
    }
    setCurrentSessionId(generateUUID());
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadSessions = async () => {
    try {
      const data = await api.getAllSessions();
      setSessions(data);
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
      const data = await api.getSessionMessages(id);
      setMessages(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    if (!authUser) {
      router.push("/login");
      return;
    }

    const userMsg = message.trim();
    setMessage("");
    setIsLoading(true);

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMsg,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);

    try {
      const res = await api.sendMessage(currentSessionId, userMsg);
      setMessages(prev => [...prev, {
        id: Date.now().toString() + 'ai',
        role: 'assistant',
        content: res.reply,
        timestamp: res.timestamp
      }]);
      loadSessions(); // refresh sidebar in case a new session was created
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  if (!mounted) return null;

  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-white dark:bg-black text-black dark:text-white transition-colors duration-200">

      {/* Sidebar Overlay (Backdrop) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-[#f9f9f9] dark:bg-[#1a1a1a] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col border-r border-gray-200 dark:border-white/5 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-500 font-bold text-lg">
            <Bot className="w-6 h-6" />
            <span>medChat</span>
          </div>
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
            <button className="hover:text-black dark:hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button
              className="hover:text-black dark:hover:text-white transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="px-3 py-2">
          <button onClick={startNewChat} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-white/10 dark:hover:bg-white/20 text-sm font-medium transition-colors">
            <MessageSquarePlus className="w-4 h-4" />
            New chat
          </button>
        </div>

        {/* Scrollable History List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6 sidebar-scroll">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-1">Past Chats</h3>
            <ul className="space-y-1">
              {sessions.map(session => (
                <li key={session.id}>
                  <button
                    onClick={() => loadSession(session.id)}
                    className={`w-full text-left px-2 py-2 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-white/5 truncate transition-colors ${currentSessionId === session.id ? 'bg-gray-200 dark:bg-white/10' : ''}`}
                  >
                    {session.summary || "New Chat"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {authUser ? (
              <>
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                  {authUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium truncate max-w-[120px]">{authUser.name}</span>
              </>
            ) : (
              <button onClick={() => router.push("/login")} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                Sign in to save chats
              </button>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
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

      {/* Main Content (Pushed behind sidebar slightly or overlaid) */}
      <div className="flex flex-col flex-1 h-full w-full">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/10">
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-[17px] font-semibold tracking-wide">New chat</h1>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors" onClick={startNewChat}>
            <SquarePen className="w-5 h-5" />
          </button>
        </header>

        {/* Main Body Area */}
        <main className="flex-1 flex flex-col overflow-y-auto p-4 md:px-20 lg:px-48 relative">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 -mt-20">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Bot className="w-10 h-10" />
              </div>
              <div className="text-center space-y-2 mt-2">
                <h2 className="text-2xl font-bold">Hi, I'm MedChat.</h2>
                <p className="text-[15px] text-gray-500 dark:text-gray-400">
                  How can I help you today?
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-6 py-6 pb-20">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white">
                      <Bot className="w-5 h-5" />
                    </div>
                  )}
                  <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] ${msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-gray-100 dark:bg-white/5 rounded-bl-sm'
                    }`}>
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 flex-shrink-0 flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4 justify-start">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="px-4 py-2.5 rounded-2xl bg-gray-100 dark:bg-white/5 rounded-bl-sm flex items-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* Bottom Input Area */}
        <div className="p-4 w-full max-w-3xl mx-auto pb-6">
          <div className="bg-[#f4f4f4] dark:bg-[#1f1f1f] rounded-3xl p-3 shadow-sm border border-transparent dark:border-white/5 transition-colors duration-200">
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message MedChat..."
                className="w-full bg-transparent text-[16px] outline-none px-2 py-1 placeholder-gray-500 dark:placeholder-gray-400"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors">
                    <Brain className="w-4 h-4" />
                    <span>DeepThink</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors">
                    <Globe className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                    <span className="text-blue-600 dark:text-blue-500">Search</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500 dark:text-gray-400">
                    <Plus className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={!message.trim() || isLoading}
                    className={`p-2 rounded-full transition-colors ${message.trim() && !isLoading
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
      </div>
    </div>
  );
}
