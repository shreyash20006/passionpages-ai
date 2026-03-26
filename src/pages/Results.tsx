import { useState } from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RefreshCw, BookOpen, Layers, Table, Network, Presentation, Image as ImageIcon, Sparkles, Download, BookmarkPlus, Check, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Markdown from 'react-markdown';
import Mermaid from '../components/Mermaid';
import { useAuth } from '../context/AuthContext';
import { getAuthToken } from '../lib/auth';

type Flashcard = {
  question: string;
  answer: string;
};

type ResultsData = {
  summary: string;
  flashcards: Flashcard[];
  table?: {
    headers: string[];
    rows: string[][];
  };
  mindmap?: {
    root: string;
    branches: { label: string; nodes: string[] }[];
  };
  slides?: {
    title: string;
    bullets: string[];
  }[];
  infographic?: {
    title: string;
    sections: { heading: string; content: string; icon: string }[];
  };
};

type TabType = 'summary' | 'flashcards' | 'table' | 'mindmap' | 'slides' | 'infographic';

export default function Results() {
  const location = useLocation();
  const { user } = useAuth();
  const data = location.state?.data as ResultsData;
  const initialTab = (location.state?.type as TabType) || 'summary';
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!data) {
    return <Navigate to="/upload" replace />;
  }

  const handleSave = async () => {
    if (!user) {
      // Fallback to localStorage if not logged in
      try {
        const savedNotes = JSON.parse(localStorage.getItem('passionpages_saved_notes') || '[]');
        const titleMatch = data.summary.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : 'Untitled Study Guide';
        const newNote = {
          id: Date.now().toString(),
          title,
          date: new Date().toISOString(),
          data
        };
        localStorage.setItem('passionpages_saved_notes', JSON.stringify([newNote, ...savedNotes]));
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      } catch (error) {
        console.error('Failed to save notes to localStorage:', error);
      }
      return;
    }

    setIsSaving(true);
    try {
      const token = await getAuthToken();
      const titleMatch = data.summary.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : 'Untitled Study Guide';

      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          data
        })
      });

      if (!response.ok) throw new Error('Failed to save note');

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save notes to Supabase:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    // Simple JSON export for now
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "study_guide.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const tabs = [
    { id: 'summary', label: 'Summary', icon: BookOpen, color: 'text-pink-500' },
    { id: 'flashcards', label: 'Flashcards', icon: Layers, color: 'text-purple-500' },
    { id: 'table', label: 'Data Table', icon: Table, color: 'text-emerald-400' },
    { id: 'mindmap', label: 'Mind Map', icon: Network, color: 'text-orange-400' },
    { id: 'slides', label: 'Slide Deck', icon: Presentation, color: 'text-rose-400' },
    { id: 'infographic', label: 'Infographic', icon: ImageIcon, color: 'text-indigo-400' },
  ];

  const renderComingSoon = (label: string) => (
    <motion.div
      key="coming-soon"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full flex flex-col items-center justify-center text-center py-20"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 text-pink-400 rounded-full flex items-center justify-center mb-6 animate-pulse shadow-inner">
        <Sparkles size={40} />
      </div>
      <h2 className="text-2xl font-display font-bold text-white mb-2">Generating {label}...</h2>
      <p className="text-slate-400 max-w-md mx-auto">
        We're using AI to transform your notes into a custom {label}. This feature is being tuned for maximum quality.
      </p>
      <button 
        onClick={() => setActiveTab('summary')}
        className="mt-8 text-pink-400 font-semibold hover:text-pink-300 transition-colors"
      >
        Back to Summary
      </button>
    </motion.div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <Link to="/upload" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4">
            <ArrowLeft size={16} />
            Back to Upload
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-display font-bold text-white">Your Study Guide</h1>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleSave}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isSaved 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                    : 'bg-[#1f2937]/50 text-slate-300 hover:bg-[#1f2937] border border-white/10'
                }`}
              >
                {isSaved ? <Check size={16} /> : <BookmarkPlus size={16} />}
                {isSaved ? 'Saved' : 'Save'}
              </button>
              <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-[#1f2937]/50 text-slate-300 rounded-xl text-sm font-bold hover:bg-[#1f2937] border border-white/10 transition-all"
              >
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap bg-[#0a0f1e]/80 backdrop-blur-md p-1.5 rounded-2xl gap-1 border border-white/5 shadow-inner">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all text-sm ${
                activeTab === tab.id 
                  ? `bg-[#1f2937] ${tab.color} shadow-sm border border-white/5` 
                  : 'text-slate-400 hover:text-white hover:bg-[#1f2937]/50'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#111827]/80 backdrop-blur-md rounded-[2.5rem] shadow-2xl shadow-black/20 border border-white/5 min-h-[600px] p-8 relative overflow-hidden">
        {activeTab === 'summary' && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-pink-400 prose-strong:text-white prose-code:text-pink-300 prose-pre:bg-[#0a0f1e] prose-pre:border prose-pre:border-white/10"
          >
            <Markdown
              components={{
                code(props: any) {
                  const { children, className, node, ...rest } = props;
                  const match = /language-(\w+)/.exec(className || '');
                  if (match && match[1] === 'mermaid') {
                    return <Mermaid chart={String(children).replace(/\n$/, '')} />;
                  }
                  return (
                    <code {...rest} className={className}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {data.summary}
            </Markdown>
          </motion.div>
        )}

        {activeTab === 'flashcards' && (
          data.flashcards && data.flashcards.length > 0 ? (
            <motion.div
              key="flashcards"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {data.flashcards.map((card, index) => (
                <FlashcardItem key={index} card={card} index={index} />
              ))}
            </motion.div>
          ) : renderComingSoon('Flashcards')
        )}

        {activeTab === 'table' && (
          data.table && data.table.headers && data.table.rows ? (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-x-auto"
            >
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#1f2937]/80 border-b border-white/10">
                    {data.table.headers.map((header, i) => (
                      <th key={i} className="px-6 py-4 text-left text-sm font-bold text-slate-300 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.table.rows.map((row, i) => (
                    <tr key={i} className="hover:bg-[#1f2937]/30 transition-colors">
                      {(row || []).map((cell, j) => (
                        <td key={j} className="px-6 py-4 text-sm text-slate-300 leading-relaxed">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          ) : renderComingSoon('Data Table')
        )}

        {activeTab === 'mindmap' && (
          data.mindmap && data.mindmap.branches ? (
            <AnimatedMindMap mindmap={data.mindmap} />
          ) : renderComingSoon('Mind Map')
        )}

        {activeTab === 'slides' && (
          data.slides && data.slides.length > 0 ? (
            <AnimatedSlideDeck slides={data.slides} />
          ) : renderComingSoon('Slide Deck')
        )}

        {activeTab === 'infographic' && (
          data.infographic && data.infographic.sections ? (
            <motion.div
              key="infographic"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
                  {data.infographic.title || 'Infographic'}
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {data.infographic.sections.map((section, i) => (
                  <div key={i} className="bg-[#1f2937]/50 border border-white/10 p-8 rounded-3xl shadow-inner hover:shadow-lg hover:shadow-pink-500/5 transition-all group">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <ImageIcon size={24} />
                    </div>
                    <h3 className="text-xl font-display font-bold text-white mb-3">{section.heading}</h3>
                    <p className="text-slate-400 leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : renderComingSoon('Infographic')
        )}
      </div>
    </div>
  );
}

function FlashcardItem({ card, index }: { card: Flashcard, index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative h-72 perspective-1000 cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-[#111827] to-[#0a0f1e] rounded-2xl border border-pink-500/20 p-6 flex flex-col shadow-lg shadow-pink-500/5 transition-shadow group-hover:shadow-pink-500/20">
          <div className="flex justify-between items-start mb-2 shrink-0">
            <span className="bg-pink-500/10 text-pink-400 border border-pink-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Card {index + 1}
            </span>
            <div className="flex items-center gap-1.5 text-pink-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-[#1f2937]/80 border border-white/10 px-2.5 py-1 rounded-full shadow-sm">
              <RefreshCw size={12} />
              FLIP
            </div>
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col custom-scrollbar">
            <h3 className="text-xl font-semibold text-white text-center m-auto py-2 leading-snug">
              {card.question}
            </h3>
          </div>
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 backface-hidden bg-gradient-to-br from-purple-900/40 to-pink-900/20 rounded-2xl border border-purple-500/30 p-6 flex flex-col shadow-lg shadow-purple-500/5"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="flex justify-between items-start mb-2 shrink-0">
            <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Answer
            </span>
            <RefreshCw size={14} className="text-purple-400 opacity-50" />
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col custom-scrollbar">
            <p className="text-slate-300 leading-relaxed text-center m-auto py-2 text-lg">
              {card.answer}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Animated Radial Mind Map ─────────────────────────────────────────────────
const BRANCH_COLORS = [
  { bg: 'from-pink-500 to-rose-500',     border: 'border-pink-500/50',   text: 'text-pink-300',   dot: '#ec4899', glow: 'shadow-pink-500/30'   },
  { bg: 'from-blue-500 to-cyan-500',     border: 'border-blue-500/50',   text: 'text-blue-300',   dot: '#3b82f6', glow: 'shadow-blue-500/30'   },
  { bg: 'from-emerald-500 to-teal-500',  border: 'border-emerald-500/50',text: 'text-emerald-300',dot: '#10b981', glow: 'shadow-emerald-500/30'},
  { bg: 'from-orange-500 to-amber-500',  border: 'border-orange-500/50', text: 'text-orange-300', dot: '#f97316', glow: 'shadow-orange-500/30' },
  { bg: 'from-purple-500 to-violet-500', border: 'border-purple-500/50', text: 'text-purple-300', dot: '#a855f7', glow: 'shadow-purple-500/30' },
  { bg: 'from-yellow-500 to-lime-500',   border: 'border-yellow-500/50', text: 'text-yellow-300', dot: '#eab308', glow: 'shadow-yellow-500/30' },
  { bg: 'from-cyan-500 to-sky-500',      border: 'border-cyan-500/50',   text: 'text-cyan-300',   dot: '#06b6d4', glow: 'shadow-cyan-500/30'   },
  { bg: 'from-red-500 to-pink-600',      border: 'border-red-500/50',    text: 'text-red-300',    dot: '#ef4444', glow: 'shadow-red-500/30'    },
];

function AnimatedMindMap({ mindmap }: { mindmap: { root: string; branches: { label: string; nodes: string[] }[] } }) {
  const branches = mindmap.branches || [];
  const count = branches.length;

  return (
    <motion.div
      key="mindmap"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full overflow-x-auto"
    >
      {/* ── Radial SVG layout ── */}
      <div className="relative w-full" style={{ minHeight: '680px' }}>
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        {/* Center glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 rounded-full bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-transparent blur-3xl" />
        </div>

        {/* SVG connection lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
          <defs>
            {branches.map((_, i) => {
              const c = BRANCH_COLORS[i % BRANCH_COLORS.length];
              return (
                <linearGradient key={i} id={`line-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={c.dot} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={c.dot} stopOpacity="0.2" />
                </linearGradient>
              );
            })}
          </defs>
          {branches.map((_, i) => {
            const angle = (360 / count) * i - 90;
            const rad = (angle * Math.PI) / 180;
            const cx = 50, cy = 50;
            const r = 32;
            const x2 = cx + r * Math.cos(rad);
            const y2 = cy + r * Math.sin(rad);
            const mx = cx + (r / 2) * Math.cos(rad);
            const my = cy + (r / 2) * Math.sin(rad);
            const c = BRANCH_COLORS[i % BRANCH_COLORS.length];
            return (
              <motion.path
                key={i}
                d={`M ${cx}% ${cy}% Q ${mx + (Math.sin(rad) * 8)}% ${my - (Math.cos(rad) * 8)}% ${x2}% ${y2}%`}
                fill="none"
                stroke={c.dot}
                strokeWidth="1.5"
                strokeOpacity="0.5"
                strokeDasharray="200"
                strokeDashoffset="200"
                strokeLinecap="round"
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.12, ease: 'easeOut' }}
              />
            );
          })}
        </svg>

        {/* Center node */}
        <motion.div
          className="absolute flex items-center justify-center z-10"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '140px', marginTop: '-70px', marginLeft: '-70px' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        >
          {/* Pulsing ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-pink-500/40"
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border border-purple-500/30"
            style={{ inset: '-12px' }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.05, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
          <div className="relative w-full h-full rounded-full bg-gradient-to-br from-pink-500 via-purple-600 to-violet-700 flex items-center justify-center shadow-2xl shadow-pink-500/40 border border-white/20 p-1">
            <div className="w-full h-full rounded-full bg-[#0a0f1e]/60 flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-bold text-sm text-center leading-tight px-3">
                {mindmap.root || 'Main Topic'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Branch nodes */}
        {branches.map((branch, i) => {
          const angle = (360 / count) * i - 90;
          const rad = (angle * Math.PI) / 180;
          const r = 32; // % from center
          const x = 50 + r * Math.cos(rad);
          const y = 50 + r * Math.sin(rad);
          const c = BRANCH_COLORS[i % BRANCH_COLORS.length];
          const floatDelay = i * 0.4;
          const floatDuration = 2.5 + (i % 3) * 0.5;

          return (
            <motion.div
              key={i}
              className="absolute z-20"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                width: '160px',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.3 + i * 0.12 }}
            >
              {/* Branch header */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: floatDuration, repeat: Infinity, ease: 'easeInOut', delay: floatDelay }}
                className="group cursor-default"
              >
                <div className={`bg-gradient-to-br ${c.bg} p-px rounded-2xl shadow-lg ${c.glow} shadow-md`}>
                  <div className="bg-[#0d1220] rounded-2xl px-3 py-2 text-center">
                    <span className={`font-bold text-sm ${c.text}`}>{branch.label}</span>
                  </div>
                </div>

                {/* Child nodes - appear below on hover-like trigger */}
                {(branch.nodes || []).length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {(branch.nodes || []).slice(0, 4).map((node, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + i * 0.12 + j * 0.07, duration: 0.35 }}
                        className={`bg-[#0d1220]/90 border ${c.border} rounded-xl px-3 py-1.5 flex items-center gap-2 hover:scale-105 transition-transform cursor-default`}
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: c.dot, boxShadow: `0 0 6px ${c.dot}aa` }}
                        />
                        <span className="text-slate-300 text-xs leading-snug line-clamp-2">{node}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-3 px-4">
        {branches.map((branch, i) => {
          const c = BRANCH_COLORS[i % BRANCH_COLORS.length];
          return (
            <div key={i} className="flex items-center gap-1.5 text-xs text-slate-400">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.dot }} />
              <span>{branch.label}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Premium Slide Deck Viewer ─────────────────────────────────────────────────
const SLIDE_THEMES = [
  { accent: '#ec4899', bg: 'from-pink-950/60 to-[#0d1220]',   bar: 'from-pink-500 to-rose-500',     num: 'text-pink-400',   border: 'border-pink-500/20'   },
  { accent: '#3b82f6', bg: 'from-blue-950/60 to-[#0d1220]',   bar: 'from-blue-500 to-cyan-400',     num: 'text-blue-400',   border: 'border-blue-500/20'   },
  { accent: '#a855f7', bg: 'from-purple-950/60 to-[#0d1220]', bar: 'from-purple-500 to-violet-400', num: 'text-purple-400', border: 'border-purple-500/20' },
  { accent: '#10b981', bg: 'from-emerald-950/60 to-[#0d1220]',bar: 'from-emerald-500 to-teal-400',  num: 'text-emerald-400',border: 'border-emerald-500/20'},
  { accent: '#f97316', bg: 'from-orange-950/60 to-[#0d1220]', bar: 'from-orange-500 to-amber-400',  num: 'text-orange-400', border: 'border-orange-500/20' },
  { accent: '#06b6d4', bg: 'from-cyan-950/60 to-[#0d1220]',   bar: 'from-cyan-500 to-sky-400',      num: 'text-cyan-400',   border: 'border-cyan-500/20'   },
];

function AnimatedSlideDeck({ slides }: { slides: { title: string; bullets: string[] }[] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const total = slides.length;
  const theme = SLIDE_THEMES[current % SLIDE_THEMES.length];

  const go = (idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(Math.max(0, Math.min(total - 1, idx)));
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0, scale: 0.97 }),
  };

  const slide = slides[current];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4 w-full"
    >
      {/* ── Main slide panel ── */}
      <div className="flex-1 flex flex-col">
        {/* Progress bar */}
        <div className="h-1 w-full bg-white/5 rounded-full mb-4 overflow-hidden">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${theme.bar}`}
            animate={{ width: `${((current + 1) / total) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Slide card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl" style={{ aspectRatio: '16/9', minHeight: '380px' }}>
          {/* Colored accent line */}
          <motion.div
            className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.bar} z-10`}
            layoutId="accent-bar"
          />

          {/* Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg}`} />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{ background: theme.accent }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5 blur-3xl"
            style={{ background: theme.accent }} />

          {/* Dot grid pattern */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

          {/* Animated content */}
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative z-10 h-full flex flex-col justify-center p-10 lg:p-14"
            >
              {/* Slide number */}
              <div className="flex items-center gap-3 mb-6">
                <span className={`text-xs font-bold uppercase tracking-[0.2em] ${theme.num}`}>
                  Slide {current + 1} / {total}
                </span>
                <div className="h-px flex-1 opacity-20" style={{ background: theme.accent }} />
              </div>

              {/* Title */}
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8 leading-tight">
                {slide.title}
              </h2>

              {/* Bullets */}
              <ul className="space-y-3">
                {(slide.bullets || []).map((bullet, j) => (
                  <motion.li
                    key={j}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: j * 0.08, duration: 0.3 }}
                    className="flex items-start gap-4"
                  >
                    <span
                      className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white mt-0.5"
                      style={{ background: theme.accent, boxShadow: `0 0 12px ${theme.accent}66` }}
                    >
                      {j + 1}
                    </span>
                    <span className="text-slate-200 text-base lg:text-lg leading-relaxed">{bullet}</span>
                  </motion.li>
                ))}
              </ul>

              {/* PassionPages brand */}
              <div className="absolute bottom-5 right-8 text-xs text-white/20 font-medium tracking-wider">
                PassionPages.ai
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => go(current - 1)}
            disabled={current === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} /> Previous
          </button>

          {/* Dot indicators */}
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === current ? '20px' : '6px',
                  height: '6px',
                  background: i === current ? theme.accent : 'rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </div>

          <button
            onClick={() => go(current + 1)}
            disabled={current === total - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ── Thumbnail panel ── */}
      <div className="hidden lg:flex flex-col gap-2 w-36 shrink-0 overflow-y-auto max-h-[520px] pr-1 custom-scrollbar">
        {slides.map((s, i) => {
          const t = SLIDE_THEMES[i % SLIDE_THEMES.length];
          return (
            <motion.button
              key={i}
              onClick={() => go(i)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={`relative rounded-xl overflow-hidden border-2 transition-all ${i === current ? t.border + ' shadow-lg' : 'border-white/10'}`}
              style={{ aspectRatio: '16/9' }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${t.bg}`} />
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${t.bar}`} />
              <div className="absolute inset-0 p-2 flex flex-col justify-center">
                <p className="text-white/90 text-[8px] font-bold leading-snug line-clamp-2">{s.title}</p>
              </div>
              <div className="absolute bottom-1 right-1.5 text-white/30 text-[7px] font-bold">{i + 1}</div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
