import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Sparkles, Zap, GraduationCap, X } from "lucide-react";
import { Link } from "react-router-dom";

// ─── Tiers Data ──────────────────────────────────────────────────────────────
const TIERS = [
  {
    id: "free",
    name: "FREE",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Perfect to get a taste of AI-powered study sessions.",
    icon: Sparkles,
    color: "from-slate-400 to-slate-200",
    glow: "shadow-slate-500/20",
    features: [
      "10 AI generations/day",
      "Notes + Flashcards + Quiz",
      "3 diagrams/day",
      "5 saved notes",
    ],
    notIncluded: ["PDF export + upload", "Priority AI speed", "Spaced repetition"],
    delay: 0,
    floatDuration: "4.5s",
  },
  {
    id: "pro",
    name: "PRO",
    monthlyPrice: 99,
    yearlyPrice: 66, // 799/12 ≈ 66/mo
    yearlyTotal: 799,
    description: "For dedicated students pushing for top grades.",
    icon: Zap,
    color: "from-pink-500 to-purple-600",
    glow: "shadow-pink-500/40",
    popular: true,
    features: [
      "Unlimited generations",
      "Full Study Kit (1 click)",
      "PDF export + upload",
      "All subject modes",
      "Spaced repetition",
      "Priority AI speed",
    ],
    notIncluded: ["Professor login"],
    delay: 0.2,
    floatDuration: "5.5s",
  },
  {
    id: "college",
    name: "COLLEGE",
    monthlyPrice: 49,
    yearlyPrice: 49, // fixed per student
    description: "For institutions and batch syllabus management.",
    icon: GraduationCap,
    color: "from-indigo-500 to-blue-500",
    glow: "shadow-blue-500/30",
    features: [
      "Everything in Pro",
      "Batch dashboard",
      "Professor login",
      "Custom syllabus upload",
      "Analytics reporting",
      "Dedicated account manager",
    ],
    notIncluded: [],
    minCommitment: "min 30 students",
    delay: 0.4,
    floatDuration: "5s",
  },
];

// ─── Magnetic Button Component ───────────────────────────────────────────────
const MagneticButton = ({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { top, left, width, height } = buttonRef.current!.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.2;
    const y = (clientY - (top + height / 2)) * 0.2;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

// ─── Background Particles ────────────────────────────────────────────────────
const AntigravityParticles = () => {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100 + 100, // start from bottom
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * -20,
      opacity: Math.random() * 0.5 + 0.1,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <style>{`
        @keyframes driftUp {
          from { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          20% { opacity: var(--max-opacity); }
          80% { opacity: var(--max-opacity); }
          to { transform: translateY(-20vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={
            {
              left: `${p.x}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: 0,
              "--max-opacity": p.opacity,
              animation: `driftUp ${p.duration}s linear ${p.delay}s infinite`,
              boxShadow: `0 0 ${p.size * 2}px rgba(255,255,255,0.8)`,
            } as any
          }
        />
      ))}
    </div>
  );
};

// ─── Main Pricing Page ───────────────────────────────────────────────────────
export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState<string | null>(null);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Check if already loaded
      if ((window as any).Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (tier: any) => {
    if (tier.id === "free") return; // Do nothing or redirect to dashboard

    setLoadingPayment(tier.id);
    
    try {
      // 1. Load Razorpay Script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Razorpay SDK failed to load. Are you offline?");
        setLoadingPayment(null);
        return;
      }

      // 2. Fetch Order from Backend
      const response = await fetch('/api/razorpay-order', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tierId: tier.id, isYearly: isYearly }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create order. Make sure Razorpay Keys are in Netlify Environment Variables!");
      }

      const orderData = await response.json();
      
      // 3. Open Razorpay Widget
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "PassionPages.ai",
        description: `Upgrade to ${tier.name} ${isYearly ? '(Yearly)' : '(Monthly)'}`,
        order_id: orderData.id,
        handler: function (response: any) {
             alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
             // Ideally here we redirect to dashboard with a celebration animation
        },
        theme: {
          color: "#db2777" // Pink color matching theme
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoadingPayment(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#06030f] text-white overflow-x-hidden relative perspective-[2000px] selection:bg-pink-500/30 font-inter">
      {/* Custom Styles for Antigravity & Typography */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Syne:wght@600;700;800&display=swap');
        
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        
        .card-perspective {
          transform-style: preserve-3d;
        }
        
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotateX(2deg) rotateY(-2deg); }
          50% { transform: translateY(-12px) rotateX(-1deg) rotateY(1deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotateX(-2deg) rotateY(2deg); }
          50% { transform: translateY(-16px) rotateX(2deg) rotateY(-1deg); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) rotateX(1deg) rotateY(1deg); }
          50% { transform: translateY(-14px) rotateX(-2deg) rotateY(-2deg); }
        }
        
        .orbit-ring {
          position: absolute;
          inset: -3px;
          border-radius: 26px;
          background: conic-gradient(from 0deg, transparent, #ec4899, #8b5cf6, transparent 40%);
          animation: spin 4s linear infinite;
          opacity: 0.8;
          z-index: -1;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Background Ambience */}
      <div className="absolute inset-x-0 top-[-20%] h-[50vh] bg-gradient-to-b from-purple-900/20 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute left-[20%] top-[40%] w-[30vh] h-[30vh] bg-pink-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      <div className="absolute right-[20%] bottom-[10%] w-[40vh] h-[40vh] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      
      <AntigravityParticles />

      {/* Close Button mapping back to Dashboard */}
      <div className="absolute top-6 right-6 z-50">
        <Link to="/dashboard" className="p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 backdrop-blur-md transition-colors block group">
          <X className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h1 className="font-syne text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Defy Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#db2777]">Limits</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 font-light mb-10 w-full md:w-4/5 mx-auto">
            Choose a plan that fits your ambition. Unlock unlimited AI power, spaced repetition, and full study kits in one click.
          </p>

          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-4 bg-white/5 border border-white/10 p-2 rounded-full w-fit mx-auto backdrop-blur-xl shadow-[0_0_30px_rgba(124,58,237,0.1)]">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${!isYearly ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-pink-500/25' : 'text-slate-400 hover:text-white'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${isYearly ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-pink-500/25' : 'text-slate-400 hover:text-white'}`}
            >
              Yearly
              <span className="absolute -top-3 -right-3 px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] uppercase font-bold rounded-full border border-green-500/30">
                Save 33%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-32">
          {TIERS.map((tier, index) => {
            const isPopular = tier.popular;
            
            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: tier.delay, ease: [0.22, 1, 0.36, 1] }}
                className="relative card-perspective flex"
              >
                {/* Antigravity floating wrapper */}
                <div 
                  className="w-full flex" 
                  style={{ animation: `float-${(index % 3) + 1} ${tier.floatDuration} ease-in-out infinite` }}
                >
                  <div className={`flex-1 relative bg-[#0a0f1e]/80 backdrop-blur-3xl rounded-[24px] border border-white/10 p-8 flex flex-col transition-all duration-500 hover:scale-[1.02] shadow-[0_40px_80px_rgba(0,0,0,0.5)] ${isPopular ? 'border-pink-500/30 md:-translate-y-8' : ''}`}>
                    
                    {/* The Downward Glowing Shadow (Reversed Gravity Feel) */}
                    <div className={`absolute inset-x-4 -bottom-12 h-16 ${tier.glow} shadow-[0_30px_60px] opacity-40 blur-2xl rounded-[100%] pointer-events-none z-0`} />

                    {/* Popular Orbiting Ring */}
                    {isPopular && (
                      <div className="absolute inset-0 z-[-1] rounded-[24px] overflow-hidden opacity-50">
                        <div className="orbit-ring" />
                      </div>
                    )}

                    {isPopular && (
                      <div className="absolute -top-4 inset-x-0 flex justify-center">
                        <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-[0_0_20px_rgba(236,72,153,0.5)] border border-pink-400/30">
                          Most Popular
                        </span>
                      </div>
                    )}

                    {/* Card Header */}
                    <div className="mb-8 relative z-10">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tier.color} p-[1px] mb-6`}>
                        <div className="w-full h-full bg-[#0a0f1e] rounded-[15px] flex items-center justify-center">
                          <tier.icon className={`w-6 h-6 bg-gradient-to-br ${tier.color} text-transparent bg-clip-text`} />
                        </div>
                      </div>
                      <h3 className="font-syne text-2xl tracking-wide font-bold text-white mb-2">{tier.name}</h3>
                      <p className="text-sm text-slate-400 min-h-[40px] leading-relaxed">{tier.description}</p>
                    </div>

                    {/* Price Section */}
                    <div className="mb-8 relative z-10 h-[80px]">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={isYearly ? "yearly" : "monthly"}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex items-end gap-2">
                            <span className="font-syne text-5xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                              ₹{isYearly ? tier.yearlyPrice : tier.monthlyPrice}
                            </span>
                            <span className="text-slate-400 pb-1">
                              {tier.id === "college" ? "/ student / mo" : "/ month"}
                            </span>
                          </div>
                          {isYearly && tier.yearlyTotal && (
                            <div className="text-sm text-pink-400 font-medium mt-2">
                              Billed ₹{tier.yearlyTotal} yearly
                            </div>
                          )}
                          {tier.id === "college" && (
                            <div className="text-sm text-indigo-400 font-medium mt-2">
                              {tier.minCommitment}
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

                    {/* Features List */}
                    <div className="flex-1 relative z-10 overflow-hidden">
                      <ul className="space-y-5">
                        {tier.features.map((feature, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="flex items-start gap-3 text-sm text-slate-200"
                          >
                            <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center mt-0.5`}>
                              <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                            </div>
                            <span className="leading-snug">{feature}</span>
                          </motion.li>
                        ))}
                        {tier.notIncluded?.map((feature, i) => (
                          <motion.li
                            key={`not-${i}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: (tier.features.length + i) * 0.1 }}
                            className="flex items-start gap-3 text-sm text-slate-500 opacity-60"
                          >
                            <div className="flex-shrink-0 w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center mt-0.5">
                              <X className="w-3 h-3 text-slate-500" strokeWidth={2} />
                            </div>
                            <span>{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <div className="mt-10 relative z-10">
                      <MagneticButton 
                        onClick={() => handlePayment(tier)}
                        className={`w-full py-4 rounded-xl font-bold tracking-wide transition-all duration-300 relative overflow-hidden group 
                        ${isPopular 
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)]' 
                          : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20'}`}
                      >
                        <span className="relative z-10 block text-sm uppercase">
                          {loadingPayment === tier.id ? "Processing..." : tier.id === "free" ? "Get Started" : tier.id === "pro" ? "Upgrade to Pro" : "Contact Sales"}
                        </span>
                        {isPopular && loadingPayment !== tier.id && (
                           <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0" />
                        )}
                      </MagneticButton>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Anti-gravity footer */}
        <div className="text-center text-slate-500 text-sm">
          <p>Secure payments powered by Razorpay. Cancel anytime.</p>
        </div>
      </div>
    </div>
  );
}
