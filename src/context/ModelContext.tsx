import React, { createContext, useContext, useState } from "react";

export type ModelProvider = "huggingface" | "bytez" | "gemini";

export interface Model {
  id: string;
  name: string;
  provider: ModelProvider;
}

export const AVAILABLE_MODELS: Model[] = [
  {
    id: "gemini:gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "gemini",
  },
  {
    id: "gemini:gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    provider: "gemini",
  },
  {
    id: "hf:Qwen/Qwen2.5-7B-Instruct",
    name: "Qwen2.5 7B (Hugging Face)",
    provider: "huggingface",
  },
  {
    id: "bytez:Qwen/Qwen3-0.6B",
    name: "Qwen3 0.6B (Bytez)",
    provider: "bytez",
  },
];

interface ModelContextType {
  selectedModel: Model;
  setSelectedModel: (model: Model) => void;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export function ModelProvider({ children }: { children: React.ReactNode }) {
  const [selectedModel, setSelectedModel] = useState<Model>(
    AVAILABLE_MODELS[0],
  );

  return (
    <ModelContext.Provider value={{ selectedModel, setSelectedModel }}>
      {children}
    </ModelContext.Provider>
  );
}

export function useModel() {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error("useModel must be used within a ModelProvider");
  }
  return context;
}
