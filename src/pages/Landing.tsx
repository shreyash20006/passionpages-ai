import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  FileText,
  MessageSquare,
  BookOpen,
  UploadCloud,
  ArrowRight,
  Headphones,
  Presentation,
  HelpCircle,
  Network,
  ChevronRight,
  Zap,
  Shield,
  Star,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import LoadingAnimation from "../components/LoadingAnimation";
import AnimatedLogo from "../components/AnimatedLogo";

// ─── Typewriter Hook ──────────────────────────────────────────────────────────
function useTypewriter(words: string[], speed = 80, pause = 2000) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < word.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), speed);
    } else if (!deleting && charIdx === word.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setWordIdx((w) => (w + 1) % words.length);
    }

    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  useEffect(() => {
    setDisplay(words[wordIdx].slice(0, charIdx));
  }, [charIdx, wordIdx, words]);

  return display;
}

// ─── Floating Orbs Background ────────────────────────────────────────────────
const FloatingOrbs = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {/* Video background */}
    <video
      autoPlay loop muted playsInline
      className="absolute inset-0 w-full h-full object-cover opacity-40"
    >
      <source
        src="https://customer-assets.emergentagent.com/job_show-me-4/artifacts/z2pk1l99_WhatsApp%20Video%202026-03-23%20at%209.39.30%20PM.mp4"
        type="video/mp4"
      />
    </video>
    <div className="absolute inset-0 bg-gradient-to-b from-[#050814]/80 via-[#050814]/60 to-[#050814]/90" />

    {/* Animated orbs */}
    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-pink-600/10 blur-[120px] animate-pulse" style={{ animationDuration: "4s" }} />
    <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] animate-pulse" style={{ animationDuration: "6s", animationDelay: "2s" }} />
    <div className="absolute bottom-[-10%] left-[30%] w-[700px] h-[400px] rounded-full bg-pink-500/8 blur-[150px] animate-pulse" style={{ animationDuration: "8s", animationDelay: "1s" }} />

    {/* Grid pattern */}
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }}
    />
  </div>
);

// ─── Feature Card ─────────────────────────────────────────────────────────────
const FeatureCard = ({
  icon: Icon, label, color, gradient, delay, onClick,
}: {
  icon: any; label: string; color: string; gradient: string; delay: number; onClick?: () => void;
}) => (
  <motion.button
    onClick={onClick}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -4, scale: 1.02 }}
    whileTap={{ scale: 0.97 }}
    className="group relative flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300 cursor-pointer overflow-hidden text-center"
  >
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${gradient}`} />
    <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 group-hover:scale-110 transition-transform duration-300`}>
      <Icon size={22} className={color} />
    </div>
    <span className="relative text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{label}</span>
  </motion.button>
);

// ─── Landing Page ─────────────────────────────────────────────────────────────
export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [showLoading, setShowLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const typedText = useTypewriter(
    ["Physics", "Mathematics", "Chemistry", "Biology", "Programming", "History", "B.Tech Subjects", "D.Pharm Notes"],
    75,
    2200
  );

  const userName =
    user?.displayName?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "Student";

  const timeOfDay =
    new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening";

  const handleGenerate = () => {
    if (prompt.trim()) navigate("/chat", { state: { initialPrompt: prompt } });
  };

  const setQuickPrompt = (text: string) => {
    setPrompt(text);
    inputRef.current?.focus();
  };

  const tools = [
    { icon: FileText, label: "AI Summary", color: "text-blue-400", gradient: "bg-gradient-to-br from-blue-500/10 to-transparent", path: "/upload?type=summary" },
    { icon: BookOpen, label: "Flashcards", color: "text-emerald-400", gradient: "bg-gradient-to-br from-emerald-500/10 to-transparent", path: "/upload?type=flashcards" },
    { icon: HelpCircle, label: "Create Quiz", color: "text-amber-400", gradient: "bg-gradient-to-br from-amber-500/10 to-transparent", path: "/upload?type=table" },
    { icon: Network, label: "Mind Map", color: "text-purple-400", gradient: "bg-gradient-to-br from-purple-500/10 to-transparent", path: "/upload?type=mindmap" },
    { icon: Presentation, label: "PPT Slides", color: "text-pink-400", gradient: "bg-gradient-to-br from-pink-500/10 to-transparent", path: "/upload?type=slides" },
    { icon: MessageSquare, label: "AI Chat", color: "text-cyan-400", gradient: "bg-gradient-to-br from-cyan-500/10 to-transparent", path: "/chat" },
  ];

  const quickPrompts = [
    "📝 Summarize my notes",
    "🃏 Make flashcards",
    "❓ Quiz me",
    "🔮 Explain a concept",
    "📊 Create a diagram",
    "🎧 Study tips",
  ];

  const stats = [
    { icon: Zap, value: "10x", label: "Faster Learning" },
    { icon: Star, value: "50K+", label: "Students" },
    { icon: Shield, value: "100%", label: "Free to Start" },
  ];

  return (
    <>
      {showLoading && <LoadingAnimation onComplete={() => setShowLoading(false)} />}
      <div className="relative min-h-screen text-white overflow-x-hidden font-sans bg-[#050814]">
        <FloatingOrbs />

        {/* ─── Navbar ──────────────────────────────────────────────────────── */}
        <nav className="relative z-30 px-6 md:px-10 py-4 flex justify-between items-center border-b border-white/[0.05] backdrop-blur-sm">
          <style>{`
            .al-logo-section { padding: 0 !important; border-bottom: none !important; }
            .al-uline-wrap { display: none; }
            .al-spin-ring::after { --logo-bg: transparent; background: transparent !important; }
          `}</style>
          <Link to="/dashboard">
            <AnimatedLogo size="small" />
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="hidden sm:block text-sm text-slate-400 hover:text-white transition-colors">
              Features
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-pink-500/25 active:scale-95"
            >
              {user ? "Dashboard" : "Get Started"}
              <ChevronRight size={16} />
            </Link>
          </div>
        </nav>

        {/* ─── Hero ────────────────────────────────────────────────────────── */}
        <main className="relative z-10 max-w-5xl mx-auto px-4 pt-16 md:pt-24 pb-20 flex flex-col items-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-sm font-medium"
          >
            <Sparkles size={14} className="animate-pulse" />
            AI-Powered Study Assistant for College Students
          </motion.div>

          {/* Headline with typewriter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-center mb-3"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              {user ? (
                <>Good {timeOfDay}, <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">{userName}</span></>
              ) : (
                <>AI Study Tool</>
              )}
            </h1>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-2">
              for{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                  {typedText}
                </span>
                <span className="inline-block w-[3px] h-[0.9em] bg-pink-400 ml-1 align-middle animate-[blink_0.8s_step-end_infinite]" />
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-slate-400 text-lg text-center mb-10 max-w-xl"
          >
            Upload notes, get instant summaries, flashcards, quizzes, mind maps & more — powered by the latest AI.
          </motion.p>

          {/* ─── Input Box ───────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-full max-w-3xl mb-5"
          >
            <div className={`relative rounded-2xl transition-all duration-300 ${isFocused ? "shadow-[0_0_40px_rgba(236,72,153,0.2)]" : ""}`}>
              {/* Gradient border */}
              <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${isFocused ? "opacity-100" : "opacity-0"}`}
                style={{ background: "linear-gradient(135deg, #ec4899, #8b5cf6)", padding: "1px" }}>
                <div className="w-full h-full rounded-2xl bg-[#0d1220]" />
              </div>

              <div className="relative bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                <div className="flex items-center px-2 py-2">
                  <UploadCloud size={20} className="ml-3 text-slate-500 shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                    placeholder="Upload notes, paste a topic, or ask anything..."
                    className="w-full bg-transparent border-none outline-none text-white px-4 py-3 placeholder:text-slate-500 text-base"
                  />
                  <motion.button
                    onClick={handleGenerate}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="shrink-0 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all mr-1"
                  >
                    <span className="hidden sm:inline">Generate</span>
                    <ArrowRight size={18} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Prompts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-2 mb-16"
          >
            {quickPrompts.map((p, i) => (
              <motion.button
                key={i}
                onClick={() => setQuickPrompt(p.replace(/^[^\s]+ /, ""))}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full text-sm font-medium bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:bg-white/[0.08] hover:border-pink-500/40 hover:text-pink-300 transition-all"
              >
                {p}
              </motion.button>
            ))}
          </motion.div>

          {/* ─── Stats Row ───────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex items-center gap-8 mb-16"
          >
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-1 text-center">
                <div className="flex items-center gap-1.5">
                  <stat.icon size={16} className="text-pink-400" />
                  <span className="text-2xl font-bold text-white">{stat.value}</span>
                </div>
                <span className="text-xs text-slate-500">{stat.label}</span>
              </div>
            ))}
          </motion.div>

          {/* ─── Tools Grid ──────────────────────────────────────────────── */}
          <div className="w-full">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center text-sm font-semibold text-slate-500 uppercase tracking-widest mb-6"
            >
              What do you want to create?
            </motion.h3>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {tools.map((tool, i) => (
                <FeatureCard
                  key={i}
                  icon={tool.icon}
                  label={tool.label}
                  color={tool.color}
                  gradient={tool.gradient}
                  delay={0.7 + i * 0.07}
                  onClick={() => navigate(tool.path)}
                />
              ))}
            </div>
          </div>

          {/* ─── Bottom CTA ──────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="mt-20 w-full relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-transparent p-10 text-center"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[1px] bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />
            <Sparkles size={32} className="text-pink-400 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Start studying smarter today
            </h2>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Join thousands of students using PassionPages.ai to ace their exams.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold rounded-2xl transition-all hover:shadow-2xl hover:shadow-pink-500/30 active:scale-95"
            >
              Get Started Free
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 text-center py-6 text-slate-600 text-sm border-t border-white/[0.04]">
          © 2026 PassionPages.ai — Built for students, by students 🎓
        </footer>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </>
  );
}
