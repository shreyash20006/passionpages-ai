import React, { useState, useEffect } from 'react';
import { Key, Save, CheckCircle2, ShieldAlert, Loader2, Eye, EyeOff } from 'lucide-react';
import { useSettings, ApiKeys } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const { apiKeys, saveApiKeys, loading } = useSettings();
  const [localKeys, setLocalKeys] = useState<ApiKeys>(apiKeys);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLocalKeys(apiKeys);
  }, [apiKeys]);

  const handleChange = (provider: keyof ApiKeys, value: string) => {
    setLocalKeys((prev) => ({ ...prev, [provider]: value }));
    setSaved(false);
  };

  const toggleShowKey = (providerId: string) => {
    setShowKeys(prev => ({ ...prev, [providerId]: !prev[providerId] }));
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await saveApiKeys(localKeys);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save keys:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const providers = [
    { id: 'gemini', name: 'Gemini API Key', description: 'Used for Google Gemini models (e.g., Gemini 3.1 Pro)' },
    { id: 'openai', name: 'OpenAI API Key', description: 'Used for OpenAI models (e.g., GPT-4o)' },
    { id: 'anthropic', name: 'Anthropic API Key', description: 'Used for Claude models (e.g., Claude 3.7 Sonnet)' },
    { id: 'deepseek', name: 'DeepSeek API Key', description: 'Used for DeepSeek models (e.g., DeepSeek Chat)' },
    { id: 'groq', name: 'Groq API Key', description: 'Used for Groq-hosted models (e.g., GPT OSS 120B)' },
  ] as const;

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-pink-500" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-[680px] mx-auto w-full px-4 py-12">
      {/* HEADER */}
      <div className="mb-10 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/20 flex items-center justify-center shrink-0">
          <Key className="text-pink-400" size={20} />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
            Settings
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your API keys and application preferences.
          </p>
        </div>
      </div>

      {/* SECURE STORAGE BANNER */}
      <div className="bg-[#0f1629] border border-purple-500/20 border-l-4 border-l-purple-500 rounded-2xl p-4 flex gap-3 mb-8 shadow-sm">
        <ShieldAlert className="shrink-0 text-purple-400" size={20} />
        <div className="text-slate-300 text-sm leading-relaxed">
          Your API keys are stored securely in your private account database. They will persist across different devices and browsers as long as you are logged in.
        </div>
      </div>

      {/* API KEYS CARD */}
      <div className="bg-[#080d1a] border border-white/6 rounded-3xl overflow-hidden shadow-xl">
        {/* Card header */}
        <div className="p-6 border-b border-white/6 bg-white/[0.02]">
          <h2 className="text-white font-bold text-lg">API Keys</h2>
          <p className="text-slate-500 text-sm mt-1">
            Keys are only sent to the backend when making requests.
          </p>
        </div>

        {/* Card body */}
        <div className="flex flex-col">
          {providers.map((provider) => (
            <div key={provider.id} className="p-5 border-b border-white/4 last:border-0">
              <label htmlFor={provider.id} className="block text-slate-300 text-sm font-medium mb-2">
                {provider.name}
              </label>
              <div className="relative bg-[#0a0f1a] border border-slate-800 rounded-xl px-4 py-3 focus-within:border-pink-500/40 focus-within:ring-1 focus-within:ring-pink-500/10 transition-all">
                <input
                  type={showKeys[provider.id] ? "text" : "password"}
                  id={provider.id}
                  value={localKeys[provider.id as keyof ApiKeys] || ''}
                  onChange={(e) => handleChange(provider.id as keyof ApiKeys, e.target.value)}
                  placeholder={`Enter your ${provider.name}`}
                  className="bg-transparent text-white placeholder-slate-600 outline-none w-full font-mono text-sm pr-8"
                />
                <button
                  type="button"
                  onClick={() => toggleShowKey(provider.id)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-pink-400 transition-colors"
                >
                  {showKeys[provider.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">{provider.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Save Area */}
      <div className="mt-6 flex items-center justify-end gap-4">
        {saved && (
          <span className="text-emerald-400 flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-right-4">
            <CheckCircle2 size={18} />
            Saved successfully
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-pink-500/25 transition-all disabled:opacity-50 active:scale-95"
        >
          {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
