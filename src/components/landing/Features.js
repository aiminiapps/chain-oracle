"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  RiLineChartLine,
  RiTrophyLine,
  RiEyeLine,
  RiNotification3Line,
  RiFileChartLine,
  RiCheckLine, RiLoader4Line, RiLinkM, RiStarLine
} from "react-icons/ri";
import { useState, useEffect } from "react";

/* ─── VISUAL 1: Predictive AI Engine ─── */
function PredictiveVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-[85%] max-w-[280px] rounded-2xl bg-[#0D0D14]/80 border border-[#2A2A3A] p-4 backdrop-blur-sm shadow-2xl">
        {/* Window dots */}
        <div className="flex gap-1.5 mb-4">
          <div className="w-2 h-2 rounded-full bg-[#EF4444]/60" />
          <div className="w-2 h-2 rounded-full bg-[#7C3AED]/60" />
          <div className="w-2 h-2 rounded-full bg-[#22C55E]/60" />
        </div>

        {/* Token header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#7C3AED]/15 border border-[#7C3AED]/30 flex items-center justify-center">
              <RiLineChartLine className="text-[#7C3AED] text-xs" />
            </div>
            <div>
              <div className="text-white text-[10px] font-bold">$ORACLE</div>
              <div className="text-[#6B6B76] text-[8px]">AI Forecast</div>
            </div>
          </div>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-[#22C55E] text-[10px] font-bold bg-[#22C55E]/10 px-2 py-0.5 rounded-md"
          >
            87% probability
          </motion.div>
        </div>

        {/* Mini predictive chart */}
        <div className="h-[60px] relative overflow-hidden rounded-lg bg-[#0A0A0F] border border-[#2A2A3A] mb-3">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 200 50" preserveAspectRatio="none">
            <defs>
              <linearGradient id="predFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Actual line */}
            <motion.path
              d="M0,40 C20,38 30,30 50,32 C70,34 80,20 100,22 C110,23 115,18 120,15"
              fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
            <motion.path
              d="M0,40 C20,38 30,30 50,32 C70,34 80,20 100,22 C110,23 115,18 120,15 L120,50 L0,50 Z"
              fill="url(#predFill)"
              initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
            {/* Prediction dashed line */}
            <motion.path
              d="M120,15 C140,10 160,8 180,5 C190,3 195,6 200,4"
              fill="none" stroke="#9F67FF" strokeWidth="1.5" strokeLinecap="round"
              strokeDasharray="4 3"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 2, repeat: Infinity, repeatDelay: 3.5 }}
            />
          </svg>
          {/* Scanning line */}
          <motion.div
            animate={{ left: ["-5%", "105%"] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="absolute top-0 bottom-0 w-px"
            style={{
              background: "linear-gradient(to bottom, transparent, #7C3AED40, transparent)",
              boxShadow: "0 0 8px #7C3AED40",
            }}
          />
        </div>

        {/* Score metrics */}
        <div className="space-y-2">
          {[
            { label: "Trend Score", w: "82%", color: "#7C3AED", delay: 0.5 },
            { label: "Momentum", w: "68%", color: "#22C55E", delay: 0.8 },
            { label: "Narrative", w: "75%", color: "#3B82F6", delay: 1.1 },
          ].map((bar) => (
            <div key={bar.label} className="flex items-center gap-2">
              <span className="text-[9px] text-[#6B6B76] w-14 shrink-0 font-mono">{bar.label}</span>
              <div className="flex-1 h-1.5 bg-[#1C1C2E] rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: ["0%", bar.w, bar.w, "0%"] }}
                  transition={{ repeat: Infinity, duration: 4, delay: bar.delay, times: [0, 0.2, 0.8, 1] }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: bar.color }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Forecast badge */}
        <motion.div
          animate={{ opacity: [0, 0, 1, 1, 0], scale: [0.8, 0.8, 1, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 5, times: [0, 0.3, 0.4, 0.85, 1] }}
          className="mt-3 mx-auto w-fit px-4 py-1.5 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20"
        >
          <span className="text-[#9F67FF] text-[10px] font-bold tracking-wider">
            FORECAST: 8.7 / 10
          </span>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── VISUAL 2: Curated Alpha Feeds (Best of Week/Month) ─── */
function CuratedFeedsVisual() {
  const picks = [
    { name: "ORBIT", score: "9.4", color: "#7C3AED", change: "+186%", tag: "Best of Week", trend: "↑" },
    { name: "NEXUS", score: "8.8", color: "#22C55E", change: "+112%", tag: "Rising Star", trend: "↑" },
    { name: "PULSE", score: "9.1", color: "#3B82F6", change: "+243%", tag: "Best of Month", trend: "↗" },
    { name: "SIGNAL", score: "8.5", color: "#9F67FF", change: "+97%", tag: "AI Pick", trend: "↑" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % picks.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [picks.length]);

  const pick = picks[activeIndex];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-[85%] max-w-[260px] flex flex-col items-center gap-3">
        {/* Header */}
        <div className="w-full rounded-xl bg-[#0D0D14]/80 border border-[#2A2A3A] p-3 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <RiTrophyLine className="text-[#7C3AED] text-sm" />
              <span className="text-[10px] text-[#A1A1AA] font-mono uppercase">Curated Picks</span>
            </div>
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]"
              style={{ boxShadow: "0 0 6px #7C3AED" }}
            />
          </div>
          <div className="w-full h-1 rounded-full bg-[#1C1C2E] overflow-hidden">
            <motion.div
              key={activeIndex}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "linear" }}
              className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9F67FF]"
            />
          </div>
        </div>

        {/* Pick Card */}
        <div className="w-full h-[130px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute inset-0 rounded-xl bg-[#0D0D14]/90 border border-[#2A2A3A] p-4 backdrop-blur-sm shadow-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: `${pick.color}15`, border: `1px solid ${pick.color}30` }}
                  >
                    <RiStarLine style={{ color: pick.color }} className="text-base" />
                  </div>
                  <div>
                    <div className="text-white text-xs font-bold">${pick.name}</div>
                    <div className="text-[#22C55E] text-[10px] font-semibold">{pick.change}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider"
                    style={{ color: pick.color, backgroundColor: `${pick.color}15` }}
                  >
                    {pick.tag}
                  </span>
                  <span className="text-sm font-extrabold" style={{ color: pick.color }}>
                    {pick.score}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-[#2A2A3A]">
                <div className="flex-1">
                  <div className="text-[#6B6B76] text-[8px] uppercase font-mono">Forecast</div>
                  <div className="text-white text-[11px] font-semibold">Bullish {pick.trend}</div>
                </div>
                <div className="w-px h-6 bg-[#2A2A3A]" />
                <div className="flex-1">
                  <div className="text-[#6B6B76] text-[8px] uppercase font-mono">Confidence</div>
                  <div className="text-white text-[11px] font-semibold">High</div>
                </div>
                <div className="w-px h-6 bg-[#2A2A3A]" />
                <div className="flex-1">
                  <div className="text-[#6B6B76] text-[8px] uppercase font-mono">Score</div>
                  <div className="h-1 rounded-full bg-[#1C1C2E] mt-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: `${parseFloat(pick.score) * 10}%` }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: pick.color }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {picks.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className="relative w-2 h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: i === activeIndex ? "#7C3AED" : "#2A2A3A",
                boxShadow: i === activeIndex ? "0 0 8px rgba(124,58,237,0.5)" : "none",
              }}
            />
          ))}
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#7C3AED]/5 rounded-full blur-[60px]" />
    </div>
  );
}

/* ─── VISUAL 3: Personalized Watchlist ─── */
function WatchlistVisual() {
  const items = [
    { token: "ETH", status: "Tracking", change: "+5.2%", color: "#22C55E" },
    { token: "SOL", status: "Alert Set", change: "+12.8%", color: "#7C3AED" },
    { token: "AVAX", status: "Watching", change: "-2.1%", color: "#EF4444" },
  ];

  return (
    <div className="w-full min-h-[300px] flex items-center justify-center font-sans">
      <div className="w-[85%] max-w-[260px] rounded-2xl bg-[#0D0D14]/80 border border-[#2A2A3A] p-4 backdrop-blur-sm shadow-2xl">
        <div className="flex items-center gap-2 mb-4">
          <RiEyeLine className="text-[#7C3AED] text-sm" />
          <span className="text-[10px] text-[#A1A1AA] font-mono uppercase">Your Watchlist</span>
        </div>
        <div className="space-y-2">
          {items.map((item, i) => (
            <motion.div
              key={item.token}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.3, repeat: Infinity, repeatDelay: 6, duration: 0.4 }}
              className="flex items-center justify-between p-2.5 rounded-lg bg-[#0A0A0F] border border-[#2A2A3A]"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#7C3AED]/10 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-[#9F67FF]">{item.token.slice(0, 2)}</span>
                </div>
                <div>
                  <div className="text-white text-[10px] font-semibold">{item.token}</div>
                  <div className="text-[#6B6B76] text-[8px]">{item.status}</div>
                </div>
              </div>
              <span className="text-[10px] font-bold" style={{ color: item.color }}>{item.change}</span>
            </motion.div>
          ))}
        </div>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-3 text-center text-[9px] text-[#7C3AED] font-medium"
        >
          AI adapts to your behavior →
        </motion.div>
      </div>
    </div>
  );
}

/* ─── VISUAL 4: Real-Time Alerts ─── */
function AlertsVisual() {
  const alerts = [
    { color: "#22C55E", icon: "🐋", text: "Whale accumulated 200 ETH", sub: "Just now" },
    { color: "#7C3AED", icon: "📈", text: "Trend acceleration detected", sub: "2m ago" },
    { color: "#3B82F6", icon: "💎", text: "Early-stage momentum signal", sub: "5m ago" },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div className="relative w-[90%] max-w-[240px] h-[160px]">
        {alerts.map((alert, i) => (
          <motion.div
            key={i}
            animate={{
              y: [40, 0, 0, -65, -65, -110, -110],
              opacity: [0, 1, 1, 0.4, 0.4, 0, 0],
              scale: [0.9, 1, 1, 0.95, 0.95, 0.9, 0.9],
              zIndex: [3, 3, 3, 2, 2, 1, 1]
            }}
            transition={{
              repeat: Infinity,
              duration: 6,
              delay: i * 2,
              times: [0, 0.08, 0.33, 0.41, 0.66, 0.74, 1],
              ease: "easeInOut",
            }}
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-xl bg-[#0D0D14]/90 border border-[#2A2A3A] backdrop-blur-sm p-3 flex items-center gap-3 shadow-xl"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0"
              style={{ backgroundColor: `${alert.color}15` }}
            >
              {alert.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-semibold truncate">{alert.text}</div>
              <div className="text-[#6B6B76] text-[10px] mt-0.5">{alert.sub}</div>
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

/* ─── VISUAL 5: Deep AI Reports ─── */
function ReportsVisual() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-3 px-2">
      {/* Report header */}
      <div className="w-full max-w-[260px] flex items-end justify-between px-1">
        <div>
          <div className="text-[#6B6B76] text-[9px] font-mono uppercase">Growth Potential</div>
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-white text-xl font-bold tracking-tight"
          >
            92%
          </motion.div>
        </div>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="text-[#7C3AED] text-xs font-bold bg-[#7C3AED]/10 px-2 py-1 rounded-md"
        >
          High Conviction
        </motion.div>
      </div>

      {/* SVG Chart area */}
      <div className="w-full max-w-[260px] h-[120px] bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl relative overflow-hidden p-2">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 200 60" preserveAspectRatio="none">
          <defs>
            <linearGradient id="reportFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[15, 30, 45].map((y) => (
            <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="#2A2A3A" strokeWidth="0.5" />
          ))}
          <motion.path
            d="M0,50 C20,45 30,30 50,35 C70,40 80,20 100,25 C120,30 130,10 150,15 C170,20 180,8 200,12 L200,60 L0,60 Z"
            fill="url(#reportFill)"
            initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
          />
          <motion.path
            d="M0,50 C20,45 30,30 50,35 C70,40 80,20 100,25 C120,30 130,10 150,15 C170,20 180,8 200,12"
            fill="none" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 3, ease: "easeOut" }}
          />
          {/* Forecast dashed extension */}
          <motion.path
            d="M200,12 C210,8 220,5 230,3"
            fill="none" stroke="#9F67FF" strokeWidth="1" strokeLinecap="round"
            strokeDasharray="3 2"
            initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1] }}
            transition={{ duration: 1, delay: 3, repeat: Infinity, repeatDelay: 5 }}
          />
          <motion.circle
            cx="200" cy="12" r="3" fill="#7C3AED"
            animate={{ opacity: [0, 0, 1, 1, 0], scale: [0, 0, 1, 1.5, 0] }}
            transition={{ duration: 6, repeat: Infinity, times: [0, 0.45, 0.5, 0.9, 1] }}
          />
        </svg>
        <motion.div
          animate={{ left: ["-5%", "105%"] }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="absolute top-0 bottom-0 w-px"
          style={{
            background: "linear-gradient(to bottom, transparent, #7C3AED40, transparent)",
            boxShadow: "0 0 8px #7C3AED40",
          }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN FEATURES COMPONENT
   ═══════════════════════════════════════════ */
export default function Features() {
  return (
    <section
      id="features"
      className="py-16 relative overflow-hidden bg-[#0A0A0F]"
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
            Your <span className="gradient-text-purple">Prediction Engine</span>
          </h2>
          <p className="text-[#A1A1AA] mt-4 text-balance max-w-xl mx-auto">
            Everything you need to forecast, discover, and act on crypto opportunities before they become obvious.
          </p>
        </motion.div>

        {/* ═══════ BENTO GRID ═══════ */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
          {/* Card 1 · Predictive AI Engine (3 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-3 rounded-3xl border border-[#2A2A3A] bg-gradient-to-b from-[#141420] to-[#0D0D14] flex flex-col overflow-hidden group hover:border-[#7C3AED]/25 transition-all duration-500 card-3d"
          >
            <div className="p-3 rounded-2xl">
              <div className="h-[280px] relative">
                <div
                  className="absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage: `radial-gradient(circle at center, #7C3AED 1px, transparent 1px)`,
                    backgroundSize: "15px 15px",
                  }}
                />
                <PredictiveVisual />
              </div>
            </div>
            <div className="p-7 pt-0">
              <h3 className="text-white font-bold text-xl mb-2 flex items-center gap-2">
                <RiLineChartLine className="text-[#7C3AED]" /> Predictive AI Engine
              </h3>
              <p className="text-[#6B6B76] text-sm leading-relaxed">
                Analyzes historical and real-time blockchain data to forecast
                token trends with trend probability, momentum scores, and
                narrative strength analysis.
              </p>
            </div>
          </motion.div>

          {/* Card 2 · Curated Alpha Feeds (3 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-3 rounded-3xl border border-[#2A2A3A] bg-gradient-to-b from-[#141420] to-[#0D0D14] flex flex-col overflow-hidden group hover:border-[#22C55E]/25 transition-all duration-500 card-3d"
          >
            <div className="p-3 rounded-2xl">
              <div className="h-[280px] relative">
                <div
                  className="absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage: `radial-gradient(circle at center, #7C3AED 1px, transparent 1px)`,
                    backgroundSize: "15px 15px",
                  }}
                />
                <CuratedFeedsVisual />
              </div>
            </div>
            <div className="p-7 pt-0">
              <h3 className="text-white font-bold text-xl mb-2 flex items-center gap-2">
                <RiTrophyLine className="text-[#22C55E]" /> Curated Alpha Feeds
              </h3>
              <p className="text-[#6B6B76] text-sm leading-relaxed">
                AI automatically generates ranked "Best of the Week" and
                "Best of the Month" lists, dynamically filtered by performance
                signals and growth patterns.
              </p>
            </div>
          </motion.div>

          {/* Card 3 · Personalized Watchlist (2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-2 rounded-3xl border border-[#2A2A3A] bg-gradient-to-b from-[#141420] to-[#0D0D14] flex flex-col overflow-hidden group hover:border-[#9F67FF]/25 transition-all duration-500 card-3d"
          >
            <div className="p-3 rounded-2xl">
              <div className="h-[220px] relative">
                <div
                  className="absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage: `radial-gradient(circle at center, #7C3AED 1px, transparent 1px)`,
                    backgroundSize: "15px 15px",
                  }}
                />
                <WatchlistVisual />
              </div>
            </div>
            <div className="p-7 pt-2">
              <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                <RiEyeLine className="text-[#9F67FF]" /> Personalized Watchlist
              </h3>
              <p className="text-[#6B6B76] text-sm leading-relaxed">
                AI builds a custom feed that adapts to your search behavior,
                wallet activity, and interests over time.
              </p>
            </div>
          </motion.div>

          {/* Card 4 · Real-Time Signal Alerts (2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="md:col-span-2 rounded-3xl border border-[#2A2A3A] bg-gradient-to-b from-[#141420] to-[#0D0D14] flex flex-col overflow-hidden group hover:border-[#F97316]/25 transition-all duration-500 card-3d"
          >
            <div className="p-3 rounded-2xl">
              <div className="h-[220px] relative">
                <div
                  className="absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage: `radial-gradient(circle at center, #7C3AED 1px, transparent 1px)`,
                    backgroundSize: "15px 15px",
                  }}
                />
                <AlertsVisual />
              </div>
            </div>
            <div className="p-7 pt-2">
              <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                <RiNotification3Line className="text-[#F97316]" /> Signal Intelligence
              </h3>
              <p className="text-[#6B6B76] text-sm leading-relaxed">
                Instant alerts for whale accumulation, liquidity changes,
                trend acceleration, and early-stage momentum signals.
              </p>
            </div>
          </motion.div>

          {/* Card 5 · Deep AI Forecast Reports (2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="md:col-span-2 md:row-span-1 rounded-3xl border border-[#2A2A3A] bg-gradient-to-b from-[#141420] to-[#0D0D14] flex flex-col overflow-hidden group hover:border-[#7C3AED]/25 transition-all duration-500 card-3d"
          >
            <div className="p-3 rounded-2xl">
              <div className="h-[220px] relative">
                <div
                  className="absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage: `radial-gradient(circle at center, #7C3AED 1px, transparent 1px)`,
                    backgroundSize: "15px 15px",
                  }}
                />
                <ReportsVisual />
              </div>
            </div>
            <div className="p-7 pt-0">
              <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                <RiFileChartLine className="text-[#7C3AED]" /> Deep AI Reports
              </h3>
              <p className="text-[#6B6B76] text-sm leading-relaxed">
                Forward-looking insights with growth potential analysis,
                narrative trends, and risk forecasting — unlock with $CORA.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
