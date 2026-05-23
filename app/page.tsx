"use client";

import React, { useState, useEffect } from "react";
import { Menu, Plus, Globe, Brain, ArrowUp, SquarePen, Bot, Search, PanelLeftClose, MoreHorizontal, Sun, Moon, MessageSquarePlus } from "lucide-react";
import { useTheme } from "next-themes";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
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
        className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-[#f9f9f9] dark:bg-[#1a1a1a] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col border-r border-gray-200 dark:border-white/5 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
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
          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-white/10 dark:hover:bg-white/20 text-sm font-medium transition-colors">
            <MessageSquarePlus className="w-4 h-4" />
            New chat
          </button>
        </div>

        {/* Scrollable History List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6 sidebar-scroll">
          
          {/* Group: Yesterday */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-1">Yesterday</h3>
            <ul className="space-y-1">
              <li>
                <button className="w-full text-left px-2 py-2 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-white/5 truncate transition-colors">
                  Four Ws in Software Engineering
                </button>
              </li>
            </ul>
          </div>

          {/* Group: 30 Days */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-1">30 Days</h3>
            <ul className="space-y-1">
              <li>
                <button className="w-full text-left px-2 py-2 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-white/5 truncate transition-colors">
                  Software Construction and Evo...
                </button>
              </li>
              <li>
                <button className="w-full text-left px-2 py-2 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-white/5 truncate transition-colors">
                  Software Construction Evolutio...
                </button>
              </li>
              <li>
                <button className="w-full text-left px-2 py-2 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-white/5 truncate transition-colors">
                  Android PNG compilation error ...
                </button>
              </li>
              <li>
                <button className="w-full text-left px-2 py-2 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-white/5 truncate transition-colors">
                  KNN weight prediction for ID11
                </button>
              </li>
              <li>
                <button className="w-full text-left px-2 py-2 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-white/5 truncate transition-colors">
                  Data Mining Mini Project Propo...
                </button>
              </li>
            </ul>
          </div>

          {/* Group: 2026-04 */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-1">2026-04</h3>
            <ul className="space-y-1">
              <li>
                <button className="w-full text-left px-2 py-2 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-white/5 truncate transition-colors">
                  Decision Tree with Temperature
                </button>
              </li>
              <li>
                <button className="w-full text-left px-2 py-2 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-white/5 truncate transition-colors">
                  Image Source Inquiry Assistance
                </button>
              </li>
              <li>
                <button className="w-full text-left px-2 py-2 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-white/5 truncate transition-colors">
                  Nurse CV structure advice
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
              K
            </div>
            <span className="text-sm font-medium">K Dreamers</span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={toggleTheme} 
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-md transition-colors text-gray-500 dark:text-gray-400"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-md transition-colors text-gray-500 dark:text-gray-400">
              <MoreHorizontal className="w-5 h-5" />
            </button>
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
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
            <SquarePen className="w-5 h-5" />
          </button>
        </header>

        {/* Main Body Area */}
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="flex flex-col items-center gap-4 -mt-20">
            {/* Logo Placeholder */}
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
        </main>

        {/* Bottom Input Area */}
        <div className="p-4 w-full max-w-3xl mx-auto pb-6">
          <div className="bg-[#f4f4f4] dark:bg-[#1f1f1f] rounded-3xl p-3 shadow-sm border border-transparent dark:border-white/5 transition-colors duration-200">
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message MedChat..."
                className="w-full bg-transparent text-[16px] outline-none px-2 py-1 placeholder-gray-500 dark:placeholder-gray-400"
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors">
                    <Brain className="w-4 h-4" />
                    <span>DeepThink (R1)</span>
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
                    className={`p-2 rounded-full transition-colors ${
                      message.trim() 
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
