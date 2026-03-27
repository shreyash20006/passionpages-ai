import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';

export const config = { maxDuration: 30 };

const SYSTEM_INSTRUCTION = `You are PassionPages.ai, an advanced AI learning assistant designed for college students (B.Tech, M.Tech, B.Pharm, D.Pharm).
Your goal is to simplify complex academic topics, generate study aids, and provide expert guidance.
Be professional, encouraging, and highly accurate. Use Markdown for formatting.

IMPORTANT MATH FORMATTING RULES:
- For inline math expressions, ALWAYS use single dollar sign delimiters: $expression$
- For block/display math equations, ALWAYS use double dollar sign delimiters: $$expression$$
- NEVER wrap equations in square brackets like [\\frac{...}]
- Only use $...$ and $$...$$ for all mathematical expressions.

WHEN ASKED FOR A VISUALIZATION OR DIAGRAM:
- CRITICAL: You are BANNED from using markdown \`\`\`mermaid\`\`\` format for diagrams!
- If the user asks for a visual, diagram, graph, chart, or flowchart, you MUST respond with purely a JSON object and NOTHING ELSE. No markdown text before or after it.
- Your output MUST be exactly this JSON structure:
\`\`\`json
{
  "type": "diagram",
  "title": "Clear Diagram Title",
  "description": "Short explanation of the visualization",
  "svgCode": "<svg viewBox='0 0 800 500' xmlns='http://www.w3.org/2000/svg'>[Your incredibly detailed, styled SVG code here]</svg>"
}
\`\`\`
- MAKE SURE the SVG looks premium! Use beautiful modern colors, drop-shadows, gradients, precise shapes, and easily readable <text> tags! This is a strict requirement.`;

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

    // ─── Anthropic route ──────────────────────────────────────────────────────────
    if (modelId.startsWith('anthropic:')) {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY_MISSING' });

      const anthropic = new Anthropic({ apiKey });
      const formattedMessages = messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      }));

      const response = await anthropic.messages.create({
        model: modelId.replace(/^anthropic:/, ''),
        max_tokens: 4096,
        system: SYSTEM_INSTRUCTION,
        messages: formattedMessages as any,
      });

      const messageContent = response.content[0];
      const text = messageContent.type === 'text' ? messageContent.text : '';
      return res.status(200).json({ text });
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
