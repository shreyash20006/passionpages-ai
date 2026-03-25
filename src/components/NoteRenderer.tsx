import { useState } from 'react';
import { Brain, Lightbulb, AlertTriangle, Star, ChevronDown, ChevronUp } from 'lucide-react';
import Mermaid from './Mermaid';

// ── Types ────────────────────────────────────────────────────
interface Highlight { text: string; type: 'tip' | 'warning' | 'important'; }
interface TableData { headers: string[]; rows: string[][]; }
interface DiagramData { type: string; mermaidCode: string; description?: string; }

interface Section {
  heading: string;
  icon: string;
  color: string;
  body?: string;
  keyPoints?: string[];
  table?: TableData;
  highlight?: Highlight;
  diagram?: DiagramData;
}

interface Flashcard { id: string; front: string; back: string; hint?: string; }
interface QuizQuestion { id: string; question: string; options: string[]; correct: number; explanation: string; }

interface StudyContent {
  type: 'notes' | 'flashcards' | 'quiz' | 'diagram';
  title: string;
  subject?: string;
  emoji?: string;
  sections?: Section[];
  summary?: string;
  mnemonic?: string;
  flashcards?: Flashcard[];
  questions?: QuizQuestion[];
  mermaidCode?: string;
  description?: string;
}

// ── Helper Components ─────────────────────────────────────────

function HighlightBox({ data }: { data: Highlight }) {
  const styles = {
    tip:       { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: <Lightbulb size={14}/>, label: 'Pro Tip' },
    warning:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   text: 'text-amber-400',   icon: <AlertTriangle size={14}/>, label: 'Warning' },
    important: { bg: 'bg-red-500/10',     border: 'border-red-500/30',     text: 'text-red-400',     icon: <Star size={14}/>, label: 'Important' },
  };
  const s = styles[data.type] || styles.tip;
  return (
    <div className={`${s.bg} border-l-2 ${s.border} rounded-r-xl p-3 mt-3`}>
      <div className={`flex items-center gap-1.5 ${s.text} font-semibold text-xs mb-1`}>
        {s.icon} {s.label}
      </div>
      <p className="text-slate-300 text-sm leading-relaxed m-0">{data.text}</p>
    </div>
  );
}

function DataTable({ table }: { table: TableData }) {
  return (
    <div className="overflow-x-auto mt-3 rounded-xl border border-white/10">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {table.headers.map((h, i) => (
              <th key={i} className="px-4 py-2.5 text-left font-semibold text-slate-300 bg-[#1f2937]/80 border-b border-white/10 text-xs uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i} className="border-b border-white/5 hover:bg-[#1f2937]/30 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 text-slate-300 text-sm">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Flashcard Component ───────────────────────────────────────
function FlashcardDeck({ data }: { data: StudyContent }) {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());

  if (!data.flashcards?.length) return null;
  const card = data.flashcards[current];
  const progress = Math.round((known.size / data.flashcards.length) * 100);

  function next() { setFlipped(false); setTimeout(() => setCurrent(i => (i + 1) % data.flashcards!.length), 150); }
  function prev() { setFlipped(false); setTimeout(() => setCurrent(i => (i - 1 + data.flashcards!.length) % data.flashcards!.length), 150); }

  return (
    <div className="max-w-2xl">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-white">🃏 {data.title}</h2>
        <span className="text-slate-400 text-sm">{current + 1} / {data.flashcards.length}</span>
      </div>

      {/* Progress bar */}
      <div className="bg-[#1f2937] rounded-full h-1.5 mb-5 overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full transition-all duration-500 relative"
          style={{ width: `${((current + 1) / data.flashcards.length) * 100}%` }}>
            <div className="absolute inset-0 bg-white/20 animate-pulse-glow"></div>
        </div>
      </div>

      {/* Card flip */}
      <div onClick={() => setFlipped(f => !f)} style={{ perspective: '1000px', cursor: 'pointer', height: '220px' }}>
        <div style={{
          position: 'relative', width: '100%', height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
        }}>
          {/* Front */}
          <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden' }}
            className="bg-gradient-to-br from-[#111827] to-[#0a0f1e] border border-pink-500/20 rounded-2xl flex flex-col items-center justify-center p-8 text-center shadow-lg shadow-pink-500/5">
            <div className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-4">QUESTION</div>
            <div className="text-white text-lg font-semibold leading-relaxed">{card.front}</div>
            {card.hint && <div className="text-slate-500 text-xs mt-4 italic">💡 {card.hint}</div>}
            <div className="text-slate-600 text-xs mt-6">Click to flip</div>
          </div>
          {/* Back */}
          <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 border border-purple-500/30 rounded-2xl flex flex-col items-center justify-center p-8 text-center shadow-lg shadow-purple-500/5">
            <div className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-4">ANSWER</div>
            <div className="text-white text-base leading-relaxed">{card.back}</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 mt-4 justify-center">
        <button onClick={prev} className="px-5 py-2 bg-[#1f2937]/50 border border-white/10 text-slate-300 rounded-xl text-sm font-medium hover:bg-[#1f2937] transition-colors">← Prev</button>
        <button onClick={() => { setKnown(p => new Set([...p, current])); next(); }}
          className="px-5 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm font-medium hover:bg-emerald-500/20 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]">✓ Know it</button>
        <button onClick={next} className="px-5 py-2 bg-[#1f2937]/50 border border-white/10 text-slate-300 rounded-xl text-sm font-medium hover:bg-[#1f2937] transition-colors">Next →</button>
      </div>
      <div className="text-center text-slate-500 text-xs mt-2">✅ Known: {known.size}/{data.flashcards.length} ({progress}%)</div>
    </div>
  );
}

// ── Quiz Component ────────────────────────────────────────────
function QuizEngine({ data }: { data: StudyContent }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [done, setDone] = useState(false);

  if (!data.questions?.length) return null;
  const q = data.questions[current];
  const score = answers.filter((a, i) => a === data.questions![i].correct).length;
  const pct = Math.round((score / data.questions.length) * 100);

  function next() {
    setAnswers(p => [...p, selected]);
    if (current + 1 >= data.questions!.length) setDone(true);
    else { setCurrent(c => c + 1); setSelected(null); }
  }

  function optStyle(idx: number) {
    const base = "w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all mb-2 flex items-center gap-3";
    if (selected === null) return `${base} border-white/10 bg-[#1f2937]/30 text-slate-300 hover:border-pink-500/50 hover:bg-pink-500/5 hover:shadow-[0_0_15px_rgba(236,72,153,0.1)] cursor-pointer`;
    if (idx === q.correct) return `${base} border-emerald-500 bg-emerald-500/10 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]`;
    if (idx === selected) return `${base} border-red-500 bg-red-500/10 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.1)]`;
    return `${base} border-white/5 bg-[#1f2937]/10 text-slate-500`;
  }

  if (done) return (
    <div className="text-center py-10">
      <div className="text-5xl mb-4">{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '📚'}</div>
      <div className="text-3xl font-bold text-white mb-1">{score}/{data.questions.length}</div>
      <div className={`text-4xl font-black mb-3 ${pct >= 80 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{pct}%</div>
      <div className="text-slate-400 mb-6">{pct >= 80 ? 'Excellent! Ready for exam 🚀' : pct >= 50 ? 'Good! Review wrong answers 📖' : 'Keep studying! 💪'}</div>
      <button onClick={() => { setCurrent(0); setSelected(null); setAnswers([]); setDone(false); }}
        className="px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-pink-500/25 transition-all">
        Retry Quiz
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-white">❓ {data.title}</h2>
        <span className="text-slate-400 text-sm">{current + 1}/{data.questions.length}</span>
      </div>
      <div className="bg-[#1f2937] rounded-full h-1.5 mb-5 overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full transition-all relative"
          style={{ width: `${(current / data.questions.length) * 100}%` }}>
            <div className="absolute inset-0 bg-white/20 animate-pulse-glow"></div>
        </div>
      </div>
      <div className="bg-[#111827]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-5 mb-4 text-white font-semibold leading-relaxed shadow-lg shadow-black/20">{q.question}</div>
      <div>
        {q.options.map((opt, idx) => (
          <button key={idx} onClick={() => selected === null && setSelected(idx)} className={optStyle(idx)}>
            <span className="w-7 h-7 rounded-lg bg-[#0a0f1e] border border-white/10 flex items-center justify-center text-xs font-bold flex-shrink-0 text-pink-400">
              {['A','B','C','D'][idx]}
            </span>
            {opt}
          </button>
        ))}
      </div>
      {selected !== null && (
        <>
          <div className="bg-[#111827]/50 border border-purple-500/20 rounded-xl p-4 mt-1 mb-4 shadow-inner">
            <span className="text-purple-400 font-semibold text-sm">📚 Explanation: </span>
            <span className="text-slate-300 text-sm">{q.explanation}</span>
          </div>
          <button onClick={next}
            className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
            {current + 1 >= data.questions.length ? 'See Results →' : 'Next Question →'}
          </button>
        </>
      )}
    </div>
  );
}

// ── Notes Renderer ────────────────────────────────────────────
function NotesRenderer({ data }: { data: StudyContent }) {
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setCollapsed(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <span className="text-4xl">{data.emoji || '📖'}</span>
        <div>
          {data.subject && (
            <span className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
              {data.subject}
            </span>
          )}
          <h1 className="text-2xl font-bold text-white leading-tight">{data.title}</h1>
          {data.summary && (
            <p className="text-slate-400 text-sm mt-2 leading-relaxed border-l-2 border-purple-500/50 pl-3">
              {data.summary}
            </p>
          )}
        </div>
      </div>

      {/* Sections */}
      {data.sections?.map((section, i) => {
        const isCollapsed = collapsed.has(i);
        return (
          <div key={i}
            className="mb-4 rounded-2xl border overflow-hidden"
            style={{ borderColor: section.color + '33', borderLeftColor: section.color, borderLeftWidth: '3px' }}>
            {/* Section Header */}
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors"
              style={{ background: section.color + '0d' }}>
              <span className="text-xl">{section.icon}</span>
              <span className="font-bold text-slate-100 flex-1 text-sm">{section.heading}</span>
              {isCollapsed ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronUp size={16} className="text-slate-400" />}
            </button>

            {/* Section Body */}
            {!isCollapsed && (
              <div className="p-4 bg-[#111827]/50 backdrop-blur-sm">
                {section.body && (
                  <p className="text-slate-300 text-sm leading-relaxed mb-3">{section.body}</p>
                )}

                {/* Key Points */}
                {section.keyPoints?.length && (
                  <div className="mb-3">
                    <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: section.color }}>
                      ✦ Key Points
                    </div>
                    <div className="space-y-2">
                      {section.keyPoints.map((p, j) => (
                        <div key={j} className="flex gap-2.5 items-start">
                          <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 shadow-[0_0_8px_currentColor]" style={{ background: section.color, color: section.color }} />
                          <span className="text-slate-200 text-sm leading-relaxed">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Table */}
                {section.table && <DataTable table={section.table} />}

                {/* Highlight */}
                {section.highlight && <HighlightBox data={section.highlight} />}

                {/* Inline Diagram */}
                {section.diagram && (
                  <div className="mt-3 bg-[#0a0f1e]/80 rounded-xl p-4 border border-white/5 shadow-inner">
                    <Mermaid chart={section.diagram.mermaidCode} />
                    {section.diagram.description && (
                      <p className="text-slate-500 text-xs mt-2 italic">{section.diagram.description}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Mnemonic */}
      {data.mnemonic && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mt-2 flex gap-3 items-start">
          <Brain size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-amber-400 font-bold text-xs uppercase tracking-widest mb-1">Memory Trick</div>
            <div className="text-amber-200 text-sm leading-relaxed">{data.mnemonic}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Diagram Renderer ──────────────────────────────────────────
function DiagramRenderer({ data }: { data: StudyContent }) {
  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-bold text-white mb-4">🔮 {data.title}</h2>
      <div className="bg-[#111827]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg shadow-black/20">
        {data.mermaidCode && <Mermaid chart={data.mermaidCode} />}
      </div>
      {data.description && (
        <p className="text-slate-400 text-sm mt-3 italic">{data.description}</p>
      )}
    </div>
  );
}

// ── MASTER RENDERER — Main Export ─────────────────────────────
export function NoteRenderer({ content }: { content: string }) {
  // Try to parse JSON from AI response
  let data: StudyContent | null = null;

  try {
    const cleaned = content
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    // Find JSON object in string
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      data = JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    // Not JSON — will render as plain text below
  }

  // If JSON parsed successfully, render visually
  if (data?.type) {
    switch (data.type) {
      case 'notes':      return <NotesRenderer data={data} />;
      case 'flashcards': return <FlashcardDeck data={data} />;
      case 'quiz':       return <QuizEngine data={data} />;
      case 'diagram':    return <DiagramRenderer data={data} />;
    }
  }

  // Fallback — plain markdown rendering (keep existing behavior)
  return null; // return null to let parent handle markdown
}