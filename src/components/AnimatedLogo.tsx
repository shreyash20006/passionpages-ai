import React from "react";

interface AnimatedLogoProps {
  onClick?: () => void;
  size?: "small" | "normal";
}

export default function AnimatedLogo({ onClick, size = "normal" }: AnimatedLogoProps) {
  const iconSize = size === "small" ? { width: "32px", height: "32px" } : { width: "36px", height: "36px" };
  const fontSize = size === "small" ? "14.5px" : "16.5px";
  const subSize = size === "small" ? "8px" : "9px";

  const replayLogo = () => {
    const sel = '.al-spin-ring,.al-logo-icon-box,.al-sv1,.al-sv2,.al-sv3,.al-pdot,.al-sk,.al-lt-passion,.al-lt-pages,.al-lt-dot,.al-lt-ai,.al-logo-sub,.al-uline-path';
    document.querySelectorAll(sel).forEach(el => {
      (el as HTMLElement).style.animation = 'none';
      void (el as HTMLElement).offsetWidth;
      (el as HTMLElement).style.animation = '';
    });
  };

  const handleClick = () => {
    if (onClick) onClick();
    replayLogo();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');

        .al-logo-section {
          padding: 18px 16px 22px;
          cursor: pointer;
          position: relative;
          user-select: none;
        }
        
        .al-logo-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .al-logo-icon-wrap {
          position: relative;
          flex-shrink: 0;
        }

        .al-spin-ring {
          position: absolute;
          inset: -3px;
          border-radius: 11px;
          background: conic-gradient(from 0deg, #7c3aed, #db2777, #a855f7, #f472b6, #7c3aed);
          opacity: 0;
          animation: al-ringPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s forwards,
                     al-ringSpin 5s linear 1s infinite;
        }
        
        .al-spin-ring::after {
          content: '';
          position: absolute;
          inset: 2.5px;
          background: var(--logo-bg, #0c0e1d);
          border-radius: 8.5px;
        }
        
        @keyframes al-ringPop {
          from { opacity: 0; transform: scale(0.4) rotate(-180deg); }
          to { opacity: 1; transform: scale(1) rotate(0); }
        }
        
        @keyframes al-ringSpin {
          to { transform: rotate(360deg); }
        }

        .al-logo-icon-box {
          position: absolute;
          inset: 0;
          border-radius: 9px;
          background: linear-gradient(135deg, #1e0845, #130530);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          opacity: 0;
          transform: scale(0.3);
          animation: al-boxPop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) 0.25s forwards;
          overflow: hidden;
        }
        
        .al-logo-icon-box::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #ffffff12, transparent 55%);
        }
        
        @keyframes al-boxPop {
          to { opacity: 1; transform: scale(1); }
        }

        .al-icon-svg {
          position: relative;
          z-index: 2;
        }
        
        .al-sv1 {
          stroke-dasharray: 75;
          stroke-dashoffset: 75;
          animation: al-drawSv 0.8s ease 0.65s forwards;
        }
        
        .al-sv2 {
          stroke-dasharray: 55;
          stroke-dashoffset: 55;
          animation: al-drawSv 0.7s ease 0.85s forwards;
        }
        
        .al-sv3 {
          opacity: 0;
          animation: al-fadeUp 0.4s ease 1.35s forwards;
        }
        
        @keyframes al-drawSv {
          to { stroke-dashoffset: 0; }
        }
        
        @keyframes al-fadeUp {
          to { opacity: 1; }
        }

        .al-pdot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #db2777;
          z-index: 3;
          opacity: 0;
          box-shadow: 0 0 8px #db277788;
          animation: al-dotShow 0.3s ease 1.6s forwards, al-dotPulse 2.2s ease-in-out 2s infinite;
        }
        
        @keyframes al-dotShow {
          to { opacity: 1; }
        }
        
        @keyframes al-dotPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 #db277766; }
          50% { transform: scale(1.3); box-shadow: 0 0 0 5px #db277700; }
        }

        .al-sparks-wrap {
          position: absolute;
          inset: -10px;
          pointer-events: none;
          z-index: 4;
        }
        
        .al-sk {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          opacity: 0;
        }
        
        .al-sk:nth-child(1) {
          top: 5%;
          left: 50%;
          background: #a855f7;
          animation: al-skFly 0.5s ease 1.6s forwards;
          --tx: -14px;
          --ty: -16px;
        }
        
        .al-sk:nth-child(2) {
          top: 50%;
          right: 0;
          background: #db2777;
          animation: al-skFly 0.5s ease 1.7s forwards;
          --tx: 16px;
          --ty: -10px;
        }
        
        .al-sk:nth-child(3) {
          bottom: 5%;
          left: 25%;
          background: #a855f7;
          animation: al-skFly 0.5s ease 1.75s forwards;
          --tx: -12px;
          --ty: 14px;
        }
        
        .al-sk:nth-child(4) {
          top: 30%;
          left: 0;
          background: #f472b6;
          animation: al-skFly 0.4s ease 1.8s forwards;
          --tx: -16px;
          --ty: 6px;
        }
        
        @keyframes al-skFly {
          0% { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0); }
        }

        .al-logo-text-wrap {
          display: flex;
          flex-direction: column;
          gap: 1px;
          overflow: hidden;
        }
        
        .al-logo-name {
          display: flex;
          align-items: baseline;
          line-height: 1;
        }
        
        .al-lt-passion {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          letter-spacing: -0.4px;
          background: linear-gradient(120deg, #fff, #d8b4fe);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          opacity: 0;
          transform: translateX(-18px);
          animation: al-slideIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) 1.05s forwards;
        }
        
        .al-lt-pages {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          letter-spacing: -0.4px;
          background: linear-gradient(120deg, #c084fc, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          opacity: 0;
          transform: translateX(-12px);
          animation: al-slideIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) 1.17s forwards;
        }
        
        .al-lt-dot {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          color: #ffffff33;
          opacity: 0;
          animation: al-fadeUp 0.4s ease 1.28s forwards;
        }
        
        .al-lt-ai {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          background: linear-gradient(120deg, #f472b6, #db2777);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          opacity: 0;
          transform: translateX(-8px);
          animation: al-slideIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) 1.3s forwards;
        }
        
        @keyframes al-slideIn {
          to { opacity: 1; transform: translateX(0); }
        }
        
        .al-logo-sub {
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #ffffff22;
          opacity: 0;
          animation: al-fadeUp 0.5s ease 1.55s forwards;
        }

        .al-uline-wrap {
          position: absolute;
          bottom: 4px;
          left: 14px;
          width: 190px;
          height: 20px;
          overflow: visible;
          pointer-events: none;
        }
        
        .al-uline-path {
          stroke-dasharray: 220;
          stroke-dashoffset: 220;
          animation: al-drawUline 0.8s ease 1.7s forwards;
        }
        
        @keyframes al-drawUline {
          to { stroke-dashoffset: 0; }
        }
      `}</style>

      <div className="al-logo-section" onClick={handleClick} title="Click to replay animation">
        <div className="al-logo-row">
          <div className="al-logo-icon-wrap" style={iconSize}>
            <div className="al-spin-ring"></div>
            <div className="al-sparks-wrap">
              <div className="al-sk"></div>
              <div className="al-sk"></div>
              <div className="al-sk"></div>
              <div className="al-sk"></div>
            </div>
            <div className="al-logo-icon-box">
              <svg className="al-icon-svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <defs>
                  <linearGradient id="al-ig1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#c084fc" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                  <linearGradient id="al-ig2" x1="1" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                <path className="al-sv1" d="M10 16C10 16 4.5 13.5 3.5 6L3.5 5.5C3.5 4.8 4.2 4.4 4.8 4.7C6.2 5.3 8.2 6.8 10 8.5" stroke="url(#al-ig1)" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                <path className="al-sv2" d="M10 16C10 16 15.5 13.5 16.5 6L16.5 5.5C16.5 4.8 15.8 4.4 15.2 4.7C13.8 5.3 11.8 6.8 10 8.5" stroke="url(#al-ig2)" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                <path className="al-sv1" d="M10 8.5L10 16" stroke="url(#al-ig1)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                <path className="al-sv3" d="M5.5 7.5L8.5 8.5M5.3 10L8.3 10.6M5.3 12.2L8.3 12.6" stroke="#c084fc55" strokeWidth="0.8" strokeLinecap="round" />
                <path className="al-sv3" d="M14.5 7.5L11.5 8.5M14.7 10L11.7 10.6M14.7 12.2L11.7 12.6" stroke="#ec489955" strokeWidth="0.8" strokeLinecap="round" />
                <circle className="al-sv3" cx="10" cy="3.8" r="1.4" fill="url(#al-ig1)" />
                <circle className="al-sv3" cx="10" cy="3.8" r="2.4" fill="url(#al-ig1)" opacity="0.15" />
              </svg>
            </div>
            <div className="al-pdot"></div>
          </div>
          <div className="al-logo-text-wrap">
            <div className="al-logo-name" style={{ fontSize }}>
              <span className="al-lt-passion">Passion</span>
              <span className="al-lt-pages">Pages</span>
              <span className="al-lt-dot">.</span>
              <span className="al-lt-ai">ai</span>
            </div>
            <div className="al-logo-sub" style={{ fontSize: subSize }}>AI Study Assistant</div>
          </div>
        </div>
        <div className="al-uline-wrap">
          <svg viewBox="0 0 190 20" width="190" height="20" fill="none" overflow="visible">
            <defs>
              <linearGradient id="al-ulg" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
                <stop offset="55%" stopColor="#a855f7" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path className="al-uline-path" d="M2 14 Q50 2 100 10 Q140 16 188 6" stroke="url(#al-ulg)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      </div>
    </>
  );
}
