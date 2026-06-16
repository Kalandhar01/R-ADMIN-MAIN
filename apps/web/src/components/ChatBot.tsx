"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { searchKnowledge, getGreeting } from "@/data/chatBotData";

interface Message {
  role: "user" | "bot";
  text: string;
}

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "bot", text: getGreeting() }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const q = input.trim();
    if (!q) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setLoading(true);

    setTimeout(() => {
      const result = searchKnowledge(q);
      let reply: string;
      if (!result) {
        reply = "I don't have information about that. Please ask me about our services — Architecture, Construction, Real Estate, Import & Export, OTC Exchange, or any of our sub-services.";
        setMessages((prev) => [...prev, { role: "bot", text: reply }]);
      } else {
        reply = result.reply;
        setMessages((prev) => [...prev, { role: "bot", text: reply }]);
      }
      setLoading(false);

      fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, answer: reply, pageUrl: window.location.href }),
      }).catch(() => {});
    }, 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[999] bg-black/20 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none" onClick={() => setOpen(false)} />
      )}

      <div
        className={`fixed z-[1000] bottom-24 right-4 sm:right-6 md:bottom-28 md:right-8 w-[calc(100vw-2rem)] sm:w-[380px] md:w-[420px] transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-6 opacity-0 pointer-events-none"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col overflow-hidden rounded-[16px] border border-[#d8bf82]/50 bg-[#fffefa] shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
          <div className="flex items-center justify-between bg-[#8B0E14] px-4 py-3.5 text-[#fff8ec]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">Ractysh Assistant</p>
                <p className="text-[0.65rem] font-medium leading-tight text-[#fff8ec]/70">Ask about our services</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex min-h-[320px] max-h-[420px] flex-col gap-3 overflow-y-auto p-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[88%] rounded-[12px] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-[#8B0E14] text-[#fff8ec] rounded-br-[4px]"
                      : "bg-[#f5ede0] text-[#2a241e] rounded-bl-[4px]"
                  }`}
                >
                  {msg.text.split("\n").map((line, j) => {
                    if (line.startsWith("**") && line.endsWith("**")) {
                      return (
                        <p key={j} className="font-semibold text-[#8B0E14]">
                          {line.slice(2, -2)}
                        </p>
                      );
                    }
                    if (line.includes("(") && line.endsWith(")")) {
                      return (
                        <p key={j} className="text-[0.7rem] font-medium uppercase tracking-wide text-[#8B0E14]/60">
                          {line}
                        </p>
                      );
                    }
                    return <p key={j}>{line}</p>;
                  })}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-[12px] rounded-bl-[4px] bg-[#f5ede0] px-3.5 py-2.5 text-sm text-[#2a241e]">
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8B0E14]/40" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8B0E14]/40" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8B0E14]/40" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="flex items-center gap-2 border-t border-[#d8bf82]/30 px-3 py-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about our services..."
              className="flex-1 bg-transparent px-2 py-1.5 text-sm text-[#2a241e] outline-none placeholder:text-[#9a8a78]"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8B0E14] text-white transition hover:bg-[#741016] disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed z-[1000] bottom-6 right-4 sm:right-6 md:bottom-8 md:right-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#8B0E14] text-white shadow-[0_8px_32px_rgba(139,14,20,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(139,14,20,0.4)] active:scale-95"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </>
  );
}
