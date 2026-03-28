import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Sparkles, FileText, MessageSquare, BookOpen, UploadCloud,
  ArrowRight, Presentation, HelpCircle, Network, ChevronRight, Zap, Star, Shield,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import LoadingAnimation from "../components/LoadingAnimation";
import AnimatedLogo from "../components/AnimatedLogo";

function useTypewriter(words: string[], speed = 80, pause = 2200) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && charIdx < word.length) t = setTimeout(() => setCharIdx(c => c + 1), speed);
    else if (!deleting && charIdx === word.length) t = setTimeout(() => setDeleting(true), pause);
    else if (deleting && charIdx > 0) t = setTimeout(() => setCharIdx(c => c - 1), speed / 2);
    else { setDeleting(false); setWordIdx(w => (w + 1) % words.length); }
    return () => clearTimeout(t);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  useEffect(() => { setDisplay(words[wordIdx].slice(0, charIdx)); }, [charIdx, wordIdx, words]);
  return display;
}

const tools = [
  { icon: FileText, label: "AI Summary", color: "text-blue-400", gradient: "bg-gradient-to-br from-blue-500/10 to-transparent", path: "/upload?type=summary" },
  { icon: BookOpen, label: "Flashcards", color: "text-emerald-400", gradient: "bg-gradient-to-br from-emerald-500/10 to-transparent", path: "/upload?type=flashcards" },
  { icon: HelpCircle, label: "Create Quiz", color: "text-amber-400", gradient: "bg-gradient-to-br from-amber-500/10 to-transparent", path: "/upload?type=table" },
  { icon: Network, label: "Mind Map", color: "text-purple-400", gradient: "bg-gradient-to-br from-purple-500/10 to-transparent", path: "/upload?type=mindmap" },
  { icon: Presentation, label: "PPT Slides", color: "text-pink-400", gradient: "bg-gradient-to-br from-pink-500/10 to-transparent", path: "/upload?type=slides" },
  { icon: MessageSquare, label: "AI Chat", color: "text-cyan-400", gradient: "bg-gradient-to-br from-cyan-500/10 to-transparent", path: "/chat" },
];

const quickPrompts = ["📝 Summarize notes", "🃏 Make flashcards", "❓ Quiz me", "🔮 Explain a concept"];

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const typedText = useTypewriter(["Physics", "Mathematics", "Chemistry", "Biology", "Programming", "History", "B.Tech"]);

  const name = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "Student";
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";

  const handleGenerate = () => {
    if (prompt.trim()) navigate("/chat", { state: { initialPrompt: prompt } });
  };

  return (
    <>
      {showLoading && <LoadingAnimation onComplete={() => setShowLoading(false)} />}

      <div className="relative min-h-screen text-white overflow-x-hidden bg-[#050814]">
        {/* Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-30">
            <source src="https://customer-assets.emergentagent.com/job_show-me-4/artifacts/z2pk1l99_WhatsApp%20Video%202026-03-23%20at%209.39.30%20PM.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#050814]/80 via-[#050814]/60 to-[#050814]/95" />
          <div className="absolute top-[-15%] left-[-5%] w-[70vw] h-[70vw] max-w-[500px] max-h-[500px] rounded-full bg-pink-600/10 blur-[100px] animate-pulse" style={{ animationDuration: "4s" }} />
          <div className="absolute bottom-[-15%] right-[-5%] w-[60vw] h-[60vw] max-w-[400px] max-h-[400px] rounded-full bg-purple-600/10 blur-[100px] animate-pulse" style={{ animationDuration: "6s", animationDelay: "2s" }} />
        </div>

        {/* Navbar */}
        <nav className="relative z-30 px-5 py-4 flex justify-between items-center border-b border-white/[0.05] backdrop-blur-sm">
          <style>{`.al-logo-section{padding:0!important;border-bottom:none!important}.al-uline-wrap{display:none}.al-spin-ring::after{--logo-bg:transparent;background:transparent!important}`}</style>
          <Link to="/dashboard"><AnimatedLogo size="small" /></Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white text-sm font-bold transition-all active:scale-95"
          >
            {user ? "Dashboard" : "Get Started"}
            <ChevronRight size={15} />
          </Link>
        </nav>

        {/* Hero */}
        <main className="relative z-10 px-5 pt-10 pb-24 flex flex-col items-center max-w-2xl mx-auto">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold"
          >
            <Sparkles size={12} className="animate-pulse" />
            AI-Powered Study Assistant
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-4"
          >
            {user ? (
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
                Good {timeOfDay},{" "}
                <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">{name}</span>
              </h1>
            ) : (
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
                AI Study Tool
              </h1>
            )}
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">
              for{" "}
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {typedText}
              </span>
              <span className="inline-block w-[2px] h-[0.85em] bg-pink-400 ml-1 align-middle animate-[blink_0.8s_step-end_infinite]" />
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 text-base text-center mb-8 max-w-sm"
          >
            Upload notes, get instant summaries, flashcards, quizzes & more.
          </motion.p>

          {/* Search / Input */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="w-full mb-4"
          >
            <div className={`relative rounded-2xl transition-all duration-300 ${focused ? "shadow-[0_0_30px_rgba(236,72,153,0.2)]" : ""}`}>
              {focused && (
                <div className="absolute inset-0 rounded-2xl" style={{ background: "linear-gradient(135deg,#ec4899,#8b5cf6)", padding: "1px" }}>
                  <div className="w-full h-full rounded-2xl bg-[#0d1220]" />
                </div>
              )}
              <div className="relative bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden flex items-center gap-2 px-3 py-2">
                <UploadCloud size={18} className="text-slate-500 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onKeyDown={e => e.key === "Enter" && handleGenerate()}
                  placeholder="Ask anything or describe your topic..."
                  className="flex-1 bg-transparent border-none outline-none text-white py-2 placeholder:text-slate-500 text-sm"
                />
                <motion.button
                  onClick={handleGenerate}
                  whileTap={{ scale: 0.95 }}
                  className="shrink-0 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 text-sm hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all"
                >
                  Go <ArrowRight size={15} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Quick prompts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => { setPrompt(p.replace(/^[^\s]+ /, "")); inputRef.current?.focus(); }}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:bg-white/[0.08] hover:border-pink-500/40 hover:text-pink-300 transition-all active:scale-95"
              >
                {p}
              </button>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-8 mb-10"
          >
            {[
              { icon: Zap, value: "10x", label: "Faster Learning" },
              { icon: Star, value: "50K+", label: "Students" },
              { icon: Shield, value: "Free", label: "To Start" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5 text-center">
                <div className="flex items-center gap-1">
                  <s.icon size={14} className="text-pink-400" />
                  <span className="text-xl font-bold text-white">{s.value}</span>
                </div>
                <span className="text-[11px] text-slate-500">{s.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Tools grid */}
          <div className="w-full">
            <p className="text-center text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
              What do you want to create?
            </p>
            <div className="grid grid-cols-3 gap-3">
              {tools.map((tool, i) => (
                <motion.button
                  key={i}
                  onClick={() => navigate(tool.path)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.07 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/20 hover:bg-white/[0.06] transition-all text-center overflow-hidden active:scale-95"
                >
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${tool.gradient}`} />
                  <div className="relative w-11 h-11 rounded-xl flex items-center justify-center bg-white/5">
                    <tool.icon size={20} className={tool.color} />
                  </div>
                  <span className="relative text-xs font-semibold text-slate-300 group-hover:text-white transition-colors leading-tight">{tool.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="mt-12 w-full rounded-3xl border border-white/[0.08] bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-transparent p-8 text-center"
          >
            <Sparkles size={28} className="text-pink-400 mx-auto mb-3 animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Start studying smarter</h2>
            <p className="text-slate-400 text-sm mb-5">Join thousands of students acing their exams with PassionPages.ai</p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-2xl transition-all hover:shadow-xl hover:shadow-pink-500/30 active:scale-95 text-sm"
            >
              Get Started Free
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </main>

        <footer className="relative z-10 text-center py-5 text-slate-600 text-xs border-t border-white/[0.04]">
          © 2026 PassionPages.ai — Built for students 🎓
        </footer>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </>
  );
}
