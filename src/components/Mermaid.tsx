import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  suppressErrorRendering: true,
});

export default function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && chart) {
      const id = `mermaid-${Math.random().toString(36).substring(7)}`;
      mermaid.render(id, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg;
        }
      }).catch(e => {
        console.error("Mermaid error", e);
        if (ref.current) {
          ref.current.innerHTML = `<div class="text-pink-400 p-4 border border-pink-500/20 rounded-xl bg-pink-500/10 text-sm font-medium">Error rendering diagram</div>`;
        }
      });
    }
  }, [chart]);

  return <div ref={ref} className="my-8 flex justify-center overflow-x-auto" />;
}
