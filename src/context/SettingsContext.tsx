import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getAuthToken } from '../lib/auth';

export interface ApiKeys {
  gemini: string;
  openai: string;
  anthropic: string;
  deepseek: string;
  groq: string;
}

interface SettingsContextType {
  apiKeys: ApiKeys;
  setApiKey: (provider: keyof ApiKeys, key: string) => void;
  saveApiKeys: (keys: ApiKeys) => Promise<void>;
  loading: boolean;
}

const defaultKeys: ApiKeys = {
  gemini: '',
  openai: '',
  anthropic: '',
  deepseek: '',
  groq: '',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKeys>(defaultKeys);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setApiKeys(defaultKeys);
      setLoading(false);
      return;
    }

    const fetchKeys = async () => {
      setLoading(true);
      try {
        const token = await getAuthToken();
        const response = await fetch('/api/settings/keys', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setApiKeys({ ...defaultKeys, ...data });
        }
      } catch (error) {
        console.error("Error fetching keys from backend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKeys();
  }, [user]);

  const setApiKey = (provider: keyof ApiKeys, key: string) => {
    setApiKeys((prev) => ({ ...prev, [provider]: key }));
  };

  const saveApiKeys = async (keys: ApiKeys) => {
    if (!user) return;

    try {
      const token = await getAuthToken();
      const response = await fetch('/api/settings/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ keys }),
      });

      if (!response.ok) {
        throw new Error('Failed to save keys');
      }
      
      setApiKeys(keys);
    } catch (error) {
      console.error("Error saving keys:", error);
      throw error;
    }
  };

  return (
    <SettingsContext.Provider value={{ apiKeys, setApiKey, saveApiKeys, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
