import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MessageSquare,
  BookOpen,
  Layers,
  Presentation,
  FileText,
  Bookmark,
  Network,
  HelpCircle,
  Sparkles,
  Zap,
  Bell,
  Menu,
  X,
  Check,
  LogOut,
  LogIn,
  ChevronDown,
  Moon,
  LayoutDashboard,
} from "lucide-react";
import { useModel, AVAILABLE_MODELS } from "../context/ModelContext";
import { useAuth } from "../context/AuthContext";
import { LoginModal } from "./LoginModal";
import { motion, AnimatePresence } from "motion/react";
import AnimatedLogo from "./AnimatedLogo";
import ThemeModal from "./ThemeModal";

const bottomTabs = [
  { name: "Home", path: "/dashboard", icon: LayoutDashboard },
  { name: "Chat", path: "/chat", icon: MessageSquare },
  { name: "Summary", path: "/upload?type=summary", icon: FileText },
  { name: "Cards", path: "/upload?type=flashcards", icon: Layers },
  { name: "Saved", path: "/saved", icon: Bookmark },
];

const allNavItems = [
  { name: "AI Chat", path: "/chat", icon: MessageSquare },
  { name: "Generate Summary", path: "/upload?type=summary", icon: FileText },
  { name: "Flashcards", path: "/upload?type=flashcards", icon: Layers },
  { name: "Generate Diagram", path: "/upload?type=mindmap", icon: Network },
  { name: "Create Quiz", path: "/upload?type=table", icon: HelpCircle },
  { name: "Generate PPT", path: "/upload?type=slides", icon: Presentation },
  { name: "Saved Notes", path: "/saved", icon: Bookmark },
];

function isActive(itemPath: string, location: ReturnType<typeof useLocation>) {
  if (itemPath.startsWith("/upload?")) {
    const itemType = new URLSearchParams(itemPath.split("?")[1]).get("type");
    const currentType = new URLSearchParams(location.search).get("type");
    return location.pathname === "/upload" && itemType === currentType;
  }
  return location.pathname === itemPath;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const location = useLocation();
  const { selectedModel, setSelectedModel } = useModel();
  const { user, logout } = useAuth();
  const modelRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (modelRef.current && !modelRef.current.contains(e.target as Node)) setIsModelDropdownOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setIsProfileOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const isChat = location.pathname === "/chat";

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-[#0F172A] text-[#F8FAFC]">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* ── DESKTOP SIDEBAR ────────────────────────────────── */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#080d1a]/90 backdrop-blur-2xl border-r border-white/5
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:flex lg:flex-col
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/5">
          <style>{`.al-logo-section{padding:0!important;border-bottom:none!important}.al-spin-ring::after{--logo-bg:#080d1a}`}</style>
          <Link to="/dashboard" onClick={() => setIsSidebarOpen(false)}>
            <AnimatedLogo size="normal" />
          </Link>
          <button className="lg:hidden text-slate-400 hover:text-white p-1" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {allNavItems.map((item) => {
            const active = isActive(item.path, location);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-pink-500/20 to-purple-500/10 text-pink-400 border-l-2 border-pink-500"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                }`}
              >
                <item.icon size={18} className={active ? "text-pink-400" : ""} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-white/5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user ? (user.displayName || user.email || "U").charAt(0).toUpperCase() : "G"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-200 truncate">{user ? user.displayName || "User" : "Guest"}</p>
              <p className="text-xs text-slate-500 truncate">{user ? user.email : "Sign in to sync"}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">

        {/* Top bar */}
        <header className="h-14 lg:h-16 bg-[#0a0f1e]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 lg:px-6 shrink-0 z-20">
          <div className="flex items-center gap-3">
            {/* Desktop menu toggle */}
            <button className="hidden lg:flex text-slate-400 hover:text-white" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu size={22} />
            </button>
            {/* Mobile: logo */}
            <div className="lg:hidden">
              <style>{`.al-logo-section{padding:0!important;border-bottom:none!important}.al-uline-wrap{display:none}`}</style>
              <Link to="/dashboard"><AnimatedLogo size="small" /></Link>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            {/* Upgrade */}
            <Link to="/pricing" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-300 font-semibold border border-pink-500/20 text-xs hover:bg-pink-500/20 transition-all">
              <Zap size={13} className="text-pink-400" />
              Upgrade
            </Link>

            {/* Model selector — desktop */}
            <div className="hidden md:block relative" ref={modelRef}>
              <div className="relative p-[1px] rounded-full bg-gradient-to-r from-pink-500 to-purple-600">
                <button
                  onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                  className="flex items-center gap-2 bg-[#111827] px-3 py-1.5 rounded-full text-sm text-slate-200 hover:bg-[#1f2937] transition-all"
                >
                  <Sparkles size={14} className="text-pink-500" />
                  <span className="max-w-[120px] truncate">{selectedModel.name}</span>
                  <ChevronDown size={13} className={`text-slate-400 transition-transform ${isModelDropdownOpen ? "rotate-180" : ""}`} />
                </button>
              </div>
              <AnimatePresence>
                {isModelDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    className="absolute top-full mt-2 right-0 w-60 bg-[#111827] border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50"
                  >
                    <div className="p-1.5 space-y-0.5">
                      {AVAILABLE_MODELS.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => { setSelectedModel(model as any); setIsModelDropdownOpen(false); }}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center justify-between transition-colors ${
                            selectedModel.id === model.id ? "bg-pink-500/10 text-pink-400" : "hover:bg-white/5 text-slate-300"
                          }`}
                        >
                          <div>
                            <p className="font-semibold">{model.name}</p>
                            <p className="text-[10px] uppercase tracking-wider opacity-50">{model.provider}</p>
                          </div>
                          {selectedModel.id === model.id && <Check size={16} />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme */}
            <button onClick={() => setIsThemeModalOpen(true)} className="p-2 text-slate-400 hover:text-purple-400 hover:bg-white/5 rounded-xl transition-all">
              <Moon size={18} />
            </button>

            {/* Bell */}
            <button className="relative p-2 text-slate-400 hover:text-pink-400 hover:bg-white/5 rounded-xl transition-all">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full border-2 border-[#0a0f1e] animate-pulse" />
            </button>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              {user ? (
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm overflow-hidden border-2 border-transparent hover:border-pink-500 transition-all">
                  {user.photoURL
                    ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    : (user.displayName || user.email || "U").charAt(0).toUpperCase()
                  }
                </button>
              ) : (
                <button onClick={() => setIsLoginModalOpen(true)} className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-bold rounded-xl transition-all active:scale-95">
                  <LogIn size={15} />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
              <AnimatePresence>
                {isProfileOpen && user && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    className="absolute top-full mt-2 right-0 w-64 bg-[#111827] border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-white/5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg overflow-hidden border-2 border-purple-500">
                        {user.photoURL
                          ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          : (user.displayName || user.email || "U").charAt(0).toUpperCase()
                        }
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-white truncate">{user.displayName || user.email?.split("@")[0]}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="p-2">
                      <button onClick={() => { logout(); setIsProfileOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl flex items-center gap-3 transition-colors font-semibold">
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={`flex-1 overflow-y-auto custom-scrollbar flex flex-col relative
          ${isChat ? "p-0" : "p-4 sm:p-5 lg:p-8"}
          pb-20 lg:pb-0
        `}>
          <div className={`${isChat ? "w-full h-full" : "max-w-5xl mx-auto"} w-full flex-1 flex flex-col`}>
            {children}
          </div>
        </main>

        {/* ── MOBILE BOTTOM TAB BAR ──────────────────────── */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#080d1a]/95 backdrop-blur-xl border-t border-white/5 safe-area-pb">
          <div className="flex items-stretch h-16">
            {bottomTabs.map((tab) => {
              const active = isActive(tab.path, location);
              return (
                <Link
                  key={tab.name}
                  to={tab.path}
                  className="flex-1 flex flex-col items-center justify-center gap-1 transition-all active:scale-90"
                >
                  <div className={`p-2 rounded-xl transition-all ${active ? "bg-pink-500/15" : ""}`}>
                    <tab.icon size={20} className={active ? "text-pink-400" : "text-slate-500"} />
                  </div>
                  <span className={`text-[10px] font-semibold ${active ? "text-pink-400" : "text-slate-600"}`}>
                    {tab.name}
                  </span>
                </Link>
              );
            })}
            {/* More button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex-1 flex flex-col items-center justify-center gap-1 active:scale-90 transition-all"
            >
              <div className="p-2 rounded-xl">
                <Menu size={20} className="text-slate-500" />
              </div>
              <span className="text-[10px] font-semibold text-slate-600">More</span>
            </button>
          </div>
        </nav>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <ThemeModal isOpen={isThemeModalOpen} onClose={() => setIsThemeModalOpen(false)} />
    </div>
  );
}
