"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  RiSearchEyeLine,
  RiVipDiamondLine,
  RiWallet3Line,
  RiNotification3Line,
  RiLineChartLine,
  RiCheckLine, RiLoader4Line, RiLinkM
} from "react-icons/ri";
import { useState, useEffect } from "react";

const float = (delay = 0) => ({
  animate: { y: [0, -8, 0] },
  transition: { repeat: Infinity, duration: 4, delay, ease: "easeInOut" },
});

const pulse = (delay = 0) => ({
  animate: { opacity: [0.4, 1, 0.4] },
  transition: { repeat: Infinity, duration: 3, delay, ease: "easeInOut" },
});


function AnalyzerVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Glass analysis window */}
      <div className="w-[85%] max-w-[260px] rounded-2xl bg-[#111]/80 border border-[#1E1E1E] p-4 backdrop-blur-sm shadow-2xl">
        {/* Window dots */}
        <div className="flex gap-1.5 mb-4">
          <div className="w-2 h-2 rounded-full bg-[#FF4444]/60" />
          <div className="w-2 h-2 rounded-full bg-[#F5D90A]/60" />
          <div className="w-2 h-2 rounded-full bg-[#22C55E]/60" />
        </div>

        {/* Search bar with typing cursor */}
        <div className="h-8 rounded-lg bg-[#0A0A0A] border border-[#222] flex items-center px-3 mb-4">
          <RiSearchEyeLine className="text-[#555] text-sm mr-2 shrink-0" />
          <motion.div
            animate={{ width: ["0%", "60%", "60%", "0%"] }}
            transition={{ repeat: Infinity, duration: 5, times: [0, 0.3, 0.7, 1] }}
            className="h-1.5 bg-[#F5D90A]/60 rounded-full"
          />
          <motion.div
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="w-0.5 h-3.5 bg-[#F5D90A] ml-1 rounded-full"
          />
        </div>

        {/* Analysis bars */}
        <div className="space-y-2.5">
          {[
            { label: "Risk", w: "75%", color: "#22C55E", delay: 0.5 },
            { label: "Liquidity", w: "60%", color: "#3B82F6", delay: 0.8 },
            { label: "Volume", w: "85%", color: "#A855F7", delay: 1.1 },
          ].map((bar) => (
            <div key={bar.label} className="flex items-center gap-2">
              <span className="text-[9px] text-[#555] w-12 shrink-0 font-mono">
                {bar.label}
              </span>
              <div className="flex-1 h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: ["0%", bar.w, bar.w, "0%"] }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    delay: bar.delay,
                    times: [0, 0.2, 0.8, 1],
                  }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: bar.color }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Score badge */}
        <motion.div
          animate={{ opacity: [0, 0, 1, 1, 0], scale: [0.8, 0.8, 1, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 5, times: [0, 0.3, 0.4, 0.85, 1] }}
          className="mt-4 mx-auto w-fit px-4 py-1.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20"
        >
          <span className="text-[#22C55E] text-[10px] font-bold tracking-wider">
            SCORE: 8.7 / 10
          </span>
        </motion.div>
      </div>
    </div>
  );
}

function GemScannerVisual() {
  const gems = [
    { name: "GEM", score: "9.2", color: "#F5D90A", change: "+142%", mcap: "$1.2M", holders: "2,841", tag: "Hot" },
    { name: "ALPHA", score: "8.6", color: "#3B82F6", change: "+89%", mcap: "$3.8M", holders: "5,120", tag: "Rising" },
    { name: "MOON", score: "7.9", color: "#A855F7", change: "+210%", mcap: "$680K", holders: "1,293", tag: "New" },
    { name: "DEGEN", score: "8.1", color: "#22C55E", change: "+67%", mcap: "$2.1M", holders: "3,742", tag: "Trending" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % gems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [gems.length]);

  const gem = gems[activeIndex];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-[85%] max-w-[260px] flex flex-col items-center gap-3">
        {/* Scanner Header */}
        <div className="w-full rounded-xl bg-[#111]/80 border border-[#1E1E1E] p-3 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <RiVipDiamondLine className="text-[#3B82F6] text-sm" />
              <span className="text-[10px] text-[#888] font-mono uppercase">Scanning Gems</span>
            </div>
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"
              style={{ boxShadow: "0 0 6px #22C55E" }}
            />
          </div>
          {/* Progress bar that syncs with slideshow */}
          <div className="w-full h-1 rounded-full bg-[#1A1A1A] overflow-hidden">
            <motion.div
              key={activeIndex}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "linear" }}
              className="h-full rounded-full bg-gradient-to-r from-[#F5D90A] to-[#F97316]"
            />
          </div>
        </div>

        {/* Gem Card Slideshow */}
        <div className="w-full h-[130px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute inset-0 rounded-xl bg-[#111]/90 border border-[#1E1E1E] p-4 backdrop-blur-sm shadow-xl"
            >
              {/* Top row: icon, name, tag */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: `${gem.color}15`, border: `1px solid ${gem.color}30` }}
                  >
                    <RiVipDiamondLine style={{ color: gem.color }} className="text-base" />
                  </div>
                  <div>
                    <div className="text-white text-xs font-bold">${gem.name}</div>
                    <div className="text-[#22C55E] text-[10px] font-semibold">{gem.change}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider"
                    style={{ color: gem.color, backgroundColor: `${gem.color}15` }}
                  >
                    {gem.tag}
                  </span>
                  <span
                    className="text-sm font-extrabold"
                    style={{ color: gem.color }}
                  >
                    {gem.score}
                  </span>
                </div>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-3 pt-2 border-t border-[#1E1E1E]">
                <div className="flex-1">
                  <div className="text-[#555] text-[8px] uppercase font-mono">MCap</div>
                  <div className="text-white text-[11px] font-semibold">{gem.mcap}</div>
                </div>
                <div className="w-px h-6 bg-[#1E1E1E]" />
                <div className="flex-1">
                  <div className="text-[#555] text-[8px] uppercase font-mono">Holders</div>
                  <div className="text-white text-[11px] font-semibold">{gem.holders}</div>
                </div>
                <div className="w-px h-6 bg-[#1E1E1E]" />
                <div className="flex-1">
                  <div className="text-[#555] text-[8px] uppercase font-mono">Score</div>
                  <div className="h-1 rounded-full bg-[#1A1A1A] mt-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: `${parseFloat(gem.score) * 10}%` }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: gem.color }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation dots */}
        <div className="flex items-center gap-2">
          {gems.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className="relative w-2 h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: i === activeIndex ? "#F5D90A" : "#333",
                boxShadow: i === activeIndex ? "0 0 8px rgba(245,217,10,0.5)" : "none",
              }}
            />
          ))}
        </div>
      </div>

      {/* Glow behind */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#3B82F6]/5 rounded-full blur-[60px]" />
    </div>
  );
}

const WalletVisual = () => {
  // States: 'idle' -> 'connecting' -> 'connected'
  const [status, setStatus] = useState('idle');

  // This effect simulates the connection process automatically
  useEffect(() => {
    let timeout1, timeout2, timeout3;

    const runSequence = () => {
      setStatus('idle');
      timeout1 = setTimeout(() => setStatus('connecting'), 2000);
      timeout2 = setTimeout(() => setStatus('connected'), 5000);
      timeout3 = setTimeout(runSequence, 9000); // Loop back to start
    };

    runSequence();

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, []);

  return (
    // Outer container purely for centering in your preview
    <div className="w-full min-h-[300px]  flex items-center justify-center font-sans">
      
      {/* The Morphing Container */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="relative overflow-hidden bg-[#0A0A0A]/90 backdrop-blur-xl border -mt-16 border-white/10 shadow-2xl flex flex-col justify-center"
        style={{
          borderRadius: 24,
          // We set minimum widths to prevent it from getting too tiny
          minWidth: status === 'idle' ? 160 : 200,
        }}
      >
        <AnimatePresence mode="wait">
          
          {/* STATE 1: IDLE / CONNECT */}
          {status === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.2 }}
              className="px-5 py-3 flex items-center justify-center gap-2 cursor-pointer group"
            >
              <RiWallet3Line className="text-[#F3BA2F] text-lg group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-zinc-100 tracking-wide">
                Connect Wallet
              </span>
            </motion.div>
          )}

          {/* STATE 2: CONNECTING */}
          {status === 'connecting' && (
            <motion.div
              key="connecting"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.2 }}
              className="px-6 py-5 flex flex-col items-center justify-center gap-4"
            >
              <div className="relative flex items-center justify-center w-10 h-10">
                {/* Soft pulsing glow behind spinner */}
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-[#F3BA2F] rounded-full blur-md"
                />
                <RiLoader4Line className="text-[#F3BA2F] text-2xl animate-spin relative z-10" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-zinc-100">Connecting</span>
                <span className="text-[11px] text-zinc-500 mt-0.5">Approve in wallet...</span>
              </div>
            </motion.div>
          )}

          {/* STATE 3: CONNECTED */}
          {status === 'connected' && (
            <motion.div
              key="connected"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="px-6 py-4 flex flex-col items-center justify-center"
            >
              {/* Success Icon */}
              <div className="w-10 h-10 rounded-full bg-[#F3BA2F]/10 flex items-center justify-center mb-3 border border-[#F3BA2F]/20">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1, bounce: 0.5 }}
                >
                  <RiCheckLine className="text-[#F3BA2F] text-xl" />
                </motion.div>
              </div>
              
              <span className="text-[13px] font-semibold text-zinc-100">
                0x4A...8B91
              </span>
              
              {/* BNB Chain Badge */}
              <div className="mt-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800/50 border border-zinc-700/50">
                <div className="w-3 h-3 rounded-full bg-[#F3BA2F] flex items-center justify-center">
                   <RiLinkM className="text-black text-[8px]" />
                </div>
                <span className="text-[10px] font-medium text-zinc-400">
                  BNB Chain
                </span>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function AlertsVisual() {
  const alerts = [
    { color: "#22C55E", icon: "🐋", text: "Whale bought 50 ETH", sub: "Just now" },
    { color: "#F97316", icon: "🔓", text: "Liquidity unlocked", sub: "2m ago" },
    { color: "#3B82F6", icon: "💎", text: "New gem detected", sub: "5m ago" },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div className="relative w-[90%] max-w-[240px] h-[160px]">
        {alerts.map((alert, i) => (
          <motion.div
            key={i}
            animate={{
              // The sequence: Enter -> Hold center -> Pushed up -> Hold secondary -> Exit out top -> Stay hidden
              y: [40, 0, 0, -65, -65, -110, -110],
              opacity: [0, 1, 1, 0.4, 0.4, 0, 0],
              scale: [0.9, 1, 1, 0.95, 0.95, 0.9, 0.9],
              zIndex: [3, 3, 3, 2, 2, 1, 1]
            }}
            transition={{
              repeat: Infinity,
              duration: 6,
              delay: i * 2, // 2 second interval perfectly matches the 33% phase shifts in the times array
              times: [0, 0.08, 0.33, 0.41, 0.66, 0.74, 1],
              ease: "easeInOut",
            }}
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-xl bg-[#111]/90 border border-[#1E1E1E] backdrop-blur-sm p-3 flex items-center gap-3 shadow-xl"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0"
              style={{ backgroundColor: `${alert.color}15` }}
            >
              {alert.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-semibold truncate">{alert.text}</div>
              <div className="text-[#555] text-[10px] mt-0.5">{alert.sub}</div>
            </div>
            <div
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: alert.color, boxShadow: `0 0 6px ${alert.color}` }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
function ChartVisual() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-3 px-2">
      {/* Price header */}
      <div className="w-full max-w-[260px] flex items-end justify-between px-1">
        <div>
          <div className="text-[#555] text-[9px] font-mono uppercase">Price</div>
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-white text-xl font-bold tracking-tight"
          >
            $0.0847
          </motion.div>
        </div>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="text-[#22C55E] text-xs font-bold bg-[#22C55E]/10 px-2 py-1 rounded-md"
        >
          +24.6%
        </motion.div>
      </div>

      {/* SVG Chart area */}
      <div className="w-full max-w-[260px] h-[120px] bg-[#0A0A0A] border border-[#1E1E1E] rounded-xl relative overflow-hidden p-2">
        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 200 60"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22C55E" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {[15, 30, 45].map((y) => (
            <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="#1E1E1E" strokeWidth="0.5" />
          ))}
          {/* Area fill */}
          <motion.path
            d="M0,50 C20,45 30,30 50,35 C70,40 80,20 100,25 C120,30 130,10 150,15 C170,20 180,8 200,12 L200,60 L0,60 Z"
            fill="url(#chartFill)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
          />
          {/* Line */}
          <motion.path
            d="M0,50 C20,45 30,30 50,35 C70,40 80,20 100,25 C120,30 130,10 150,15 C170,20 180,8 200,12"
            fill="none"
            stroke="#22C55E"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 3, ease: "easeOut" }}
          />
          {/* Dot at end */}
          <motion.circle
            cx="200"
            cy="12"
            r="3"
            fill="#22C55E"
            animate={{ opacity: [0, 0, 1, 1, 0], scale: [0, 0, 1, 1.5, 0] }}
            transition={{ duration: 6, repeat: Infinity, times: [0, 0.45, 0.5, 0.9, 1] }}
          />
        </svg>

        {/* Scanning line */}
        <motion.div
          animate={{ left: ["-5%", "105%"] }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="absolute top-0 bottom-0 w-px"
          style={{
            background: "linear-gradient(to bottom, transparent, #22C55E40, transparent)",
            boxShadow: "0 0 8px #22C55E40",
          }}
        />
      </div>
    </div>
  );
}


/* ─── MAIN COMPONENT ─── */
export default function Features() {
  return (
    <section
      id="features"
      className="py-16 relative overflow-hidden bg-[#0B0B0B]"
    >

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-3">
            Your Unfair Advantage
          </h2>
          <p className="text-[#888] mt-4 text-balance max-w-xl mx-auto">
            Everything you need to find, analyze, and act on crypto opportunities before the crowd.
          </p>
        </motion.div>

        {/* ═══════ BENTO GRID ═══════ */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
          {/* ── Card 1 · AI Token Analyzer (top-left, 3 cols) ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-3 rounded-3xl border border-[#1E1E1E] bg-gradient-to-b from-[#111] to-[#0A0A0A] flex flex-col overflow-hidden group hover:border-[#F5D90A]/20 transition-colors duration-500"
          >
            <div className="p-3 rounded-2xl">
              <div className="h-[260px] relative">
                <div
                    className="absolute inset-0 opacity-[0.15]"
                    style={{
                      backgroundImage: `radial-gradient(circle at center, #F5D90A 1px, transparent 1px)`,
                      backgroundSize: "15px  15px",
                      backgroundPosition: "0 0"
                    }}
                />
              <AnalyzerVisual />
              </div>
            </div>
            <div className="p-7 pt-0">
              <h3 className="text-white font-bold text-xl mb-2 flex items-center gap-2">
                <RiSearchEyeLine className="text-[#F5D90A]" /> AI Token Analyzer
              </h3>
              <p className="text-[#666] text-sm leading-relaxed">
                Input any contract and get instant AI-generated research with
                liquidity analysis, holder patterns, and risk scores.
              </p>
            </div>
          </motion.div>

          {/* ── Card 2 · Hidden Gem Scanner (top-right, 3 cols) ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-3 rounded-3xl border border-[#1E1E1E] bg-gradient-to-b from-[#111] to-[#0A0A0A] flex flex-col overflow-hidden group hover:border-[#3B82F6]/20 transition-colors duration-500"
          >
            <div className="p-3 rounded-2xl">
              <div className="h-[260px] relative">
                <div
                    className="absolute inset-0 opacity-[0.15]"
                    style={{
                      backgroundImage: `radial-gradient(circle at center, #F5D90A 1px, transparent 1px)`,
                      backgroundSize: "15px  15px",
                      backgroundPosition: "0 0"
                    }}
                />
              <GemScannerVisual />
              </div>
            </div>
            <div className="p-7 pt-0">
              <h3 className="text-white font-bold text-xl mb-2 flex items-center gap-2">
                <RiVipDiamondLine className="text-[#3B82F6]" /> Hidden Gem
                Scanner
              </h3>
              <p className="text-[#666] text-sm leading-relaxed">
                Continuously monitors new launches and surfaces tokens with
                unusual activity, strong traction, and high Alpha Scores.
              </p>
            </div>
          </motion.div>

          {/* ── Card 3 · Wallet Intelligence (mid-left, 2 cols) ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-2 rounded-3xl border border-[#1E1E1E] bg-gradient-to-b from-[#111] to-[#0A0A0A] flex flex-col overflow-hidden group hover:border-[#A855F7]/20 transition-colors duration-500"
          >
            <div className="p-3 rounded-2xl">
              <div className="h-[220px] relative">
                <div
                    className="absolute inset-0 opacity-[0.15]"
                    style={{
                      backgroundImage: `radial-gradient(circle at center, #F5D90A 1px, transparent 1px)`,
                      backgroundSize: "15px  15px",
                      backgroundPosition: "0 0"
                    }}
                />
              <WalletVisual />
              </div>
            </div>
            <div className="p-7 pt-2">
              <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                <RiWallet3Line className="text-[#A855F7]" /> Wallet Intelligence
              </h3>
              <p className="text-[#666] text-sm leading-relaxed">
                Track smart wallets. See what top investors are buying before the
                market reacts.
              </p>
            </div>
          </motion.div>

          {/* ── Card 4 · Alpha Alerts (mid-center, 2 cols) ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="md:col-span-2 rounded-3xl border border-[#1E1E1E] bg-gradient-to-b from-[#111] to-[#0A0A0A] flex flex-col overflow-hidden group hover:border-[#F97316]/20 transition-colors duration-500"
          >
            <div className="p-3 rounded-2xl">
              <div className="h-[220px] relative">
                <div
                    className="absolute inset-0 opacity-[0.15]"
                    style={{
                      backgroundImage: `radial-gradient(circle at center, #F5D90A 1px, transparent 1px)`,
                      backgroundSize: "15px  15px",
                      backgroundPosition: "0 0"
                    }}
                />
              <AlertsVisual />
              </div>
            </div>
            <div className="p-7 pt-2">
              <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                <RiNotification3Line className="text-[#F97316]" /> Real-Time
                Alerts
              </h3>
              <p className="text-[#666] text-sm leading-relaxed">
                Instant notifications for whale buys, liquidity spikes, and smart
                money movements.
              </p>
            </div>
          </motion.div>

          {/* ── Card 5 · Live Dashboard (mid-right, 2 cols, row-span-2) ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="md:col-span-2 md:row-span-1 rounded-3xl border border-[#1E1E1E] bg-gradient-to-b from-[#111] to-[#0A0A0A] flex flex-col overflow-hidden group hover:border-[#22C55E]/20 transition-colors duration-500"
          >
            <div className="p-3 rounded-2xl">
              <div className="h-[220px] relative">
                <div
                    className="absolute inset-0 opacity-[0.15]"
                    style={{
                      backgroundImage: `radial-gradient(circle at center, #F5D90A 1px, transparent 1px)`,
                      backgroundSize: "15px  15px",
                      backgroundPosition: "0 0"
                    }}
                />
              <ChartVisual />
              </div>
            </div>
            <div className="p-7 pt-0">
              <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                <RiLineChartLine className="text-[#22C55E]" /> Advanced Tracking
              </h3>
              <p className="text-[#666] text-sm leading-relaxed">
                Real-time charts, and comprehensive volume tracking built directly into the platform.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
