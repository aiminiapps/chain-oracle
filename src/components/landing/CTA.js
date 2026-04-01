"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { RiTerminalBoxLine, RiArrowRightSLine, RiPulseLine } from "react-icons/ri";

export default function CTA() {
  return (
    <section className="py-24 relative relative bg-[#0A0A0F] overflow-hidden">
      
      {/* High-tech grid background */}
      <div className="absolute inset-0 bg-[#0A0A0F]">
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `linear-gradient(#7C3AED 1px, transparent 1px), linear-gradient(90deg, #7C3AED 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            backgroundPosition: "center center"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0F] via-transparent to-[#0A0A0F] z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0A0A0F_80%)] z-0" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative rounded-[2.5rem] border border-[#2A2A3A] bg-[#0A0A0F]/80 backdrop-blur-3xl p-10 md:p-20 text-center overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)] group"
        >
          {/* Cyberpunk corner accents */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-[3px] border-l-[3px] border-[#9F67FF] rounded-tl-[2.5rem] opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-[3px] border-r-[3px] border-[#9F67FF] rounded-br-[2.5rem] opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* Internal Glow Blob */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#7C3AED]/20 rounded-full blur-[100px] pointer-events-none" 
          />

          <div className="relative z-10 flex flex-col items-center">
            
            <div className="w-16 h-16 rounded-2xl bg-[#141420] border border-[#2A2A3A] flex items-center justify-center mb-8 shadow-2xl relative overflow-hidden group-hover:border-[#7C3AED]/50 transition-colors">
               <RiTerminalBoxLine className="text-[#9F67FF] text-3xl z-10" />
               <motion.div 
                 animate={{ top: ["-50%", "150%"] }}
                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-x-0 h-px bg-white/50 blur-[1px] w-full"
               />
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter leading-none">
              Initialize <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9F67FF] to-[#D8B4FE]">The Subsystem</span>
            </h2>
            
            <p className="text-[#A1A1AA] text-sm md:text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
              Synchronize your encrypted Web3 identity with the ChainOracle neural network. Extract pristine, high-conviction Alpha from the market noise before anyone else.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full">
               <Link
                 href="/app"
                 className="btn-3d flex items-center justify-center gap-2 px-10 py-5 text-sm font-bold uppercase tracking-widest w-full sm:w-auto overflow-hidden relative"
               >
                 <span className="relative z-10 flex items-center gap-2">Deploy Oracle Engine <RiArrowRightSLine className="text-xl" /></span>
               </Link>

               <div className="px-6 py-4 rounded-xl border border-[#2A2A3A] bg-[#141420] flex items-center gap-3 w-full sm:w-auto text-left">
                  <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse rounded-full shadow-[0_0_8px_#22C55E]" />
                  <div>
                     <div className="text-[#E0E0E0] text-[10px] font-bold tracking-widest uppercase">Network Status</div>
                     <div className="text-[#8E8E9A] text-[10px] uppercase font-mono mt-0.5 tracking-wider">Nodes Active & Syncing</div>
                  </div>
                  <RiPulseLine className="text-[#2A2A3A] text-2xl ml-auto" />
               </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
