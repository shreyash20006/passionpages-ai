import { useState } from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, RefreshCw, BookOpen, Layers, Table, Network, Presentation, Image as ImageIcon, Sparkles, Download, BookmarkPlus, Check, Loader2 } from 'lucide-react';
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
            <motion.div
              key="mindmap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-lg shadow-pink-500/20 mb-12 border border-white/10">
                {data.mindmap.root || 'Central Topic'}
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 w-full">
                {data.mindmap.branches.map((branch, i) => (
                  <div key={i} className="relative">
                    <div className="bg-[#1f2937]/80 border border-white/10 p-4 rounded-xl font-bold text-white mb-4 text-center shadow-inner">
                      {branch.label}
                    </div>
                    <ul className="space-y-2">
                      {(branch.nodes || []).map((node, j) => (
                        <li key={j} className="bg-[#0a0f1e]/50 border border-white/5 p-3 rounded-lg text-sm text-slate-300 shadow-sm flex items-center gap-3">
                          <div className="w-1.5 h-1.5 bg-pink-500 rounded-full shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
                          {node}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : renderComingSoon('Mind Map')
        )}

        {activeTab === 'slides' && (
          data.slides && data.slides.length > 0 ? (
            <motion.div
              key="slides"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              {data.slides.map((slide, i) => (
                <div key={i} className="bg-[#1f2937]/50 border border-white/10 rounded-3xl p-8 aspect-video flex flex-col justify-center shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-pink-500/10 to-transparent rounded-bl-full pointer-events-none" />
                  <div className="mb-8 relative z-10">
                    <span className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-2 block">Slide {i + 1}</span>
                    <h3 className="text-3xl font-display font-bold text-white">{slide.title}</h3>
                  </div>
                  <ul className="space-y-4 relative z-10">
                    {(slide.bullets || []).map((bullet, j) => (
                      <li key={j} className="flex items-start gap-3 text-lg text-slate-300">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2.5 shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>
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
