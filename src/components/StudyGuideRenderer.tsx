import React from "react";
import { FileText, List, Table as TableIcon, Network } from "lucide-react";
import mermaid from "mermaid";

// Initialize Mermaid
mermaid.initialize({ 
  startOnLoad: true,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#a855f7',
    primaryTextColor: '#fff',
    primaryBorderColor: '#7c3aed',
    lineColor: '#ec4899',
    secondaryColor: '#db2777',
    tertiaryColor: '#3b82f6'
  }
});

interface Section {
  heading: string;
  content: string | string[] | string[][];
  type: "text" | "list" | "table" | "diagram";
  diagram?: string;
}

interface StudyGuideData {
  title: string;
  sections: Section[];
}

interface StudyGuideRendererProps {
  data: StudyGuideData;
}

export default function StudyGuideRenderer({ data }: StudyGuideRendererProps) {
  const renderMermaidDiagram = (code: string, id: string) => {
    React.useEffect(() => {
      try {
        mermaid.contentLoaded();
      } catch (error) {
        console.error('Mermaid render error:', error);
      }
    }, [code]);

    return (
      <div className="mermaid-container bg-slate-900/50 rounded-xl p-6 overflow-x-auto">
        <div className="mermaid" data-diagram-id={id}>
          {code}
        </div>
      </div>
    );
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case "text":
        return <FileText className="w-5 h-5 text-purple-400" />;
      case "list":
        return <List className="w-5 h-5 text-pink-400" />;
      case "table":
        return <TableIcon className="w-5 h-5 text-blue-400" />;
      case "diagram":
        return <Network className="w-5 h-5 text-green-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="study-guide-container space-y-8">
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
          {data.title}
        </h1>
        <div className="h-1 w-32 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {data.sections.map((section, index) => (
          <div
            key={index}
            className="section-card bg-slate-800/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300"
          >
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10">
                {getSectionIcon(section.type)}
              </div>
              <h2 className="text-xl font-semibold text-slate-200">
                {section.heading}
              </h2>
              <span className="ml-auto text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {section.type}
              </span>
            </div>

            {/* Section Content */}
            <div className="section-content">
              {/* Text Type */}
              {section.type === "text" && (
                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {section.content as string}
                  </p>
                </div>
              )}

              {/* List Type */}
              {section.type === "list" && (
                <ul className="space-y-3">
                  {(section.content as string[]).map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white mt-0.5">
                        {i + 1}
                      </span>
                      <span className="flex-1 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Table Type */}
              {section.type === "table" && (
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-white/10">
                        {(section.content as string[][])[0].map((header, i) => (
                          <th
                            key={i}
                            className="px-6 py-4 text-left text-sm font-semibold text-purple-300"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(section.content as string[][]).slice(1).map((row, i) => (
                        <tr
                          key={i}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          {row.map((cell, j) => (
                            <td
                              key={j}
                              className="px-6 py-4 text-sm text-slate-300"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Diagram Type */}
              {section.type === "diagram" && section.diagram && (
                <div className="diagram-wrapper">
                  {renderMermaidDiagram(section.diagram, `diagram-${index}`)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center pt-8">
        <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105">
          Save Study Guide
        </button>
        <button className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-all duration-300 border border-white/10">
          Export as PDF
        </button>
      </div>
    </div>
  );
}
