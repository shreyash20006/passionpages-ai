import React, { useState } from "react";
import StudyGuideRenderer from "../components/StudyGuideRenderer";
import { Loader2 } from "lucide-react";

export default function GenerateContent() {
  const [loading, setLoading] = useState(false);
  const [studyGuide, setStudyGuide] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (text: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          modelId: 'hf:meta-llama/Llama-3.3-70B-Instruct'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      
      // Parse the JSON response
      const parsedData = JSON.parse(data.text);
      setStudyGuide(parsedData);
      
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Input Section */}
        {!studyGuide && (
          <div className="text-center space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Generate Study Guide
              </h1>
              <p className="text-slate-400">
                Enter your study material and let AI create a comprehensive guide
              </p>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <textarea
                className="w-full h-64 bg-slate-900/50 border border-white/10 rounded-xl p-4 text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Paste your study material here...&#10;&#10;Example:&#10;- Lecture notes&#10;- Textbook chapters&#10;- Research papers&#10;- Any educational content"
                onChange={(e) => {
                  // Store text for generation
                  (window as any).__studyText = e.target.value;
                }}
              />
              
              <button
                onClick={() => handleGenerate((window as any).__studyText || '')}
                disabled={loading}
                className="mt-6 w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Study Guide...
                  </>
                ) : (
                  'Generate Study Guide'
                )}
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Results Section */}
        {studyGuide && (
          <div>
            <button
              onClick={() => setStudyGuide(null)}
              className="mb-6 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            >
              ← Back to Input
            </button>
            
            <StudyGuideRenderer data={studyGuide} />
          </div>
        )}
      </div>
    </div>
  );
}
