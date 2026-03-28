import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UploadCloud, MessageSquare, Send, FileText, Layers, Network,
  HelpCircle, Presentation, Bot, User, MoreHorizontal,
  ArrowRight, TrendingUp, Clock, BookOpen, Sparkles,
} from 'lucide-react';
import Mermaid from '../components/Mermaid';
import { useAuth } from '../context/AuthContext';

const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = value / (900 / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <>{count}{suffix}</>;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [chatInput, setChatInput]   = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  const userName = user?.displayName?.split(" ")[0] || "there";

  const tools = [
    { name: 'Generate Summary',  icon: FileText,      path: '/upload?type=summary',    color: '#a855f7', desc: 'From notes or topic' },
    { name: 'AI Chat',           icon: MessageSquare, path: '/chat',                   color: '#ec4899', desc: 'Your personal tutor' },
    { name: 'Create Flashcards', icon: Layers,        path: '/upload?type=flashcards', color: '#6366f1', desc: 'Q&A revision cards' },
    { name: 'Generate Diagram',  icon: Network,       path: '/upload?type=mindmap',    color: '#14b8a6', desc: 'Mind maps & flows' },
    { name: 'Create Quiz',       icon: HelpCircle,    path: '/upload?type=table',      color: '#f59e0b', desc: 'MCQ with feedback' },
    { name: 'Generate PPT',      icon: Presentation,  path: '/upload?type=slides',     color: '#10b981', desc: 'Slide decks instantly' },
  ];

  const stats = [
    { label: 'Notes Generated', value: 24,  icon: FileText,     color: '#a855f7', change: '+3 today' },
    { label: 'Flashcards',      value: 156, icon: Layers,       color: '#ec4899', change: '+12 today' },
    { label: 'Quizzes Taken',   value: 8,   icon: HelpCircle,   color: '#6366f1', change: '+1 today' },
  ];

  const recent = [
    { title: 'Beta Blockers — Pharmacology', time: '2h ago', icon: FileText, color: '#a855f7' },
    { title: 'Newton\'s Laws of Motion',     time: '5h ago', icon: BookOpen, color: '#ec4899' },
    { title: 'Data Structures Quiz',         time: '1d ago', icon: HelpCircle, color: '#f59e0b' },
  ];

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pt-1">
        <div>
          <h1 className="text-xl font-bold text-white">
            Good morning, <span className="gradient-text">{userName}</span> �
          </h1>
          <p className="text-sm text-[#71717a] mt-0.5">What are we studying today?</p>
        </div>
        <button 
          onClick={() => navigate('/upload')}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 btn-primary text-white text-xs font-semibold rounded-lg"
        >
          <UploadCloud size={14} /> New Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="relative overflow-hidden bg-[#18181b] border border-[#27272a] rounded-xl p-4 group hover:border-opacity-60 transition-all"
            style={{ '--hover-color': stat.color } as any}
          >
            {/* top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${stat.color}60, transparent)` }} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] text-[#71717a] font-medium mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-white leading-tight">
                  <AnimatedCounter value={stat.value} />
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: stat.color + '15', border: `1px solid ${stat.color}25` }}>
                <stat.icon size={16} style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-[10px] mt-2 flex items-center gap-1" style={{ color: stat.color }}>
              <TrendingUp size={10} /> {stat.change}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Tools Grid */}
      <div>
        <p className="text-[11px] font-semibold text-[#52525b] uppercase tracking-widest mb-3">Quick Actions</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {tools.map((tool, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 8 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link to={tool.path} className="block group">
                <div className="tool-card bg-[#18181b] border border-[#27272a] rounded-xl p-4 flex flex-col gap-3 text-center items-center">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: tool.color + '18', border: `1px solid ${tool.color}28` }}>
                    <tool.icon size={18} style={{ color: tool.color }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#a1a1aa] group-hover:text-white transition-colors leading-tight">
                      {tool.name}
                    </p>
                    <p className="text-[10px] text-[#52525b] mt-0.5 leading-tight">{tool.desc}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Area */}
      <div className="grid lg:grid-cols-12 gap-5 min-h-[520px]">
        {/* Left */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Upload zone */}
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={e => { e.preventDefault(); setIsDragging(false); navigate('/upload'); }}
            onClick={() => navigate('/upload')}
            className={`relative rounded-xl border-2 border-dashed p-7 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              isDragging ? 'border-purple-500 bg-purple-500/5' : 'border-[#27272a] hover:border-purple-500/40 hover:bg-white/[0.02]'
            }`}
          >
            <div className="w-11 h-11 rounded-xl bg-[#27272a] border border-[#3f3f46] flex items-center justify-center mb-3">
              <UploadCloud size={20} className="text-[#71717a]" />
            </div>
            <p className="text-sm font-semibold text-white mb-1">Drag & drop files</p>
            <p className="text-xs text-[#71717a] mb-4">PDF, DOCX, PPTX, Images · up to 50 MB</p>
            <button className="px-4 py-1.5 btn-primary text-white text-xs font-semibold rounded-lg">
              Browse Files
            </button>
          </div>

          {/* Recent */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={13} className="text-[#52525b]" />
                <span className="text-sm font-semibold text-white">Recent</span>
              </div>
              <Link to="/saved" className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-0.5">
                See all <ArrowRight size={11} />
              </Link>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {recent.map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: item.color + '18', border: `1px solid ${item.color}28` }}>
                    <item.icon size={13} style={{ color: item.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-white truncate">{item.title}</p>
                    <p className="text-[10px] text-[#52525b] mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mini Chat */}
          <div className="flex-1 bg-[#18181b] border border-[#27272a] rounded-xl flex flex-col overflow-hidden min-h-[200px]">
            <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Sparkles size={12} className="text-purple-400" />
                </div>
                <span className="text-sm font-semibold text-white">AI Tutor</span>
              </div>
              <Link to="/chat" className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-0.5">
                Open <ArrowRight size={11} />
              </Link>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
              <div className="flex gap-2.5">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                  <Bot size={12} className="text-white" />
                </div>
                <div className="bg-[#27272a] rounded-xl rounded-tl-none px-3 py-2 text-xs text-[#d4d4d8] leading-relaxed">
                  Hi! Upload notes or ask me anything to get started. 🚀
                </div>
              </div>
              <div className="flex gap-2.5 flex-row-reverse">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                  <User size={12} className="text-white" />
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl rounded-tr-none px-3 py-2 text-xs text-white leading-relaxed">
                  Explain Neural Networks
                </div>
              </div>
            </div>
            <div className="p-3 border-t border-white/[0.06] shrink-0">
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={chatInput} 
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Ask your AI tutor..."
                  className="flex-1 px-3 py-1.5 bg-[#09090b] border border-[#27272a] rounded-lg text-xs text-white placeholder:text-[#52525b] outline-none focus:border-purple-500/50 transition-colors" 
                />
                <button 
                  onClick={() => { if(chatInput.trim()) navigate('/chat', { state: { initialPrompt: chatInput } }); }}
                  className="p-1.5 btn-primary text-white rounded-lg shrink-0"
                >
                  <Send size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Output panel */}
        <div className="lg:col-span-8 bg-[#18181b] border border-[#27272a] rounded-xl flex flex-col overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <FileText size={14} className="text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Neural Networks Fundamentals</p>
                <p className="text-[11px] text-[#52525b]">AI Generated · 2 mins ago</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-[#09090b] border border-[#27272a] rounded-lg overflow-hidden">
                {['Notes', 'Flashcards', 'Quiz'].map(tab => (
                  <button key={tab} className="px-3 py-1.5 text-[11px] font-medium text-[#71717a] hover:text-white transition-colors">
                    {tab}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 btn-primary text-white text-xs font-semibold rounded-lg">
                Save
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="max-w-3xl mx-auto space-y-5">
              {/* Quote highlight */}
              <div className="relative overflow-hidden bg-gradient-to-r from-purple-500/8 to-pink-500/5 border border-purple-500/20 rounded-xl px-5 py-4">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 rounded-l-xl" />
                <p className="text-[11px] font-bold text-purple-400 uppercase tracking-widest mb-1.5">Core Insight</p>
                <p className="text-sm text-[#d4d4d8] italic leading-relaxed">
                  Neural networks are the computational backbone of modern AI, designed to recognize patterns by mimicking the structure of the human brain.
                </p>
              </div>

              {/* Section */}
              <div>
                <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-purple-500/20 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  </span>
                  Structural Components
                </h2>
                <div className="grid sm:grid-cols-3 gap-2.5">
                  {[
                    { title: 'Input Layer',   desc: 'Receives initial data', color: '#a855f7' },
                    { title: 'Hidden Layers', desc: 'Transforms data',       color: '#ec4899' },
                    { title: 'Output Layer',  desc: 'Final prediction',      color: '#6366f1' },
                  ].map((box, i) => (
                    <div key={i} className="bg-[#27272a] border border-[#3f3f46] rounded-xl p-3.5">
                      <div className="w-6 h-1 rounded-full mb-2" style={{ background: box.color }} />
                      <p className="text-xs font-bold text-white mb-1">{box.title}</p>
                      <p className="text-[11px] text-[#71717a] leading-relaxed">{box.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div>
                <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-pink-500/20 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                  </span>
                  How It Works
                </h2>
                <ol className="space-y-2.5">
                  {[
                    ['Forward Propagation', 'Data flows through the network via weights and activation functions.'],
                    ['Loss Calculation', 'Measures the gap between prediction and actual target.'],
                    ['Backpropagation', 'Adjusts weights using gradient descent to minimize error.'],
                  ].map(([title, desc], i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/25 flex items-center justify-center text-purple-300 text-[11px] font-bold mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-[#c4c4c8] leading-relaxed">
                        <span className="font-semibold text-white">{title}: </span>
                        {desc}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Diagram */}
              <div>
                <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-teal-500/20 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  </span>
                  Network Architecture
                </h2>
                <div className="bg-[#09090b] border border-[#27272a] rounded-xl p-5 flex justify-center">
                  <Mermaid chart={`flowchart TD
subgraph Input
A[Feature 1]
B[Feature 2]
end
subgraph Hidden
C((Node 1))
D((Node 2))
E((Node 3))
end
subgraph Output
F[Prediction]
end
A --> C
A --> D
B --> D
B --> E
C --> F
D --> F
E --> F
style C fill:#7c3aed,stroke:#a855f7,color:#fff
style D fill:#7c3aed,stroke:#a855f7,color:#fff
style E fill:#7c3aed,stroke:#a855f7,color:#fff`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
