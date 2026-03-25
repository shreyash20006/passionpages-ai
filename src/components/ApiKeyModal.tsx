import React from 'react';
import { Key, X, ShieldAlert, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ModelProvider } from '../context/ModelContext';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider?: ModelProvider;
}

export function ApiKeyModal({ isOpen, onClose, provider }: ApiKeyModalProps) {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const getProviderName = () => {
    switch (provider) {
      case 'openai': return 'OpenAI';
      case 'anthropic': return 'Anthropic';
      case 'deepseek': return 'DeepSeek';
      case 'groq': return 'Groq';
      case 'gemini':
      default: return 'Gemini';
    }
  };

  const providerName = getProviderName();

  const handleGoToSettings = () => {
    onClose();
    navigate('/settings');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f1e]/80 backdrop-blur-sm p-4">
      <div className="bg-[#111827] rounded-[2rem] shadow-2xl shadow-pink-500/10 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border border-white/10">
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <div className="flex items-center gap-3 text-pink-400">
            <ShieldAlert size={24} />
            <h2 className="text-xl font-display font-bold text-white">API Key Required</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-pink-400 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-4 text-slate-300">
          <p>
            To use the selected model, you need to configure your <strong>{providerName}</strong> API key.
          </p>
          
          <div className="bg-[#1f2937]/50 p-5 rounded-2xl border border-white/5 space-y-3 shadow-inner">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Key size={18} className="text-purple-400" />
              How to add your key:
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              You can securely add and manage your API keys in the application settings. Keys are stored in your private account and will be available across all your devices.
            </p>
          </div>
        </div>
        
        <div className="p-6 bg-[#0a0f1e]/50 border-t border-white/5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-slate-400 hover:text-white hover:bg-[#1f2937] font-medium rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleGoToSettings}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg hover:shadow-pink-500/25 text-white font-bold rounded-xl transition-all active:scale-95"
          >
            <Settings size={18} />
            Go to Settings
          </button>
        </div>
      </div>
    </div>
  );
}
