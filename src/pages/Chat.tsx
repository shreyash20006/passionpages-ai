import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import {
  Send,
  Bot,
  User,
  Loader2,
  FileText,
  Download,
  BookmarkPlus,
  Sparkles,
  Wand2,
  Image as ImageIcon,
  Copy,
  Check,
  Plus,
} from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useModel } from "../context/ModelContext";
import Mermaid from "../components/Mermaid";
import { NoteRenderer } from "../components/NoteRenderer";
import { useAuth } from "../context/AuthContext";
import { getAuthToken } from "../lib/auth";

type Message = { id: string; role: "user" | "model"; content: string };

// Quick prompt suggestions
const QUICK_PROMPTS = [
  { label: "📝 Notes", prompt: "Generate detailed notes for: " },
  { label: "🃏 Flashcards", prompt: "Create flashcards for: " },
  { label: "❓ Quiz", prompt: "Create a quiz for: " },
  { label: "🔮 Diagram", prompt: "Generate a diagram for: " },
];

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-2 bg-[#1f2937]/80 hover:bg-[#374151] text-slate-300 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 border border-white/10 backdrop-blur-sm shadow-lg"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check size={16} className="text-emerald-400" />
      ) : (
        <Copy size={16} />
      )}
    </button>
  );
};

export default function Chat() {
  const { selectedModel } = useModel();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "model",
      content: JSON.stringify({
        type: "notes",
        title: "Welcome to PassionPages AI! 🚀",
        subject: "Getting Started",
        emoji: "🎯",
        summary:
          "Your AI-powered study assistant. Ask me anything — I'll turn it into beautiful visual notes, flashcards, quizzes, or diagrams!",
        sections: [
          {
            heading: "What can I do?",
            icon: "✨",
            color: "#a855f7",
            body: "I can transform any topic into structured study material instantly.",
            keyPoints: [
              "📝 Generate visual notes with sections & tables",
              "🃏 Create interactive flashcard decks",
              "❓ Build quizzes with instant feedback",
              "🔮 Draw diagrams and mind maps",
            ],
          },
          {
            heading: "How to use",
            icon: "💡",
            color: "#06b6d4",
            body: "Just type any topic below and I'll generate study material for you!",
            keyPoints: [
              'Type "notes on Beta Blockers"',
              'Type "flashcards for Newton\'s Laws"',
              'Type "quiz on Data Structures"',
              'Type "diagram of photosynthesis"',
            ],
            highlight: {
              text: "Use the quick buttons below the input to choose what type of content you want!",
              type: "tip",
            },
          },
        ],
        mnemonic:
          "PassionPages = Passion for Learning + Beautiful Pages of Content!",
      }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [activeTab, setActiveTab] = useState("Notes");
  const [isFocused, setIsFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  // Load chat history
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const token = await getAuthToken();
        const response = await fetch("/api/chat/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const history = await response.json();
          if (history.length > 0)
            setMessages(
              history.map((m: any) => ({
                id: m.id,
                role: m.role,
                content: m.content,
              })),
            );
        }
      } catch (e) {
        console.error("Failed to fetch history:", e);
      }
    };
    fetchHistory();
  }, [user]);

  const saveMessage = async (role: "user" | "model", content: string) => {
    if (!user) return;
    try {
      const token = await getAuthToken();
      await fetch("/api/chat/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role, content }),
      });
    } catch (e) {
      console.error("Failed to save message:", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent, overrideInput?: string) => {
    e.preventDefault();
    const userMsg = (overrideInput || input).trim();
    if (!userMsg || isLoading) return;

    setInput("");
    const newMessages = [
      ...messages,
      { id: Date.now().toString(), role: "user" as const, content: userMsg },
    ];
    setMessages(newMessages);
    setIsLoading(true);
    saveMessage("user", userMsg);

    try {
      const token = user ? await getAuthToken() : null;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          messages: newMessages,
          modelId: selectedModel.id,
        }),
      });

      let data;
      const ct = response.headers.get("content-type");
      if (ct && ct.includes("application/json")) {
        data = await response.json();
      } else {
        throw new Error(`Server error (${response.status})`);
      }

      if (!response.ok) throw new Error(data.error || "Failed to get response");

      const modelContent = data.text;
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "model",
          content: modelContent,
        },
      ]);
      saveMessage("model", modelContent);
    } catch (error: any) {
      let errorMsg = error.message;
      const isKeyError =
        errorMsg?.includes("API_KEY_MISSING") ||
        errorMsg?.includes("API key not valid") ||
        errorMsg?.includes("API_KEY_INVALID");
      const isPermissionError =
        errorMsg?.includes("sufficient permissions") ||
        errorMsg?.includes("Inference Providers") ||
        errorMsg?.includes("403");

      if (isKeyError) {
        errorMsg =
          "⚠️ **API Key Missing** — Set HUGGINGFACE_API_KEY in your Netlify site environment variables (or .env.local for local dev), then redeploy/restart.";
      } else if (isPermissionError) {
        errorMsg =
          "⚠️ **Hugging Face Permission Error** — Your token cannot call Inference Providers. Update token permissions, replace HUGGINGFACE_API_KEY in Netlify env vars (or .env.local), then redeploy/restart.";
      } else if (errorMsg?.includes("quota") || error.status === 429) {
        errorMsg =
          "⏳ **Rate Limit** — Too many requests. Wait a minute and try again.";
      }

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "model", content: errorMsg },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const latestModelMsg =
    [...messages].reverse().find((m) => m.role === "model")?.content || "";

  // Check if content is visual JSON or plain text
  function isVisualContent(content: string) {
    try {
      const cleaned = content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        JSON.parse(match[0]);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  const exportPDF = async () => {
    setIsExportingPDF(true);
    try {
      const element = document.getElementById("output-content");
      if (!element) return;
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#0a0f1e",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("PassionPages-Notes.pdf");
    } catch (error) {
      console.error("Failed to export PDF:", error);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const exportImage = async () => {
    setIsExportingImage(true);
    try {
      const element = document.getElementById("output-content");
      if (!element) return;
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#0a0f1e",
      });
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "PassionPages-Notes.png";
      link.click();
    } catch (error) {
      console.error("Failed to export Image:", error);
    } finally {
      setIsExportingImage(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full w-full overflow-hidden">
      {/* ── LEFT: Chat (42%) ─────────────────────────────────── */}
      <div className="w-full lg:w-[42%] flex flex-col bg-[#080d1a] border-r border-white/5 h-full z-10 shadow-2xl">
        {/* Top bar */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0 bg-[#080d1a]/80 backdrop-blur-md">
          <div className="px-3 py-1.5 bg-[#0f1629] border border-white/5 rounded-full flex items-center gap-2 shadow-inner">
            <Sparkles size={14} className="text-pink-400" />
            <span className="text-slate-300 text-xs font-medium">
              {selectedModel.name}
            </span>
          </div>
          <button
            onClick={() =>
              setMessages([
                {
                  id: "1",
                  role: "model",
                  content: JSON.stringify({
                    type: "notes",
                    title: "Welcome to PassionPages AI! 🚀",
                    subject: "Getting Started",
                    emoji: "🎯",
                    summary:
                      "Your AI-powered study assistant. Ask me anything — I'll turn it into beautiful visual notes, flashcards, quizzes, or diagrams!",
                    sections: [
                      {
                        heading: "What can I do?",
                        icon: "✨",
                        color: "#a855f7",
                        body: "I can transform any topic into structured study material instantly.",
                        keyPoints: [
                          "📝 Generate visual notes with sections & tables",
                          "🃏 Create interactive flashcard decks",
                          "❓ Build quizzes with instant feedback",
                          "🔮 Draw diagrams and mind maps",
                        ],
                      },
                      {
                        heading: "How to use",
                        icon: "💡",
                        color: "#06b6d4",
                        body: "Just type any topic below and I'll generate study material for you!",
                        keyPoints: [
                          'Type "notes on Beta Blockers"',
                          'Type "flashcards for Newton\'s Laws"',
                          'Type "quiz on Data Structures"',
                          'Type "diagram of photosynthesis"',
                        ],
                        highlight: {
                          text: "Use the quick buttons below the input to choose what type of content you want!",
                          type: "tip",
                        },
                      },
                    ],
                    mnemonic:
                      "PassionPages = Passion for Learning + Beautiful Pages of Content!",
                  }),
                },
              ])
            }
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-500/10 to-purple-500/10 hover:from-pink-500/20 hover:to-purple-500/20 border border-pink-500/20 text-pink-400 text-xs font-medium rounded-full transition-all shadow-sm"
          >
            <Plus size={14} /> New Chat
          </button>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {messages.map((msg) => (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm shadow-md ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-pink-500/20"
                    : "bg-gradient-to-br from-pink-500/20 to-purple-600/20 border border-pink-500/30 text-pink-400 shadow-sm shadow-pink-500/20"
                }`}
              >
                {msg.role === "user" ? (
                  <User size={16} />
                ) : (
                  <Sparkles size={16} />
                )}
              </div>

              {/* Bubble */}
              <div
                className={`flex flex-col gap-1 max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-[#EC4899] to-[#8B5CF6] text-white rounded-2xl rounded-tr-sm shadow-lg shadow-pink-500/20 font-medium"
                      : "bg-[#0f1629] text-slate-200 rounded-2xl rounded-tl-sm border-l-2 border-pink-500/40 shadow-md"
                  }`}
                >
                  {msg.role === "user" ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : isVisualContent(msg.content) ? (
                    <p className="text-slate-400 italic text-xs flex items-center gap-1.5">
                      <Wand2 size={12} className="text-pink-400" />
                      Visual content generated — see output panel →
                    </p>
                  ) : (
                    <div className="prose prose-sm prose-invert max-w-none">
                      <Markdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          pre({ children, ...props }: any) {
                            const child = Array.isArray(children)
                              ? children[0]
                              : children;
                            let codeString = "";
                            let isMermaid = false;

                            if (child && child.props) {
                              const match = /language-(\w+)/.exec(
                                child.props.className || "",
                              );
                              if (match && match[1] === "mermaid") {
                                isMermaid = true;
                              }

                              if (child.props.children) {
                                codeString = Array.isArray(child.props.children)
                                  ? child.props.children.join("")
                                  : String(child.props.children);
                              }
                            }

                            if (isMermaid) {
                              return (
                                <div className="relative group my-4">
                                  <CopyButton text={codeString} />
                                  <Mermaid
                                    chart={codeString.replace(/\n$/, "")}
                                  />
                                </div>
                              );
                            }

                            return (
                              <div className="relative group my-4">
                                <CopyButton text={codeString} />
                                <pre
                                  className="bg-[#0a0f1e] p-4 rounded-xl overflow-x-auto border border-white/5 m-0"
                                  {...props}
                                >
                                  {children}
                                </pre>
                              </div>
                            );
                          },
                          code({
                            node,
                            inline,
                            className,
                            children,
                            ...props
                          }: any) {
                            return (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {msg.content}
                      </Markdown>
                    </div>
                  )}
                </div>
                <span className="text-xs text-slate-600 mt-0.5 px-1">
                  {msg.id === "1"
                    ? new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : new Date(
                        parseInt(msg.id) || Date.now(),
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                </span>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-600/20 border border-pink-500/30 flex items-center justify-center shrink-0 shadow-sm shadow-pink-500/20">
                <Sparkles size={16} className="text-pink-400" />
              </div>
              <div className="bg-[#0f1629] border-l-2 border-pink-500/40 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-3 shadow-md">
                <div className="flex space-x-1.5">
                  <div
                    className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  PassionPages is thinking...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Bottom input area */}
        <div className="p-4 bg-[#0a0f1e] border-t border-white/5 shrink-0 relative z-20">
          {/* Pill buttons */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1 custom-scrollbar">
            {["📝 Notes", "🃏 Flashcards", "❓ Quiz", "🔮 Diagram"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    const promptMap: Record<string, string> = {
                      "📝 Notes": "Generate detailed notes for: ",
                      "🃏 Flashcards": "Create flashcards for: ",
                      "❓ Quiz": "Create a quiz for: ",
                      "🔮 Diagram": "Generate a diagram for: ",
                    };
                    setInput(promptMap[tab] || "");
                    textareaRef.current?.focus();
                  }}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-300 shadow-sm shadow-pink-500/10"
                      : "bg-[#111827] border border-white/5 text-slate-400 hover:text-slate-200 hover:bg-[#1f2937]"
                  }`}
                >
                  {tab}
                </button>
              ),
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className={`flex items-end gap-2 bg-[#111827] border rounded-2xl p-1.5 transition-all ${
              isFocused
                ? "border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.15)]"
                : "border-white/10"
            }`}
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Upload notes, paste a topic, or ask anything..."
              className="flex-1 bg-transparent border-none focus:ring-0 px-3 py-2.5 text-sm text-white outline-none resize-none placeholder:text-slate-500"
              disabled={isLoading}
              style={{ minHeight: "40px", maxHeight: "120px" }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 mb-0.5 mr-0.5 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-xl flex items-center justify-center disabled:opacity-30 hover:shadow-lg hover:shadow-pink-500/25 transition-all active:scale-90 shrink-0"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} className="ml-0.5" />
              )}
            </button>
          </form>
        </div>
      </div>

      {/* ── RIGHT: Visual Output (58%) ───────────────────────── */}
      <div className="w-full lg:w-[58%] flex flex-col bg-[#04080f] h-full relative z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_center,rgba(236,72,153,0.05),transparent_50%)] pointer-events-none z-0" />

        <div className="p-4 border-b border-white/5 bg-[#04080f]/80 backdrop-blur-md flex items-center gap-3 shrink-0 z-10">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-pink-500/20 flex items-center justify-center shadow-sm shadow-pink-500/10">
            <FileText size={16} className="text-pink-400" />
          </div>
          <span className="text-slate-200 text-sm font-semibold">
            Visual Output
          </span>

          {isVisualContent(latestModelMsg) && (
            <span className="px-2.5 py-1 bg-[#0f1629] border border-white/10 rounded-lg text-xs font-medium text-pink-400 uppercase tracking-wider shadow-inner">
              {(() => {
                try {
                  const cleaned = latestModelMsg
                    .replace(/```json/g, "")
                    .replace(/```/g, "")
                    .trim();
                  const match = cleaned.match(/\{[\s\S]*\}/);
                  if (match) {
                    const parsed = JSON.parse(match[0]);
                    return parsed.type || "Content";
                  }
                } catch {
                  return "Content";
                }
                return "Content";
              })()}
            </span>
          )}

          <div className="ml-auto flex gap-2">
            <button
              onClick={exportPDF}
              disabled={
                isExportingPDF || isExportingImage || messages.length <= 1
              }
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f1629] hover:bg-[#1f2937] border border-white/10 hover:border-pink-500/30 text-slate-300 hover:text-pink-300 text-xs font-medium rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExportingPDF ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Download size={14} />
              )}{" "}
              PDF
            </button>
            <button
              onClick={exportImage}
              disabled={
                isExportingPDF || isExportingImage || messages.length <= 1
              }
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f1629] hover:bg-[#1f2937] border border-white/10 hover:border-pink-500/30 text-slate-300 hover:text-pink-300 text-xs font-medium rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExportingImage ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <ImageIcon size={14} />
              )}{" "}
              Image
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-500/10 to-purple-500/10 hover:from-pink-500/20 hover:to-purple-500/20 border border-pink-500/20 text-pink-400 text-xs font-medium rounded-xl transition-all shadow-sm">
              <BookmarkPlus size={14} /> Save
            </button>
          </div>
        </div>

        <div
          className="flex-1 overflow-y-auto p-6 custom-scrollbar z-10"
          id="output-content"
        >
          {messages.length > 1 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Try visual render first */}
              {isVisualContent(latestModelMsg) ? (
                <NoteRenderer content={latestModelMsg} />
              ) : (
                /* Fallback: GPAI-style rich markdown */
                <div className="bg-[#0d1220] rounded-2xl border border-white/[0.06] shadow-2xl overflow-hidden">
                  <div className="h-1 w-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500" />
                  <div className="p-8">
                    <Markdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children }: any) => (
                          <h1 className="text-2xl font-bold text-white mb-4 mt-6 first:mt-0 flex items-center gap-3">
                            <span className="w-1 h-7 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full inline-block shrink-0" />
                            {children}
                          </h1>
                        ),
                        h2: ({ children }: any) => (
                          <h2 className="text-xl font-bold text-white mb-3 mt-8 first:mt-0 pb-2 border-b border-white/[0.08] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-pink-500 inline-block shrink-0" />
                            {children}
                          </h2>
                        ),
                        h3: ({ children }: any) => (
                          <h3 className="text-base font-bold text-pink-300 mb-2 mt-6 first:mt-0">{children}</h3>
                        ),
                        p: ({ children }: any) => (
                          <p className="text-slate-300 text-[15px] leading-[1.85] mb-4">{children}</p>
                        ),
                        strong: ({ children }: any) => (
                          <strong className="font-bold text-white">{children}</strong>
                        ),
                        em: ({ children }: any) => (
                          <em className="italic text-purple-300">{children}</em>
                        ),
                        ol: ({ children }: any) => (
                          <ol className="space-y-3 mb-4 list-none pl-0">{children}</ol>
                        ),
                        ul: ({ children }: any) => (
                          <ul className="space-y-2 mb-4 list-none pl-0">{children}</ul>
                        ),
                        li: ({ children, ordered, index }: any) => (
                          <li className="flex items-start gap-3 text-slate-300 text-[15px] leading-relaxed">
                            <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center text-xs font-bold text-pink-300">
                              {typeof index === "number" ? index + 1 : "•"}
                            </span>
                            <span>{children}</span>
                          </li>
                        ),
                        blockquote: ({ children }: any) => (
                          <blockquote className="border-l-4 border-purple-500/60 pl-4 py-2 my-4 bg-purple-500/5 rounded-r-xl text-slate-400 italic">{children}</blockquote>
                        ),
                        code({ node, inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || "");
                          if (!inline && match && match[1] === "mermaid") {
                            return <Mermaid chart={String(children).replace(/\n$/, "")} />;
                          }
                          if (inline) {
                            return <code className="px-1.5 py-0.5 bg-pink-500/10 border border-pink-500/20 text-pink-300 rounded text-sm font-mono" {...props}>{children}</code>;
                          }
                          return (
                            <div className="relative group my-4">
                              <CopyButton text={String(children)} />
                              <pre className="bg-[#070b14] border border-white/[0.06] rounded-xl p-5 overflow-x-auto text-sm font-mono text-slate-300 leading-relaxed">
                                <code className={className} {...props}>{children}</code>
                              </pre>
                            </div>
                          );
                        },
                        table: ({ children }: any) => (
                          <div className="overflow-x-auto my-4 rounded-xl border border-white/[0.08]">
                            <table className="w-full text-sm text-slate-300">{children}</table>
                          </div>
                        ),
                        th: ({ children }: any) => (
                          <th className="px-4 py-3 bg-[#0f1629] text-left font-semibold text-pink-300 border-b border-white/[0.08]">{children}</th>
                        ),
                        td: ({ children }: any) => (
                          <td className="px-4 py-3 border-b border-white/[0.04] text-slate-300">{children}</td>
                        ),
                        hr: () => <hr className="my-6 border-white/[0.06]" />,
                      }}
                    >
                      {latestModelMsg}
                    </Markdown>
                    <div className="mt-6 pt-4 border-t border-white/[0.06]">
                      <p className="text-xs text-slate-600 italic">💬 Ask a follow-up question in the chat →</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            /* Empty state */
            <div className="h-full flex flex-col items-center justify-center text-center px-8">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-24 h-24 bg-gradient-to-br from-pink-500/10 to-purple-600/10 border border-pink-500/20 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(236,72,153,0.15)] relative"
              >
                <div
                  className="absolute inset-0 rounded-full border border-pink-500/30 animate-ping opacity-20"
                  style={{ animationDuration: "3s" }}
                />
                <Sparkles size={40} className="text-pink-400" />
              </motion.div>
              <h3 className="text-white font-bold text-2xl mb-4 tracking-tight">
                Ready to generate!
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md mb-10">
                Type any topic in the chat — your visual notes, flashcards,
                quiz, or diagram will appear here in a beautiful, structured
                format.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-2 w-full max-w-lg">
                {[
                  ["📝", "Notes", "Generate notes on Beta Blockers"],
                  ["🃏", "Flashcards", "Create flashcards for Newton's Laws"],
                  ["❓", "Quiz", "Create a quiz on Data Structures"],
                  ["🔮", "Diagram", "Generate a diagram of photosynthesis"],
                ].map(([emoji, label, prompt], i) => (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    key={label}
                    onClick={() => {
                      setInput(prompt);
                      setActiveTab(`${emoji} ${label}`);
                      textareaRef.current?.focus();
                    }}
                    className="bg-[#0f1629] border border-white/5 hover:border-pink-500/40 hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(236,72,153,0.2)] rounded-2xl p-5 text-left transition-all duration-300 group"
                  >
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform origin-left duration-300">
                      {emoji}
                    </div>
                    <div className="text-slate-200 text-sm font-semibold group-hover:text-pink-400 transition-colors">
                      {label}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
