import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MessageSquare,
  Layers,
  Presentation,
  FileText,
  Bookmark,
  Search,
  ChevronDown,
  Menu,
  X,
  Check,
  LogOut,
  LogIn,
  Network,
  HelpCircle,
  Zap,
  Sparkles,
} from "lucide-react";
import { useModel, AVAILABLE_MODELS } from "../context/ModelContext";
import { useAuth } from "../context/AuthContext";
import { LoginModal } from "./LoginModal";
import { motion, AnimatePresence } from "motion/react";
import ThemeModal from "./ThemeModal";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen]         = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen]   = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen]   = useState(false);
  const location  = useLocation();
  const { selectedModel, setSelectedModel } = useModel();
  const { user, logout } = useAuth();
  const dropdownRef        = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setIsModelDropdownOpen(false);
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node))
        setIsProfileDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: "AI Chat",          path: "/chat",                  icon: MessageSquare },
    { name: "Generate Summary", path: "/upload?type=summary",   icon: FileText },
    { name: "Flashcards",       path: "/upload?type=flashcards",icon: Layers },
    { name: "Generate Diagram", path: "/upload?type=mindmap",   icon: Network },
    { name: "Create Quiz",      path: "/upload?type=table",     icon: HelpCircle },
    { name: "Generate PPT",     path: "/upload?type=slides",    icon: Presentation },
    { name: "Saved Notes",      path: "/saved",                 icon: Bookmark },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#09090b] text-[#fafafa]">

      {/* Mobile overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-60 flex flex-col
        bg-[#09090b] border-r border-[#27272a]
        transform transition-transform duration-250 ease-in-out
        lg:translate-x-0 lg:static
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between h-14 px-5 border-b border-[#27272a] shrink-0">
          <Link to="/dashboard" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">PassionPages</span>
          </Link>
          <button className="lg:hidden text-[#71717a] hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = (() => {
                if (item.path.startsWith("/upload?")) {
                  const itemType    = new URLSearchParams(item.path.split("?")[1]).get("type");
                  const currentType = new URLSearchParams(location.search).get("type");
                  return location.pathname === "/upload" && itemType === currentType;
                }
                return location.pathname === item.path;
              })();
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive
                      ? "bg-[#27272a] text-white font-medium"
                      : "text-[#a1a1aa] hover:text-white hover:bg-[#18181b]"
                  }`}
                >
                  <item.icon size={16} className={isActive ? "text-indigo-400" : "text-[#71717a]"} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User */}
        <div className="p-3 border-t border-[#27272a] shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 rounded-md">
            <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
              {user ? (user.displayName || user.email || "U").charAt(0).toUpperCase() : "G"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-white truncate">
                {user ? user.displayName || "User" : "Guest"}
              </span>
              <span className="text-[11px] text-[#71717a] truncate">
                {user ? user.email : "Sign in to sync"}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ──────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="h-14 bg-[#09090b] border-b border-[#27272a] flex items-center justify-between px-5 shrink-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <button className="lg:hidden text-[#71717a] hover:text-white" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} />
            </button>

            {/* Search */}
            <div className="flex items-center relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 text-[#52525b]" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#18181b] border border-[#3f3f46] rounded-md text-sm text-white placeholder:text-[#52525b] outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Upgrade */}
            <Link
              to="/pricing"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#18181b] border border-[#3f3f46] text-[#a1a1aa] hover:text-white hover:border-[#52525b] transition-colors text-xs font-medium"
            >
              <Zap size={13} className="text-indigo-400" />
              Upgrade
            </Link>

            {/* Model Selector */}
            <div className="hidden sm:flex relative" ref={dropdownRef}>
              <button
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#18181b] border border-[#3f3f46] hover:border-[#52525b] rounded-md text-xs font-medium text-[#a1a1aa] hover:text-white transition-colors"
              >
                <Sparkles size={13} className="text-indigo-400" />
                <span>{selectedModel.name}</span>
                <ChevronDown size={13} className={`text-[#52525b] transition-transform ${isModelDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isModelDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                    className="absolute top-full mt-2 right-0 w-56 bg-[#18181b] border border-[#3f3f46] rounded-lg shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-1">
                      {AVAILABLE_MODELS.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => { setSelectedModel(model as any); setIsModelDropdownOpen(false); }}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between transition-colors ${
                            selectedModel.id === model.id
                              ? "bg-indigo-500/10 text-indigo-400"
                              : "text-[#a1a1aa] hover:bg-[#27272a] hover:text-white"
                          }`}
                        >
                          <div>
                            <div className="font-medium text-xs">{model.name}</div>
                            <div className="text-[10px] text-[#71717a] uppercase tracking-wider mt-0.5">{model.provider}</div>
                          </div>
                          {selectedModel.id === model.id && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User / Sign In */}
            <div className="relative" ref={profileDropdownRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-semibold overflow-hidden hover:ring-2 hover:ring-indigo-400 transition-all"
                  >
                    {user.photoURL
                      ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      : (user.displayName || user.email || "U").charAt(0).toUpperCase()
                    }
                  </button>
                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                        className="absolute top-full mt-2 right-0 w-64 bg-[#18181b] border border-[#3f3f46] rounded-lg shadow-xl z-50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-[#27272a]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold overflow-hidden shrink-0">
                              {user.photoURL
                                ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                : (user.displayName || user.email || "U").charAt(0).toUpperCase()
                              }
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-white truncate">{user.displayName || "User"}</p>
                              <p className="text-xs text-[#71717a] truncate">{user.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-1">
                          <button
                            onClick={() => { logout(); setIsProfileDropdownOpen(false); }}
                            className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-md flex items-center gap-2 transition-colors"
                          >
                            <LogOut size={14} />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold rounded-md transition-colors"
                >
                  <LogIn size={13} />
                  Sign In
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={`flex-1 overflow-y-auto custom-scrollbar flex flex-col relative page-enter
          ${location.pathname === "/chat" ? "p-0" : "p-5 sm:p-6"}`}>
          <div className={`${location.pathname === "/chat" ? "w-full max-w-none" : "max-w-6xl mx-auto"} w-full flex-1 flex flex-col`}>
            {children}
          </div>
        </main>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <ThemeModal  isOpen={isThemeModalOpen}  onClose={() => setIsThemeModalOpen(false)} />
    </div>
  );
}
