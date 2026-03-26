import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MessageSquare,
  UploadCloud,
  BookOpen,
  LayoutDashboard,
  Layers,
  Presentation,
  FileText,
  Calculator,
  Eye,
  Bookmark,
  Search,
  Bell,
  ChevronDown,
  Moon,
  Sun,
  Menu,
  X,
  Check,
  LogOut,
  LogIn,
  Network,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { useModel, AVAILABLE_MODELS } from "../context/ModelContext";
import { useAuth } from "../context/AuthContext";
import { LoginModal } from "./LoginModal";
import { motion, AnimatePresence } from "motion/react";
import AnimatedLogo from "./AnimatedLogo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const location = useLocation();
  const { selectedModel, setSelectedModel } = useModel();
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsModelDropdownOpen(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: "AI Chat", path: "/chat", icon: MessageSquare },
    { name: "Generate Summary", path: "/upload?type=summary", icon: FileText },
    { name: "Flashcards", path: "/upload?type=flashcards", icon: Layers },
    { name: "Generate Diagram", path: "/upload?type=mindmap", icon: Network },
    { name: "Create Quiz", path: "/upload?type=table", icon: HelpCircle },
    { name: "Generate PPT", path: "/upload?type=slides", icon: Presentation },
    { name: "Saved Notes", path: "/saved", icon: Bookmark },
  ];

  const models = AVAILABLE_MODELS;

  return (
    <div
      className={`flex h-screen overflow-hidden font-sans dark bg-[#0F172A] text-[#F8FAFC]`}
    >
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-500/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse-glow"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-[30%] right-[20%] w-[30%] h-[30%] bg-pink-400/5 rounded-full blur-[100px] animate-pulse-glow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Mobile sidebar overlay */}
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

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#080d1a]/80 backdrop-blur-2xl border-r border-white/5 shadow-[4px_0_24px_rgba(0,0,0,0.4)]
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Top-to-bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#080d1a]/50 to-[#080d1a]/90 pointer-events-none z-0" />

        <div className="flex items-center justify-between h-20 px-6 shrink-0 relative z-10 border-b border-white/5">
          <style>{`
            .al-logo-section {
              padding: 0 !important;
              border-bottom: none !important;
            }
            .al-spin-ring::after {
              --logo-bg: #080d1a;
            }
          `}</style>
          <Link
            to="/dashboard"
            onClick={() => setIsSidebarOpen(false)}
          >
            <AnimatedLogo size="normal" />
          </Link>
          <button
            className="lg:hidden text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar relative z-10">
          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive = (() => {
                if (item.path.startsWith("/upload?")) {
                  const itemType = new URLSearchParams(
                    item.path.split("?")[1],
                  ).get("type");
                  const currentType = new URLSearchParams(location.search).get(
                    "type",
                  );
                  return (
                    location.pathname === "/upload" && itemType === currentType
                  );
                }
                return location.pathname === item.path;
              })();
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`group flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? "bg-gradient-to-r from-pink-500/20 to-purple-500/10 text-pink-400 border-l-2 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                      : "text-slate-400 hover:text-white hover:bg-white/5 hover:border-l-2 hover:border-pink-500 border-l-2 border-transparent"
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-pink-500/10 blur-xl rounded-2xl z-0" />
                  )}
                  <item.icon
                    size={20}
                    className={`relative z-10 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-pink-400" : "text-slate-400 group-hover:text-white"}`}
                  />
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-white/5 shrink-0 flex flex-col gap-2 relative z-10">
          {/* User Avatar Placeholder at bottom of sidebar */}
          <div className="mt-2 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-pink-500/20 shrink-0">
              {user
                ? (user.displayName || user.email || "U")
                    .charAt(0)
                    .toUpperCase()
                : "G"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-slate-200 truncate">
                {user ? user.displayName || "User" : "Guest"}
              </span>
              <span className="text-xs text-slate-500 truncate">
                {user ? user.email : "Sign in to sync"}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Topbar */}
        <header className="h-20 bg-[#0a0f1e]/70 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-6 flex-1">
            <button
              className="lg:hidden text-slate-400 hover:text-slate-200"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>

            {/* Search */}
            <div className="flex items-center relative flex-1 max-w-xl group">
              <Search
                size={18}
                className="absolute left-4 text-slate-400 group-focus-within:text-pink-500 transition-colors"
              />
              <input
                type="text"
                placeholder="Search study materials, flashcards..."
                className="w-full pl-12 pr-4 py-2.5 bg-[#111827] border border-white/5 focus:bg-[#111827] focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/20 rounded-2xl text-[13px] sm:text-sm transition-all outline-none text-white shadow-inner"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* Model Selector */}
            <div
              className="hidden sm:flex items-center relative"
              ref={dropdownRef}
            >
              <div className="relative p-[1px] rounded-full bg-gradient-to-r from-pink-500 to-purple-600">
                <button
                  className="flex items-center gap-2.5 bg-[#111827] px-4 py-2 rounded-full cursor-pointer hover:bg-[#1f2937] transition-all"
                  onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                >
                  <Sparkles size={16} className="text-pink-500" />
                  <span className="text-sm font-semibold text-slate-200">
                    {selectedModel.name}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform duration-300 ${isModelDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              <AnimatePresence>
                {isModelDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full mt-3 right-0 w-64 bg-[#111827] border border-white/10 rounded-2xl shadow-2xl shadow-pink-500/10 overflow-hidden z-50"
                  >
                    <div className="p-2 space-y-1">
                      {models.map((model) => (
                        <button
                          key={model.id}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm flex items-center justify-between transition-colors ${
                            selectedModel.id === model.id
                              ? "bg-pink-500/10 text-pink-400"
                              : "hover:bg-white/5 text-slate-300"
                          }`}
                          onClick={() => {
                            setSelectedModel(model as any);
                            setIsModelDropdownOpen(false);
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="font-semibold">{model.name}</span>
                            <span className="text-[10px] uppercase tracking-wider opacity-60">
                              {model.provider}
                            </span>
                          </div>
                          {selectedModel.id === model.id && <Check size={18} />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            <button className="p-2.5 text-slate-400 hover:bg-[#111827] rounded-2xl transition-all relative group">
              <Bell
                size={22}
                className="group-hover:text-pink-400 transition-colors"
              />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-pink-500 rounded-full border-2 border-[#0a0f1e] animate-pulse" />
            </button>

            {/* User Profile */}
            <div className="relative" ref={profileDropdownRef}>
              {user ? (
                <div
                  className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#EC4899] to-[#8B5CF6] text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-pink-500/20 cursor-pointer border-2 border-[#111827] overflow-hidden transition-transform hover:scale-105"
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    (user.displayName || user.email || "U")
                      .charAt(0)
                      .toUpperCase()
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 hover:shadow-lg hover:shadow-pink-500/25 text-white text-sm font-bold rounded-2xl transition-all active:scale-95"
                >
                  <LogIn size={18} />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}

              <AnimatePresence>
                {isProfileDropdownOpen && user && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full mt-3 right-0 w-72 bg-[#111827] border border-white/10 rounded-2xl shadow-2xl shadow-pink-500/10 overflow-hidden z-50"
                  >
                    {/* Profile Header with Photo */}
                    <div className="p-5 border-b border-white/5 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                      <div className="flex items-center gap-4">
                        {/* Large Profile Photo */}
                        <div className="relative">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt={user.displayName || "User"}
                              className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'User')}&background=7c3aed&color=fff&size=256`;
                              }}
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl border-2 border-purple-500">
                              {(user.displayName || user.email || 'U')[0].toUpperCase()}
                            </div>
                          )}
                          {/* Online Status */}
                          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#111827]" />
                        </div>
                        
                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white truncate text-lg">
                            {user.displayName || user.email?.split('@')[0] || "User"}
                          </p>
                          <p className="text-xs text-slate-400 truncate mt-1">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl flex items-center gap-3 transition-colors font-semibold"
                      >
                        <LogOut size={18} />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Main Scrollable Area */}
        <main
          className={`flex-1 overflow-y-auto ${location.pathname === "/chat" ? "p-0" : "p-4 sm:p-6 lg:p-8"} custom-scrollbar flex flex-col relative page-enter`}
        >
          <div
            className={`${location.pathname === "/chat" ? "w-full max-w-none" : "max-w-7xl mx-auto"} w-full flex-1 flex flex-col`}
          >
            {children}
          </div>
        </main>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
