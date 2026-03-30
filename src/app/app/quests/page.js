"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  RiTwitterXLine, RiHeart3Line, RiChat3Line, RiTelegramLine,
  RiGroupLine, RiSearchLine, RiVipDiamondLine, RiNotification3Line,
  RiWallet3Line, RiCalendarLine, RiShareLine,
  RiCheckLine, RiCoinLine, RiArrowRightLine, RiStarLine,
  RiExternalLinkLine, RiLock2Line,
} from "react-icons/ri";
import { useTokens } from "@/context/TokenContext";
import { useConnectModal } from "@rainbow-me/rainbowkit";

const QUEST_ICONS = {
  twitter: RiTwitterXLine, like: RiHeart3Line, chat: RiChat3Line,
  telegram: RiTelegramLine, users: RiGroupLine, search: RiSearchLine,
  gem: RiVipDiamondLine, bell: RiNotification3Line, wallet: RiWallet3Line,
  calendar: RiCalendarLine, share: RiShareLine,
  coin: RiCoinLine, star: RiStarLine,
};

const CATEGORIES = [
  { id: "all", label: "All Quests" },
  { id: "social", label: "Social" },
  { id: "platform", label: "Platform" },
  { id: "community", label: "Community" },
];

const ALL_QUESTS = [
  { id: "q1", title: "Follow ChainOracle on X", desc: "Follow our official account and stay updated", category: "social", icon: "twitter", reward: 100, link: "https://x.com/ascp_ai" },
  { id: "q2", title: "Like & Repost Launch Tweet", desc: "Engage with our launch announcement", category: "social", icon: "like", reward: 50, link: "https://x.com/ascp_ai" },
  { id: "q3", title: "Join Telegram Community", desc: "Join our Telegram group for alpha leaks", category: "social", icon: "telegram", reward: 100, link: "https://x.com/ascp_ai" },
  { id: "q5", title: "Share ChainOracle with Friends", desc: "Share a referral link on any platform", category: "social", icon: "share", reward: 75, link: "https://x.com/intent/tweet?text=Check%20out%20ChainOracle%20-%20AI-powered%20predictive%20analytics%20platform!%20%40ascp_ai" },
  { id: "q6", title: "Run Your First Forecast", desc: "Run the AI Forecast Analyzer on any token", category: "platform", icon: "search", reward: 150, link: null },
  { id: "q7", title: "Explore Oracle Predictions", desc: "Open the Oracle Predictions page", category: "platform", icon: "gem", reward: 50, link: null },
  { id: "q8", title: "Connect Your Wallet", desc: "Link a wallet to your ChainOracle account", category: "platform", icon: "wallet", reward: 200, link: null },
  { id: "q9", title: "Set Up Signal Alerts", desc: "Customize your signal alert preferences", category: "platform", icon: "bell", reward: 50, link: null },
  { id: "q10", title: "Daily Login Streak (3 Days)", desc: "Open ChainOracle for 3 consecutive days", category: "community", icon: "calendar", reward: 150, link: null },
  { id: "q11", title: "Invite 3 Friends", desc: "Get 3 friends to sign up via referral", category: "community", icon: "users", reward: 300, link: null },
  { id: "q12", title: "Submit Feedback", desc: "Share your thoughts on how to improve ChainOracle", category: "community", icon: "chat", reward: 100, link: null },
];

export default function QuestsPage() {
  const { balance, completedQuests, completeQuest, isConnected } = useTokens();
  const { openConnectModal } = useConnectModal();
  const [category, setCategory] = useState("all");
  const [claimingId, setClaimingId] = useState(null);

  const filtered = ALL_QUESTS.filter((q) => category === "all" || q.category === category);
  const totalReward = ALL_QUESTS.reduce((acc, q) => acc + q.reward, 0);
  const earnedReward = ALL_QUESTS.filter(q => completedQuests.includes(q.id)).reduce((acc, q) => acc + q.reward, 0);
  const progressPct = (completedQuests.length / ALL_QUESTS.length) * 100;

  function handleClaim(quest) {
    if (!isConnected) return;
    if (completedQuests.includes(quest.id)) return;
    setClaimingId(quest.id);
    if (quest.link) {
      window.open(quest.link, "_blank", "noopener,noreferrer");
    }
    setTimeout(() => {
      completeQuest(quest.id, quest.reward);
      setClaimingId(null);
    }, 1200);
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="max-w-md w-full">
          <div className="w-24 h-24 rounded-3xl bg-[#141420] border border-[#2A2A3A] flex items-center justify-center mx-auto mb-8 shadow-lg">
            <RiLock2Line className="text-[#7C3AED] text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Connect Wallet to Access Quests</h1>
          <p className="text-[#A1A1AA] text-sm leading-relaxed mb-8 max-w-sm mx-auto">
            To start earning <span className="text-[#9F67FF] font-semibold">$CORA</span> tokens, you need to connect your wallet first. You'll receive <span className="text-[#9F67FF] font-semibold">500 $CORA</span> as a welcome bonus!
          </p>
          <div className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#0A0A0F] border border-[#2A2A3A] mb-8 w-fit mx-auto">
            <RiCoinLine className="text-[#7C3AED] text-lg" />
            <span className="text-[#6B6B76] font-bold text-xl">0</span>
            <span className="text-[#6B6B76] text-sm">CORA</span>
          </div>
          <button onClick={openConnectModal} className="btn-3d px-8 py-4 text-sm flex items-center gap-2 mx-auto">
            <RiWallet3Line className="text-lg" />
            Connect Wallet
          </button>
          <div className="mt-12 relative">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/80 to-transparent rounded-2xl" />
            <div className="grid gap-3 opacity-40 blur-[2px]">
              {ALL_QUESTS.slice(0, 3).map((q) => {
                const Icon = QUEST_ICONS[q.icon] || RiStarLine;
                return (
                  <div key={q.id} className="p-4 rounded-2xl border border-[#2A2A3A] bg-[#141420] flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center shrink-0">
                      <Icon className="text-[#7C3AED] text-lg" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-white font-semibold text-sm">{q.title}</h3>
                      <p className="text-[#6B6B76] text-xs">{q.desc}</p>
                    </div>
                    <span className="px-3 py-1.5 rounded-lg bg-[#7C3AED]/10 text-[#9F67FF] text-xs font-semibold">+{q.reward}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Quest Center</h1>
          <p className="text-[#6B6B76] text-sm mt-1">Complete tasks to earn $CORA tokens</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141420] border border-[#2A2A3A]">
          <RiCoinLine className="text-[#7C3AED]" />
          <span className="text-[#9F67FF] font-bold">{balance.toLocaleString()}</span>
          <span className="text-[#6B6B76] text-xs">CORA</span>
        </div>
      </div>

      <div className="p-5 rounded-2xl border border-[#2A2A3A] bg-[#141420]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-semibold text-sm">Overall Progress</span>
          <span className="text-[#6B6B76] text-xs">{completedQuests.length}/{ALL_QUESTS.length} Quests · {earnedReward.toLocaleString()}/{totalReward.toLocaleString()} CORA</span>
        </div>
        <div className="w-full h-3 rounded-full bg-[#0A0A0F] overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9F67FF]" />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button key={cat.id} onClick={() => setCategory(cat.id)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${category === cat.id ? "bg-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/20" : "bg-[#141420] border border-[#2A2A3A] text-[#A1A1AA] hover:text-white hover:border-[#7C3AED]/30"}`}>
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((quest, i) => {
          const isCompleted = completedQuests.includes(quest.id);
          const isClaiming = claimingId === quest.id;
          const Icon = QUEST_ICONS[quest.icon] || RiStarLine;
          const hasLink = !!quest.link;
          return (
            <motion.div key={quest.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}
              className={`p-4 rounded-2xl border bg-[#141420] transition-colors ${isCompleted ? "border-[#22C55E]/30" : "border-[#2A2A3A] hover:border-[#7C3AED]/20"}`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isCompleted ? "bg-[#22C55E]/10" : "bg-[#7C3AED]/10"}`}>
                  {isCompleted ? <RiCheckLine className="text-[#22C55E] text-lg" /> : <Icon className="text-[#7C3AED] text-lg" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-semibold text-sm ${isCompleted ? "text-[#6B6B76] line-through" : "text-white"}`}>{quest.title}</h3>
                    {hasLink && !isCompleted && <RiExternalLinkLine className="text-[#555] text-xs shrink-0" />}
                  </div>
                  <p className="text-[#6B6B76] text-xs mt-0.5">{quest.desc}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <RiCoinLine className="text-[#7C3AED] text-xs" />
                    <span className="text-[#9F67FF] text-xs font-semibold">+{quest.reward} CORA</span>
                  </div>
                </div>
                <div className="shrink-0">
                  {isCompleted ? (
                    <span className="px-3 py-1.5 rounded-lg bg-[#22C55E]/10 text-[#22C55E] text-xs font-semibold">Done</span>
                  ) : (
                    <button onClick={() => handleClaim(quest)} disabled={isClaiming} className="btn-3d btn-3d-sm px-4 py-1.5 text-xs disabled:opacity-50 flex items-center gap-1">
                      {isClaiming ? (
                        <motion.div initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}>
                          <RiCoinLine />
                        </motion.div>
                      ) : (
                        <>Claim <RiArrowRightLine /></>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
