"use client";

import { useState, useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import Spinner from "@/components/ui/Spinner";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id?: string;
  role: "USER" | "ASSISTANT";
  content: string;
}

const SUGGESTIONS = [
  "Help me find the best programs for Computer Science",
  "What scholarships are available for Bangladeshi students?",
  "Compare studying in Canada vs Australia",
  "What IELTS score do I need for top UK universities?",
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch("/api/chat");
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages ?? []);
        }
      } catch {
        // Ignore - fresh chat
      }
      setHistoryLoaded(true);
    }
    loadHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (content: string) => {
    const userMsg: Message = { role: "USER", content };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [...prev, { role: "ASSISTANT", content: data.message }]);
      } else {
        toast.error(data.error ?? "Failed to get response");
      }
    } catch {
      toast.error("Failed to send message");
    }

    setLoading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const programData = e.dataTransfer.getData("program");
    if (programData) {
      try {
        const program = JSON.parse(programData);
        handleSend(`Tell me more about the "${program.name}" program at ${program.university}. What are the requirements, and is it a good fit for me?`);
      } catch {
        // Invalid data
      }
    }
  };

  return (
    <div
      className="flex flex-col h-[calc(100vh-8rem)]"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && historyLoaded && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 mb-4">
              <Sparkles className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              AI Education Counselor
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Ask me anything about studying abroad, programs, scholarships, visa, or university life.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSend(suggestion)}
                  className="text-left p-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <ChatMessage key={idx} role={msg.role} content={msg.content} />
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-gray-500">
            <Spinner size="sm" />
            <span className="text-sm">Thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-4 bg-white dark:bg-gray-950">
        <ChatInput onSend={handleSend} disabled={loading} />
        <p className="text-xs text-gray-400 text-center mt-2">
          Drag a program card here to ask about it. AI responses are for guidance only.
        </p>
      </div>
    </div>
  );
}
