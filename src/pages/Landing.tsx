import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Sparkles,
  FileText,
  MessageSquare,
  BookOpen,
  UploadCloud,
  ArrowRight,
  Presentation,
  HelpCircle,
  Network,
  ChevronRight,
  Zap,
  Shield,
  Star,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const tools = [
  { icon: FileText,      label: "AI Summary",    path: "/upload?type=summary" },
  { icon: BookOpen,      label: "Flashcards",     path: "/upload?type=flashcards" },
  { icon: HelpCircle,    label: "Create Quiz",    path: "/upload?type=table" },
  { icon: Network,       label: "Mind Map",       path: "/upload?type=mindmap" },
  { icon: Presentation,  label: "PPT Slides",     path: "/upload?type=slides" },
  { icon: MessageSquare, label: "AI Chat",        path: "/chat" },
];

const stats = [
  { icon: Zap,    value: "10x",  label: "Faster Learning" },
  { icon: Star,   value: "50K+", label: "Students" },
  { icon: Shield, value: "100%", label: "Free to Start" },
];

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [prompt, setPrompt]     = useState("");
  const [focused, setFocused]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const userName = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  const handleGenerate = () => {
    if (prompt.trim()) navigate("/chat", { state: { initialPrompt: prompt } });
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col">

      {/* Nav */}
      <nav className="border-b border-[#27272a] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="text-sm font-semibold tracking-tight">PassionPages.ai</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/pricing" className="text-sm text-[#a1a1aa] hover:text-white transition-colors hidden sm:block">
            Pricing
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold rounded-md transition-colors"
          >
            {user ? "Dashboard" : "Get Started"}
            <ChevronRight size={13} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8"
        >
          <Sparkles size={11} />
          AI-Powered Study Assistant for College Students
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-5"
        >
          {user
            ? <>Hi, <span className="text-indigo-400">{userName}</span> —<br className="hidden sm:block" /> ready to study?</>
            : <>Study smarter with<br className="hidden sm:block" /> <span className="text-indigo-400">AI by your side</span></>
          }
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-[#71717a] text-base sm:text-lg max-w-lg mx-auto mb-10 leading-relaxed"
        >
          Upload your notes and get instant summaries, flashcards, quizzes, mind maps and more — powered by the latest AI.
        </motion.p>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-2xl mb-4"
        >
          <div className={`flex items-center gap-2 bg-[#18181b] border rounded-lg px-4 py-2.5 transition-colors ${focused ? "border-indigo-500" : "border-[#3f3f46]"}`}>
            <UploadCloud size={16} className="text-[#52525b] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="Upload notes, paste a topic, or ask anything..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-[#52525b]"
            />
            <button
              onClick={handleGenerate}
              className="shrink-0 flex items-center gap-1.5 px-4 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold rounded-md transition-colors"
            >
              Generate
              <ArrowRight size={13} />
            </button>
          </div>
        </motion.div>

        {/* Quick prompts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28 }}
          className="flex flex-wrap justify-center gap-2 mb-16"
        >
          {["Summarize my notes", "Make flashcards", "Quiz me", "Explain a concept", "Create a diagram"].map((p) => (
            <button
              key={p}
              onClick={() => { setPrompt(p); inputRef.current?.focus(); }}
              className="px-3 py-1 rounded-full text-xs font-medium bg-[#18181b] border border-[#3f3f46] text-[#a1a1aa] hover:text-white hover:border-[#52525b] transition-colors"
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
                <stat.icon size={14} className="text-indigo-400" />
                <span className="text-xl font-bold text-white">{stat.value}</span>
              </div>
              <span className="text-xs text-[#71717a]">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Tool grid */}
        <div className="w-full max-w-2xl">
          <p className="text-xs font-semibold text-[#52525b] uppercase tracking-widest mb-4">What do you want to create?</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {tools.map((tool, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.04 }}
                onClick={() => navigate(tool.path)}
                className="flex flex-col items-center gap-2 p-3 rounded-lg bg-[#18181b] border border-[#3f3f46] hover:border-[#52525b] hover:bg-[#27272a] transition-colors group"
              >
                <tool.icon size={18} className="text-[#71717a] group-hover:text-indigo-400 transition-colors" />
                <span className="text-[11px] font-medium text-[#71717a] group-hover:text-white transition-colors leading-tight">{tool.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-20 w-full max-w-2xl bg-[#18181b] border border-[#3f3f46] rounded-xl p-8 text-center"
        >
          <h2 className="text-lg font-semibold text-white mb-2">Start studying smarter today</h2>
          <p className="text-sm text-[#71717a] mb-5">
            Join thousands of students using PassionPages.ai to ace their exams.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold rounded-md transition-colors"
          >
            Get Started Free
            <ArrowRight size={15} />
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#27272a] py-4 text-center text-xs text-[#52525b]">
        © 2026 PassionPages.ai — Built for students, by students
      </footer>
    </div>
  );
}
