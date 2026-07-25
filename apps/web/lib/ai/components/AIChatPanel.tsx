// apps/web/lib/ai/components/AIChatPanel.tsx

import React, { useState } from "react";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { useCopilot } from "../hooks/useAI";

interface AIChatPanelProps {
  copilotType: "PATIENT" | "OPERATIONS" | "CLINICAL" | "FINANCE";
  actorId: string;
}

export default function AIChatPanel({ copilotType, actorId }: AIChatPanelProps) {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: `Hello! I am your LabCircle ${copilotType} Copilot. How can I assist you today?` },
  ]);
  const [prompt, setPrompt] = useState("");
  const { queryCopilot, loading } = useCopilot();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMsg = prompt.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setPrompt("");

    const res = await queryCopilot({ copilotType, prompt: userMsg }, actorId, "User");
    if (res) {
      setMessages((prev) => [...prev, { role: "assistant", content: res.responseText }]);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4 max-w-lg flex flex-col h-96">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          <span>LabCircle {copilotType} Copilot</span>
        </div>
        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
          AI Decision Support
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && <Bot className="h-4 w-4 text-indigo-600 shrink-0 mt-1" />}
            <div className={`p-2.5 rounded-lg max-w-[80%] ${m.role === "user" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-800"}`}>
              {m.content}
            </div>
            {m.role === "user" && <User className="h-4 w-4 text-slate-400 shrink-0 mt-1" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-slate-100 pt-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={`Ask ${copilotType} Copilot...`}
          className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
