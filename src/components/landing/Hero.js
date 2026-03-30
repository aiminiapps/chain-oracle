"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { RiRocketLine, RiLineChartLine } from "react-icons/ri";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0F]">
      {/* ─── Background Effects ─── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Purple Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#7C3AED]/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#7C3AED]/5 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#9F67FF]/5 rounded-full blur-[80px] mix-blend-screen" />
        
        {/* Premium Dots Mesh — Purple */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `radial-gradient(circle at center, #7C3AED 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
            backgroundPosition: "0 0"
          }}
        />
        
        {/* Film Style Noise Grain */}
        <div
          className="absolute inset-0 opacity-[0.2] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Gradients to fade out mesh/noise at edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0F]/30 via-transparent to-[#0A0A0F] block" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0F] via-transparent to-[#0A0A0F] opacity-80 block" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-32">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#2A2A3A] bg-[#141420]/80 backdrop-blur-md mb-8 shadow-2xl shadow-[#7C3AED]/5"
        >
          <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse shadow-[0_0_8px_#7C3AED]" />
          <span className="text-sm font-medium tracking-wide text-[#CCC]">
            AI Predictive Engine Live
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
        >
          <span className="text-white drop-shadow-lg">Predict the Next</span>
          <br />
          <span className="gradient-text-purple">
            Alpha Before Everyone
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg md:text-xl text-[#A1A1AA] max-w-2xl mx-auto mb-10 leading-relaxed font-light"
        >
          ChainOracle uses AI to forecast token trends, curate top opportunities,
          and deliver real-time signal intelligence — giving you the edge to act
          before the market moves.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/app"
            className="btn-3d group flex items-center gap-2 px-8 py-4 text-base"
          >
            <RiRocketLine className="text-lg transition-transform group-hover:-translate-y-1" />
            Launch App
          </Link>
          <Link
            href="/app/analyzer"
            className="btn-3d-ghost group flex items-center gap-2 px-8 py-4 text-base"
          >
            <RiLineChartLine className="text-lg text-[#A1A1AA] group-hover:text-[#9F67FF] transition-colors" />
            Try Forecast
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-xl mx-auto border-t border-[#2A2A3A]/50 pt-10"
        >
          {[
            { value: "94%", label: "Forecast Accuracy" },
            { value: "15K+", label: "Signals Tracked" },
            { value: "3.2K", label: "Active Oracles" },
          ].map((stat) => (
            <div key={stat.label} className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-white group-hover:text-[#9F67FF] transition-colors duration-300">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-[#6B6B76] mt-2 font-medium tracking-wide uppercase">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
