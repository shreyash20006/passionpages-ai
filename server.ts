import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import admin from "firebase-admin";
import firebaseConfig from "./firebase-applet-config.json" with { type: "json" };

dotenv.config({ path: ".env.local" });
dotenv.config();

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
}

const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseServiceKey || "placeholder"
);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 5000);

  app.use(express.json({ limit: "50mb" }));

  // Middleware to verify Firebase ID Token
  const authenticateUser = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const idToken = authHeader.split("Bearer ")[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      (req as any).user = decodedToken;
      next();
    } catch (error) {
      console.error("Error verifying Firebase token:", error);
      res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
  };

  // Handle JSON parsing errors
  app.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      if (err instanceof SyntaxError && "body" in err) {
        return res.status(400).json({ error: "Invalid JSON payload" });
      }
      if (err.type === "entity.too.large") {
        return res
          .status(413)
          .json({ error: "Payload too large. Please upload a smaller file." });
      }
      next(err);
    },
  );

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Settings endpoints
  app.get("/api/settings/keys", authenticateUser, async (req, res) => {
    const user = (req as any).user;
    try {
      const { data, error } = await supabase
        .from("api_keys")
        .select("provider, api_key")
        .eq("user_email", user.email);

      if (error) throw error;

      const keys: Record<string, string> = {};
      data.forEach((item) => {
        keys[item.provider] = item.api_key;
      });

      res.json(keys);
    } catch (error: any) {
      console.error("Error fetching keys from Supabase:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/settings/keys", authenticateUser, async (req, res) => {
    const user = (req as any).user;
    const { keys } = req.body; // { gemini: '...', openai: '...' }

    try {
      const upsertData = Object.entries(keys).map(([provider, api_key]) => ({
        user_email: user.email,
        provider,
        api_key,
        created_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from("api_keys")
        .upsert(upsertData, { onConflict: "user_email,provider" });

      if (error) throw error;

      res.json({ status: "success" });
    } catch (error: any) {
      console.error("Error saving keys to Supabase:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Chat history endpoints
  app.get("/api/chat/history", authenticateUser, async (req, res) => {
    const user = (req as any).user;
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("user_email", user.email)
        .order("created_at", { ascending: true });

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/chat/history", authenticateUser, async (req, res) => {
    const user = (req as any).user;
    const { role, content } = req.body;

    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .insert([
          {
            user_email: user.email,
            role,
            content,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      console.error("Error saving chat message:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Saved notes endpoints
  app.get("/api/notes", authenticateUser, async (req, res) => {
    const user = (req as any).user;
    try {
      const { data, error } = await supabase
        .from("saved_notes")
        .select("*")
        .eq("user_email", user.email)
        .order("created_at", { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/notes", authenticateUser, async (req, res) => {
    const user = (req as any).user;
    const { title, data: noteData } = req.body;

    try {
      const { data, error } = await supabase
        .from("saved_notes")
        .insert([
          {
            user_email: user.email,
            title,
            data: noteData,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      console.error("Error saving note:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/notes/:id", authenticateUser, async (req, res) => {
    const user = (req as any).user;
    const { id } = req.params;

    try {
      const { error } = await supabase
        .from("saved_notes")
        .delete()
        .eq("id", id)
        .eq("user_email", user.email);

      if (error) throw error;
      res.json({ status: "success" });
    } catch (error: any) {
      console.error("Error deleting note:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, modelId } = req.body;

      const systemInstruction = `You are PassionPages.ai, an advanced AI learning assistant designed for college students (B.Tech, M.Tech, B.Pharm, D.Pharm).
Your task is to help students learn effectively by providing clear, accurate, and engaging explanations.`;

      // Initialize Gemini API
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY_MISSING" });
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction 
      });

      // Format messages for Gemini
      const chatHistory = messages.slice(0, -1).map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      const lastMessage = messages[messages.length - 1];
      
      const chat = model.startChat({
        history: chatHistory,
      });

      const result = await chat.sendMessage(lastMessage.content);
      const response = await result.response;
      const text = response.text();

      return res.json({ text });
    } catch (error: any) {
      console.error("Chat API Error:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  app.post("/api/upload", async (req, res) => {
    try {
      const { text, modelId } = req.body;

      const prompt = `You are PassionPages.ai, an advanced AI learning assistant designed for college students (B.Tech, M.Tech, B.Pharm, D.Pharm).
      Your task is to analyze the provided study material and generate a comprehensive learning package in JSON format.
      
      Study Material:
      ${text}
      
      Requirements:
      1. Summary: A detailed, well-structured summary of the material in Markdown format.
      2. Flashcards: At least 5-10 question-answer pairs covering key concepts.
      3. Table: A structured comparison or data table if applicable.
      4. Mindmap: A hierarchical structure with a root and branches.
      5. Slides: A series of 5-8 presentation slides with titles and bullet points.
      6. Infographic: A visual breakdown with 4-6 sections, each with a heading, content, and a simple Lucide icon name (e.g., "star", "check", "alert", "info", "book", "cpu", "database").
      
      Respond ONLY with a valid JSON object matching this schema:
      {
        "summary": "string (markdown)",
        "flashcards": [{"question": "string", "answer": "string"}],
        "table": {"headers": ["string"], "rows": [["string"]]},
        "mindmap": {"root": "string", "branches": [{"label": "string", "nodes": ["string"]}]},
        "slides": [{"title": "string", "bullets": ["string"]}],
        "infographic": {"title": "string", "sections": [{"heading": "string", "content": "string", "icon": "string"}]}
      }`;

      // Initialize Gemini API
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY_MISSING" });
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json"
        }
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text_response = response.text();

      return res.json({ text: text_response });
    } catch (error: any) {
      console.error("Upload API Error:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  // Generic error handler for API routes
  app.use(
    "/api",
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      console.error("API Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    },
  );

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
