"use client";

import { motion } from "motion/react";
import {
  RiCoinLine,
  RiArrowDownLine,
  RiArrowUpLine,
  RiShieldCheckLine,
  RiAddLine,
  RiSubtractLine,
  RiExchangeFundsLine,
  RiCopperCoinLine,
  RiLockUnlockLine
} from "react-icons/ri";

const earnMethods = [
  { label: "Follow on X", reward: "+50 ASCP" },
  { label: "Like & Repost", reward: "+30 ASCP" },
  { label: "Join Telegram", reward: "+75 ASCP" },
  { label: "Analyze Token", reward: "+100 ASCP" },
  { label: "Daily Login", reward: "+20 ASCP" },
];

const spendMethods = [
  { label: "Full AI Report", cost: "-200 ASCP" },
  { label: "Gem Scanner Pro", cost: "-150 ASCP" },
  { label: "Wallet Intel", cost: "-100 ASCP" },
  { label: "Alpha Alerts", cost: "-75 ASCP" },
];

export default function TokenSection() {
  return (
    <section id="token" className="py-20 relative overflow-hidden bg-[#0B0B0B] border-t border-[#111]">
      {/* Background blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F5D90A]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-3">
            The <span className="text-[#F5D90A]">$ASCP</span> Economy
          </h2>
          <p className="text-[#888] mt-4 max-w-2xl mx-auto">
            A closed-loop system rewarding true research and active community participation. Earn by engaging, spend to unlock alpha.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* EARN CARD */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#0B0B0B] border border-[#2A2A2A] rounded-[2rem] p-8 relative overflow-hidden group hover:border-[#22C55E]/40 transition-colors"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#22C55E]/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#22C55E]/20 transition-all duration-500" />
            
            <div className="flex flex-col h-full relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-[#333] flex items-center justify-center mb-6 shadow-sm">
                <RiArrowDownLine className="text-[#22C55E] text-xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Earn $ASCP</h3>
              <p className="text-[#888] text-sm mb-8 leading-relaxed">
                Perform community tasks and contribute your research to accumulate ASCP with zero capital required.
              </p>

              <div className="space-y-3 mt-auto">
                {earnMethods.map((item, i) => (
                  <div key={i} className="flex flex-col group/item cursor-default">
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#111] border border-[#222] group-hover/item:border-[#22C55E]/30 transition-colors">
                      <span className="text-[#CCC] text-sm font-medium">{item.label}</span>
                      <div className="flex items-center gap-1.5 bg-[#22C55E]/10 border border-[#22C55E]/20 px-2.5 py-1 rounded-md">
                        <RiAddLine className="text-[#22C55E] text-xs" />
                        <span className="text-[#22C55E] font-bold text-xs">{item.reward.replace('+', '')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CENTER COIN VISUAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-[#111] to-[#050505] border border-[#2A2A2A] rounded-[2rem] p-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px] shadow-2xl"
          >
            {/* Orbital Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-[#2A2A2A]/40 border-dashed animate-[spin_20s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full border border-[#F5D90A]/10 animate-[spin_15s_linear_infinite_reverse]" />

            {/* Glowing Coin */}
            <div className="relative z-10 w-36 h-36 rounded-full bg-gradient-to-tr from-[#F5D90A] via-[#FFEA5C] to-[#FFF4A3] flex items-center justify-center shadow-[0_0_50px_rgba(245,217,10,0.25)] mb-10 hover:shadow-[0_0_70px_rgba(245,217,10,0.4)] transition-all duration-700 hover:scale-105">
              <div className="w-[8.25rem] h-[8.25rem] rounded-full bg-[#050505] flex items-center justify-center flex-col shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)] border border-[#F5D90A]/30">
                <RiCopperCoinLine className="text-[#F5D90A] text-5xl mb-1 opacity-90" />
                <span className="text-white font-black text-sm tracking-widest bg-gradient-to-r from-white to-[#AAA] bg-clip-text text-transparent">ASCP</span>
              </div>
            </div>

            <div className="text-center relative z-10">
              <h3 className="text-xl font-bold text-white mb-2">The Engine of Alpha</h3>
              <p className="text-[#888] text-sm max-w-[250px] mx-auto leading-relaxed">
                Connecting community engagement to high-probability market insights.
              </p>
            </div>
          </motion.div>

          {/* SPEND CARD */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-[#0B0B0B] border border-[#2A2A2A] rounded-[2rem] p-8 relative overflow-hidden group hover:border-[#F5D90A]/40 transition-colors"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5D90A]/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#F5D90A]/20 transition-all duration-500" />
            
            <div className="flex flex-col h-full relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-[#333] flex items-center justify-center mb-6 shadow-sm">
                <RiExchangeFundsLine className="text-[#F5D90A] text-xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Unlock Alpha</h3>
              <p className="text-[#888] text-sm mb-8 leading-relaxed">
                Burn your accumulated ASCP to access exclusive AI reports, deep dives, and real-time alerts.
              </p>

              <div className="space-y-3 mt-auto">
                {spendMethods.map((item, i) => (
                  <div key={i} className="flex flex-col group/item cursor-default">
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#111] border border-[#222] group-hover/item:border-[#F5D90A]/30 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <RiLockUnlockLine className="text-[#555] group-hover/item:text-[#F5D90A]/80 transition-colors text-sm" />
                        <span className="text-[#CCC] text-sm font-medium">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-[#F5D90A]/10 border border-[#F5D90A]/20 px-2.5 py-1 rounded-md">
                        <RiSubtractLine className="text-[#F5D90A] text-xs" />
                        <span className="text-[#F5D90A] font-bold text-xs">{item.cost.replace('-', '')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>

        {/* Security / Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 bg-gradient-to-r from-[#0B0B0B] to-[#111] border border-[#2A2A2A] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative"
        >
          {/* subtle right glow */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-full bg-[#F5D90A]/5 blur-[40px] pointer-events-none" />

          <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#151515] sm:flex hidden items-center justify-center border border-[#333] shrink-0 shadow-lg">
              <RiShieldCheckLine className="text-[#F5D90A] text-2xl" />
            </div>
            <div className="text-left">
              <h4 className="text-white font-bold text-lg tracking-tight">Secure & Fair Ecosystem</h4>
              <p className="text-[#888] text-sm mt-1 max-w-lg leading-relaxed">
                Tokens are governed by robust smart contracts. Our economy is protected by wallet-based authentication, strict daily limits, and anti-sybil safeguards.
              </p>
            </div>
          </div>
          
          <div className="relative z-10 w-full md:w-auto mt-2 md:mt-0 flex shrink-0">
            <button className="w-full md:w-auto px-8 py-3.5 bg-transparent hover:bg-[#1A1A1A] border border-[#333] hover:border-[#F5D90A]/50 rounded-xl text-white text-sm font-semibold transition-all duration-300">
              Read Tokenomics
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
