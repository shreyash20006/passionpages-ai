import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = { maxDuration: 30 };

const SYSTEM_INSTRUCTION = `You are PassionPages.ai, an advanced AI learning assistant designed for college students (B.Tech, M.Tech, B.Pharm, D.Pharm).
Your goal is to simplify complex academic topics, generate study aids, and provide expert guidance.
Be professional, encouraging, and highly accurate. Use Markdown for formatting.

IMPORTANT MATH FORMATTING RULES:
- For inline math expressions, ALWAYS use single dollar sign delimiters: $expression$
- For block/display math equations, ALWAYS use double dollar sign delimiters: $$expression$$
- NEVER wrap equations in square brackets like [\\frac{...}]
- Only use $...$ and $$...$$ for all mathematical expressions.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { messages, modelId } = req.body;

    // ─── Gemini route ──────────────────────────────────────────────────────────
    if (modelId.startsWith('gemini:')) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY_MISSING' });

      const geminiModelId = modelId.replace(/^gemini:/, '');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: geminiModelId, systemInstruction: SYSTEM_INSTRUCTION });

      const historyRaw = messages.slice(0, -1).map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));
      let startIdx = 0;
      while (startIdx < historyRaw.length && historyRaw[startIdx].role === 'model') startIdx++;
      const history = historyRaw.slice(startIdx);
      const lastMessage = messages[messages.length - 1]?.content || '';
      const chat = model.startChat({ history });
      const result = await chat.sendMessage(lastMessage);
      return res.status(200).json({ text: result.response.text() });
    }

    // ─── xAI Grok route ────────────────────────────────────────────────────────
    if (modelId.startsWith('xai:')) {
      const apiKey = process.env.XAI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'XAI_API_KEY_MISSING' });

      const openai = new OpenAI({ apiKey, baseURL: 'https://api.x.ai/v1' });
      const formattedMessages = [
        { role: 'system', content: SYSTEM_INSTRUCTION },
        ...messages.map((m: any) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })),
      ];
      const response = await openai.chat.completions.create({ model: modelId.replace(/^xai:/, ''), messages: formattedMessages as any });
      return res.status(200).json({ text: response.choices[0].message.content });
    }

    // ─── HuggingFace route ─────────────────────────────────────────────────────
    if (modelId.startsWith('hf:')) {
      const apiKey = process.env.HUGGINGFACE_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'HUGGINGFACE_API_KEY_MISSING' });

      const openai = new OpenAI({ apiKey, baseURL: 'https://router.huggingface.co/v1' });
      const formattedMessages = [
        { role: 'system', content: SYSTEM_INSTRUCTION },
        ...messages.map((m: any) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })),
      ];
      const response = await openai.chat.completions.create({ model: modelId.replace(/^hf:/, ''), messages: formattedMessages as any });
      return res.status(200).json({ text: response.choices[0].message.content });
    }

    return res.status(400).json({ error: 'Unsupported model' });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
