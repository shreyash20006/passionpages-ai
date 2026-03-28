import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Sparkles, FileText, MessageSquare, BookOpen, UploadCloud,
  ArrowRight, Presentation, HelpCircle, Network, ChevronRight,
  Zap, Shield, Star, Brain,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Logo } from "../components/Logo";

const tools = [
  { icon: FileText,      label: "AI Summary",    path: "/upload?type=summary",    color: "#a855f7" },
  { icon: BookOpen,      label: "Flashcards",    path: "/upload?type=flashcards", color: "#ec4899" },
  { icon: HelpCircle,    label: "Create Quiz",   path: "/upload?type=table",      color: "#6366f1" },
  { icon: Network,       label: "Mind Map",      path: "/upload?type=mindmap",    color: "#14b8a6" },
  { icon: Presentation,  label: "PPT Slides",    path: "/upload?type=slides",     color: "#f59e0b" },
  { icon: MessageSquare, label: "AI Chat",       path: "/chat",                   color: "#10b981" },
];

const stats = [
  { icon: Zap,    value: "10x",  label: "Faster Learning", color: "#a855f7" },
  { icon: Star,   value: "50K+", label: "Students",        color: "#ec4899" },
  { icon: Shield, value: "Free", label: "To Start",        color: "#6366f1" },
];

const subjects = ["Chemistry", "Physics", "Biology", "Pharmacy", "Engineering", "Mathematics"];

export default function Landing() {
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const [prompt, setPrompt]     = useState("");
  const [focused, setFocused]   = useState(false);
  const [subjectIdx, setSubjectIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const userName = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  useEffect(() => {
    const t = setInterval(() => setSubjectIdx(i => (i + 1) % subjects.length), 2200);
    return () => clearInterval(t);
  }, []);

  const handleGenerate = () => {
    if (prompt.trim()) navigate("/chat", { state: { initialPrompt: prompt } });
    else navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col overflow-hidden">
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-8%] left-[8%] w-[500px] h-[500px] rounded-full bg-purple-700/20 blur-[120px]" />
        <div className="absolute top-[25%] right-[-5%] w-[380px] h-[380px] rounded-full bg-pink-700/15 blur-[100px]" />
        <div className="absolute bottom-[5%] left-[35%] w-[320px] h-[320px] rounded-full bg-indigo-700/15 blur-[90px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-20 border-b border-white/[0.06] px-6 py-3.5 flex items-center justify-between backdrop-blur-sm bg-[#09090b]/80">
        <Logo variant="navbar" />
        <div className="flex items-center gap-3">
          <Link to="/pricing" className="text-sm text-[#71717a] hover:text-white transition-colors hidden sm:block px-3 py-1.5">
            Pricing
          </Link>
          <Link to="/dashboard" className="flex items-center gap-1.5 px-4 py-2 btn-primary text-white text-xs font-semibold rounded-lg">
            {user ? "Dashboard" : "Get Started"}
            <ChevronRight size={13} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-20 text-center">
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium mb-8"
        >
          <Sparkles size={11} />
          AI-Powered Study Assistant for College Students
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 14 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.08 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-5 max-w-3xl"
        >
          {user ? (
            <>
              Hi, <span className="gradient-text">{userName}</span> —
              <br className="hidden sm:block" /> ready to study?
            </>
          ) : (
            <>
              AI Study Tool
              <br />
              <span className="inline-flex items-baseline gap-2">
                for{" "}
                <motion.span 
                  key={subjectIdx} 
                  initial={{ opacity: 0, y: 8 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="gradient-text cursor-blink"
                >
                  {subjects[subjectIdx]}
                </motion.span>
              </span>
            </>
          )}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.15 }}
          className="text-[#71717a] text-base sm:text-lg max-w-lg mx-auto mb-10 leading-relaxed"
        >
          Upload notes, get instant summaries, flashcards, quizzes & more — powered by the latest AI.
        </motion.p>

        {/* Search */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="w-full max-w-2xl mb-4"
        >
          <div className={`flex items-center gap-2 bg-[#18181b] border rounded-xl px-4 py-3 transition-all duration-200 ${
            focused ? "border-purple-500/60 shadow-[0_0_0_3px_rgba(168,85,247,0.1)]" : "border-[#3f3f46] hover:border-[#52525b]"
          }`}>
            <UploadCloud size={16} className="text-[#52525b] shrink-0" />
            <input 
              ref={inputRef} 
              type="text" 
              value={prompt} 
              onChange={e => setPrompt(e.target.value)}
              onFocus={() => setFocused(true)} 
              onBlur={() => setFocused(false)}
              onKeyDown={e => e.key === "Enter" && handleGenerate()}
              placeholder="Ask anything or describe your topic..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-[#52525b]" 
            />
            <button 
              onClick={handleGenerate}
              className="shrink-0 flex items-center gap-1.5 px-4 py-2 btn-primary text-white text-xs font-semibold rounded-lg"
            >
              Go <ArrowRight size={13} />
            </button>
          </div>
        </motion.div>

        {/* Quick prompts */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.28 }}
          className="flex flex-wrap justify-center gap-2 mb-14"
        >
          {["📄 Summarize notes", "🃏 Make flashcards", "❓ Quiz me", "🧠 Explain a concept"].map(p => (
            <button 
              key={p} 
              onClick={() => { setPrompt(p.split(" ").slice(1).join(" ")); inputRef.current?.focus(); }}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#18181b] border border-[#3f3f46] text-[#a1a1aa] hover:text-white hover:border-purple-500/40 hover:bg-purple-500/5 transition-all"
            >
              {p}
            </button>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 8 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.32 }}
          className="flex items-center gap-10 mb-14"
        >
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5">
                <stat.icon size={14} style={{ color: stat.color }} />
                <span className="text-xl font-bold text-white">{stat.value}</span>
              </div>
              <span className="text-xs text-[#71717a]">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Tool grid */}
        <div className="w-full max-w-2xl">
          <p className="text-[11px] font-semibold text-[#52525b] uppercase tracking-widest mb-4">
            What do you want to create?
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {tools.map((tool, i) => (
              <motion.button 
                key={i} 
                initial={{ opacity: 0, y: 8 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }} 
                onClick={() => navigate(tool.path)}
                className="tool-card flex flex-col items-center gap-2 p-3 rounded-xl bg-[#18181b] border border-[#27272a] text-center group"
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: tool.color + "18", border: `1px solid ${tool.color}28` }}>
                  <tool.icon size={17} style={{ color: tool.color }} />
                </div>
                <span className="text-[11px] font-medium text-[#71717a] group-hover:text-white transition-colors leading-tight">
                  {tool.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.6 }}
          className="mt-20 w-full max-w-2xl relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5 p-8 text-center"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
            <Brain size={20} className="text-purple-400" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Start studying smarter today</h2>
          <p className="text-sm text-[#71717a] mb-6">
            Join thousands of students using PassionPages.ai to ace their exams.
          </p>
          <Link 
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-2.5 btn-primary text-white text-sm font-semibold rounded-lg"
          >
            Get Started Free <ArrowRight size={15} />
          </Link>
        </motion.div>
      </main>

      <footer className="relative z-10 border-t border-white/[0.06] py-4 text-center text-xs text-[#52525b]">
        © 2026 PassionPages.ai — Built for students, by students
      </footer>
    </div>
  );
}
