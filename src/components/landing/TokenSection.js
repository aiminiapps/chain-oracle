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
  { label: "Follow on X", reward: "+50 CORA" },
  { label: "Like & Repost", reward: "+30 CORA" },
  { label: "Join Telegram", reward: "+75 CORA" },
  { label: "Run Forecast", reward: "+100 CORA" },
  { label: "Daily Login", reward: "+20 CORA" },
];

const spendMethods = [
  { label: "Predictive Report", cost: "-200 CORA" },
  { label: "Oracle Scanner Pro", cost: "-150 CORA" },
  { label: "Forecast Alerts", cost: "-100 CORA" },
  { label: "Watchlist Pro", cost: "-75 CORA" },
];

export default function TokenSection() {
  return (
    <section id="token" className="py-20 relative overflow-hidden bg-[#0A0A0F] border-t border-[#141420]">
      {/* Background blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7C3AED]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-3">
            The <span className="text-[#7C3AED]">$CORA</span> Economy
          </h2>
          <p className="text-[#A1A1AA] mt-4 max-w-2xl mx-auto">
            A closed-loop system rewarding true research and active community participation. Earn by engaging, spend to unlock predictive intelligence.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* EARN CARD */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#0A0A0F] border border-[#2A2A3A] rounded-[2rem] p-8 relative overflow-hidden group hover:border-[#22C55E]/40 transition-colors card-3d"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#22C55E]/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#22C55E]/20 transition-all duration-500" />
            
            <div className="flex flex-col h-full relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#1C1C2E] border border-[#2A2A3A] flex items-center justify-center mb-6 shadow-sm">
                <RiArrowDownLine className="text-[#22C55E] text-xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Earn $CORA</h3>
              <p className="text-[#A1A1AA] text-sm mb-8 leading-relaxed">
                Perform community tasks and contribute research to accumulate CORA with zero capital required.
              </p>

              <div className="space-y-3 mt-auto">
                {earnMethods.map((item, i) => (
                  <div key={i} className="flex flex-col group/item cursor-default">
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#141420] border border-[#2A2A3A] group-hover/item:border-[#22C55E]/30 transition-colors">
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
            className="bg-gradient-to-br from-[#141420] to-[#0A0A0F] border border-[#2A2A3A] rounded-[2rem] p-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px] shadow-2xl"
          >
            {/* Orbital Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-[#2A2A3A]/40 border-dashed animate-[spin_20s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full border border-[#7C3AED]/10 animate-[spin_15s_linear_infinite_reverse]" />

            {/* Glowing Coin */}
            <div className="relative z-10 w-36 h-36 rounded-full bg-gradient-to-tr from-[#7C3AED] via-[#9F67FF] to-[#A78BFA] flex items-center justify-center shadow-[0_0_50px_rgba(124,58,237,0.25)] mb-10 hover:shadow-[0_0_70px_rgba(124,58,237,0.4)] transition-all duration-700 hover:scale-105">
              <div className="w-[8.25rem] h-[8.25rem] rounded-full bg-[#0A0A0F] flex items-center justify-center flex-col shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)] border border-[#7C3AED]/30">
                <RiCopperCoinLine className="text-[#7C3AED] text-5xl mb-1 opacity-90" />
                <span className="text-white font-black text-sm tracking-widest bg-gradient-to-r from-white to-[#9F67FF] bg-clip-text text-transparent">CORA</span>
              </div>
            </div>

            <div className="text-center relative z-10">
              <h3 className="text-xl font-bold text-white mb-2">The Oracle Engine</h3>
              <p className="text-[#A1A1AA] text-sm max-w-[250px] mx-auto leading-relaxed">
                Connecting community engagement to high-probability market predictions.
              </p>
            </div>
          </motion.div>

          {/* SPEND CARD */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-[#0A0A0F] border border-[#2A2A3A] rounded-[2rem] p-8 relative overflow-hidden group hover:border-[#7C3AED]/40 transition-colors card-3d"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED]/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#7C3AED]/20 transition-all duration-500" />
            
            <div className="flex flex-col h-full relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#1C1C2E] border border-[#2A2A3A] flex items-center justify-center mb-6 shadow-sm">
                <RiExchangeFundsLine className="text-[#7C3AED] text-xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Unlock Predictions</h3>
              <p className="text-[#A1A1AA] text-sm mb-8 leading-relaxed">
                Spend CORA to access exclusive AI forecasts, deep reports, and premium signal intelligence.
              </p>

              <div className="space-y-3 mt-auto">
                {spendMethods.map((item, i) => (
                  <div key={i} className="flex flex-col group/item cursor-default">
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#141420] border border-[#2A2A3A] group-hover/item:border-[#7C3AED]/30 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <RiLockUnlockLine className="text-[#6B6B76] group-hover/item:text-[#7C3AED]/80 transition-colors text-sm" />
                        <span className="text-[#CCC] text-sm font-medium">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-[#7C3AED]/10 border border-[#7C3AED]/20 px-2.5 py-1 rounded-md">
                        <RiSubtractLine className="text-[#7C3AED] text-xs" />
                        <span className="text-[#7C3AED] font-bold text-xs">{item.cost.replace('-', '')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>

        {/* Security Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 bg-gradient-to-r from-[#0A0A0F] to-[#141420] border border-[#2A2A3A] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative"
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-full bg-[#7C3AED]/5 blur-[40px] pointer-events-none" />

          <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#1C1C2E] sm:flex hidden items-center justify-center border border-[#2A2A3A] shrink-0 shadow-lg">
              <RiShieldCheckLine className="text-[#7C3AED] text-2xl" />
            </div>
            <div className="text-left">
              <h4 className="text-white font-bold text-lg tracking-tight">Secure & Fair Ecosystem</h4>
              <p className="text-[#A1A1AA] text-sm mt-1 max-w-lg leading-relaxed">
                Tokens are governed by robust smart contracts. Our economy is protected by wallet-based authentication, strict daily limits, and anti-sybil safeguards.
              </p>
            </div>
          </div>
          
          <div className="relative z-10 w-full md:w-auto mt-2 md:mt-0 flex shrink-0">
            <button className="btn-3d-ghost w-full md:w-auto">
              Read Tokenomics
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
