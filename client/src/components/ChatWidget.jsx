import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { askAI } from "../store/slices/chatSlice.js";
import Spinner from "./Spinner.jsx";

const QUICK = [
  "What's healthy for breakfast?",
  "milk",
  "Best snacks under ₹200",
  "Weekly sabzi list",
];

export function ChatWidget() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { messages, isLoading } = useSelector((state) => state.chat);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, isLoading, open]);

  const send = (text) => {
    const q = (text || input).trim();
    if (!q || isLoading) return;
    setInput("");
    dispatch(askAI(q));
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-primary text-white shadow-xl shadow-primary/40 flex items-center justify-center hover:bg-primary-dark active:scale-90 transition-all"
        aria-label="AI Assistant"
      >
        {open ? <X size={24} /> : <Sparkles size={24} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-4 left-4 sm:left-auto sm:w-[380px] z-50 bg-white rounded-3xl shadow-2xl border border-line overflow-hidden animate-slide-up flex flex-col max-h-[560px]">
          <div className="bg-primary text-white px-5 py-4 flex items-center gap-3">
            <span className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot size={22} />
            </span>
            <div className="flex-1">
              <p className="font-bold">Bazar AI</p>
              <p className="text-xs text-white/80 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-300 animate-pulse" />
                Online — ask me anything about our products
              </p>
            </div>
          </div>

          <div ref={bodyRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface/50">
            {messages.length === 0 && (
              <>
                <div className="bg-white rounded-2xl rounded-tl-sm p-3 text-sm text-muted shadow-sm animate-fade-up">
                  Hello! 👋 I'm your shopping assistant. Ask me things like:
                </div>
                {QUICK.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    disabled={!isAuthenticated}
                    className="block text-left bg-white rounded-2xl rounded-tr-sm px-3 py-2.5 text-sm shadow-sm hover:border-primary border border-transparent transition disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.from === "ai" && (
                  <span className="h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center mr-1.5 shrink-0 mt-1">
                    <Bot size={13} />
                  </span>
                )}
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 text-sm rounded-2xl shadow-sm animate-fade-up ${
                    m.from === "user"
                      ? "bg-primary text-white rounded-br-sm"
                      : "bg-white text-ink rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 bg-white rounded-2xl px-3.5 py-3 w-fit shadow-sm">
                <Spinner size="sm" />
                <span className="text-xs text-muted">Thinking...</span>
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="p-3 border-t border-line flex items-center gap-2 bg-white"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Try 'healthy breakfast ideas'..."
                className="flex-1 bg-surface rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark disabled:opacity-40 transition shrink-0"
              >
                <Send size={17} />
              </button>
            </form>
          ) : (
            <div className="p-3 border-t border-line bg-white">
              <Link
                to="/login"
                className="block text-center bg-primary text-white font-bold text-sm py-3 rounded-xl hover:bg-primary-dark transition"
              >
                Login to chat with AI assistant
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}