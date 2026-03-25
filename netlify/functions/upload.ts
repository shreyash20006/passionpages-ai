import { Handler } from "@netlify/functions";
import OpenAI from "openai";
import { authenticateUser } from "./utils/auth";
import { jsonResponse, errorResponse } from "./utils/response";

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return errorResponse(405, "Method Not Allowed");
  }

  try {
    const { text, modelId = "hf:meta-llama/Llama-3.3-70B-Instruct" } = JSON.parse(event.body || "{}");
    await authenticateUser(event);
    
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
    {
      "question": "Concept-based question",
      "answer": "Clear answer",
      "type": "good"
    },
    {
      "question": "Common mistake or confusion",
      "answer": "Correct explanation",
      "type": "bad"
    }
  ],

  "quiz": [
    {
      "question": "MCQ question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Correct option"
    }
  ],

  "diagram": "Valid Mermaid diagram code only (graph TD; ...)",

  "ppt": [
    {
      "title": "Slide title",
      "points": ["Short point 1", "Short point 2", "Short point 3"],
      "theme": "gradient-purple"
    }
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

    if (modelId.startsWith("hf:")) {
      const apiKey = process.env.HUGGINGFACE_API_KEY;
      if (!apiKey) return errorResponse(500, "HUGGINGFACE_API_KEY_MISSING");

      const hfModel = modelId.replace(/^hf:/, "");
      const openai = new OpenAI({
        apiKey,
        baseURL: "https://router.huggingface.co/v1",
      });

      let hfResponse;
      try {
        hfResponse = await openai.chat.completions.create({
          model: hfModel,
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
        });
      } catch {
        hfResponse = await openai.chat.completions.create({
          model: hfModel,
          messages: [{ role: "user", content: prompt }],
        });
      }

      return jsonResponse(200, { text: hfResponse.choices[0].message.content });
    }

    return errorResponse(400, "Unsupported model");
  } catch (error: any) {
    console.error("Upload API Error:", error);
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
