import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Sparkles,
  FileText,
  MessageSquare,
  BookOpen,
  UploadCloud,
  Plus,
  ArrowRight,
  Headphones,
  Presentation,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import LoadingAnimation from "../components/LoadingAnimation";
import AnimatedLogo from "../components/AnimatedLogo";

// Video Background Component
const SpaceBackground = () => {
  return (
    <>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover pointer-events-none z-0"
      >
        <source
          src="https://customer-assets.emergentagent.com/job_show-me-4/artifacts/z2pk1l99_WhatsApp%20Video%202026-03-23%20at%209.39.30%20PM.mp4"
          type="video/mp4"
        />
      </video>
      {/* Subtle overlay for text readability */}
      <div className="fixed inset-0 bg-black/20 pointer-events-none z-0" />
    </>
  );
};

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [showLoading, setShowLoading] = useState(true);

  const userName =
    user?.displayName?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "Explorer";

  const handleGenerate = () => {
    if (prompt.trim()) {
      navigate("/chat", { state: { initialPrompt: prompt } });
    }
  };

  const timeOfDay =
    new Date().getHours() < 12
      ? "morning"
      : new Date().getHours() < 18
        ? "afternoon"
        : "evening";

  return (
    <>
      {showLoading && <LoadingAnimation onComplete={() => setShowLoading(false)} />}
      <div className="relative min-h-screen text-white overflow-hidden font-sans">
      <SpaceBackground />

      {/* Radial glow at bottom center */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-pink-600/20 via-purple-600/5 to-transparent blur-[100px] pointer-events-none z-0" />

      {/* Navbar */}
      <nav className="relative z-20 px-6 py-4 flex justify-between items-center">
        <style>{`
          .al-logo-section {
            padding: 8px 12px !important;
            border-bottom: none !important;
          }
          .al-uline-wrap {
            display: none;
          }
          .al-spin-ring::after {
            --logo-bg: transparent;
            background: transparent !important;
          }
        `}</style>
        <Link to="/dashboard">
          <AnimatedLogo size="small" />
        </Link>
        {!user && (
          <Link
            to="/dashboard"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
        )}
        {user && (
          <Link
            to="/dashboard"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
        )}
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-4 pt-20 pb-12 flex flex-col items-center">
        {/* Center Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-3xl flex flex-col items-center text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
            Good {timeOfDay}, {userName}
          </h1>
          <p className="text-lg text-slate-400 mb-8">Your AI study universe</p>

          {/* Input Box */}
          <div
            className={`w-full relative transition-all duration-300 rounded-2xl ${isFocused ? "shadow-[0_0_30px_rgba(236,72,153,0.15)]" : ""}`}
          >
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[12px] rounded-2xl border border-pink-500/20" />
            <div className="relative flex items-center p-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                placeholder="Upload notes, paste a topic, or ask anything..."
                className="w-full bg-transparent border-none outline-none text-white px-4 py-3 placeholder:text-slate-500"
              />
              <button
                onClick={handleGenerate}
                className="shrink-0 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 rounded-xl hover:shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mt-8"
          >
            {[
              { icon: "📝", label: "Notes" },
              { icon: "🃏", label: "Flashcards" },
              { icon: "❓", label: "Quiz" },
              { icon: "🔮", label: "Diagram" },
              { icon: "📊", label: "PPT Slides" },
              { icon: "🎧", label: "Audio Notes" },
            ].map((pill, i) => (
              <button
                key={i}
                onClick={() =>
                  setPrompt(`Generate ${pill.label.toLowerCase()} for `)
                }
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 hover:border-pink-500/50 hover:shadow-[0_0_15px_rgba(236,72,153,0.2)] hover:text-pink-300 transition-all"
              >
                <span>{pill.icon}</span>
                {pill.label}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sources Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="md:col-span-3 bg-[#0a0f1e]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg">Sources</h2>
              <button className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                <Plus size={18} />
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-white/10 rounded-2xl hover:border-pink-500/30 hover:bg-pink-500/5 transition-all cursor-pointer group">
              <UploadCloud
                size={28}
                className="text-slate-500 group-hover:text-pink-400 mb-3 transition-colors"
              />
              <p className="text-sm text-slate-400 group-hover:text-slate-300">
                Add sources to get started
              </p>
            </div>
          </motion.div>

          {/* Chat Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="md:col-span-4 bg-[#0a0f1e]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 flex flex-col"
          >
            <h2 className="font-semibold text-lg mb-6">Recent Chats</h2>
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <MessageSquare
                size={32}
                className="text-slate-600 mb-3"
              />
              <p className="text-sm text-slate-500">
                No recent chats yet
              </p>
            </div>
          </motion.div>

          {/* Studio Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="md:col-span-5 bg-[#0a0f1e]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6"
          >
            <h2 className="font-semibold text-lg mb-6">Studio</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: FileText, label: "Notes", color: "text-blue-400" },
                {
                  icon: BookOpen,
                  label: "Flashcards",
                  color: "text-emerald-400",
                },
                { icon: HelpCircle, label: "Quiz", color: "text-amber-400" },
                { icon: Sparkles, label: "Diagram", color: "text-purple-400" },
                { icon: Presentation, label: "Slides", color: "text-pink-400" },
                { icon: Headphones, label: "Audio", color: "text-indigo-400" },
              ].map((tool, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all cursor-pointer flex items-center gap-3 group"
                >
                  <div className="p-2 rounded-xl bg-[#04080f] group-hover:scale-110 transition-transform">
                    <tool.icon size={18} className={tool.color} />
                  </div>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white">
                    {tool.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
    </>
  );
}
