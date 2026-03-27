import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Monitor, X } from 'lucide-react';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThemeModal = ({ isOpen, onClose }: ThemeModalProps) => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const themeOptions = [
    { id: 'light', label: 'Light', icon: <Sun size={24} className="mb-3" /> },
    { id: 'dark', label: 'Dark', icon: <Moon size={24} className="mb-3" /> },
    { id: 'system', label: 'System', icon: <Monitor size={24} className="mb-3" /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center"
          >
            {/* The Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0f0f11] border border-white/10 rounded-2xl p-6 w-[90%] max-w-lg shadow-2xl z-50 relative"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Choose your theme</h2>
                  <p className="text-sm text-gray-400 mt-1">Select the appearance you prefer!</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Theme Options Grid */}
              <div className="grid grid-cols-3 gap-4">
                {themeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setTheme(option.id)}
                    className={`relative flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-300 ${
                      theme === option.id 
                      ? 'border-purple-500 bg-purple-500/10 text-purple-400' 
                      : 'border-white/5 bg-[#1a1a1c] text-gray-500 hover:border-white/20 hover:text-gray-300'
                    }`}
                  >
                    {option.icon}
                    <span className="text-sm font-semibold">{option.label}</span>

                    {/* Active State Indicator */}
                    {theme === option.id && (
                      <motion.div 
                        layoutId="active-theme"
                        className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7]"
                      />
                    )}
                  </button>
                ))}
              </div>

            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ThemeModal;
