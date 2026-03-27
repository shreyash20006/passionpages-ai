import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UploadCloud,
  MessageSquare,
  Send,
  FileText,
  Layers,
  Network,
  HelpCircle,
  Presentation,
  FileDown,
  Image as ImageIcon,
  Download,
  ExternalLink,
  Save,
  Bot,
  User,
  MoreHorizontal,
} from 'lucide-react';
import Mermaid from '../components/Mermaid';

const AnimatedCounter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = value / (1200 / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <>{count}</>;
};

export default function Dashboard() {
  const [chatInput, setChatInput]   = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const tools = [
    { name: 'Generate Summary',  icon: FileText,     path: '/upload?type=summary' },
    { name: 'AI Chat',           icon: MessageSquare, path: '/chat' },
    { name: 'Create Flashcards', icon: Layers,        path: '/upload?type=flashcards' },
    { name: 'Generate Diagram',  icon: Network,       path: '/upload?type=mindmap' },
    { name: 'Create Quiz',       icon: HelpCircle,    path: '/upload?type=table' },
    { name: 'Generate PPT',      icon: Presentation,  path: '/upload?type=slides' },
  ];

  const stats = [
    { label: 'Notes Generated', value: 24, icon: FileText },
    { label: 'Flashcards',      value: 156, icon: Layers },
    { label: 'Quizzes Taken',   value: 8,  icon: HelpCircle },
  ];

  return (
    <div className="flex flex-col gap-6 pb-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 pt-1">
        <div>
          <h1 className="text-xl font-semibold text-white">Dashboard</h1>
          <p className="text-sm text-[#71717a] mt-0.5">Welcome back — what are we studying today?</p>
        </div>
        <button
          onClick={() => navigate('/upload')}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold rounded-md transition-colors"
        >
          <UploadCloud size={14} />
          New Project
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
            className="bg-[#18181b] border border-[#3f3f46] rounded-lg p-4 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-md bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <stat.icon size={15} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-[11px] text-[#71717a] font-medium">{stat.label}</p>
              <p className="text-lg font-semibold text-white leading-tight">
                <AnimatedCounter value={stat.value} />
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {tools.map((tool, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Link to={tool.path} className="block group">
              <div className="bg-[#18181b] border border-[#3f3f46] hover:border-[#52525b] rounded-lg p-4 flex flex-col items-center gap-3 text-center transition-colors">
                <div className="w-9 h-9 rounded-md bg-[#27272a] group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 border border-[#3f3f46] flex items-center justify-center transition-colors">
                  <tool.icon size={17} className="text-[#a1a1aa] group-hover:text-indigo-400 transition-colors" />
                </div>
                <span className="text-xs font-medium text-[#a1a1aa] group-hover:text-white transition-colors leading-tight">{tool.name}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Main Area */}
      <div className="grid lg:grid-cols-12 gap-5 min-h-[560px]">

        {/* Left: Upload + Chat */}
        <div className="lg:col-span-4 flex flex-col gap-5">

          {/* Upload */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); navigate('/upload'); }}
            onClick={() => navigate('/upload')}
            className={`relative rounded-lg border-2 border-dashed p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors shrink-0
              ${isDragging
                ? 'border-indigo-500 bg-indigo-500/5'
                : 'border-[#3f3f46] hover:border-[#52525b] hover:bg-[#18181b]'
              }`}
          >
            <div className="w-10 h-10 rounded-lg bg-[#27272a] border border-[#3f3f46] flex items-center justify-center mb-3">
              <UploadCloud size={20} className="text-[#71717a]" />
            </div>
            <p className="text-sm font-medium text-white mb-1">Drag & drop or upload</p>
            <p className="text-xs text-[#71717a]">PDF, DOCX, PPTX, Images · up to 50 MB</p>
            <button className="mt-4 px-4 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold rounded-md transition-colors">
              Browse Files
            </button>
          </div>

          {/* Chat panel */}
          <div className="flex-1 bg-[#18181b] border border-[#3f3f46] rounded-lg flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-[#27272a] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <MessageSquare size={13} className="text-indigo-400" />
                </div>
                <span className="text-sm font-medium text-white">AI Tutor</span>
              </div>
              <button className="text-[#52525b] hover:text-[#a1a1aa] transition-colors">
                <MoreHorizontal size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#27272a] border border-[#3f3f46] flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-indigo-400" />
                </div>
                <div className="bg-[#27272a] rounded-lg rounded-tl-none px-3 py-2.5 text-sm text-[#d4d4d8] leading-relaxed">
                  Hi! I'm your PassionPages AI assistant. Upload study materials or ask me anything to get started.
                </div>
              </div>
              <div className="flex gap-3 flex-row-reverse">
                <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                  <User size={14} className="text-white" />
                </div>
                <div className="bg-indigo-500 rounded-lg rounded-tr-none px-3 py-2.5 text-sm text-white leading-relaxed">
                  Explain the core principles of Neural Networks.
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-[#27272a] shrink-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask your AI tutor..."
                  className="flex-1 px-3 py-2 bg-[#09090b] border border-[#3f3f46] rounded-md text-sm text-white placeholder:text-[#52525b] outline-none focus:border-indigo-500 transition-colors"
                />
                <button className="p-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-md transition-colors shrink-0">
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Output */}
        <div className="lg:col-span-8 bg-[#18181b] border border-[#3f3f46] rounded-lg flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-5 py-3 border-b border-[#27272a] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-md bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <FileText size={14} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Neural Networks Fundamentals</p>
                <p className="text-[11px] text-[#71717a]">AI Generated · 2 mins ago</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 border border-[#3f3f46] rounded-md overflow-hidden">
                {[FileDown, ImageIcon, Download, ExternalLink].map((Icon, i) => (
                  <button key={i} className="p-1.5 text-[#71717a] hover:text-white hover:bg-[#27272a] transition-colors">
                    <Icon size={14} />
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold rounded-md transition-colors">
                <Save size={13} />
                Save
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="max-w-3xl mx-auto space-y-6">
              <div>
                <h1 className="text-lg font-semibold text-white mb-3">Deep Dive into Neural Networks</h1>
                <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-lg px-4 py-3">
                  <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">Core Insight</p>
                  <p className="text-sm text-[#d4d4d8] italic leading-relaxed">
                    "Neural networks are the computational backbone of modern AI, designed to recognize patterns by mimicking the structure of the human brain."
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-white mb-3">Structural Components</h2>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { title: 'Input Layer',   desc: 'Receives initial data for processing.' },
                    { title: 'Hidden Layers', desc: 'Performs complex transformations.' },
                    { title: 'Output Layer',  desc: 'Produces the final prediction.' },
                  ].map((box, i) => (
                    <div key={i} className="bg-[#27272a] border border-[#3f3f46] rounded-lg p-3">
                      <p className="text-xs font-semibold text-white mb-1">{box.title}</p>
                      <p className="text-xs text-[#71717a] leading-relaxed">{box.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-white mb-3">How It Works</h2>
                <ol className="space-y-2">
                  {[
                    ['Forward Propagation', 'Data flows through the network, multiplied by weights and passed through activation functions.'],
                    ['Loss Calculation', 'The difference between the predicted output and actual target is measured.'],
                    ['Backpropagation', 'The network adjusts weights in reverse to minimize the error using gradient descent.'],
                  ].map(([title, desc], i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-[11px] font-bold mt-0.5">{i + 1}</span>
                      <p className="text-[#d4d4d8]"><span className="font-medium text-white">{title}: </span>{desc}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-white mb-3">Network Architecture</h2>
                <div className="bg-[#09090b] border border-[#27272a] rounded-lg p-6 flex justify-center">
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
  style C fill:#6366f1,stroke:#818cf8,color:#fff
  style D fill:#6366f1,stroke:#818cf8,color:#fff
  style E fill:#6366f1,stroke:#818cf8,color:#fff`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
