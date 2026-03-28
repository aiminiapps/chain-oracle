"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  RiStarLine, RiLoader4Line, RiLockLine,
  RiRefreshLine, RiSparklingLine,
  RiFireLine, RiShieldCheckLine, RiBarChartBoxLine,
} from "react-icons/ri";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { useTokens } from "@/context/TokenContext";
import { getTrendingTokens, getTopBoostedTokens, searchTokens, formatPairData, formatCurrency, formatNumber, getChainLabel } from "@/lib/dexscreener";
import InsufficientTokensModal from "@/components/dashboard/InsufficientTokensModal";
import GemDetailModal from "@/components/dashboard/GemDetailModal";

const GEM_DETAIL_COST = 100;

function getSparkline(token) {
  const b = 100;
  return [
    { v: b }, { v: b * (1 + (token.priceChange6h || 0) / 100 * 0.1) },
    { v: b * (1 + (token.priceChange6h || 0) / 100 * 0.5) },
    { v: b * (1 + (token.priceChange1h || 0) / 100 * 0.3) },
    { v: b * (1 + (token.priceChange1h || 0) / 100) },
    { v: b * (1 + (token.priceChange24h || 0) / 100 * 0.8) },
    { v: b * (1 + (token.priceChange24h || 0) / 100) },
  ];
}

export default function GemsPage() {
  const { balance, spendTokens } = useTokens();
  const [gems, setGems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("alphaScore");
  const [filterChain, setFilterChain] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [unlockedGems, setUnlockedGems] = useState(new Set());
  const [selectedGem, setSelectedGem] = useState(null);
  const [aiReport, setAiReport] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  async function fetchGems() {
    setLoading(true);
    try {
      const [trending, top] = await Promise.all([getTrendingTokens(), getTopBoostedTokens()]);
      const allTokens = [...(trending || []), ...(top || [])];
      const unique = [...new Map(allTokens.map(t => [t.tokenAddress, t])).values()];
      const searchPromises = unique.slice(0, 15).map(t => searchTokens(t.tokenAddress).catch(() => []));
      const results = await Promise.all(searchPromises);
      const pairs = results.flatMap(r => r).filter(p => p && p.priceUsd);
      const seen = new Set();
      const uniquePairs = pairs.filter(p => {
        const key = p.baseToken?.address;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      setGems(uniquePairs.map(formatPairData).filter(Boolean));
    } catch (err) {
      console.error("Failed to fetch gems:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchGems(); }, []);

  function unlockGem(gem) {
    if (balance < GEM_DETAIL_COST) { setShowModal(true); return; }
    const success = spendTokens(GEM_DETAIL_COST, `Gem details: ${gem.symbol}`);
    if (!success) { setShowModal(true); return; }
    setUnlockedGems(prev => new Set(prev).add(gem.address));
    openGemPopup(gem);
  }

  async function openGemPopup(gem) {
    setSelectedGem(gem);
    setAiReport(null);
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenData: gem }),
      });
      const data = await res.json();
      setAiReport(data.report);
    } catch (err) {
      console.error("AI report failed:", err);
    } finally {
      setAiLoading(false);
    }
  }

  const chains = useMemo(() => {
    const c = new Set(gems.map(g => g.chain));
    return ["all", ...c];
  }, [gems]);

  const sorted = useMemo(() => {
    let filtered = filterChain === "all" ? gems : gems.filter(g => g.chain === filterChain);
    return [...filtered].sort((a, b) => {
      if (sortBy === "alphaScore") return b.alphaScore - a.alphaScore;
      if (sortBy === "volume") return b.volume24h - a.volume24h;
      if (sortBy === "liquidity") return b.liquidity - a.liquidity;
      if (sortBy === "priceChange") return b.priceChange24h - a.priceChange24h;
      return 0;
    });
  }, [gems, sortBy, filterChain]);

  const marketStats = useMemo(() => {
    if (!gems.length) return null;
    const avgScore = gems.reduce((s, g) => s + g.alphaScore, 0) / gems.length;
    const totalVol = gems.reduce((s, g) => s + g.volume24h, 0);
    const avgChange = gems.reduce((s, g) => s + g.priceChange24h, 0) / gems.length;
    const highAlpha = gems.filter(g => g.alphaScore >= 8).length;
    return { avgScore, totalVol, avgChange, highAlpha };
  }, [gems]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Hidden Gem Scanner</h1>
          <p className="text-[#888] text-sm mt-1">Live trending tokens · Unlock deep insights for {GEM_DETAIL_COST} ASCP</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <select value={filterChain} onChange={e => setFilterChain(e.target.value)} className="px-3 py-2 rounded-xl bg-[#151515] border border-[#2A2A2A] text-white text-sm focus:outline-none cursor-pointer">
            {chains.map(c => <option key={c} value={c}>{c === "all" ? "All Chains" : getChainLabel(c)}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-3 py-2 rounded-xl bg-[#151515] border border-[#2A2A2A] text-white text-sm focus:outline-none cursor-pointer">
            <option value="alphaScore">Alpha Score</option>
            <option value="volume">Volume</option>
            <option value="liquidity">Liquidity</option>
            <option value="priceChange">24h Change</option>
          </select>
          <button onClick={fetchGems} disabled={loading} className="p-2 rounded-xl border border-[#2A2A2A] bg-[#151515] text-[#888] hover:text-white transition-colors">
            <RiRefreshLine className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Market Overview Strip */}
      {marketStats && !loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Gems Found", value: gems.length, icon: RiFireLine, color: "#F97316" },
            { label: "High Alpha (8+)", value: marketStats.highAlpha, icon: RiStarLine, color: "#22C55E" },
            { label: "Avg Score", value: marketStats.avgScore.toFixed(1), icon: RiShieldCheckLine, color: "#F5D90A" },
            { label: "Total Vol", value: formatCurrency(marketStats.totalVol), icon: RiBarChartBoxLine, color: "#3B82F6" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-3 rounded-xl border border-[#2A2A2A] bg-[#151515] flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${s.color}15` }}>
                <s.icon style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-[#888] text-[10px] uppercase tracking-wider">{s.label}</p>
                <p className="text-white font-bold text-sm">{s.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Loading / Empty / Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <RiLoader4Line className="text-[#F5D90A] text-3xl animate-spin mx-auto mb-3" />
            <p className="text-[#888] text-sm">Scanning for hidden gems...</p>
          </div>
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-16 text-[#888]">No gems found. Try refreshing or changing filters.</div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sorted.map((gem, i) => (
            <motion.div key={gem.address} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.04 }} className="p-4 rounded-2xl border border-[#2A2A2A] bg-[#151515] card-hover relative overflow-hidden group">
              {/* Glow for high alpha */}
              {gem.alphaScore >= 8 && <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#22C55E]/5 rounded-full blur-2xl pointer-events-none" />}

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {gem.imageUrl ? (
                    <img src={gem.imageUrl} alt="" className="w-9 h-9 rounded-full" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F5D90A]/20 to-[#F97316]/20 flex items-center justify-center text-xs font-bold text-[#F5D90A]">{gem.symbol?.slice(0, 2)}</div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-semibold text-sm truncate max-w-[120px]">{gem.name}</h3>
                      <span className="text-[#888] text-xs">{gem.symbol}</span>
                    </div>
                    <span className="text-[#888] text-[10px]">{getChainLabel(gem.chain)} · {gem.dex}</span>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${gem.alphaScore >= 8 ? "bg-[#22C55E]/10 text-[#22C55E]" : gem.alphaScore >= 6 ? "bg-[#F5D90A]/10 text-[#F5D90A]" : "bg-[#F97316]/10 text-[#F97316]"}`}>
                  <RiStarLine className="text-[10px]" /> {gem.alphaScore}
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-white font-bold text-lg">{gem.price}</span>
                  <span className={`ml-2 text-sm font-medium ${gem.positive ? "text-[#22C55E]" : "text-[#FF4444]"}`}>
                    {gem.positive ? "+" : ""}{gem.priceChange24h?.toFixed(1)}%
                  </span>
                </div>
                <div className="w-20 h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getSparkline(gem)}>
                      <Line type="monotone" dataKey="v" stroke={gem.positive ? "#22C55E" : "#FF4444"} strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 rounded-lg bg-[#0B0B0B]">
                  <span className="text-[#888] text-[10px] block">Vol 24h</span>
                  <span className="text-white text-xs font-medium">{formatCurrency(gem.volume24h)}</span>
                </div>
                <div className="text-center p-2 rounded-lg bg-[#0B0B0B]">
                  <span className="text-[#888] text-[10px] block">Liq</span>
                  <span className="text-white text-xs font-medium">{formatCurrency(gem.liquidity)}</span>
                </div>
                <div className="text-center p-2 rounded-lg bg-[#0B0B0B]">
                  <span className="text-[#888] text-[10px] block">FDV</span>
                  <span className="text-white text-xs font-medium">{formatCurrency(gem.fdv)}</span>
                </div>
              </div>

              {/* Buy/Sell mini bar */}
              <div className="mb-3">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-[#22C55E]">B: {gem.buys24h}</span>
                  <span className="text-[#FF4444]">S: {gem.sells24h}</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#2A2A2A] overflow-hidden flex">
                  <div className="h-full bg-[#22C55E] rounded-l-full" style={{ width: `${(gem.buys24h / Math.max(1, gem.buys24h + gem.sells24h)) * 100}%` }} />
                  <div className="h-full bg-[#FF4444] rounded-r-full flex-1" />
                </div>
              </div>

              {/* Unlock / View Details */}
              {!unlockedGems.has(gem.address) ? (
                <button onClick={() => unlockGem(gem)} className="w-full py-2.5 rounded-xl border border-[#2A2A2A] text-[#888] hover:text-[#F5D90A] hover:border-[#F5D90A]/30 transition-all text-sm flex items-center justify-center gap-2 group-hover:border-[#F5D90A]/20">
                  <RiLockLine /> Unlock Details · {GEM_DETAIL_COST} ASCP
                </button>
              ) : (
                <button onClick={() => openGemPopup(gem)} className="w-full py-2.5 rounded-xl bg-[#F5D90A]/10 border border-[#F5D90A]/20 text-[#F5D90A] hover:bg-[#F5D90A]/20 transition-all text-sm flex items-center justify-center gap-2 font-medium">
                  <RiSparklingLine /> View Full Report
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* ═══════ GEM DETAIL POPUP MODAL ═══════ */}
      <AnimatePresence>
        {selectedGem && (
          <GemDetailModal gem={selectedGem} aiReport={aiReport} aiLoading={aiLoading} onClose={() => { setSelectedGem(null); setAiReport(null); }} />
        )}
      </AnimatePresence>

      <InsufficientTokensModal isOpen={showModal} onClose={() => setShowModal(false)} required={GEM_DETAIL_COST} balance={balance} />
    </div>
  );
}
