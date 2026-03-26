import { Handler } from "@netlify/functions";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { authenticateUser } from "./utils/auth";
import { jsonResponse, errorResponse } from "./utils/response";

const SYSTEM_INSTRUCTION = `You are PassionPages.ai, an advanced AI learning assistant designed for college students (B.Tech, M.Tech, B.Pharm, D.Pharm).
Your goal is to simplify complex academic topics, generate study aids, and provide expert guidance.
Be professional, encouraging, and highly accurate. Use Markdown for formatting.

IMPORTANT MATH FORMATTING RULES:
- For inline math expressions, ALWAYS use single dollar sign delimiters: $expression$
  Example: The value of $x^2$ is 4.
- For block/display math equations (on their own line), ALWAYS use double dollar sign delimiters: $$expression$$
  Example:
  $$\\frac{4x^2}{4} = \\frac{16}{4}$$
- NEVER wrap equations in square brackets like [\\frac{...}] — this does NOT render correctly.
- NEVER use \\[ ... \\] or \\( ... \\) notation.
- Only use $...$ and $$...$$ for all mathematical expressions.`;

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return errorResponse(405, "Method Not Allowed");
  }

  try {
    const { messages, modelId } = JSON.parse(event.body || "{}");
    await authenticateUser(event);

    // ─── Gemini route ─────────────────────────────────────────────────────────
    if (modelId.startsWith("gemini:")) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return errorResponse(500, "GEMINI_API_KEY_MISSING");

      const geminiModelId = modelId.replace(/^gemini:/, "");
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: geminiModelId,
        systemInstruction: SYSTEM_INSTRUCTION,
      });

      // Convert messages to Gemini history format
      // Gemini requires history to start with 'user' role — filter leading assistant messages
      const historyRaw = messages.slice(0, -1).map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      // Drop leading model messages to satisfy Gemini's constraint
      let startIdx = 0;
      while (startIdx < historyRaw.length && historyRaw[startIdx].role === "model") {
        startIdx++;
      }
      const history = historyRaw.slice(startIdx);

      const lastMessage = messages[messages.length - 1]?.content || "";
      const chat = model.startChat({ history });
      const result = await chat.sendMessage(lastMessage);
      const text = result.response.text();

      return jsonResponse(200, { text });
    }


    // ─── xAI Grok route ───────────────────────────────────────────────────────
    if (modelId.startsWith("xai:")) {
      const apiKey = process.env.XAI_API_KEY;
      if (!apiKey) return errorResponse(500, "XAI_API_KEY_MISSING");

      const xaiModel = modelId.replace(/^xai:/, "");
      const openai = new OpenAI({
        apiKey,
        baseURL: "https://api.x.ai/v1",
      });

      const formattedMessages = [
        { role: "system", content: SYSTEM_INSTRUCTION },
        ...messages.map((m: any) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        })),
      ];

      const response = await openai.chat.completions.create({
        model: xaiModel,
        messages: formattedMessages as any,
      });
      return jsonResponse(200, { text: response.choices[0].message.content });
    }

    // ─── HuggingFace route ────────────────────────────────────────────────────
    if (modelId.startsWith("hf:")) {
      const apiKey = process.env.HUGGINGFACE_API_KEY;
      if (!apiKey) return errorResponse(500, "HUGGINGFACE_API_KEY_MISSING");

      const hfModel = modelId.replace(/^hf:/, "");
      const openai = new OpenAI({
        apiKey,
        baseURL: "https://router.huggingface.co/v1",
      });

      const formattedMessages = [
        { role: "system", content: SYSTEM_INSTRUCTION },
        ...messages.map((m: any) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        })),
      ];

      const response = await openai.chat.completions.create({
        model: hfModel,
        messages: formattedMessages as any,
      });
      return jsonResponse(200, { text: response.choices[0].message.content });
    }

    // ─── Bytez route (OpenAI-compatible API) ──────────────────────────────────
    if (modelId.startsWith("bytez:")) {
      const apiKey = process.env.BYTEZ_API_KEY;
      if (!apiKey) return errorResponse(500, "BYTEZ_API_KEY_MISSING");

      const bytezModelId = modelId.replace(/^bytez:/, "");
      const openai = new OpenAI({
        apiKey,
        baseURL: "https://api.bytez.com/models/v2/openai/v1",
      });

      const formattedMessages = messages.map((m: any) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      }));

      const response = await openai.chat.completions.create({
        model: bytezModelId,
        messages: [
          { role: "system", content: SYSTEM_INSTRUCTION },
          ...formattedMessages,
        ] as any,
        max_tokens: 512,
        temperature: 0.7,
      });

      const text = response.choices[0]?.message?.content;
      if (!text) {
        return errorResponse(500, "Model returned empty response. Please try again.");
      }
      return jsonResponse(200, { text });
    }

    return errorResponse(400, "Unsupported model");
  } catch (error: any) {
    console.error("Chat API Error:", error);
    const message = String(error?.message || "");
    const isPermissionError =
      error?.status === 403 ||
      message.includes("Inference Providers") ||
      message.includes("sufficient permissions");
    if (isPermissionError) {
      return errorResponse(
        403,
        "HUGGINGFACE_PERMISSION_MISSING: Enable Inference Providers permission for this token."
      );
    }
    return errorResponse(500, error.message || "Internal Server Error");
  }
};
