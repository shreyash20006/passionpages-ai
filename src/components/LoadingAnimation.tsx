import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface LoadingAnimationProps {
  onComplete: () => void;
}

export default function LoadingAnimation({ onComplete }: LoadingAnimationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#09090b] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center">
          <Sparkles size={22} className="text-white" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-base font-semibold text-white tracking-tight">PassionPages</span>
          <span className="text-base font-semibold text-indigo-400">.ai</span>
        </div>
        <div className="flex gap-1.5 mt-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#3f3f46]"
              style={{ animation: `dot-fade 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes dot-fade {
          0%, 100% { background-color: #3f3f46; }
          50%       { background-color: #6366f1; }
        }
      `}</style>
    </div>
  );
}
