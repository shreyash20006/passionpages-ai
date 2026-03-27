import { useEffect, useState } from "react";

interface LoadingAnimationProps {
  onComplete: () => void;
}

export default function LoadingAnimation({ onComplete }: LoadingAnimationProps) {
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Auto-hide after animation completes (3.5 seconds)
    const timer = setTimeout(() => {
      setShouldRender(false);
      onComplete();
    }, 3500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!shouldRender) return null;

  return (
    <div className="loading-animation-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Inter:wght@300;400;500&display=swap');

        .loading-animation-wrapper {
          position: fixed;
          inset: 0;
          background: #06030f;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          overflow: hidden;
        }

        /* Background glow orbs */
        .la-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
        }
        .la-orb1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #7c3aed33, transparent 70%);
          top: -150px;
          left: -150px;
          animation: la-orbIn 1.5s ease 0.3s both;
        }
        .la-orb2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #db277733, transparent 70%);
          bottom: -100px;
          right: -100px;
          animation: la-orbIn 1.5s ease 0.5s both;
        }
        @keyframes la-orbIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Logo container */
        .la-logo-outer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          position: relative;
        }

        /* ICON */
        .la-icon-wrap {
          position: relative;
          width: 160px;
          height: 160px;
          margin-bottom: 28px;
        }

        /* Spinning ring */
        .la-spin-ring {
          position: absolute;
          inset: -5px;
          border-radius: 38px;
          background: conic-gradient(from 0deg, #7c3aed, #db2777, #a855f7, #f472b6, #7c3aed);
          opacity: 0;
          animation: la-ringPop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards,
                     la-ringSpin 6s linear 1.2s infinite;
        }
        .la-spin-ring::after {
          content: '';
          position: absolute;
          inset: 4px;
          background: #06030f;
          border-radius: 34px;
        }
        @keyframes la-ringPop {
          from { opacity: 0; transform: scale(0.4) rotate(-180deg); }
          to { opacity: 1; transform: scale(1) rotate(0); }
        }
        @keyframes la-ringSpin {
          to { transform: rotate(360deg); }
        }

        /* Icon box */
        .la-icon-box {
          position: absolute;
          inset: 0;
          border-radius: 34px;
          background: linear-gradient(135deg, #1e0845 0%, #120530 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          overflow: hidden;
          opacity: 0;
          transform: scale(0.3);
          animation: la-boxPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards;
          box-shadow: 0 24px 70px #7c3aed28, 0 8px 30px #00000066;
        }
        .la-icon-box::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #ffffff18 0%, transparent 55%);
          border-radius: 34px;
        }
        @keyframes la-boxPop {
          to { opacity: 1; transform: scale(1); }
        }

        /* Book SVG */
        .la-book-svg {
          width: 96px;
          height: 96px;
          position: relative;
          z-index: 2;
        }
        .la-bp1 {
          stroke-dasharray: 120;
          stroke-dashoffset: 120;
          animation: la-drawSv 1s ease 0.7s forwards;
        }
        .la-bp2 {
          stroke-dasharray: 90;
          stroke-dashoffset: 90;
          animation: la-drawSv 0.9s ease 0.95s forwards;
        }
        .la-bp3 {
          opacity: 0;
          animation: la-fadeUp 0.5s ease 1.6s forwards;
        }
        @keyframes la-drawSv {
          to { stroke-dashoffset: 0; }
        }
        @keyframes la-fadeUp {
          to { opacity: 1; }
        }

        /* Pulse dot */
        .la-pdot {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #db2777;
          z-index: 3;
          opacity: 0;
          box-shadow: 0 0 20px #db277799;
          animation: la-dotShow 0.4s ease 1.8s forwards, la-dotPulse 2.5s ease-in-out 2.2s infinite;
        }
        @keyframes la-dotShow {
          to { opacity: 1; }
        }
        @keyframes la-dotPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 #db277766; }
          50% { transform: scale(1.3); box-shadow: 0 0 0 10px #db277700; }
        }

        /* Sparks */
        .la-sparks {
          position: absolute;
          inset: -22px;
          pointer-events: none;
          z-index: 4;
        }
        .la-sk {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          opacity: 0;
        }
        .la-sk:nth-child(1) {
          top: 8%;
          left: 50%;
          background: #a855f7;
          animation: la-skFly 0.6s ease 1.8s forwards;
          --tx: -28px;
          --ty: -32px;
        }
        .la-sk:nth-child(2) {
          top: 50%;
          right: 2%;
          background: #db2777;
          animation: la-skFly 0.6s ease 1.9s forwards;
          --tx: 32px;
          --ty: -20px;
        }
        .la-sk:nth-child(3) {
          bottom: 8%;
          left: 25%;
          background: #a855f7;
          animation: la-skFly 0.6s ease 2s forwards;
          --tx: -26px;
          --ty: 28px;
        }
        .la-sk:nth-child(4) {
          top: 25%;
          left: 2%;
          background: #f472b6;
          animation: la-skFly 0.5s ease 1.95s forwards;
          --tx: -30px;
          --ty: 12px;
        }
        .la-sk:nth-child(5) {
          bottom: 25%;
          right: 5%;
          background: #c084fc;
          animation: la-skFly 0.5s ease 2.05s forwards;
          --tx: 26px;
          --ty: 24px;
        }
        @keyframes la-skFly {
          0% { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0); }
        }

        /* BRAND TEXT */
        .la-brand-name {
          display: flex;
          align-items: baseline;
          gap: 0;
          line-height: 1;
          margin-bottom: 8px;
        }
        .la-t-passion {
          font-family: 'Syne', sans-serif;
          font-weight: 900;
          font-size: 52px;
          letter-spacing: -2px;
          background: linear-gradient(120deg, #a78bfa 0%, #ddd6fe 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          opacity: 0;
          transform: translateY(30px);
          animation: la-riseUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 1.4s forwards;
        }
        .la-t-pages {
          font-family: 'Syne', sans-serif;
          font-weight: 900;
          font-size: 52px;
          letter-spacing: -2px;
          background: linear-gradient(120deg, #c084fc 0%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          opacity: 0;
          transform: translateY(30px);
          animation: la-riseUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 1.55s forwards;
        }
        .la-t-dot {
          font-family: 'Syne', sans-serif;
          font-size: 52px;
          font-weight: 900;
          color: #7c3aed44;
          opacity: 0;
          animation: la-fadeUp 0.4s ease 1.68s forwards;
        }
        .la-t-ai {
          font-family: 'Syne', sans-serif;
          font-weight: 900;
          font-size: 52px;
          letter-spacing: -1px;
          background: linear-gradient(120deg, #f472b6 0%, #db2777 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          opacity: 0;
          transform: translateY(30px);
          animation: la-riseUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 1.72s forwards;
        }
        @keyframes la-riseUp {
          to { opacity: 1; transform: translateY(0); }
        }

        /* Tagline */
        .la-tagline {
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #7c3aed66;
          display: flex;
          align-items: center;
          gap: 12px;
          opacity: 0;
          animation: la-fadeUp 0.7s ease 2s forwards;
          margin-bottom: 20px;
        }
        .la-tagline::before,
        .la-tagline::after {
          content: '';
          height: 0.5px;
          width: 40px;
          background: linear-gradient(90deg, transparent, #7c3aed44);
        }
        .la-tagline::after {
          background: linear-gradient(90deg, #7c3aed44, transparent);
        }

        /* Gradient bar */
        .la-gbar {
          height: 2.5px;
          width: 0;
          border-radius: 3px;
          background: linear-gradient(90deg, #7c3aed, #a855f7, #db2777);
          animation: la-barGrow 0.9s cubic-bezier(0.22, 1, 0.36, 1) 2.1s forwards;
          margin-bottom: 28px;
        }
        @keyframes la-barGrow {
          to { width: 380px; }
        }

        /* Pills */
        .la-pills {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
          opacity: 0;
          animation: la-fadeUp 0.6s ease 2.3s forwards;
        }
        .la-pill {
          padding: 7px 16px;
          border-radius: 100px;
          border: 0.5px solid #7c3aed33;
          background: #7c3aed0a;
          font-size: 12px;
          font-weight: 500;
          color: #7c3aed99;
          letter-spacing: 0.04em;
          animation: la-pillPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .la-pill:nth-child(1) { animation-delay: 2.3s; }
        .la-pill:nth-child(2) { animation-delay: 2.4s; }
        .la-pill:nth-child(3) { animation-delay: 2.5s; }
        .la-pill:nth-child(4) { animation-delay: 2.6s; }
        @keyframes la-pillPop {
          from { opacity: 0; transform: scale(0.8) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* Floating glow loop */
        .la-glow-ring {
          position: absolute;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, #7c3aed18, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: la-glowPulse 3s ease-in-out 2.5s infinite;
          pointer-events: none;
          z-index: -1;
        }
        @keyframes la-glowPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.2; }
        }

        /* Fade out wrapper */
        .la-fade-out {
          animation: la-wrapperFadeOut 0.6s ease forwards;
        }
        @keyframes la-wrapperFadeOut {
          to { opacity: 0; pointer-events: none; }
        }
      `}</style>

      <div className="la-orb la-orb1"></div>
      <div className="la-orb la-orb2"></div>

      <div className="la-logo-outer">
        <div className="la-glow-ring"></div>

        {/* ICON */}
        <div className="la-icon-wrap">
          <div className="la-spin-ring"></div>
          <div className="la-sparks">
            <div className="la-sk"></div>
            <div className="la-sk"></div>
            <div className="la-sk"></div>
            <div className="la-sk"></div>
            <div className="la-sk"></div>
          </div>
          <div className="la-icon-box">
            <svg className="la-book-svg" viewBox="0 0 60 60" fill="none">
              <defs>
                <linearGradient id="la-bg1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
                <linearGradient id="la-bg2" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              {/* Left page */}
              <path
                className="la-bp1"
                d="M30 48C30 48 13 42 11 17L11 16C11 14 13 13 14.5 14C19 16 25 21 30 26"
                stroke="url(#la-bg1)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Right page */}
              <path
                className="la-bp2"
                d="M30 48C30 48 47 42 49 17L49 16C49 14 47 13 45.5 14C41 16 35 21 30 26"
                stroke="url(#la-bg2)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Spine */}
              <path
                className="la-bp1"
                d="M30 26L30 48"
                stroke="url(#la-bg1)"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Left lines */}
              <path
                className="la-bp3"
                d="M16 22L27 25M15 29L26 31.5M15 36L26 37.5"
                stroke="#c084fc66"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              {/* Right lines */}
              <path
                className="la-bp3"
                d="M44 22L33 25M45 29L34 31.5M45 36L34 37.5"
                stroke="#ec489966"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              {/* Top glow dot */}
              <circle className="la-bp3" cx="30" cy="11" r="4.5" fill="url(#la-bg1)" />
              <circle className="la-bp3" cx="30" cy="11" r="8" fill="url(#la-bg1)" opacity="0.18" />
              <circle className="la-bp3" cx="30" cy="11" r="12" fill="url(#la-bg1)" opacity="0.07" />
            </svg>
          </div>
          <div className="la-pdot"></div>
        </div>

        {/* BRAND TEXT */}
        <div className="la-brand-name">
          <span className="la-t-passion">Passion</span>
          <span className="la-t-pages">Pages</span>
          <span className="la-t-dot">.</span>
          <span className="la-t-ai">ai</span>
        </div>

        {/* Tagline */}
        <div className="la-tagline">Turn Knowledge into Opportunities</div>

        {/* Bar */}
        <div className="la-gbar"></div>

        {/* Pills */}
        <div className="la-pills">
          <span className="la-pill">📝 Smart Notes</span>
          <span className="la-pill">🃏 Flashcards</span>
          <span className="la-pill">❓ Quiz</span>
          <span className="la-pill">🔮 Diagrams</span>
        </div>
      </div>
    </div>
  );
}
