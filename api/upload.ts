import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

export const config = { maxDuration: 30 };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { text, modelId = 'hf:meta-llama/Llama-3.3-70B-Instruct' } = req.body;

    const prompt = `You are PassionPages.ai — an AI Study Assistant that converts any topic into a structured, visually rich learning experience.

IMPORTANT:
- Always return STRICT JSON
- Do NOT return plain text
- Do NOT add explanations outside JSON

OUTPUT FORMAT:
{
  "title": "Topic title",
  "summary": "Clear and short explanation of the topic",
  "flashcards": [
    { "question": "Concept-based question", "answer": "Clear answer", "type": "good" },
    { "question": "Common mistake or confusion", "answer": "Correct explanation", "type": "bad" }
  ],
  "quiz": [
    { "question": "MCQ question", "options": ["Option A", "Option B", "Option C", "Option D"], "answer": "Correct option" }
  ],
  "diagram": "Valid Mermaid diagram code only (graph TD; ...)",
  "ppt": [
    { "title": "Slide title", "points": ["Short point 1", "Short point 2", "Short point 3"], "theme": "gradient-purple" }
  ]
}

RULES:
- Summary should be easy to understand
- Flashcards must include both correct (good) and misconception (bad)
- Quiz must be exam-oriented
- Diagram must be simple and valid Mermaid syntax
- PPT slides must be short, clean, and presentation-ready
- Keep everything structured and visually usable for frontend rendering
- No markdown, no extra text, only JSON

USER TOPIC:
${text}`;

    if (modelId.startsWith('hf:')) {
      const apiKey = process.env.HUGGINGFACE_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'HUGGINGFACE_API_KEY_MISSING' });

      const hfModel = modelId.replace(/^hf:/, '');
      const openai = new OpenAI({ apiKey, baseURL: 'https://router.huggingface.co/v1' });

      let hfResponse;
      try {
        hfResponse = await openai.chat.completions.create({
          model: hfModel,
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
        });
      } catch {
        hfResponse = await openai.chat.completions.create({
          model: hfModel,
          messages: [{ role: 'user', content: prompt }],
        });
      }
      return res.status(200).json({ text: hfResponse.choices[0].message.content });
    }

    return res.status(400).json({ error: 'Unsupported model' });
  } catch (error: any) {
    console.error('Upload API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
