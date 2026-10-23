import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bot,
  Sparkles,
  Send,
  BookOpen,
  HelpCircle,
  Lightbulb,
  FileText,
  Flame,
  CheckCircle,
  User
} from 'lucide-react';

export const AIAssistantView: React.FC = () => {
  const { chatMessages, sendMessage, isAiTyping } = useApp();
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  const promptShortcuts = [
    { label: 'Create a study plan for my exams', icon: '📅' },
    { label: 'Summarize this topic', icon: '📑' },
    { label: 'Explain a concept', icon: '💡' },
    { label: 'Generate practice questions', icon: '📝' },
    { label: 'Help me stay consistent', icon: '🤝' },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-sm">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>Study Helper</span>
              <Sparkles className="w-4 h-4 text-purple-600 fill-purple-600" />
            </h1>
            <p className="text-xs text-slate-400">On-device study prompts and note helpers</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Works locally</span>
        </span>
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto py-5 space-y-5 pr-2">
        {chatMessages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                  isUser
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-100 text-purple-700'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-purple-600 text-white rounded-tr-none'
                    : 'bg-white border border-slate-100 text-slate-800 shadow-sm rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">{msg.content}</div>

                {/* Quick Prompts list if present on first greeting */}
                {msg.prompts && msg.prompts.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100/80 space-y-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Suggested Prompts:
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {promptShortcuts.map((p) => (
                        <button
                          key={p.label}
                          onClick={() => sendMessage(p.label)}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-50/70 hover:bg-purple-100 text-purple-900 text-xs font-semibold transition-all text-left group"
                        >
                          <span className="text-sm group-hover:scale-110 transition-transform">
                            {p.icon}
                          </span>
                          <span>{p.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* AI Typing Indicator */}
        {isAiTyping && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="pt-3 border-t border-slate-100 shrink-0">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask for a plan, explain a topic, or paste notes to summarize..."
            className="w-full pl-5 pr-14 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="absolute right-2 p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm disabled:opacity-40 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
