import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  UploadCloud,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import { useModel } from "../context/ModelContext";
import { useAuth } from "../context/AuthContext";
import { getAuthToken } from "../lib/auth";

// Use a more reliable worker source from the package itself via Vite
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function Upload() {
  const { selectedModel } = useModel();
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const typeParam = queryParams.get("type") || "summary";

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isProcessing) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < 2 ? prev + 1 : prev));
      }, 15000); // Progress to next step every 15 seconds
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const findFirstJsonObject = (input: string): string | null => {
    let start = -1;
    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let i = 0; i < input.length; i++) {
      const ch = input[i];

      if (inString) {
        if (escaped) {
          escaped = false;
          continue;
        }
        if (ch === "\\") {
          escaped = true;
          continue;
        }
        if (ch === '"') {
          inString = false;
        }
        continue;
      }

      if (ch === '"') {
        inString = true;
        continue;
      }

      if (ch === "{") {
        if (depth === 0) start = i;
        depth++;
        continue;
      }

      if (ch === "}") {
        if (depth > 0) depth--;
        if (depth === 0 && start !== -1) {
          return input.slice(start, i + 1);
        }
      }
    }

    return null;
  };

  const parseAiJsonPayload = (rawText: string): any => {
    const candidates: string[] = [];

    const fencedMatches = rawText.matchAll(/```(?:json)?\s*([\s\S]*?)```/gi);
    for (const match of fencedMatches) {
      if (match[1]) candidates.push(match[1].trim());
    }
    candidates.push(rawText.trim());

    for (const candidate of candidates) {
      if (!candidate) continue;

      try {
        return JSON.parse(candidate);
      } catch {
        // Try extracting the first balanced JSON object from noisy output.
      }

      const extracted = findFirstJsonObject(candidate);
      if (!extracted) continue;

      try {
        return JSON.parse(extracted);
      } catch {
        // Keep trying next candidate.
      }
    }

    throw new Error("Failed to understand the AI response. Please try again.");
  };

  const extractJsonLikeStringField = (
    rawText: string,
    fieldName: string,
  ): string | null => {
    const keyIndex = rawText.indexOf(`"${fieldName}"`);
    if (keyIndex === -1) return null;

    const colonIndex = rawText.indexOf(":", keyIndex);
    if (colonIndex === -1) return null;

    let valueStart = colonIndex + 1;
    while (valueStart < rawText.length && /\s/.test(rawText[valueStart])) {
      valueStart++;
    }

    if (rawText[valueStart] !== '"') return null;
    valueStart++;

    let i = valueStart;
    let escaped = false;
    let out = "";

    while (i < rawText.length) {
      const ch = rawText[i];

      if (escaped) {
        switch (ch) {
          case "n":
            out += "\n";
            break;
          case "r":
            out += "\r";
            break;
          case "t":
            out += "\t";
            break;
          case '"':
            out += '"';
            break;
          case "\\":
            out += "\\";
            break;
          default:
            out += ch;
            break;
        }
        escaped = false;
        i++;
        continue;
      }

      if (ch === "\\") {
        escaped = true;
        i++;
        continue;
      }

      if (ch === '"') {
        return out.trim();
      }

      out += ch;
      i++;
    }

    return out.trim() || null;
  };

  const normalizeResultsData = (input: any, rawText: string) => {
    const source = input && typeof input === "object" ? input : {};
    const rawSummary = extractJsonLikeStringField(rawText, "summary");

    const summary =
      (typeof source.summary === "string" && source.summary.trim()) ||
      (typeof source.notes === "string" && source.notes.trim()) ||
      (typeof source.content === "string" && source.content.trim()) ||
      (typeof rawSummary === "string" && rawSummary.trim()) ||
      rawText.trim();

    const flashcards = Array.isArray(source.flashcards)
      ? source.flashcards
          .map((card: any) => {
            if (typeof card === "string") {
              return { question: card, answer: "" };
            }

            if (card && typeof card === "object") {
              const question =
                (typeof card.question === "string" && card.question) ||
                (typeof card.front === "string" && card.front) ||
                "";
              const answer =
                (typeof card.answer === "string" && card.answer) ||
                (typeof card.back === "string" && card.back) ||
                "";

              if (question || answer) {
                return { question, answer };
              }
            }

            return null;
          })
          .filter(Boolean)
      : [];

    const table =
      source.table &&
      Array.isArray(source.table.headers) &&
      Array.isArray(source.table.rows)
        ? {
            headers: source.table.headers.map((h: any) => String(h ?? "")),
            rows: source.table.rows.map((row: any) =>
              Array.isArray(row)
                ? row.map((cell: any) => String(cell ?? ""))
                : [],
            ),
          }
        : undefined;

    const mindmap =
      source.mindmap &&
      typeof source.mindmap.root === "string" &&
      Array.isArray(source.mindmap.branches)
        ? {
            root: source.mindmap.root,
            branches: source.mindmap.branches.map((b: any) => ({
              label: String(b?.label ?? ""),
              nodes: Array.isArray(b?.nodes)
                ? b.nodes.map((n: any) => String(n ?? ""))
                : [],
            })),
          }
        : undefined;

    const buildSlidesFromSummary = (summaryText: string) => {
      const lines = summaryText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      const deck: { title: string; bullets: string[] }[] = [];
      let currentTitle = "Key Concepts";
      let currentBullets: string[] = [];

      const pushCurrent = () => {
        if (currentBullets.length > 0) {
          deck.push({
            title: currentTitle,
            bullets: currentBullets.slice(0, 6),
          });
          currentBullets = [];
        }
      };

      for (const line of lines) {
        const headingMatch = line.match(/^#{1,6}\s+(.+)$/);
        if (headingMatch) {
          pushCurrent();
          currentTitle = headingMatch[1].trim();
          continue;
        }

        const bulletMatch =
          line.match(/^[-*]\s+(.+)$/) || line.match(/^\d+\.\s+(.+)$/);
        if (bulletMatch) {
          currentBullets.push(bulletMatch[1].trim());
          if (currentBullets.length >= 6) {
            pushCurrent();
          }
          continue;
        }

        if (line.length > 15 && !line.startsWith("```")) {
          currentBullets.push(line.replace(/^\W+/, "").trim());
          if (currentBullets.length >= 6) {
            pushCurrent();
          }
        }
      }

      pushCurrent();

      if (deck.length === 0) {
        return [
          {
            title: "Study Notes",
            bullets: [summaryText.slice(0, 240)],
          },
        ];
      }

      return deck.slice(0, 8);
    };

    const slides = Array.isArray(source.slides)
      ? source.slides
          .map((s: any) => ({
            title: String(s?.title ?? ""),
            bullets: Array.isArray(s?.bullets)
              ? s.bullets.map((b: any) => String(b ?? ""))
              : [],
          }))
          .filter((s: any) => s.title || s.bullets.length > 0)
      : buildSlidesFromSummary(summary);

    const infographic =
      source.infographic && Array.isArray(source.infographic.sections)
        ? {
            title: String(source.infographic.title ?? "Infographic"),
            sections: source.infographic.sections
              .map((sec: any) => ({
                heading: String(sec?.heading ?? ""),
                content: String(sec?.content ?? ""),
                icon: String(sec?.icon ?? "info"),
              }))
              .filter((sec: any) => sec.heading || sec.content),
          }
        : undefined;

    return {
      summary,
      flashcards,
      table,
      mindmap,
      slides,
      infographic,
    };
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const extractTextFromPDF = async (pdfFile: File) => {
    setIsExtracting(true);
    setError("");
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });

      const pdf = await loadingTask.promise;

      // Limit to first 100 pages for performance if it's a massive document
      const numPages = Math.min(pdf.numPages, 100);
      const pagePromises = [];

      for (let i = 1; i <= numPages; i++) {
        pagePromises.push(
          (async () => {
            try {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              return textContent.items.map((item: any) => item.str).join(" ");
            } catch (pageErr) {
              console.warn(`Could not extract text from page ${i}:`, pageErr);
              return "";
            }
          })(),
        );
      }

      const pageTexts = await Promise.all(pagePromises);
      let fullText = pageTexts.join("\n\n");

      if (!fullText.trim()) {
        throw new Error(
          "The PDF appears to be empty or contains only images (scanned document).",
        );
      }

      setTextInput(fullText);
      setFile(pdfFile);
    } catch (err: any) {
      console.error("Error parsing PDF:", err);
      const message = err.message || "Failed to parse PDF file.";
      setError(
        `${message} Please try a text-based PDF, or paste your notes directly into the text box below.`,
      );
      setFile(null);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    setError("");

    // Increase limit to 50MB
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError("File is too large. Please upload a file under 50MB.");
      return;
    }

    if (
      selectedFile.type === "text/plain" ||
      selectedFile.name.endsWith(".txt")
    ) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTextInput(e.target?.result as string);
        setFile(selectedFile);
      };
      reader.readAsText(selectedFile);
    } else if (
      selectedFile.type === "application/pdf" ||
      selectedFile.name.endsWith(".pdf")
    ) {
      extractTextFromPDF(selectedFile);
    } else {
      setFile(null);
      setError("Unsupported file format. Please upload a TXT or PDF file.");
    }
  };

  const processNotes = async () => {
    if (!textInput.trim()) {
      setError("Please provide some text to process.");
      return;
    }

    setIsProcessing(true);
    setError("");
    console.log("Starting note processing...");

    try {
      console.log("Sending request to backend API...");

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(
                "Request timed out. The document might be too large or the server is busy. Please try with a shorter text.",
              ),
            ),
          180000,
        ),
      );

      const token = user ? await getAuthToken() : null;

      const fetchPromise = fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          text: textInput,
          modelId: selectedModel.id,
        }),
      });

      const response = (await Promise.race([
        fetchPromise,
        timeoutPromise,
      ])) as Response;

      let dataResponse;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        dataResponse = await response.json();
      } else {
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse);
        throw new Error(
          `Server returned an unexpected response (${response.status}). Please try again with a smaller file or plain text.`,
        );
      }

      if (!response.ok) {
        throw new Error(dataResponse.error || "Failed to process notes");
      }

      const resultText = dataResponse.text;
      console.log("Received response from backend API");

      if (!resultText) {
        throw new Error(
          "The AI returned an empty response. Please try again with different notes.",
        );
      }

      try {
        let parsedData: any = null;

        try {
          parsedData = parseAiJsonPayload(resultText);
        } catch (parseErr) {
          console.warn(
            "Could not parse strict JSON payload, falling back to normalized text response:",
            parseErr,
          );
        }

        const data = normalizeResultsData(parsedData, resultText);

        if (!data.summary || !data.summary.trim()) {
          throw new Error(
            "The AI returned an empty response. Please try again.",
          );
        }

        console.log("Processing successful, navigating to results");
        navigate("/results", { state: { data, type: typeParam } });
      } catch (parseErr) {
        console.error(
          "Result Normalization Error:",
          parseErr,
          "Raw text:",
          resultText,
        );
        throw new Error(
          "Failed to understand the AI response. Please try again.",
        );
      }
    } catch (err: any) {
      console.error("Processing Error Detail:", err);
      let errorMessage = "Failed to process notes. Please try again.";

      let parsedErrorMessage = err.message;
      try {
        const parsed = JSON.parse(err.message);
        if (parsed.error && parsed.error.message) {
          parsedErrorMessage = parsed.error.message;
        }
      } catch (e) {
        // Not JSON
      }

      const isApiKeyError =
        parsedErrorMessage?.includes("API_KEY_MISSING") ||
        parsedErrorMessage?.includes("API_KEY is missing") ||
        parsedErrorMessage?.includes("API key not valid") ||
        parsedErrorMessage?.includes("API_KEY_INVALID") ||
        parsedErrorMessage?.includes("authentication failed");

      const isPermissionError =
        parsedErrorMessage?.includes("sufficient permissions") ||
        parsedErrorMessage?.includes("Inference Providers") ||
        parsedErrorMessage?.includes("403");

      if (isApiKeyError) {
        errorMessage =
          "API Key Missing. Set HUGGINGFACE_API_KEY in Vercel Project Settings → Environment Variables, then redeploy.";
      } else if (isPermissionError) {
        errorMessage =
          "Hugging Face token lacks Inference Providers permission. Create/update token permissions, update HUGGINGFACE_API_KEY, then redeploy/restart.";
      } else if (parsedErrorMessage?.includes("quota") || err.status === 429) {
        errorMessage =
          "API quota exceeded. Please wait 60 seconds and try again.";
      } else if (parsedErrorMessage) {
        errorMessage = parsedErrorMessage;
      }

      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const getTitle = () => {
    switch (typeParam) {
      case "flashcards":
        return "Generate Flashcards";
      case "slides":
        return "Generate Slide Deck";
      case "mindmap":
        return "Generate Mind Map";
      case "table":
        return "Generate Cheatsheet";
      case "summary":
        return "Generate Notes & Report";
      default:
        return "Upload Study Materials";
    }
  };

  const getDescription = () => {
    switch (typeParam) {
      case "flashcards":
        return "Upload your notes to automatically generate study flashcards.";
      case "slides":
        return "Upload your notes to automatically generate a presentation slide deck.";
      case "mindmap":
        return "Upload your notes to automatically generate a visual mind map.";
      case "table":
        return "Upload your notes to automatically generate a structured cheatsheet.";
      case "summary":
        return "Upload your notes to automatically generate a comprehensive summary and report.";
      default:
        return "We'll analyze your notes and generate summaries and flashcards.";
    }
  };

  return (
    <div className="max-w-[720px] mx-auto px-4 py-12 w-full">
      {/* HEADER SECTION */}
      <div className="mb-8">
        <div className="text-slate-600 text-xs mb-3 font-medium tracking-wide uppercase">
          PassionPages / {getTitle()}
        </div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
          {getTitle()}
        </h1>
        <p className="text-slate-500 text-sm mt-2">{getDescription()}</p>
      </div>

      {/* UPLOAD ZONE */}
      <div className="relative">
        {isProcessing && (
          <div className="absolute inset-0 z-20 bg-[#050914]/90 backdrop-blur-md flex flex-col items-center justify-center rounded-3xl border border-white/5">
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-pink-400 animate-orb-float shadow-[0_0_50px_rgba(236,72,153,0.5)]" />
              <div className="absolute inset-[-10px] rounded-full border-2 border-pink-500/20 animate-pulse-glow" />
              <div
                className="absolute inset-[-20px] rounded-full border border-purple-500/10 animate-pulse-glow"
                style={{ animationDelay: "1s" }}
              />
            </div>
            <h3 className="text-2xl font-bold text-white mb-6">
              Analyzing your notes...
            </h3>

            <div className="flex flex-col items-start gap-4 text-slate-300 bg-[#0a0f1a] p-6 rounded-3xl border border-white/5 w-full max-w-sm shadow-inner">
              <LoadingStep
                active={loadingStep === 0}
                completed={loadingStep > 0}
                text="Reading and structuring document"
                color="text-pink-500"
              />
              <LoadingStep
                active={loadingStep === 1}
                completed={loadingStep > 1}
                text="Generating summaries & flashcards"
                color="text-purple-500"
              />
              <LoadingStep
                active={loadingStep === 2}
                completed={loadingStep > 2}
                text="Creating mind maps & infographics"
                color="text-pink-400"
              />
            </div>

            <p className="text-sm text-slate-500 mt-8 font-medium">
              This might take a few minutes for large documents.
            </p>
          </div>
        )}

        <div
          className={`bg-[#0a0f1a] border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center transition-all duration-300 ${
            isExtracting
              ? "opacity-50 cursor-not-allowed border-slate-700"
              : "cursor-pointer border-slate-700 hover:border-pink-500/50 hover:bg-pink-500/5 " +
                (isDragging ? "border-pink-500 bg-pink-500/10" : "")
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={isExtracting ? undefined : handleDrop}
          onClick={() => !isExtracting && fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".txt,.pdf"
            disabled={isExtracting}
            onChange={(e) =>
              e.target.files && handleFileSelection(e.target.files[0])
            }
          />

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/20 mb-4 flex items-center justify-center">
            {isExtracting ? (
              <Loader2 className="animate-spin text-pink-400" size={32} />
            ) : (
              <UploadCloud size={32} className="text-pink-400" />
            )}
          </div>

          <h3 className="text-white font-semibold text-lg">
            {isExtracting
              ? "Extracting text from PDF..."
              : file
                ? file.name
                : "Drag & drop your files here"}
          </h3>
          <p className="text-slate-500 text-sm mt-1">PDF or TXT up to 50MB</p>

          {!isExtracting && (
            <button className="mt-6 px-8 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all active:scale-95">
              Browse Files
            </button>
          )}
        </div>

        {error && (
          <div className="mt-6 p-5 bg-pink-500/10 border border-pink-500/20 rounded-2xl flex flex-col gap-3 text-pink-200">
            <div className="flex items-start gap-3">
              <AlertCircle
                className="shrink-0 mt-0.5 text-pink-400"
                size={20}
              />
              <div>
                <p className="font-semibold text-pink-300">
                  Something went wrong
                </p>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            </div>

            <div className="mt-2 pt-3 border-t border-pink-500/20">
              <p className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-2">
                How to resolve:
              </p>
              <ul className="text-xs space-y-1.5 list-disc list-inside opacity-80">
                {error.includes("API Key") ? (
                  <>
                    <li>
                      Set <b>HUGGINGFACE_API_KEY</b> in Vercel Project Settings → Environment Variables.
                    </li>
                    <li>
                      Redeploy on Vercel after updating env values.
                    </li>
                  </>
                ) : error.includes("Inference Providers") ||
                  error.includes("permissions") ||
                  error.includes("403") ? (
                  <>
                    <li>
                      In Hugging Face token settings, enable permission to call{" "}
                      <b>Inference Providers</b>.
                    </li>
                    <li>
                      Use that updated token in Vercel Environment Variables and redeploy.
                    </li>
                  </>
                ) : error.includes("scanned") ? (
                  <>
                    <li>
                      This app currently extracts selectable text only. Scanned
                      image PDFs cannot be parsed reliably.
                    </li>
                    <li>
                      Try a text-based PDF, or copy-paste notes manually below.
                    </li>
                  </>
                ) : error.includes("quota") ? (
                  <li>
                    Wait 60 seconds and try again. The free tier has a limit on
                    requests per minute.
                  </li>
                ) : error.includes("Failed to understand the AI response") ? (
                  <>
                    <li>
                      Try again once. Some model responses include extra text
                      around JSON.
                    </li>
                    <li>
                      If it repeats, reduce input size by uploading fewer
                      pages/sections.
                    </li>
                    <li>
                      Prefer clear text PDFs over scanned/image-only PDFs.
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      Check your internet connection and try refreshing the
                      page.
                    </li>
                    <li>Ensure the file is not corrupted and is under 50MB.</li>
                    <li>Try pasting the text directly into the box below.</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}

        <div className="text-slate-600 text-xs text-center my-6 font-medium tracking-widest uppercase">
          ─── or paste text directly ───
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              {textInput.trim()
                ? `${textInput.trim().length.toLocaleString()} characters ready`
                : "No text loaded yet"}
            </p>
            {textInput && (
              <button
                type="button"
                onClick={() => {
                  setTextInput("");
                  setFile(null);
                  setError("");
                }}
                className="text-xs px-2.5 py-1 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Paste your lecture notes, textbook excerpts, or study guides here..."
            className="w-full min-h-[140px] p-5 bg-[#0a0f1a] border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-pink-500/40 focus:ring-2 focus:ring-pink-500/8 transition-all resize-none"
          />
        </div>

        <button
          onClick={processNotes}
          disabled={isProcessing || !textInput.trim()}
          className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-base hover:shadow-xl hover:shadow-pink-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:shadow-none active:scale-95"
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Processing...
            </>
          ) : (
            <>
              <FileText size={20} />
              Generate Now
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function LoadingStep({
  active,
  completed,
  text,
  color,
}: {
  active: boolean;
  completed: boolean;
  text: string;
  color: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 font-medium transition-all duration-500 ${active ? "opacity-100 scale-105" : completed ? "opacity-70" : "opacity-40"}`}
    >
      {completed ? (
        <CheckCircle2 className="text-pink-500" size={20} />
      ) : active ? (
        <Loader2 className={`animate-spin ${color}`} size={20} />
      ) : (
        <div className="w-5 h-5 rounded-full border-2 border-white/20" />
      )}
      <span className={active ? "text-white font-semibold" : ""}>{text}</span>
    </div>
  );
}
