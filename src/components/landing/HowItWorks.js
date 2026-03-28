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
    description: "Link your wallet to create your secure identity on the AlphaScope platform.",
    icon: RiWalletLine,
    details: {
      tag: "STEP 1 OF 4",
      heading: "Create your identity",
      text: "Set up your secure connection to interact with the AlphaScope ecosystem. Your wallet serves as your universal login, providing access to all features.",
      form: (
        <div className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">Your wallet address</label>
            <input 
              type="text" 
              placeholder="e.g 0x123...abc" 
              disabled
              className="w-full bg-[#0B0B0B] border border-[#2A2A2A] rounded-lg px-4 py-3 text-[#E0E0E0] placeholder:text-[#666] focus:outline-none focus:border-[#F5D90A] transition-colors"
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Preferred Network</label>
            <input 
              type="text" 
              placeholder="e.g Ethereum Mainnet" 
              disabled
              className="w-full bg-[#0B0B0B] border border-[#2A2A2A] rounded-lg px-4 py-3 text-[#E0E0E0] placeholder:text-[#666] focus:outline-none focus:border-[#F5D90A] transition-colors"
            />
          </div>
          <p className="text-sm text-[#888]">
            By connecting your wallet you agree to the Terms of Service. For example: John Doe (0xab...xy)
          </p>
          <div className="space-y-3 pt-4 border-t border-[#2A2A2A]">
            <h4 className="text-white font-medium text-sm">Documentation</h4>
            <div className="flex gap-3">
              <button disabled className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-sm text-[#CCC] hover:text-white transition-colors cursor-not-allowed">
                <RiFileList3Line /> Protocol Setup
              </button>
              <button disabled className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-sm text-[#CCC] hover:text-white transition-colors cursor-not-allowed">
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
    title: "Earn $ASCP",
    description: "Complete quests and community tasks to earn ASCP tokens no purchase required.",
    icon: RiTrophyLine,
    details: {
      tag: "STEP 2 OF 4",
      heading: "Start earning rewards",
      text: "Engage with the community, participate in daily quests, and contribute to research discussions to earn ASCP tokens for unlocking premium features.",
      form: (
        <div className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">Community Handle (Optional)</label>
            <input 
              type="text" 
              placeholder="e.g @crypto_guru" 
              disabled
              className="w-full bg-[#0B0B0B] border border-[#2A2A2A] rounded-lg px-4 py-3 text-[#E0E0E0] placeholder:text-[#666] focus:outline-none focus:border-[#F5D90A] transition-colors"
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Referral Code</label>
            <input 
              type="text" 
              placeholder="e.g ALPHA2026" 
              disabled
              className="w-full bg-[#0B0B0B] border border-[#2A2A2A] rounded-lg px-4 py-3 text-[#E0E0E0] placeholder:text-[#666] focus:outline-none focus:border-[#F5D90A] transition-colors"
            />
          </div>
          <p className="text-sm text-[#888]">
            Earn your first 100 $ASCP immediately upon verification of your Discord or X profile.
          </p>
        </div>
      )
    }
  },
  {
    id: "03",
    title: "Research & Analyze",
    description: "Use AI-powered tools to analyze tokens, scan gems, and track smart wallets.",
    icon: RiSearchLine,
    details: {
      tag: "STEP 3 OF 4",
      heading: "Configure AI Agent",
      text: "Set up your personalized AI agent by selecting the types of tokens and metrics you want to track initially.",
      form: (
        <div className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">Primary Chains</label>
            <input 
              type="text" 
              placeholder="e.g Ethereum, Solana, Arbitrum" 
              disabled
              className="w-full bg-[#0B0B0B] border border-[#2A2A2A] rounded-lg px-4 py-3 text-[#E0E0E0] placeholder:text-[#666] focus:outline-none focus:border-[#F5D90A] transition-colors"
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Risk Tolerance & Strategy</label>
            <input 
              type="text" 
              placeholder="e.g Medium risk, focus on Defi protocols" 
              disabled
              className="w-full bg-[#0B0B0B] border border-[#2A2A2A] rounded-lg px-4 py-3 text-[#E0E0E0] placeholder:text-[#666] focus:outline-none focus:border-[#F5D90A] transition-colors"
            />
          </div>
          <p className="text-sm text-[#888]">
            The AI Agent will use these parameters to filter out the noise and present you with highly relevant data.
          </p>
        </div>
      )
    }
  },
  {
    id: "04",
    title: "Discover Alpha",
    description: "Unlock premium insights, deep-dive reports, and alpha alerts before the crowd.",
    icon: RiRocketLine,
    details: {
      tag: "STEP 4 OF 4",
      heading: "Setup Alpha Alerts",
      text: "Determine how and when you want to receive alpha notifications to ensure you never miss a market movement.",
      form: (
        <div className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">Notification Channel</label>
            <input 
              type="text" 
              placeholder="e.g Telegram @my_handle" 
              disabled
              className="w-full bg-[#0B0B0B] border border-[#2A2A2A] rounded-lg px-4 py-3 text-[#E0E0E0] placeholder:text-[#666] focus:outline-none focus:border-[#F5D90A] transition-colors"
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Alert Thresholds</label>
            <input 
              type="text" 
              placeholder="e.g Volume spike > 500% in 1H" 
              disabled
              className="w-full bg-[#0B0B0B] border border-[#2A2A2A] rounded-lg px-4 py-3 text-[#E0E0E0] placeholder:text-[#666] focus:outline-none focus:border-[#F5D90A] transition-colors"
            />
          </div>
          <p className="text-sm text-[#888]">
            Alerts will be sent out instantly when parameters are met. 
          </p>
        </div>
      )
    }
  }
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="py-16 relative overflow-hidden bg-[#0B0B0B]">
      <div className="max-w-[85rem] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-3">
            How AlphaScope Works
          </h2>
        </motion.div>

        <div className="bg-[#0B0B0B] border border-[#2A2A2A] rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[700px]">
          
          {/* LEFT PANEL */}
          <div className="lg:w-[45%] p-10 lg:p-14 relative border-b lg:border-b-0 lg:border-r border-[#2A2A2A] overflow-hidden flex flex-col justify-start pb-20">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#15150A] via-[#0B0B0B] to-[#111111]" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#F5D90A]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F5D90A]/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 flex flex-col pt-4">
              <div className="flex items-start gap-4 mb-12 bg-[#1A1A1A]/50 p-4 rounded-xl border border-[#2A2A2A]">
                <RiErrorWarningLine className="text-[#888] text-xl mt-0.5 flex-shrink-0" />
                <p className="text-[#CCC] text-sm leading-relaxed">
                  Get started by connecting your wallet, earning initial rewards, and configuring your personalized AI research agent.
                </p>
              </div>

              <div className="relative pl-0 md:pl-2 space-y-12">
                {/* Dotted Vertical Line */}
                <div className="absolute left-6 md:left-[2rem] top-8 bottom-10 w-px border-l-2 border-dashed border-[#2A2A2A] -translate-x-1/2" />

                {steps.map((step, index) => {
                  const isActive = activeStep === index;
                  const isPast = index < activeStep;
                  
                  return (
                    <div 
                      key={step.id} 
                      className="relative z-10 flex gap-6 cursor-pointer group"
                      onClick={() => setActiveStep(index)}
                    >
                      {/* Icon Circle */}
                      <div className="flex-shrink-0 relative">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative z-10 box-border ${
                          isActive 
                            ? "bg-[#1A1A1A] border-2 border-[#F5D90A] shadow-[0_0_15px_rgba(245,217,10,0.2)]" 
                            : isPast 
                              ? "bg-[#1A1A1A] border-[#888] border-2" 
                              : "bg-[#0B0B0B] border-[#2A2A2A] border-2 group-hover:border-[#555]"
                        }`}>
                          <step.icon className={`text-xl transition-colors duration-300 ${
                            isActive ? "text-[#F5D90A]" : isPast ? "text-[#888]" : "text-[#555]"
                          }`} />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="pt-1.5 flex-1 pr-4">
                        <h4 className={`text-lg font-bold transition-colors duration-300 ${
                          isActive || isPast ? "text-white" : "text-[#888]"
                        }`}>
                          {step.title}
                        </h4>
                        <p className={`text-sm mt-2 leading-relaxed transition-colors duration-300 ${
                          isActive || isPast ? "text-[#CCC]" : "text-[#666]"
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
          <div className="lg:w-[55%] p-10 lg:p-14 flex flex-col justify-start pt-16 lg:pt-24 bg-[#0B0B0B] relative overflow-hidden">
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
                  <span className="text-[#F5D90A] text-xs font-bold tracking-widest uppercase mb-4 block">
                    {steps[activeStep].details.tag}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-5">
                    {steps[activeStep].details.heading}
                  </h3>
                  <p className="text-[#888] leading-relaxed text-base">
                    {steps[activeStep].details.text}
                  </p>
                </div>

                {steps[activeStep].details.form}
                
                <div className="mt-12">
                 <Link href="/app">
                  <button 
                    onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
                    className="bg-[#F5D90A] text-black hover:bg-[#E5C90A] transition-colors px-8 py-3.5 rounded-lg font-semibold w-full sm:w-auto text-sm shadow-[0_0_20px_rgba(245,217,10,0.15)] hover:shadow-[0_0_25px_rgba(245,217,10,0.25)]"
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
