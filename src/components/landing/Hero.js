"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { RiRocketLine, RiSearchEyeLine } from "react-icons/ri";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0B0B0B]">
      {/* ─── Background Effects ─── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#F5D90A]/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#F5D90A]/5 rounded-full blur-[100px] mix-blend-screen" />
        
        {/* Premium Dots Mesh */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(circle at center, #F5D90A 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
            backgroundPosition: "0 0"
          }}
        />
        
        {/* Film Style Noise Grain */}
        <div
          className="absolute inset-0 opacity-[0.25] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Gradients to fade out mesh/noise at edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B]/30 via-transparent to-[#0B0B0B] block" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-transparent to-[#0B0B0B] opacity-80 block" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-32">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#2A2A2A] bg-[#151515]/80 backdrop-blur-md mb-8 shadow-2xl shadow-[#F5D90A]/5"
        >
          <span className="w-2 h-2 rounded-full bg-[#F5D90A] animate-pulse shadow-[0_0_8px_#F5D90A]" />
          <span className="text-sm font-medium tracking-wide text-[#CCC]">
            AI-Powered Research Engine Live
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
        >
          <span className="text-white drop-shadow-lg">Discover Alpha</span>
          <br />
          <span className=" text-[#F5D90A]/80">
            Before Everyone Else
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg md:text-xl text-[#888] max-w-2xl mx-auto mb-10 leading-relaxed font-light"
        >
          AlphaScope uses AI to scan blockchain data, detect hidden gems, and
          track smart wallets giving you the edge to find opportunities before
          they trend.
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
            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-b from-[#F5D90A] to-[#E5C90A] text-[#0B0B0B] rounded-xl font-bold text-base shadow-[0_0_40px_rgba(245,217,10,0.2)] hover:shadow-[0_0_60px_rgba(245,217,10,0.4)] hover:-translate-y-1 transition-all duration-300"
          >
            <RiRocketLine className="text-lg transition-transform group-hover:translate group-hover:-translate-y-1" />
            Launch App
          </Link>
          <Link
            href="/app/analyzer"
            className="group flex items-center gap-2 px-8 py-4 border border-[#2A2A2A] bg-[#151515]/50 backdrop-blur-md text-white rounded-xl font-semibold text-base hover:border-[#F5D90A]/50 hover:bg-[#1E1E1E] hover:-translate-y-1 transition-all duration-300"
          >
            <RiSearchEyeLine className="text-lg text-[#888] group-hover:text-[#F5D90A] transition-colors" />
            Try Analyzer
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-xl mx-auto border-t border-[#2A2A2A]/50 pt-10"
        >
          {[
            { value: "12K+", label: "Tokens Scanned" },
            { value: "2.4K", label: "Active Users" },
            { value: "89%", label: "Signal Accuracy" },
          ].map((stat) => (
            <div key={stat.label} className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-white group-hover:text-[#F5D90A] transition-colors duration-300">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-[#888] mt-2 font-medium tracking-wide uppercase">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
