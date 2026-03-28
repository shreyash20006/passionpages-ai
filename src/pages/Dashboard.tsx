import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText, Layers, Network, HelpCircle, Presentation, MessageSquare,
  UploadCloud, Sparkles, Share2, TrendingUp,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const tools = [
  { name: "Summary", icon: FileText, color: "from-pink-500 to-rose-500", path: "/upload?type=summary" },
  { name: "AI Chat", icon: MessageSquare, color: "from-emerald-400 to-teal-500", path: "/chat" },
  { name: "Flashcards", icon: Layers, color: "from-purple-500 to-indigo-500", path: "/upload?type=flashcards" },
  { name: "Diagram", icon: Network, color: "from-pink-400 to-purple-500", path: "/upload?type=mindmap" },
  { name: "Quiz", icon: HelpCircle, color: "from-blue-500 to-cyan-500", path: "/upload?type=table" },
  { name: "PPT Slides", icon: Presentation, color: "from-orange-400 to-red-500", path: "/upload?type=slides" },
];

const stats = [
  { label: "Notes", value: 10, icon: FileText, color: "from-pink-500 to-rose-500" },
  { label: "Flashcards", value: 68, icon: Layers, color: "from-purple-500 to-indigo-500" },
  { label: "Quizzes", value: 3, icon: HelpCircle, color: "from-blue-500 to-cyan-500" },
];

function Counter({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = value / (1200 / 16);
    const t = setInterval(() => {
      start += step;
      if (start >= value) { setCount(value); clearInterval(t); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [value]);
  return <>{count}</>;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const name = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "Explorer";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex flex-col gap-6 pb-4">

      {/* ── Header ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            {greeting},{" "}
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              {name}
            </span>{" "}
            🚀
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">What shall we study today?</p>
        </div>
        <button
          onClick={() => navigate("/upload")}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl text-sm font-bold hover:shadow-lg hover:shadow-pink-500/30 transition-all active:scale-95"
        >
          <Sparkles size={16} />
          <span className="hidden sm:inline">New Project</span>
          <span className="sm:hidden">New</span>
        </button>
      </motion.div>

      {/* ── Stats Row ──────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-[#0d1424] border border-white/5 rounded-2xl p-4 flex flex-col gap-2"
          >
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
              <stat.icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white leading-none">
                <Counter value={stat.value} />
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Upload CTA ─────────────────────────────────────── */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => navigate("/upload")}
        className="w-full bg-[#0d1424] border-2 border-dashed border-white/10 hover:border-pink-500/40 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 text-center transition-all group active:scale-[0.99]"
      >
        <div className="w-14 h-14 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <UploadCloud size={28} className="text-pink-400" />
        </div>
        <div>
          <p className="font-bold text-white text-base">
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Upload</span> your notes
          </p>
          <p className="text-sm text-slate-400 mt-0.5">PDF, DOCX, PPTX or images · up to 50 MB</p>
        </div>
        <span className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl text-sm font-bold w-full hover:shadow-lg hover:shadow-pink-500/25 transition-all">
          Browse Files
        </span>
      </motion.button>

      {/* ── Tools Grid ─────────────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Quick Tools</p>
        <div className="grid grid-cols-3 gap-3">
          {tools.map((tool, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.06 }}
            >
              <Link to={tool.path} className="block group">
                <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-4 flex flex-col items-center gap-3 text-center hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/10 transition-all active:scale-95 group-hover:scale-[1.03]">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <tool.icon size={22} />
                  </div>
                  <span className="text-xs font-semibold text-slate-300 group-hover:text-pink-400 transition-colors leading-tight">{tool.name}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Recent Activity ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-[#0d1424] border border-white/5 rounded-3xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-pink-400" />
            <h3 className="text-sm font-bold text-white">Recent</h3>
          </div>
          <Link to="/saved" className="text-xs text-pink-400 font-semibold hover:text-pink-300 transition-colors">View all</Link>
        </div>

        <div className="divide-y divide-white/5">
          {[
            { title: "Neural Networks Fundamentals", type: "AI Summary", time: "2 min ago", icon: FileText, color: "from-pink-500 to-rose-500" },
            { title: "Thermodynamics Flashcards", type: "Flashcards", time: "1 hr ago", icon: Layers, color: "from-purple-500 to-indigo-500" },
            { title: "Organic Chemistry Quiz", type: "Quiz", time: "Yesterday", icon: HelpCircle, color: "from-blue-500 to-cyan-500" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors active:bg-white/5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shrink-0`}>
                <item.icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-200 truncate">{item.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.type} · {item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
