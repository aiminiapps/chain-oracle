"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { RiArrowRightUpLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import Image from "next/image";

const RIGHT_OUTPUTS = [
  { token: "$NEIRO", score: "9.8", type: "Whale Accumulation", color: "#22C55E" },
  { token: "$CORA", score: "9.5", type: "Volume Breakout", color: "#3B82F6" },
  { token: "$AIX", score: "9.1", type: "Smart Money Entry", color: "#9F67FF" },
  { token: "$PEPE", score: "8.9", type: "Momentum Surge", color: "#F97316" }
];

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start pt-32 pb-20 overflow-hidden bg-[#0A0A0F]">
      
      {/* ─── Background Effects ─── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#7C3AED]/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-[#F97316]/5 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0A0A0F] to-transparent z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_30%,transparent,rgba(10,10,15,1))]" />
      </div>

      <div className="relative z-20 max-w-6xl mx-auto sm:mt-20 px-6 text-center w-full">
        {/* Headline */}
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tighter mb-6 mx-auto max-w-4xl text-white">
          Unlock True Alpha From <br className="hidden sm:block" />
          <span className="text-[#7C3AED]">Any Token</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-base md:text-lg text-[#8E8E9A] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          The most advanced tool for deep liquidity and sentiment analysis. ChainOracle ensures full, accurate probability matrices from sheer on-chain noise.
        </motion.p>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
          <Link href="/app" className="btn-3d group flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold w-full sm:w-auto uppercase tracking-wide">
             Launch App <RiArrowRightUpLine className="text-lg group-hover:text-gray-300 transition-colors" />
          </Link>
        </motion.div>

        {/* ─── NEXT LEVEL 3D PIPELINE ANIMATION ─── */}
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }} className="w-full h-[350px] md:h-[450px] relative max-w-5xl mx-auto flex items-center justify-center">
          
          {/* Left Side: 3D Incoming Documents (Noise / Raw Data) */}
          <div className="absolute left-0 top-0 bottom-0 w-[45%] z-10" style={{ perspective: "1000px" }}>
             {/* Gradient mask to fade out the far left edge cleanly */}
             <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0A0A0F] to-transparent z-20 pointer-events-none" />
             
             {mounted && [0,1,2,3,4,5].map((i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 -translate-y-1/2 w-48 h-64 md:w-64 md:h-80 rounded-2xl bg-[#0D0D14]/80 backdrop-blur-sm border border-[#1E1E2E] p-5 shadow-[20px_0_50px_rgba(0,0,0,0.5)] flex flex-col gap-4 overflow-hidden"
                  initial={{ x: "-40%", opacity: 0, rotateY: "35deg", scale: 0.7 }}
                  animate={{ x: ["-40%", "150%"], opacity: [0, 0.4, 0.6, 0], scale: [0.7, 0.85, 1, 0.95] }}
                  transition={{ duration: 7, repeat: Infinity, delay: i * 1.16, ease: "linear" }}
                  style={{ transformStyle: "preserve-3d", left: "-5%" }}
                >
                  <div className="w-16 h-2 bg-[#2A2A3A] rounded-full mb-2" />
                  <div className="space-y-3 opacity-60">
                    <div className="w-full h-1.5 bg-[#1E1E2E] rounded-full" />
                    <div className="w-5/6 h-1.5 bg-[#1E1E2E] rounded-full" />
                    <div className="w-3/4 h-1.5 bg-[#1E1E2E] rounded-full" />
                    <div className="w-full h-1.5 bg-[#1E1E2E] rounded-full" />
                    <div className="w-4/6 h-1.5 bg-[#1E1E2E] rounded-full" />
                    <div className="w-2/3 h-1.5 bg-[#1E1E2E] rounded-full mt-6" />
                    <div className="w-full h-1.5 bg-[#1E1E2E] rounded-full" />
                  </div>
                  <div className="mt-auto pt-4 border-t border-[#1E1E2E] flex justify-between items-center opacity-40">
                     <div className="w-6 h-6 rounded bg-[#2A2A3A]" />
                     <div className="w-12 h-1.5 bg-[#2A2A3A] rounded-full" />
                  </div>
                </motion.div>
             ))}
          </div>

          {/* Center: The Oracle Processing Beam */}
          <div className="absolute top-0 bottom-0 left-[48%] w-[2px] bg-gradient-to-b from-transparent via-[#7C3AED] to-transparent shadow-[0_0_20px_#7C3AED] z-30 flex items-center justify-center">
             {/* The Processing Badge attached to the beam */}
             <div className="absolute top-1/2 -left-8 -translate-y-1/2 w-16 h-16 rounded-full bg-[#0A0A0F] border-2 border-[#7C3AED] shadow-[0_0_30px_rgba(124,58,237,0.4)] flex items-center justify-center z-40 transform rotate-45">
             <Image src="/agent.png" alt="Logo" width={80} height={80}/>
             </div>
          </div>

          {/* Right Side: Clean Structured Output Feed (Single File List) */}
          <div className="absolute right-0 top-0 bottom-0 w-[45%] z-20 overflow-hidden flex items-center justify-start pl-8 md:pl-16">
             <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0A0A0F] to-transparent z-30 pointer-events-none" />
             <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0A0A0F] to-transparent z-30 pointer-events-none" />
             
             <div className="w-full max-w-sm h-[250px] relative">
               <motion.div 
                 animate={{ y: ["0%", "-50%"] }}
                 transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                 className="flex flex-col gap-4 absolute top-0 left-0 w-full"
               >
                 {mounted && [...RIGHT_OUTPUTS, ...RIGHT_OUTPUTS].map((out, i) => (
                    <div 
                      key={i}
                      className="w-full bg-[#0D0D14]/90 backdrop-blur-xl border border-[#2A2A3A]/60 rounded-xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden flex items-center gap-4"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: out.color }} />
                      
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center justify-between mb-1">
                            <span className="text-white text-sm font-bold truncate">{out.token}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border bg-[#0A0A0F]" style={{ color: out.color, borderColor: `${out.color}30` }}>
                               {out.score}
                            </span>
                         </div>
                         <span className="text-[#8E8E9A] text-[10px] font-medium text-left uppercase tracking-widest truncate block">
                            {out.type}
                         </span>
                      </div>
                    </div>
                 ))}
               </motion.div>
             </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
