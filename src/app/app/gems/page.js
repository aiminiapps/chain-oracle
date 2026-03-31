"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  RiStarLine, RiLoader4Line, RiLockLine,
  RiRefreshLine, RiSparklingLine,
  RiFireLine, RiShieldCheckLine, RiBarChartBoxLine,
  RiFilter3Line, RiArrowUpSLine, RiArrowDownSLine,
  RiEyeLine, RiCoinLine,
} from "react-icons/ri";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { useTokens } from "@/context/TokenContext";
import { getTrendingTokens, getTopBoostedTokens, searchTokens, formatPairData, formatCurrency, formatNumber, getChainLabel } from "@/lib/dexscreener";
import InsufficientTokensModal from "@/components/dashboard/InsufficientTokensModal";
import GemDetailModal from "@/components/dashboard/GemDetailModal";

const GEM_DETAIL_COST = 100;
const CARD = "rounded-2xl border border-dashed border-[#2A2A3A]/60 bg-[#0D0D14] relative overflow-hidden";
const CARD_INNER = "rounded-xl border border-[#1E1E2E] bg-[#0A0A0F]";

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

function ScoreBadge({ score }) {
  const cfg = score >= 8 ? { c: "#22C55E", bg: "rgba(34,197,94,0.08)", bc: "rgba(34,197,94,0.25)" }
    : score >= 6 ? { c: "#7C3AED", bg: "rgba(124,58,237,0.08)", bc: "rgba(124,58,237,0.25)" }
    : { c: "#F97316", bg: "rgba(249,115,22,0.08)", bc: "rgba(249,115,22,0.25)" };
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold border border-dashed"
      style={{ color: cfg.c, background: cfg.bg, borderColor: cfg.bc }}>
      <RiStarLine className="text-[9px]" />{score}
    </span>
  );
}

export default function GemsPage() {
  const { balance, spendTokens } = useTokens();
  const [gems, setGems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("alphaScore");
  const [filterChain, setFilterChain] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
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
      const uniquePairs = pairs.filter(p => { const k = p.baseToken?.address; if (seen.has(k)) return false; seen.add(k); return true; });
      setGems(uniquePairs.map(formatPairData).filter(Boolean));
    } catch (err) { console.error("Failed to fetch gems:", err); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchGems(); }, []);

  function unlockGem(gem) {
    if (balance < GEM_DETAIL_COST) { setShowModal(true); return; }
    const success = spendTokens(GEM_DETAIL_COST, `Prediction details: ${gem.symbol}`);
    if (!success) { setShowModal(true); return; }
    setUnlockedGems(prev => new Set(prev).add(gem.address));
    openGemPopup(gem);
  }

  async function openGemPopup(gem) {
    setSelectedGem(gem);
    setAiReport(null);
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/report", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tokenData: gem }) });
      const data = await res.json();
      setAiReport(data.report);
    } catch (err) { console.error("AI report failed:", err); }
    finally { setAiLoading(false); }
  }

  const chains = useMemo(() => ["all", ...new Set(gems.map(g => g.chain))], [gems]);

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

  const mStats = useMemo(() => {
    if (!gems.length) return null;
    return {
      avgScore: gems.reduce((s, g) => s + g.alphaScore, 0) / gems.length,
      totalVol: gems.reduce((s, g) => s + g.volume24h, 0),
      avgChange: gems.reduce((s, g) => s + g.priceChange24h, 0) / gems.length,
      highAlpha: gems.filter(g => g.alphaScore >= 8).length,
    };
  }, [gems]);

  return (
    <div className="space-y-5">
      {/* ═══ HEADER ═══ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center">
              <RiEyeLine className="text-[#9F67FF] text-sm" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Oracle Predictions</h1>
              <p className="text-[#555] text-xs">Unlock deep AI insights · {GEM_DETAIL_COST} CORA per report</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select value={filterChain} onChange={e => setFilterChain(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#0D0D14] border border-dashed border-[#2A2A3A]/60 text-white text-[11px] focus:outline-none cursor-pointer focus:border-[#7C3AED]/40 appearance-none">
            {chains.map(c => <option key={c} value={c}>{c === "all" ? "All Chains" : getChainLabel(c)}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#0D0D14] border border-dashed border-[#2A2A3A]/60 text-white text-[11px] focus:outline-none cursor-pointer focus:border-[#7C3AED]/40 appearance-none">
            <option value="alphaScore">Score ↓</option>
            <option value="volume">Volume ↓</option>
            <option value="liquidity">Liquidity ↓</option>
            <option value="priceChange">24h Change ↓</option>
          </select>
          <button onClick={fetchGems} disabled={loading}
            className="w-8 h-8 rounded-lg border border-dashed border-[#2A2A3A]/60 bg-[#0D0D14] text-[#8E8E9A] hover:text-white hover:border-[#7C3AED]/30 transition-all flex items-center justify-center">
            <RiRefreshLine className={`text-sm ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* ═══ STAT STRIP ═══ */}
      {mStats && !loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Signals Found", value: gems.length, icon: RiFireLine, color: "#F97316", sub: "live tokens" },
            { label: "High Score (8+)", value: mStats.highAlpha, icon: RiStarLine, color: "#22C55E", sub: "top picks" },
            { label: "Avg Score", value: mStats.avgScore.toFixed(1), icon: RiShieldCheckLine, color: "#7C3AED", sub: "/ 10" },
            { label: "Total Volume", value: formatCurrency(mStats.totalVol), icon: RiBarChartBoxLine, color: "#3B82F6", sub: `${mStats.avgChange >= 0 ? "+" : ""}${mStats.avgChange.toFixed(1)}% avg` },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className={`p-3.5 ${CARD}`}>
              <div className="absolute -top-6 -right-6 w-14 h-14 rounded-full blur-xl pointer-events-none" style={{ background: `${s.color}06` }} />
              <div className="flex items-center gap-2.5 relative z-10">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${s.color}10` }}>
                  <s.icon className="text-sm" style={{ color: s.color }} />
                </div>
                <div>
                  <p className="text-[#555] text-[10px] uppercase tracking-wider">{s.label}</p>
                  <div className="flex items-baseline gap-1.5">
                    <p className="text-white font-bold text-lg leading-tight">{s.value}</p>
                    <span className="text-[#555] text-[10px]">{s.sub}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ═══ LOADING ═══ */}
      {loading && (
        <div className={`flex items-center justify-center py-24 ${CARD}`}>
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#7C3AED]/8 flex items-center justify-center mx-auto mb-4">
              <RiLoader4Line className="text-[#9F67FF] text-xl animate-spin" />
            </div>
            <p className="text-[#8E8E9A] text-sm font-medium">Scanning predictions...</p>
            <p className="text-[#555] text-xs mt-1">Fetching boosted & trending tokens</p>
          </div>
        </div>
      )}

      {/* ═══ EMPTY STATE ═══ */}
      {!loading && sorted.length === 0 && (
        <div className={`flex items-center justify-center py-20 ${CARD}`}>
          <div className="text-center">
            <RiEyeLine className="text-[#555] text-2xl mx-auto mb-3" />
            <p className="text-[#8E8E9A] text-sm font-medium">No predictions found</p>
            <p className="text-[#555] text-xs mt-1">Try refreshing or changing filters</p>
          </div>
        </div>
      )}

      {/* ═══ GEM CARDS GRID ═══ */}
      {!loading && sorted.length > 0 && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sorted.map((gem, i) => {
            const buyPct = gem.buys24h + gem.sells24h > 0 ? Math.round((gem.buys24h / (gem.buys24h + gem.sells24h)) * 100) : 50;
            const isUnlocked = unlockedGems.has(gem.address);
            return (
              <motion.div key={gem.address} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.035 }}
                className={`group ${CARD} hover:border-[#2A2A3A] transition-all duration-300`}>
                {gem.alphaScore >= 8 && <div className="absolute -top-8 -right-8 w-20 h-20 bg-[#22C55E]/4 rounded-full blur-2xl pointer-events-none" />}

                {/* Header row */}
                <div className="p-4 pb-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      {gem.imageUrl
                        ? <img src={gem.imageUrl} alt="" className="w-9 h-9 rounded-full ring-1 ring-[#1E1E2E]" />
                        : <div className="w-9 h-9 rounded-full bg-[#7C3AED]/8 ring-1 ring-[#1E1E2E] flex items-center justify-center text-xs font-bold text-[#9F67FF]">{gem.symbol?.slice(0, 2)}</div>
                      }
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-white font-semibold text-sm truncate max-w-[110px]">{gem.name}</h3>
                          <span className="text-[#555] text-[10px]">{gem.symbol}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] px-1.5 py-0.5 rounded border border-dashed border-[#1E1E2E] text-[#555] font-medium">{getChainLabel(gem.chain)}</span>
                          <span className="text-[#555] text-[10px]">{gem.dex}</span>
                        </div>
                      </div>
                    </div>
                    <ScoreBadge score={gem.alphaScore} />
                  </div>

                  {/* Price + Sparkline */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-white font-bold text-xl">{gem.price}</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className={`flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md ${gem.positive ? "bg-[#22C55E]/8 text-[#22C55E]" : "bg-[#FF4444]/8 text-[#FF4444]"}`}>
                          {gem.positive ? <RiArrowUpSLine className="text-xs" /> : <RiArrowDownSLine className="text-xs" />}
                          {gem.positive ? "+" : ""}{gem.priceChange24h?.toFixed(1)}%
                        </span>
                        <span className="text-[#555] text-[10px]">24h</span>
                      </div>
                    </div>
                    <div className="w-24 h-10">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={getSparkline(gem)}>
                          <Line type="monotone" dataKey="v" stroke={gem.positive ? "#22C55E" : "#FF4444"} strokeWidth={1.5} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Metrics strip — dashed separator */}
                <div className="border-t border-dashed border-[#1E1E2E] mx-4" />
                <div className="grid grid-cols-3 gap-px p-4 pt-3">
                  {[
                    { label: "Vol 24h", value: formatCurrency(gem.volume24h) },
                    { label: "Liquidity", value: formatCurrency(gem.liquidity) },
                    { label: "FDV", value: formatCurrency(gem.fdv) },
                  ].map(m => (
                    <div key={m.label} className={`text-center p-2 ${CARD_INNER}`}>
                      <span className="text-[#555] text-[9px] uppercase tracking-wider block mb-0.5">{m.label}</span>
                      <span className="text-white text-xs font-semibold">{m.value}</span>
                    </div>
                  ))}
                </div>

                {/* Buy/Sell pressure */}
                <div className="px-4 pb-3">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-[#22C55E] font-medium">Buys {buyPct}%</span>
                    <span className="text-[#FF4444] font-medium">Sells {100 - buyPct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#1E1E2E] overflow-hidden flex">
                    <div className="h-full bg-[#22C55E] rounded-l-full transition-all" style={{ width: `${buyPct}%` }} />
                    <div className="h-full bg-[#FF4444] rounded-r-full flex-1" />
                  </div>
                </div>

                {/* Action — dashed separator */}
                <div className="border-t border-dashed border-[#1E1E2E] mx-4" />
                <div className="p-4 pt-3">
                  {!isUnlocked ? (
                    <button onClick={() => unlockGem(gem)}
                      className="w-full py-2.5 rounded-xl border border-dashed border-[#2A2A3A]/60 text-[#8E8E9A] hover:text-[#9F67FF] hover:border-[#7C3AED]/30 transition-all text-sm flex items-center justify-center gap-2 group-hover:border-[#7C3AED]/20 bg-[#0A0A0F]">
                      <RiLockLine className="text-xs" /> Unlock · {GEM_DETAIL_COST} CORA
                    </button>
                  ) : (
                    <button onClick={() => openGemPopup(gem)} className="btn-3d btn-3d-sm w-full py-2.5 flex items-center justify-center gap-2 text-sm">
                      <RiSparklingLine /> View Full Report
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {selectedGem && (
          <GemDetailModal gem={selectedGem} aiReport={aiReport} aiLoading={aiLoading} onClose={() => { setSelectedGem(null); setAiReport(null); }} />
        )}
      </AnimatePresence>
      <InsufficientTokensModal isOpen={showModal} onClose={() => setShowModal(false)} required={GEM_DETAIL_COST} balance={balance} />
    </div>
  );
}
