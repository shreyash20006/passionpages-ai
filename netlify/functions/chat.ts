import { Handler } from "@netlify/functions";
import OpenAI from "openai";
import { authenticateUser } from "./utils/auth";
import { jsonResponse, errorResponse } from "./utils/response";

const SYSTEM_INSTRUCTION = `You are PassionPages.ai, an advanced AI learning assistant designed for college students (B.Tech, M.Tech, B.Pharm, D.Pharm).
Your goal is to simplify complex academic topics, generate study aids, and provide expert guidance.
Be professional, encouraging, and highly accurate. Use Markdown for formatting.`;

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return errorResponse(405, "Method Not Allowed");
  }

  try {
    const { messages, modelId } = JSON.parse(event.body || "{}");
    await authenticateUser(event);

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

      // Bytez is OpenAI-compatible — use OpenAI SDK with Bytez base URL
      const openai = new OpenAI({
        apiKey,
        baseURL: "https://api.bytez.com/models/v2/openai/v1",
      });

      const formattedMessages = [
        { role: "system", content: SYSTEM_INSTRUCTION },
        ...messages.map((m: any) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        })),
      ];

      const response = await openai.chat.completions.create({
        model: bytezModelId,
        messages: formattedMessages as any,
        max_tokens: 1024,
      });

      const text = response.choices[0]?.message?.content ?? "";
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
