import React from "react";

interface LogoProps {
  variant?: "navbar" | "full" | "icon";
  className?: string;
}

export function Logo({ variant = "navbar", className = "" }: LogoProps) {
  const Icon = ({ size = 42 }: { size?: number }) => (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Gradient border box */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.24,
          padding: 2,
          background: "linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)",
          boxShadow: "0 0 20px rgba(168,85,247,0.35)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: size * 0.2,
            background: "linear-gradient(160deg,#1a1035,#110d2a)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width={size * 0.56}
            height={size * 0.6}
            viewBox="0 0 24 26"
            fill="none"
          >
            {/* Person head */}
            <circle cx="12" cy="5.5" r="3.5" fill="url(#logoHead)" />
            {/* Shield / book body */}
            <path
              d="M4 10.5Q4 7.5 12 7Q20 7.5 20 10.5L20 18Q20 23 12 25.5Q4 23 4 18Z"
              fill="url(#logoShield)"
            />
            {/* Horizontal lines on shield */}
            <line x1="7.5" y1="13" x2="16.5" y2="13" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
            <line x1="7" y1="16" x2="17" y2="16" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
            <line x1="7.5" y1="19" x2="16.5" y2="19" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.22" />
            <defs>
              <radialGradient id="logoHead" cx="40%" cy="35%">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#db2777" />
              </radialGradient>
              <linearGradient id="logoShield" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#4c1d95" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      {/* Pink notification dot */}
      <div
        style={{
          position: "absolute",
          top: -2,
          right: -2,
          width: size * 0.22,
          height: size * 0.22,
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%,#f472b6,#e11d48)",
          border: "2px solid #09090b",
          boxShadow: "0 0 8px rgba(244,63,94,0.7)",
        }}
      />
    </div>
  );

  if (variant === "icon") return <Icon size={42} />;

  if (variant === "navbar") {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <Icon size={34} />
        <div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 800,
              lineHeight: 1.1,
              background: "linear-gradient(90deg,#a78bfa,#d946ef,#f43f5e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.3px",
            }}
          >
            PassionPages
            <span style={{ WebkitTextFillColor: "transparent" }}>.ai</span>
          </div>
          <div style={{ fontSize: 8, color: "#6b7280", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 1 }}>
            AI Study Assistant
          </div>
        </div>
      </div>
    );
  }

  // Full / splash
  return (
    <div className={`flex flex-col items-center gap-0 ${className}`}>
      <div style={{ marginBottom: 20 }}>
        <Icon size={90} />
      </div>
      <div
        style={{
          fontSize: 42,
          fontWeight: 900,
          letterSpacing: "-1px",
          background: "linear-gradient(90deg,#818cf8,#a855f7,#d946ef,#f43f5e)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          lineHeight: 1,
          marginBottom: 10,
        }}
      >
        PassionPages.ai
      </div>
      <div
        style={{
          fontSize: 10,
          letterSpacing: "0.22em",
          color: "#6b7280",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        — Turn Knowledge Into Opportunities —
      </div>
      <div
        style={{
          width: 200,
          height: 2,
          background: "linear-gradient(90deg,#7c3aed,#a855f7,#ec4899,#f43f5e)",
          borderRadius: 2,
        }}
      />
    </div>
  );
}
