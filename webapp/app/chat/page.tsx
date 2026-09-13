"use client";
// app/chat/page.tsx — AI Counselor chat interface
// Protected route. Sends questions to POST /api/ai/ask.
// AI responses can be long — rendered with preserved whitespace.

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import ProtectedRoute from "@/components/ProtectedRoute";
import { askAI } from "@/lib/api";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <ChatInterface />
    </ProtectedRoute>
  );
}

function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Hi! I'm your CampusCompass AI counselor. I can help you choose between colleges, understand what a stream leads to, compare fees, or just think through your options. What's on your mind?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on initial render
  useEffect(() => {
    const savedChat = localStorage.getItem("cc_chat_history");
    if (savedChat) {
      try {
        setMessages(JSON.parse(savedChat));
      } catch (e) {
        console.error("Failed to parse chat history");
      }
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    // Only save if there's an actual conversation (more than just the default greeting)
    if (messages.length > 1) {
      localStorage.setItem("cc_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);

    try {
      const data = await askAI(question) as { answer: string };
      setMessages((prev) => [...prev, { role: "ai", content: data.answer }]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Try again.";
      setMessages((prev) => [...prev, { role: "ai", content: msg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift — Shift+Enter = new line)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[100dvh] bg-[#F5F3EE] flex flex-col pt-16">
      <style dangerouslySetInnerHTML={{ __html: `
        body { overflow: hidden; }
        footer { display: none !important; }
      `}} />
      {/* Header */}
      <div className="bg-[#16213E] px-6 py-5">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-white text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            AI Counselor
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Ask anything about colleges, streams, or your career path.
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "ai" && (
                <div className="w-8 h-8 rounded-full bg-[#3D7A6B] flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mr-3 mt-1">
                  CC
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-xl px-5 py-4 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#16213E] text-white rounded-tr-sm"
                    : "bg-white border border-slate-100 text-[#16213E] rounded-tl-sm"
                }`}
              >
                {/* AI responses preserve whitespace and line breaks for readability */}
                {msg.role === "ai" ? (
                  <div className="markdown-content ai-message-content space-y-3">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-[#3D7A6B] flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mr-3">
                CC
              </div>
              <div className="bg-white border border-slate-100 rounded-xl rounded-tl-sm px-5 py-4">
                <div className="flex gap-1.5 items-center h-5">
                  <span className="w-2 h-2 bg-[#3D7A6B] rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-[#3D7A6B] rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-[#3D7A6B] rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 bg-white px-4 py-4">
        <div className="max-w-3xl mx-auto flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Ask about colleges, streams, fees, career paths…"
            className="flex-1 resize-none border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#16213E] focus:outline-none focus:border-[#3D7A6B] focus:ring-1 focus:ring-[#3D7A6B] max-h-32 overflow-y-auto"
            style={{ scrollbarWidth: "none" }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#3D7A6B] text-white flex items-center justify-center hover:bg-[#4a9180] transition-colors disabled:opacity-40"
            aria-label="Send message"
          >
            <svg className="w-4 h-4 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-center text-xs text-slate-400 mt-2">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
