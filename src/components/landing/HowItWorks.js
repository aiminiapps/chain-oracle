"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  RiErrorWarningLine,
  RiFileList3Line,
  RiSettings4Line,
  RiWalletLine,
  RiTrophyLine,
  RiSearchLine,
  RiRocketLine,
} from "react-icons/ri";
import Link from "next/link";

const steps = [
  {
    id: "01",
    title: "Connect Wallet",
    description: "Link your wallet to create your secure identity on the ChainOracle platform.",
    icon: RiWalletLine,
    details: {
      tag: "STEP 1 OF 4",
      heading: "Create your identity",
      text: "Set up your secure connection to interact with the ChainOracle ecosystem. Your wallet serves as your universal login, providing access to all prediction tools.",
      form: (
        <div className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">Your wallet address</label>
            <input 
              type="text" 
              placeholder="e.g 0x123...abc" 
              disabled
              className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-lg px-4 py-3 text-[#E0E0E0] placeholder:text-[#6B6B76] focus:outline-none focus:border-[#7C3AED] transition-colors"
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Preferred Network</label>
            <input 
              type="text" 
              placeholder="e.g Ethereum Mainnet" 
              disabled
              className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-lg px-4 py-3 text-[#E0E0E0] placeholder:text-[#6B6B76] focus:outline-none focus:border-[#7C3AED] transition-colors"
            />
          </div>
          <p className="text-sm text-[#A1A1AA]">
            By connecting your wallet you agree to the Terms of Service.
          </p>
          <div className="space-y-3 pt-4 border-t border-[#2A2A3A]">
            <h4 className="text-white font-medium text-sm">Documentation</h4>
            <div className="flex gap-3">
              <button disabled className="flex items-center gap-2 px-4 py-2 bg-[#1C1C2E] border border-[#2A2A3A] rounded-lg text-sm text-[#CCC] hover:text-white transition-colors cursor-not-allowed">
                <RiFileList3Line /> Protocol Setup
              </button>
              <button disabled className="flex items-center gap-2 px-4 py-2 bg-[#1C1C2E] border border-[#2A2A3A] rounded-lg text-sm text-[#CCC] hover:text-white transition-colors cursor-not-allowed">
                <RiSettings4Line /> Wallet Issues
              </button>
            </div>
          </div>
        </div>
      )
    }
  },
  {
    id: "02",
    title: "Earn $CORA",
    description: "Complete quests and community tasks to earn CORA tokens — no purchase required.",
    icon: RiTrophyLine,
    details: {
      tag: "STEP 2 OF 4",
      heading: "Start earning rewards",
      text: "Engage with the community, participate in daily quests, and contribute to prediction discussions to earn CORA tokens for unlocking premium forecasts.",
      form: (
        <div className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">Community Handle (Optional)</label>
            <input 
              type="text" 
              placeholder="e.g @crypto_guru" 
              disabled
              className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-lg px-4 py-3 text-[#E0E0E0] placeholder:text-[#6B6B76] focus:outline-none focus:border-[#7C3AED] transition-colors"
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Referral Code</label>
            <input 
              type="text" 
              placeholder="e.g ORACLE2026" 
              disabled
              className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-lg px-4 py-3 text-[#E0E0E0] placeholder:text-[#6B6B76] focus:outline-none focus:border-[#7C3AED] transition-colors"
            />
          </div>
          <p className="text-sm text-[#A1A1AA]">
            Earn your first 100 $CORA immediately upon verification of your Discord or X profile.
          </p>
        </div>
      )
    }
  },
  {
    id: "03",
    title: "Configure AI Oracle",
    description: "Set up your personalized AI prediction engine with chains and risk preferences.",
    icon: RiSearchLine,
    details: {
      tag: "STEP 3 OF 4",
      heading: "Configure your Oracle",
      text: "Set up your personalized AI Oracle by selecting the types of tokens and metrics you want to track. The engine will learn and improve from your interactions.",
      form: (
        <div className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">Primary Chains</label>
            <input 
              type="text" 
              placeholder="e.g Ethereum, Solana, Arbitrum" 
              disabled
              className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-lg px-4 py-3 text-[#E0E0E0] placeholder:text-[#6B6B76] focus:outline-none focus:border-[#7C3AED] transition-colors"
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Risk Tolerance & Strategy</label>
            <input 
              type="text" 
              placeholder="e.g Medium risk, focus on DeFi protocols" 
              disabled
              className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-lg px-4 py-3 text-[#E0E0E0] placeholder:text-[#6B6B76] focus:outline-none focus:border-[#7C3AED] transition-colors"
            />
          </div>
          <p className="text-sm text-[#A1A1AA]">
            The AI Oracle will use these parameters to filter noise and deliver highly relevant predictions.
          </p>
        </div>
      )
    }
  },
  {
    id: "04",
    title: "Receive Predictions",
    description: "Get AI-curated forecasts, deep reports, and real-time signal alerts.",
    icon: RiRocketLine,
    details: {
      tag: "STEP 4 OF 4",
      heading: "Setup Prediction Alerts",
      text: "Determine how and when you want to receive predictions and signal alerts to ensure you never miss a critical opportunity.",
      form: (
        <div className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">Notification Channel</label>
            <input 
              type="text" 
              placeholder="e.g Telegram @my_handle" 
              disabled
              className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-lg px-4 py-3 text-[#E0E0E0] placeholder:text-[#6B6B76] focus:outline-none focus:border-[#7C3AED] transition-colors"
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Alert Thresholds</label>
            <input 
              type="text" 
              placeholder="e.g Volume spike > 500% in 1H" 
              disabled
              className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-lg px-4 py-3 text-[#E0E0E0] placeholder:text-[#6B6B76] focus:outline-none focus:border-[#7C3AED] transition-colors"
            />
          </div>
          <p className="text-sm text-[#A1A1AA]">
            Alerts will be sent instantly when signals match your configured thresholds. 
          </p>
        </div>
      )
    }
  }
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="py-16 relative overflow-hidden bg-[#0A0A0F]">
      <div className="max-w-[85rem] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-3">
            How <span className="gradient-text-purple">ChainOracle</span> Works
          </h2>
        </motion.div>

        <div className="bg-[#0A0A0F] border border-[#2A2A3A] rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[700px]">
          
          {/* LEFT PANEL */}
          <div className="lg:w-[45%] p-10 lg:p-14 relative border-b lg:border-b-0 lg:border-r border-[#2A2A3A] overflow-hidden flex flex-col justify-start pb-20">
            <div className="absolute inset-0 bg-gradient-to-br from-[#12101F] via-[#0A0A0F] to-[#0D0D14]" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#7C3AED]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#7C3AED]/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 flex flex-col pt-4">
              <div className="flex items-start gap-4 mb-12 bg-[#1C1C2E]/50 p-4 rounded-xl border border-[#2A2A3A]">
                <RiErrorWarningLine className="text-[#A1A1AA] text-xl mt-0.5 flex-shrink-0" />
                <p className="text-[#CCC] text-sm leading-relaxed">
                  Get started by connecting your wallet, earning initial rewards, and configuring your personalized AI prediction engine.
                </p>
              </div>

              <div className="relative pl-0 md:pl-2 space-y-12">
                <div className="absolute left-6 md:left-[2rem] top-8 bottom-10 w-px border-l-2 border-dashed border-[#2A2A3A] -translate-x-1/2" />

                {steps.map((step, index) => {
                  const isActive = activeStep === index;
                  const isPast = index < activeStep;
                  
                  return (
                    <div 
                      key={step.id} 
                      className="relative z-10 flex gap-6 cursor-pointer group"
                      onClick={() => setActiveStep(index)}
                    >
                      <div className="flex-shrink-0 relative">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative z-10 box-border ${
                          isActive 
                            ? "bg-[#1C1C2E] border-2 border-[#7C3AED] shadow-[0_0_15px_rgba(124,58,237,0.2)]" 
                            : isPast 
                              ? "bg-[#1C1C2E] border-[#A1A1AA] border-2" 
                              : "bg-[#0A0A0F] border-[#2A2A3A] border-2 group-hover:border-[#555]"
                        }`}>
                          <step.icon className={`text-xl transition-colors duration-300 ${
                            isActive ? "text-[#7C3AED]" : isPast ? "text-[#A1A1AA]" : "text-[#6B6B76]"
                          }`} />
                        </div>
                      </div>
                      <div className="pt-1.5 flex-1 pr-4">
                        <h4 className={`text-lg font-bold transition-colors duration-300 ${
                          isActive || isPast ? "text-white" : "text-[#A1A1AA]"
                        }`}>
                          {step.title}
                        </h4>
                        <p className={`text-sm mt-2 leading-relaxed transition-colors duration-300 ${
                          isActive || isPast ? "text-[#CCC]" : "text-[#6B6B76]"
                        }`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:w-[55%] p-10 lg:p-14 flex flex-col justify-start pt-16 lg:pt-24 bg-[#0A0A0F] relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-xl mx-auto"
              >
                <div className="mb-10">
                  <span className="text-[#7C3AED] text-xs font-bold tracking-widest uppercase mb-4 block">
                    {steps[activeStep].details.tag}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-5">
                    {steps[activeStep].details.heading}
                  </h3>
                  <p className="text-[#A1A1AA] leading-relaxed text-base">
                    {steps[activeStep].details.text}
                  </p>
                </div>

                {steps[activeStep].details.form}
                
                <div className="mt-12">
                 <Link href="/app">
                  <button 
                    onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
                    className="btn-3d w-full sm:w-auto"
                  >
                    {activeStep === steps.length - 1 ? "Complete Setup" : "Save and continue"}
                  </button>
                 </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
