"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { useLocale } from "@/contexts/locale-context";

type ChatMessage = { role: "user" | "assistant"; content: string };

export function Chatbot() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: messages }),
      });
      const data = await res.json();
      if (res.ok && data.reply) {
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
      } else {
        const errMsg = data.error || t("chat.error");
        setMessages([...newMessages, { role: "assistant", content: `⚠️ ${errMsg}` }]);
      }
    } catch {
      setMessages([...newMessages, { role: "assistant", content: `⚠️ ${t("chat.error")}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg glow-cyan"
        style={{ background: "oklch(0.75 0.18 200)" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI Chat"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="size-5 text-white" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="size-5 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: "oklch(0.16 0.04 265)", border: "1px solid oklch(0.30 0.04 265 / 0.5)" }}
          >
            {/* Header */}
            <div className="px-4 py-3 flex items-center gap-3" style={{ background: "oklch(0.20 0.045 265)", borderBottom: "1px solid oklch(0.30 0.04 265 / 0.4)" }}>
              <div className="p-2 rounded-xl" style={{ background: "oklch(0.75 0.18 200 / 0.15)" }}>
                <Bot className="size-4" style={{ color: "oklch(0.75 0.18 200)" }} />
              </div>
              <div>
                <h3 className="text-sm font-semibold">{t("chat.title")}</h3>
                <p className="text-[10px]" style={{ color: "oklch(0.60 0.02 200)" }}>Online</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="h-80 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="p-3 rounded-2xl mx-auto mb-3 animate-pulse-glow" style={{ background: "oklch(0.75 0.18 200 / 0.1)", width: "fit-content" }}>
                    <Bot className="size-8" style={{ color: "oklch(0.75 0.18 200)" }} />
                  </div>
                  <p className="text-xs" style={{ color: "oklch(0.60 0.02 220)" }}>
                    {t("chat.welcome")}
                  </p>
                </div>
              )}
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="shrink-0 p-1.5 rounded-lg mt-0.5" style={{ background: "oklch(0.75 0.18 200 / 0.12)" }}>
                      <Bot className="size-3" style={{ color: "oklch(0.75 0.18 200)" }} />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                      msg.role === "user" ? "rounded-br-md" : "rounded-bl-md"
                    }`}
                    style={
                      msg.role === "user"
                        ? { background: "oklch(0.75 0.18 200)", color: "oklch(0.13 0.04 265)" }
                        : { background: "oklch(0.22 0.035 265)", border: "1px solid oklch(0.30 0.04 265 / 0.4)" }
                    }
                  >
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="shrink-0 p-1.5 rounded-lg mt-0.5" style={{ background: "oklch(0.82 0.16 85 / 0.12)" }}>
                      <User className="size-3" style={{ color: "oklch(0.82 0.16 85)" }} />
                    </div>
                  )}
                </motion.div>
              ))}
              {loading && (
                <div className="flex gap-2 items-start">
                  <div className="shrink-0 p-1.5 rounded-lg" style={{ background: "oklch(0.75 0.18 200 / 0.12)" }}>
                    <Bot className="size-3" style={{ color: "oklch(0.75 0.18 200)" }} />
                  </div>
                  <div className="px-3 py-2 rounded-2xl rounded-bl-md" style={{ background: "oklch(0.22 0.035 265)", border: "1px solid oklch(0.30 0.04 265 / 0.4)" }}>
                    <Loader2 className="size-3 animate-spin" style={{ color: "oklch(0.60 0.02 220)" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 flex gap-2" style={{ borderTop: "1px solid oklch(0.30 0.04 265 / 0.4)" }}>
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
                placeholder={t("chat.placeholder")}
                className="flex-1 h-9 text-xs rounded-xl"
                style={{ background: "oklch(0.22 0.035 265)", border: "1px solid oklch(0.30 0.04 265 / 0.4)" }}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                size="icon"
                className="h-9 w-9 rounded-xl shrink-0"
                style={{ background: "oklch(0.75 0.18 200)", color: "white" }}
              >
                <Send className="size-3.5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
