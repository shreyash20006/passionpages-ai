import { useState } from 'react';
import ThemeModal from '../components/ThemeModal';
import { Settings } from 'lucide-react';

const DashboardSettings = () => {
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">⚙️ Settings</h1>

      {/* Theme Section */}
      <div className="bg-[#111827]/80 border border-white/10 rounded-2xl p-6 mb-4">
        <h2 className="text-lg font-semibold text-white mb-2">Appearance</h2>
        <p className="text-sm text-slate-400 mb-4">Customize the look and feel of your dashboard.</p>
        <button 
          onClick={() => setIsThemeModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1c] border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
        >
          <Settings size={18} />
          Change Theme
        </button>
      </div>

      {/* Render the Modal */}
      <ThemeModal 
        isOpen={isThemeModalOpen} 
        onClose={() => setIsThemeModalOpen(false)} 
      />
    </div>
  );
};

export default DashboardSettings;
