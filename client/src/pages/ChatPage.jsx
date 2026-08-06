import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ArrowLeft, Bot, Eraser, Send, Sparkles } from "lucide-react";
import { askAI, clearChat } from "../store/slices/chatSlice.js";
import Spinner from "../components/Spinner.jsx";

const SUGGESTIONS = [
  { icon: "🥛", text: "milk" },
  { icon: "🍞", text: "bread" },
  { icon: "🥦", text: "vegetables for the week" },
  { icon: "🍿", text: "snacks under ₹200" },
  { icon: "💪", text: "healthy breakfast ideas" },
  { icon: "🎂", text: "something sweet" },
];

const QUICK_START = [
  { icon: "🥛", label: "Dairy", msg: "best dairy products" },
  { icon: "🍞", label: "Bakery", msg: "fresh bakery items" },
  { icon: "🍎", label: "Fruits", msg: "fresh fruits" },
  { icon: "🍿", label: "Snacks", msg: "snacks under ₹200" },
  { icon: "🥦", label: "Vegetables", msg: "vegetables for the week" },
  { icon: "🧃", label: "Beverages", msg: "cold drinks and juices" },
];

export default function ChatPage() {
  const dispatch = useDispatch();
  const { messages, isLoading } = useSelector((state) => state.chat);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [input, setInput] = useState("");
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const send = (text) => {
    const q = (text || input).trim();
    if (!q || isLoading) return;
    setInput("");
    dispatch(askAI(q));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-6">
      <Link
        to="/"
        className="flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink mb-5 transition"
      >
        <ArrowLeft size={16} /> Back to store
      </Link>

      <div className="bg-white rounded-3xl border border-line overflow-hidden shadow-xl shadow-primary/5 flex flex-col h-[calc(100vh-260px)] min-h-[420px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-emerald-600 text-white px-6 py-5 flex items-center gap-4">
          <span className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <Bot size={26} />
          </span>
          <div className="flex-1">
            <h1 className="font-extrabold text-lg">Bazar AI Assistant</h1>
            <p className="text-xs text-white/85 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-300 animate-pulse" />
              Online · Knows every product in our store
            </p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={() => dispatch(clearChat())}
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-xs font-bold px-3 py-2 rounded-full transition"
              title="Clear chat"
            >
              <Eraser size={13} /> Clear
            </button>
          )}
        </div>

        {/* Messages */}
        <div ref={bodyRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-surface/60">
          {messages.length === 0 && (
            <div className="py-6 animate-fade-up">
              <div className="text-center">
                <span className="inline-flex h-16 w-16 rounded-full bg-primary-light items-center justify-center text-3xl mb-4">
                  🤖
                </span>
                <p className="font-extrabold text-xl">Hello! 👋 How can I help you shop?</p>
                <p className="text-sm text-muted mt-1.5 max-w-sm mx-auto">
                  Ask for product ideas, healthy combos, budget-friendly picks or anything else —
                  I'll search the store for you.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-xl mx-auto">
                {QUICK_START.map((q) => (
                  <button
                    key={q.label}
                    onClick={() => send(q.msg)}
                    disabled={!isAuthenticated || isLoading}
                    className="flex items-center gap-2.5 bg-white rounded-2xl border border-line px-4 py-3 text-left hover:border-primary hover:shadow-md hover:-translate-y-0.5 transition disabled:opacity-50"
                  >
                    <span className="text-2xl">{q.icon}</span>
                    <span>
                      <span className="block text-sm font-bold">{q.label}</span>
                      <span className="block text-[10px] text-muted">Ask AI</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.from === "user" ? "justify-end" : "justify-start"} animate-fade-up`}
            >
              {m.from === "ai" && (
                <span className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center mr-2 shrink-0 mt-1">
                  <Bot size={15} />
                </span>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 text-sm rounded-2xl shadow-sm ${
                  m.from === "user"
                    ? "bg-primary text-white rounded-br-md"
                    : "bg-white text-ink rounded-bl-md"
                }`}
              >
                {m.from === "ai" && <p className="text-[10px] font-bold text-primary mb-1">BAZAR AI</p>}
                {m.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-3 w-fit shadow-sm">
              <Spinner size="sm" />
              <span className="text-xs text-muted">Searching the store...</span>
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="px-5 py-3 bg-white border-t border-line no-scrollbar overflow-x-auto flex gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.text}
              onClick={() => send(s.text)}
              disabled={!isAuthenticated || isLoading}
              className="shrink-0 text-xs font-bold bg-surface px-3.5 py-2 rounded-full hover:bg-primary-light hover:text-primary transition disabled:opacity-50"
            >
              {s.icon} {s.text}
            </button>
          ))}
        </div>

        {/* Input */}
        {isAuthenticated ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="px-5 py-4 bg-white border-t border-line flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Try "healthy breakfast ideas" or "milk"...'
              className="flex-1 bg-surface rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-4 focus:ring-primary/15 border border-transparent focus:border-primary transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center hover:bg-primary-dark disabled:opacity-40 transition shrink-0"
            >
              <Send size={18} />
            </button>
          </form>
        ) : (
          <div className="px-5 py-4 bg-white border-t border-line">
            <Link
              to="/login"
              className="block text-center bg-primary text-white font-bold py-3.5 rounded-2xl hover:bg-primary-dark transition"
            >
              Login to chat with AI assistant
            </Link>
          </div>
        )}
      </div>

      <div className="mt-4 bg-primary-light rounded-2xl p-4 flex items-start gap-3">
        <Sparkles size={18} className="text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-primary-dark leading-relaxed">
          <b>Pro tip:</b> Ask things like "Weekly sabzi list bana do" or "Weight loss diet ke liye
          essentials?" — the AI gives you a curated list with prices & quantities from real stock.
        </p>
      </div>
    </div>
  );
}
