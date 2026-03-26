import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  BookOpen,
  Download,
  FileDown,
  Image as ImageIcon,
  MoreVertical,
  Wand2,
  Sparkles,
  Share2,
  Check,
  ExternalLink,
  Save,
  Bot,
  User
} from 'lucide-react';
import Mermaid from '../components/Mermaid';

// Custom Diagram Icon with glowing pink nodes
const DiagramIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="6" r="2.5" fill="#EC4899" className="animate-node-pulse" />
    <circle cx="6" cy="18" r="2.5" fill="#EC4899" className="animate-node-pulse" style={{ animationDelay: '0.5s' }} />
    <circle cx="18" cy="18" r="2.5" fill="#EC4899" className="animate-node-pulse" style={{ animationDelay: '1s' }} />
    <path d="M11 8L7.5 15.5" stroke="#EC4899" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    <path d="M13 8L16.5 15.5" stroke="#EC4899" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    <path d="M8.5 18H15.5" stroke="#EC4899" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
  </svg>
);

// Counter component for stats
const AnimatedCounter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = value / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <>{count}</>;
};

export default function Dashboard() {
  const [chatInput, setChatInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOutput, setShowOutput] = useState(true);
  const navigate = useNavigate();

  const tools = [
    { name: 'Generate Summary', icon: FileText, color: 'from-pink-500 to-rose-500', path: '/upload?type=summary' },
    { name: 'AI Chat', icon: MessageSquare, color: 'from-emerald-400 to-teal-500', path: '/chat' },
    { name: 'Create Flashcards', icon: Layers, color: 'from-purple-500 to-indigo-500', path: '/upload?type=flashcards' },
    { name: 'Generate Diagram', icon: DiagramIcon, color: 'from-pink-400 to-purple-500', path: '/upload?type=mindmap' },
    { name: 'Create Quiz', icon: HelpCircle, color: 'from-blue-500 to-cyan-500', path: '/upload?type=table' },
    { name: 'Generate PPT', icon: Presentation, color: 'from-orange-400 to-red-500', path: '/upload?type=slides' },
  ];

  const handleUploadClick = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowOutput(true);
    }, 3000);
  };

  return (
    <div className="flex flex-col flex-1 h-full space-y-8 pb-10 relative">
      {/* Mesh Gradient Overlay & Glowing Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 rounded-3xl">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 shrink-0 z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">Welcome back</span>, Explorer! 
            <motion.span 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
              className="inline-block animate-bounce"
            >
              🚀
            </motion.span>
          </h1>
          <p className="text-slate-400 mt-1.5 text-lg">What knowledge shall we unlock today?</p>
        </motion.div>
        
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 glass rounded-2xl text-sm font-semibold text-slate-200 hover:bg-pink-500/10 transition-all flex items-center gap-2 shadow-sm border border-white/5">
            <Share2 size={18} />
            Share Workspace
          </button>
          <button 
            onClick={() => navigate('/upload')}
            className="px-5 py-2.5 bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white rounded-2xl text-sm font-bold hover:shadow-xl hover:shadow-pink-500/30 transition-all flex items-center gap-2 active:scale-95"
          >
            <Sparkles size={18} />
            New Project
          </button>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 shrink-0 z-10">
        {[
          { label: 'Notes Generated', value: 24, icon: FileText, color: 'from-pink-500 to-rose-500' },
          { label: 'Flashcards', value: 156, icon: Layers, color: 'from-purple-500 to-indigo-500' },
          { label: 'Quizzes Taken', value: 8, icon: HelpCircle, color: 'from-blue-500 to-cyan-500' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#0d1424] border border-white/5 rounded-3xl p-5 flex items-center gap-4 relative overflow-hidden group hover:border-pink-500/30 transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <h4 className="text-2xl font-display font-bold text-white">
                <AnimatedCounter value={stat.value} />
              </h4>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 shrink-0 z-10">
        {tools.map((tool, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link to={tool.path} className="block h-full group">
              <div className="relative h-full bg-[#0d1424] p-6 rounded-3xl border border-white/5 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-pink-500/20 group-hover:border-pink-500/30 flex flex-col items-center text-center gap-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${tool.color} text-white shadow-lg shadow-pink-500/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                  <tool.icon size={32} />
                </div>
                <span className="text-sm font-bold text-slate-200 group-hover:text-pink-400 transition-colors relative z-10">{tool.name}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-12 gap-8 flex-1 min-h-[600px] z-10">
        
        {/* Left Column: Upload & Chat (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-8 h-full">
          
          {/* Upload Section */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className={`relative rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center transition-all duration-300 bg-[#0d1424] shrink-0 cursor-pointer group overflow-hidden z-10
              ${isDragging 
                ? 'bg-pink-900/20 shadow-2xl shadow-pink-500/30' 
                : 'hover:shadow-2xl hover:shadow-pink-500/20 hover:bg-[#111827]'
              }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
            onClick={handleUploadClick}
          >
            <style>{`
              @keyframes dash {
                to {
                  stroke-dashoffset: -20;
                }
              }
            `}</style>
            <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-[2.5rem]" style={{ zIndex: 0 }}>
              <rect x="2" y="2" width="calc(100% - 4px)" height="calc(100% - 4px)" rx="38" ry="38" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" className={`transition-colors duration-300 animate-[dash_3s_linear_infinite] ${isDragging ? 'text-pink-500' : 'text-white/10 group-hover:text-pink-500'}`} />
            </svg>

            <div className={`absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isDragging ? 'opacity-100' : ''}`} />
            
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 text-pink-400 rounded-3xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg group-hover:shadow-pink-500/20 relative z-10">
              <UploadCloud size={40} className="animate-bounce" />
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-2 relative z-10">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">Drag & Drop</span> or Upload
            </h3>
            <p className="text-sm text-slate-400 mb-6 max-w-[200px] relative z-10">PDF, DOCX, PPTX, or Images up to 50MB</p>
            <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl text-sm font-bold hover:shadow-lg hover:shadow-pink-500/25 transition-all w-full relative z-10">
              Browse Files
            </button>
          </motion.div>

          {/* Chat Panel */}
          <div className="flex-1 bg-[#0d1117] rounded-[2.5rem] border border-white/5 shadow-2xl shadow-pink-500/5 flex flex-col overflow-hidden">
            <div className="p-5 border-b border-white/5 bg-[#111827]/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-pink-500/20 flex items-center justify-center">
                  <MessageSquare size={20} className="text-pink-400" />
                </div>
                <h3 className="font-display font-bold text-white">AI Tutor</h3>
              </div>
              <button className="p-2 text-slate-400 hover:text-pink-400 transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1f2937] border border-white/5 flex items-center justify-center text-pink-400 shrink-0 shadow-md">
                  <Bot size={20} />
                </div>
                <div className="bg-[#111827] border border-white/5 rounded-2xl rounded-tl-none p-4 text-sm text-slate-200 leading-relaxed shadow-sm">
                  Greetings! I'm your PassionPages AI assistant. Upload your materials or ask me anything to begin our learning journey.
                </div>
              </div>
              
              <div className="flex gap-4 flex-row-reverse">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md shadow-pink-500/20">
                  <User size={20} />
                </div>
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl rounded-tr-none p-4 text-sm shadow-md shadow-pink-500/20">
                  Explain the core principles of Neural Networks.
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/5 bg-[#0a0f1e]/80 backdrop-blur-md shrink-0">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask your AI tutor..."
                  className="w-full pl-5 pr-14 py-4 bg-[#111827] border border-white/5 focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/20 rounded-2xl text-sm transition-all outline-none text-white shadow-inner"
                />
                <button className="absolute right-2 p-2.5 bg-gradient-to-br from-pink-500 to-purple-600 hover:shadow-lg hover:shadow-pink-500/25 text-white rounded-xl transition-all active:scale-90">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Output Display Area (8 cols) */}
        <div className="lg:col-span-8 bg-[#0a0f1e] rounded-[2.5rem] border border-white/5 shadow-2xl shadow-pink-500/5 flex flex-col overflow-hidden h-full relative">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 pointer-events-none z-0" />
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div 
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0a0f1e]/80 backdrop-blur-md"
              >
                <div className="relative mb-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-pink-400 animate-orb-float shadow-[0_0_50px_rgba(236,72,153,0.5)]" />
                  <div className="absolute inset-[-10px] rounded-full border-2 border-pink-500/20 animate-pulse-glow" />
                  <div className="absolute inset-[-20px] rounded-full border border-purple-500/10 animate-pulse-glow" style={{ animationDelay: '1s' }} />
                </div>
                <h2 className="text-2xl font-display font-bold text-white mb-2">PassionPages AI</h2>
                <div className="flex items-center gap-2 text-pink-400 font-medium">
                  <span className="animate-typing">PassionPages AI is generating your response...</span>
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                    <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </span>
                </div>
              </motion.div>
            ) : showOutput ? (
              <motion.div 
                key="output"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col h-full relative z-10"
              >
                {/* Output Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#111827]/80 backdrop-blur-md shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-pink-500/20 text-pink-400 rounded-2xl shadow-sm">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-display font-bold text-white">Neural Networks Fundamentals</h2>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">AI Generated • 2 mins ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 p-1 bg-[#1f2937] border border-white/5 rounded-xl shadow-inner">
                      <button className="p-2 text-slate-400 hover:text-pink-400 hover:bg-[#111827] rounded-lg transition-all" title="Download PDF">
                        <FileDown size={20} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-pink-400 hover:bg-[#111827] rounded-lg transition-all" title="Download Image">
                        <ImageIcon size={20} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-pink-400 hover:bg-[#111827] rounded-lg transition-all" title="Save to Google Drive">
                        <Download size={20} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-pink-400 hover:bg-[#111827] rounded-lg transition-all" title="Save to Notion">
                        <ExternalLink size={20} />
                      </button>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-pink-500/25 transition-all active:scale-95">
                      <Save size={18} />
                      Save to Notes
                    </button>
                  </div>
                </div>

                {/* Output Content (NotebookLM Style) */}
                <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
                  <div className="max-w-4xl mx-auto prose prose-invert prose-headings:font-display prose-headings:font-bold prose-p:leading-relaxed prose-li:leading-relaxed bg-[#111827] p-8 rounded-3xl border border-white/5 shadow-sm">
                    <h1 className="text-4xl mb-8">🧠 Deep Dive into Neural Networks</h1>
                    
                    <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-l-4 border-pink-500 p-6 rounded-r-3xl my-10 shadow-sm">
                      <h3 className="text-pink-300 m-0 text-xl flex items-center gap-2">
                        <Sparkles size={20} />
                        Core Insight
                      </h3>
                      <p className="text-slate-200 mt-3 mb-0 text-lg italic">
                        "Neural networks are the computational backbone of modern AI, designed to recognize patterns and solve complex problems by mimicking the biological structure of the human brain."
                      </p>
                    </div>

                    <h2 className="text-2xl mt-12 mb-6">Structural Components</h2>
                    <div className="grid sm:grid-cols-3 gap-6 my-8">
                      {[
                        { title: 'Input Layer', desc: 'Receives initial data for processing.', color: 'border-pink-500/30 bg-pink-500/5' },
                        { title: 'Hidden Layers', desc: 'Performs complex mathematical transformations.', color: 'border-purple-500/30 bg-purple-500/5' },
                        { title: 'Output Layer', desc: 'Produces the final prediction or result.', color: 'border-pink-400/30 bg-pink-400/5' }
                      ].map((box, idx) => (
                        <div key={idx} className={`p-5 rounded-2xl border ${box.color} transition-transform hover:-translate-y-1 hover:shadow-lg`}>
                          <h4 className="m-0 font-bold mb-2">{box.title}</h4>
                          <p className="m-0 text-sm opacity-80">{box.desc}</p>
                        </div>
                      ))}
                    </div>

                    <h2 className="text-2xl mt-12 mb-6">How It Works</h2>
                    <ol>
                      <li><strong>Forward Propagation:</strong> Data flows through the network, multiplied by weights and passed through activation functions.</li>
                      <li><strong>Loss Calculation:</strong> The difference between the predicted output and actual target is measured.</li>
                      <li><strong>Backpropagation:</strong> The network adjusts weights in reverse to minimize the error using gradient descent.</li>
                    </ol>

                    <h2 className="text-2xl mt-12 mb-6">Network Architecture</h2>
                    <div className="bg-[#0a0f1e]/50 p-8 rounded-[2rem] border border-white/5 my-10 flex justify-center shadow-inner">
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
    style C fill:#EC4899,stroke:#fff,color:#fff
    style D fill:#8B5CF6,stroke:#fff,color:#fff
    style E fill:#F472B6,stroke:#fff,color:#000`} />
                    </div>

                    <h2 className="text-2xl mt-12 mb-6">Comparison Table</h2>
                    <div className="overflow-hidden rounded-2xl border border-white/5 my-8">
                      <table className="w-full text-left border-collapse m-0">
                        <thead>
                          <tr className="bg-[#1f2937]/50">
                            <th className="p-4 font-bold border-b border-white/5">Architecture</th>
                            <th className="p-4 font-bold border-b border-white/5">Best For</th>
                            <th className="p-4 font-bold border-b border-white/5">Key Feature</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="hover:bg-[#1f2937]/30 transition-colors">
                            <td className="p-4 border-b border-white/5 font-medium">CNN</td>
                            <td className="p-4 border-b border-white/5">Image Recognition</td>
                            <td className="p-4 border-b border-white/5">Spatial Hierarchies</td>
                          </tr>
                          <tr className="hover:bg-[#1f2937]/30 transition-colors">
                            <td className="p-4 border-b border-white/5 font-medium">RNN</td>
                            <td className="p-4 border-b border-white/5">Sequence Data</td>
                            <td className="p-4 border-b border-white/5">Temporal Memory</td>
                          </tr>
                          <tr className="hover:bg-[#1f2937]/30 transition-colors">
                            <td className="p-4 font-medium">Transformer</td>
                            <td className="p-4">NLP / LLMs</td>
                            <td className="p-4">Self-Attention</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center relative z-10">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }} 
                  transition={{ duration: 0.5 }}
                  className="w-24 h-24 bg-gradient-to-br from-pink-500/10 to-purple-600/10 border border-pink-500/20 rounded-[2rem] flex items-center justify-center text-pink-400 mb-6 shadow-lg shadow-pink-500/5"
                >
                  <BookOpen size={48} className="animate-pulse" />
                </motion.div>
                <h3 className="text-2xl font-display font-bold text-white mb-3">Ready to learn?</h3>
                <p className="text-slate-400 max-w-sm text-lg">Upload a document or select a tool to generate your first set of learning materials.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
