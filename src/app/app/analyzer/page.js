"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  RiSearchLine, RiShieldCheckLine, RiAlertLine,
  RiLockLine, RiSparklingLine, RiArrowRightUpLine,
  RiArrowRightDownLine, RiExternalLinkLine, RiCoinLine,
  RiLoader4Line, RiStarLine, RiFireLine, RiTimeLine,
  RiHistoryLine, RiCloseLine, RiLightbulbLine,
  RiBarChartBoxLine, RiPulseLine,
} from "react-icons/ri";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { useTokens } from "@/context/TokenContext";
import { searchTokens, getTrendingTokens, formatPairData, formatCurrency, formatNumber, getChainLabel, timeAgo } from "@/lib/dexscreener";
import InsufficientTokensModal from "@/components/dashboard/InsufficientTokensModal";

const AI_REPORT_COST = 200;
const RISK_COLORS = { LOW: "#22C55E", MEDIUM: "#F5D90A", HIGH: "#F97316", CRITICAL: "#FF4444" };
const REC_COLORS = { STRONG_BUY: "#22C55E", BUY: "#22C55E", HOLD: "#F5D90A", CAUTION: "#F97316", AVOID: "#FF4444" };

/* ─── Markdown renderer ─── */
function renderInline(text) {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={i} className="text-[#DDD] italic">{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={i} className="px-1.5 py-0.5 rounded bg-[#2A2A2A] text-[#F5D90A] text-xs font-mono">{part.slice(1, -1)}</code>;
    return part;
  });
}

function MarkdownBlock({ text }) {
  if (!text) return null;
  return (
    <div>
      {text.split("\n").map((line, i) => {
        if (line.startsWith("### ")) return <h4 key={i} className="text-white font-semibold text-sm mt-3 mb-1">{line.slice(4)}</h4>;
        if (line.startsWith("## ")) return <h3 key={i} className="text-white font-bold text-base mt-4 mb-1">{line.slice(3)}</h3>;
        if (line.startsWith("- ") || line.startsWith("* ")) return <li key={i} className="text-[#CCC] text-sm ml-4 list-disc">{renderInline(line.slice(2))}</li>;
        if (line.trim() === "") return <div key={i} className="h-2" />;
        return <p key={i} className="text-[#CCC] text-sm leading-relaxed mb-1">{renderInline(line)}</p>;
      })}
    </div>
  );
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1E1E1E]/95 backdrop-blur-xl border border-[#2A2A2A] rounded-xl p-2 shadow-2xl">
      {payload.map((e, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ background: e.color || e.stroke }} />
          <span className="text-[#888]">{e.name}:</span>
          <span className="text-white font-medium">{typeof e.value === "number" ? `$${e.value < 0.01 ? e.value.toExponential(2) : e.value.toFixed(e.value < 1 ? 6 : 2)}` : e.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════ */
export default function AnalyzerPage() {
  const { balance, spendTokens, cacheAnalysis, getCachedAnalysis } = useTokens();
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [aiReport, setAiReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reportUnlocked, setReportUnlocked] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const [recentSearches, setRecentSearches] = useState([]);

  /* ─── Load suggestions from trending tokens ─── */
  useEffect(() => {
    async function loadSuggestions() {
      try {
        const boosts = await getTrendingTokens();
        const uniqueAddrs = [...new Set(boosts.slice(0, 8).map(b => b.tokenAddress))];
        const results = await Promise.all(uniqueAddrs.slice(0, 5).map(a => searchTokens(a).catch(() => [])));
        const pairs = results.flatMap(r => r).filter(p => p && p.priceUsd);
        const seen = new Set();
        const unique = pairs.filter(p => { const k = p.baseToken?.address; if (seen.has(k)) return false; seen.add(k); return true; });
        setSuggestions(unique.slice(0, 6).map(formatPairData).filter(Boolean));
      } catch (err) { console.error("Suggestions failed:", err); }
      finally { setSuggestionsLoading(false); }
    }
    loadSuggestions();
    // Load recent searches from localStorage
    try {
      const stored = localStorage.getItem("ascp_recent_searches");
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch {}
  }, []);

  function saveRecentSearch(token) {
    const updated = [{ name: token.name, symbol: token.symbol, address: token.address, chain: token.chain, imageUrl: token.imageUrl }, ...recentSearches.filter(r => r.address !== token.address)].slice(0, 5);
    setRecentSearches(updated);
    try { localStorage.setItem("ascp_recent_searches", JSON.stringify(updated)); } catch {}
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setSelectedToken(null);
    setAiReport(null);
    setReportUnlocked(false);
    try {
      const pairs = await searchTokens(query.trim());
      const formatted = pairs.slice(0, 10).map(formatPairData).filter(Boolean);
      setSearchResults(formatted);
    } catch (err) {
      console.error("Search failed:", err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }

  function selectToken(token) {
    setSelectedToken(token);
    setAiReport(null);
    setReportUnlocked(false);
    setSearchResults([]);
    saveRecentSearch(token);
    const cached = getCachedAnalysis(token.address);
    if (cached?.report) {
      setAiReport(cached.report);
      setReportUnlocked(true);
    }
  }

  async function quickAnalyze(addr) {
    setQuery(addr);
    setSearching(true);
    setSelectedToken(null);
    setAiReport(null);
    setReportUnlocked(false);
    setSearchResults([]);
    try {
      const pairs = await searchTokens(addr);
      const formatted = pairs.slice(0, 1).map(formatPairData).filter(Boolean);
      if (formatted.length > 0) { selectToken(formatted[0]); }
      else { setSearchResults(pairs.slice(0, 10).map(formatPairData).filter(Boolean)); }
    } catch (err) { console.error("Quick analyze failed:", err); }
    finally { setSearching(false); }
  }

  async function unlockReport() {
    if (balance < AI_REPORT_COST) { setShowModal(true); return; }
    const success = spendTokens(AI_REPORT_COST, `AI Report: ${selectedToken.symbol}`);
    if (!success) { setShowModal(true); return; }
    setReportLoading(true);
    setReportUnlocked(true);
    try {
      const res = await fetch("/api/ai/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenData: selectedToken }),
      });
      const data = await res.json();
      setAiReport(data.report);
      cacheAnalysis(selectedToken.address, { ...selectedToken, report: data.report });
    } catch (err) { console.error("AI report failed:", err); }
    finally { setReportLoading(false); }
  }

  /* ─── Derived chart data ─── */
  const radarData = selectedToken ? [
    { metric: "Liquidity", value: Math.min(10, (selectedToken.liquidity / 500000) * 10) },
    { metric: "Volume", value: Math.min(10, (selectedToken.volume24h / 1000000) * 10) },
    { metric: "Txns", value: Math.min(10, ((selectedToken.buys24h + selectedToken.sells24h) / 500) * 10) },
    { metric: "Momentum", value: Math.min(10, Math.max(0, (selectedToken.priceChange24h + 50) / 10)) },
    { metric: "Buy Power", value: selectedToken.buys24h + selectedToken.sells24h > 0 ? (selectedToken.buys24h / (selectedToken.buys24h + selectedToken.sells24h)) * 10 : 5 },
    { metric: "Alpha", value: selectedToken.alphaScore },
  ] : [];

  const pieData = selectedToken ? [
    { name: "Buys", value: selectedToken.buys24h || 1 },
    { name: "Sells", value: selectedToken.sells24h || 1 },
  ] : [];

  const priceHistory = selectedToken ? [
    { t: "-24h", p: selectedToken.priceRaw * (1 - (selectedToken.priceChange24h || 0) / 100) },
    { t: "-6h", p: selectedToken.priceRaw * (1 - (selectedToken.priceChange6h || 0) / 100) },
    { t: "-1h", p: selectedToken.priceRaw * (1 - (selectedToken.priceChange1h || 0) / 100) },
    { t: "-5m", p: selectedToken.priceRaw * (1 - (selectedToken.priceChange5m || 0) / 100) },
    { t: "Now", p: selectedToken.priceRaw },
  ] : [];

  const smartInsights = useMemo(() => {
    if (!selectedToken) return [];
    const t = selectedToken;
    const insights = [];
    const buyRatio = t.buys24h + t.sells24h > 0 ? t.buys24h / (t.buys24h + t.sells24h) : 0.5;
    const volLiq = t.liquidity > 0 ? t.volume24h / t.liquidity : 0;

    if (t.alphaScore >= 8) insights.push({ type: "positive", text: `High Alpha Score (${t.alphaScore}/10) — strong multi-factor signal` });
    else if (t.alphaScore <= 4) insights.push({ type: "negative", text: `Low Alpha Score (${t.alphaScore}/10) — elevated risk factors` });

    if (buyRatio > 0.65) insights.push({ type: "positive", text: `Strong buy pressure at ${(buyRatio * 100).toFixed(0)}% — bullish sentiment` });
    else if (buyRatio < 0.35) insights.push({ type: "negative", text: `Heavy sell pressure at ${((1 - buyRatio) * 100).toFixed(0)}% — bearish signal` });

    if (volLiq > 3) insights.push({ type: "warning", text: `Volume ${volLiq.toFixed(1)}x liquidity — potential wash trading or extreme interest` });
    else if (volLiq > 1) insights.push({ type: "positive", text: `Healthy volume-to-liquidity ratio (${volLiq.toFixed(1)}x)` });
    else if (volLiq < 0.1) insights.push({ type: "negative", text: `Very low trading activity (Vol/Liq: ${volLiq.toFixed(2)}x)` });

    if (t.liquidity < 50000) insights.push({ type: "negative", text: `Critical liquidity (${formatCurrency(t.liquidity)}) — high slippage risk` });
    else if (t.liquidity > 1000000) insights.push({ type: "positive", text: `Deep liquidity pool (${formatCurrency(t.liquidity)}) — low slippage` });

    if (t.priceChange24h > 100) insights.push({ type: "warning", text: `Massive 24h pump (+${t.priceChange24h.toFixed(0)}%) — potential correction risk` });
    else if (t.priceChange24h > 20) insights.push({ type: "positive", text: `Strong upward momentum (+${t.priceChange24h.toFixed(1)}% in 24h)` });
    else if (t.priceChange24h < -30) insights.push({ type: "negative", text: `Significant dump (${t.priceChange24h.toFixed(1)}% in 24h) — potential capitulation` });

    if (t.priceChange1h > 0 && t.priceChange24h < 0) insights.push({ type: "info", text: "Short-term recovery pattern — 1h positive despite 24h negative" });
    if (t.priceChange1h < -5 && t.priceChange24h > 10) insights.push({ type: "warning", text: "Short-term weakness — 1h dip despite 24h gain, possible reversal" });

    return insights.slice(0, 6);
  }, [selectedToken]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Token Analyzer</h1>
        <p className="text-[#888] text-sm mt-1">Deep-dive analytics with AI insights · Report costs {AI_REPORT_COST} ASCP</p>
      </div>

      {/* ─── Search ─── */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888]" />
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by token name, symbol, or contract address..." className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#151515] border border-[#2A2A2A] text-white placeholder:text-[#666] focus:border-[#F5D90A]/50 focus:outline-none transition-colors" />
        </div>
        <button type="submit" disabled={searching} className="px-6 py-3 rounded-xl bg-[#F5D90A] text-[#0B0B0B] font-semibold hover:bg-[#F5D90A]/90 transition-colors disabled:opacity-50 flex items-center gap-2 shrink-0">
          {searching && <RiLoader4Line className="animate-spin" />}
          Analyze
        </button>
      </form>

      {/* ─── Search Results ─── */}
      <AnimatePresence>
        {searchResults.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-2xl border border-[#2A2A2A] bg-[#151515] overflow-hidden">
            <p className="text-[#888] text-xs px-4 pt-3 pb-1">Found {searchResults.length} results — select one to analyze</p>
            {searchResults.map((token, i) => (
              <button key={i} onClick={() => selectToken(token)} className="w-full flex items-center gap-4 px-4 py-3 hover:bg-[#1E1E1E] transition-colors text-left border-b border-[#2A2A2A]/50 last:border-b-0">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {token.imageUrl ? <img src={token.imageUrl} alt="" className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F5D90A]/20 to-[#F97316]/20 flex items-center justify-center text-xs font-bold text-[#F5D90A]">{token.symbol?.slice(0, 2)}</div>}
                  <div className="min-w-0">
                    <span className="text-white font-medium text-sm block truncate">{token.name}</span>
                    <span className="text-[#888] text-xs">{token.symbol} · {getChainLabel(token.chain)} · {token.dex}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-white text-sm font-medium block">{token.price}</span>
                  <span className={`text-xs ${token.positive ? "text-[#22C55E]" : "text-[#FF4444]"}`}>
                    {token.positive ? "+" : ""}{token.priceChange24h?.toFixed(1)}%
                  </span>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Pre-analysis: Suggestions + Recent ═══ */}
      {!selectedToken && !searching && searchResults.length === 0 && (
        <div className="space-y-6">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-2xl border border-[#2A2A2A] bg-[#151515]">
              <div className="flex items-center gap-2 mb-3">
                <RiHistoryLine className="text-[#888]" />
                <h3 className="text-white font-semibold text-sm">Recent Searches</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map(r => (
                  <button key={r.address} onClick={() => quickAnalyze(r.address)} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0B0B0B] border border-[#2A2A2A] hover:border-[#F5D90A]/30 transition-colors group">
                    {r.imageUrl ? <img src={r.imageUrl} alt="" className="w-5 h-5 rounded-full" /> : <div className="w-5 h-5 rounded-full bg-[#F5D90A]/10 flex items-center justify-center text-[8px] font-bold text-[#F5D90A]">{r.symbol?.slice(0, 2)}</div>}
                    <span className="text-[#888] text-xs font-medium group-hover:text-white transition-colors">{r.symbol}</span>
                    <span className="text-[#555] text-[10px]">{getChainLabel(r.chain)}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Trending Suggestions */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-5 rounded-2xl border border-[#2A2A2A] bg-[#151515]">
            <div className="flex items-center gap-2 mb-4">
              <RiFireLine className="text-[#F97316]" />
              <h3 className="text-white font-semibold text-sm">Trending — Quick Analyze</h3>
              <span className="text-[#555] text-xs ml-auto">Tap to analyze instantly</span>
            </div>
            {suggestionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <RiLoader4Line className="text-[#F5D90A] animate-spin text-xl" />
              </div>
            ) : suggestions.length === 0 ? (
              <p className="text-[#888] text-xs text-center py-4">No suggestions available</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {suggestions.map(s => (
                  <button key={s.address} onClick={() => quickAnalyze(s.address)} className="flex items-center gap-3 p-3 rounded-xl bg-[#0B0B0B] border border-[#2A2A2A] hover:border-[#F5D90A]/30 transition-all text-left group">
                    {s.imageUrl ? <img src={s.imageUrl} alt="" className="w-9 h-9 rounded-full shrink-0" /> : <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F5D90A]/20 to-[#F97316]/20 flex items-center justify-center text-xs font-bold text-[#F5D90A] shrink-0">{s.symbol?.slice(0, 2)}</div>}
                    <div className="flex-1 min-w-0">
                      <span className="text-white text-sm font-medium block truncate group-hover:text-[#F5D90A] transition-colors">{s.name}</span>
                      <span className="text-[#888] text-[10px]">{s.symbol} · {getChainLabel(s.chain)}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-white text-xs font-medium block">{s.price}</span>
                      <span className={`text-[10px] font-medium ${s.positive ? "text-[#22C55E]" : "text-[#FF4444]"}`}>
                        {s.positive ? "+" : ""}{s.priceChange24h?.toFixed(1)}%
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Tips Card */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-5 rounded-2xl border border-[#2A2A2A] bg-[#151515] relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#3B82F6]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-3 relative z-10">
              <RiLightbulbLine className="text-[#F5D90A]" />
              <h3 className="text-white font-semibold text-sm">Pro Tips</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 relative z-10">
              {[
                { tip: "Paste a contract address for the most accurate results", icon: "📋" },
                { tip: "Look for tokens with Alpha Score 7+ for better opportunities", icon: "⭐" },
                { tip: "Compare Vol/Liq ratio — healthy is 0.5x-2x", icon: "📊" },
                { tip: "Check buy pressure above 55% for bullish momentum", icon: "📈" },
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-[#0B0B0B]/50">
                  <span className="text-sm shrink-0">{t.icon}</span>
                  <span className="text-[#888] text-xs leading-relaxed">{t.tip}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* ═══ Token Analysis ═══ */}
      {selectedToken && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          {/* ─── Header ─── */}
          <div className="p-5 rounded-2xl border border-[#2A2A2A] bg-[#151515] relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#F5D90A]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-wrap items-center gap-4 relative z-10">
              {selectedToken.imageUrl ? <img src={selectedToken.imageUrl} alt="" className="w-14 h-14 rounded-2xl" /> : <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F5D90A]/20 to-[#F97316]/20 flex items-center justify-center font-bold text-[#F5D90A] text-lg">{selectedToken.symbol?.slice(0, 2)}</div>}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-white font-bold text-xl">{selectedToken.name}</h2>
                  <span className="text-[#888] text-sm">{selectedToken.symbol}</span>
                  <span className="px-2 py-0.5 rounded-lg bg-[#1E1E1E] text-[#888] text-[10px] font-medium">{getChainLabel(selectedToken.chain)}</span>
                  <span className="px-2 py-0.5 rounded-lg bg-[#1E1E1E] text-[#888] text-[10px] font-medium">{selectedToken.dex}</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-white text-2xl font-bold">{selectedToken.price}</span>
                  <span className={`flex items-center gap-1 text-sm font-medium ${selectedToken.positive ? "text-[#22C55E]" : "text-[#FF4444]"}`}>
                    {selectedToken.positive ? <RiArrowRightUpLine /> : <RiArrowRightDownLine />}
                    {selectedToken.positive ? "+" : ""}{selectedToken.priceChange24h?.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-bold ${selectedToken.alphaScore >= 8 ? "bg-[#22C55E]/10 text-[#22C55E]" : selectedToken.alphaScore >= 6 ? "bg-[#F5D90A]/10 text-[#F5D90A]" : "bg-[#F97316]/10 text-[#F97316]"}`}>
                  <RiStarLine /> {selectedToken.alphaScore}/10
                </div>
                {selectedToken.url && (
                  <a href={selectedToken.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl border border-[#2A2A2A] text-[#888] hover:text-white transition-colors">
                    <RiExternalLinkLine />
                  </a>
                )}
                <button onClick={() => { setSelectedToken(null); setAiReport(null); setReportUnlocked(false); }} className="p-2 rounded-xl border border-[#2A2A2A] text-[#888] hover:text-white transition-colors">
                  <RiCloseLine />
                </button>
              </div>
            </div>
          </div>

          {/* ─── Key Metrics ─── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Volume 24h", value: formatCurrency(selectedToken.volume24h) },
              { label: "Liquidity", value: formatCurrency(selectedToken.liquidity) },
              { label: "FDV", value: formatCurrency(selectedToken.fdv) },
              { label: "Market Cap", value: formatCurrency(selectedToken.marketCap) },
              { label: "24h Buys", value: formatNumber(selectedToken.buys24h), color: "#22C55E" },
              { label: "24h Sells", value: formatNumber(selectedToken.sells24h), color: "#FF4444" },
              { label: "1h Change", value: `${selectedToken.priceChange1h >= 0 ? "+" : ""}${selectedToken.priceChange1h?.toFixed(1)}%`, color: selectedToken.priceChange1h >= 0 ? "#22C55E" : "#FF4444" },
              { label: "Pair Age", value: timeAgo(selectedToken.pairCreatedAt) },
            ].map(m => (
              <div key={m.label} className="p-4 rounded-xl bg-[#151515] border border-[#2A2A2A]">
                <span className="text-[#888] text-xs block mb-1">{m.label}</span>
                <span className="text-white font-semibold text-sm" style={m.color ? { color: m.color } : undefined}>{m.value}</span>
              </div>
            ))}
          </div>

          {/* ─── Smart Insights ─── */}
          {smartInsights.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-2xl border border-[#2A2A2A] bg-[#151515]">
              <div className="flex items-center gap-2 mb-3">
                <RiLightbulbLine className="text-[#F5D90A]" />
                <h3 className="text-white font-semibold">Smart Insights</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {smartInsights.map((insight, i) => (
                  <div key={i} className={`flex items-start gap-2 p-3 rounded-xl border ${
                    insight.type === "positive" ? "border-[#22C55E]/20 bg-[#22C55E]/5" :
                    insight.type === "negative" ? "border-[#FF4444]/20 bg-[#FF4444]/5" :
                    insight.type === "warning" ? "border-[#F97316]/20 bg-[#F97316]/5" :
                    "border-[#3B82F6]/20 bg-[#3B82F6]/5"
                  }`}>
                    <span className="text-sm mt-0.5 shrink-0">{
                      insight.type === "positive" ? "✅" : insight.type === "negative" ? "🔴" : insight.type === "warning" ? "⚠️" : "ℹ️"
                    }</span>
                    <span className="text-[#CCC] text-xs leading-relaxed">{insight.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── Price Trend Chart ─── */}
          <div className="p-5 rounded-2xl border border-[#2A2A2A] bg-[#151515]">
            <h3 className="text-white font-semibold mb-3">Price Trend</h3>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceHistory}>
                  <defs>
                    <linearGradient id="analyzerPriceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={selectedToken.positive ? "#22C55E" : "#FF4444"} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={selectedToken.positive ? "#22C55E" : "#FF4444"} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
                  <XAxis dataKey="t" tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} domain={["auto", "auto"]} tickFormatter={v => `$${v < 0.01 ? v.toExponential(1) : v.toFixed(v < 1 ? 4 : 2)}`} />
                  <Area type="monotone" dataKey="p" name="Price" stroke={selectedToken.positive ? "#22C55E" : "#FF4444"} fill="url(#analyzerPriceGrad)" strokeWidth={2} />
                  <Tooltip content={<ChartTooltip />} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ─── Charts Row ─── */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl border border-[#2A2A2A] bg-[#151515]">
              <h3 className="text-white font-semibold mb-3">Risk / Strength Radar</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#2A2A2A" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: "#888", fontSize: 11 }} />
                  <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
                  <Radar name="Token" dataKey="value" stroke="#F5D90A" fill="#F5D90A" fillOpacity={0.15} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-5 rounded-2xl border border-[#2A2A2A] bg-[#151515]">
              <h3 className="text-white font-semibold mb-3">Buy / Sell Pressure (24h)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} strokeWidth={0}>
                    <Cell fill="#22C55E" />
                    <Cell fill="#FF4444" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 -mt-2">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#22C55E]" /><span className="text-[#888] text-xs">Buys ({formatNumber(selectedToken.buys24h)})</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#FF4444]" /><span className="text-[#888] text-xs">Sells ({formatNumber(selectedToken.sells24h)})</span></div>
              </div>
            </div>
          </div>

          {/* ─── Premium AI Report ─── */}
          <div className="p-5 rounded-2xl border border-[#2A2A2A] bg-[#151515] relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#F5D90A]/5 rounded-full blur-3xl pointer-events-none" />
            {!reportUnlocked ? (
              <div className="text-center py-10 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-[#F5D90A]/10 flex items-center justify-center mx-auto mb-4">
                  <RiLockLine className="text-[#F5D90A] text-2xl" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Unlock AI Research Report</h3>
                <p className="text-[#888] text-sm mb-1 max-w-md mx-auto">Get an AI-generated deep analysis including risk assessment, narrative analysis, buy/sell signals, and actionable recommendations.</p>
                <p className="text-[#F5D90A] text-sm font-semibold mb-6">Cost: {AI_REPORT_COST} ASCP (Balance: {balance})</p>
                <button onClick={unlockReport} className="px-8 py-3 rounded-xl bg-[#F5D90A] text-[#0B0B0B] font-bold hover:bg-[#F5D90A]/90 transition-colors inline-flex items-center gap-2">
                  <RiSparklingLine /> Unlock Report
                </button>
              </div>
            ) : reportLoading ? (
              <div className="text-center py-16">
                <RiLoader4Line className="text-[#F5D90A] text-3xl animate-spin mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Analyzing {selectedToken.symbol}...</h3>
                <p className="text-[#888] text-sm">AI is processing on-chain data and generating insights</p>
              </div>
            ) : aiReport ? (
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <RiSparklingLine className="text-[#F5D90A]" />
                  <h3 className="text-white font-bold text-lg">AI Research Report</h3>
                </div>

                {/* Summary */}
                <div className="p-4 rounded-xl bg-[#1E1E1E] border border-[#2A2A2A]">
                  <h4 className="text-white text-sm font-semibold mb-2">Executive Summary</h4>
                  <MarkdownBlock text={aiReport.summary} />
                </div>

                {/* Risk + Rec */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#1E1E1E] border border-[#2A2A2A]">
                    <span className="text-[#888] text-xs block mb-2">Risk Level</span>
                    <div className="flex items-center gap-2">
                      <RiShieldCheckLine style={{ color: RISK_COLORS[aiReport.riskLevel] || "#888" }} />
                      <span className="text-white font-bold" style={{ color: RISK_COLORS[aiReport.riskLevel] }}>{aiReport.riskLevel}</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#1E1E1E] border border-[#2A2A2A]">
                    <span className="text-[#888] text-xs block mb-2">Recommendation</span>
                    <span className="text-white font-bold text-sm" style={{ color: REC_COLORS[aiReport.recommendation?.split(" ")[0]] || "#888" }}>
                      {aiReport.recommendation?.split(" — ")[0] || aiReport.recommendation}
                    </span>
                  </div>
                </div>

                {/* Narrative */}
                {aiReport.narrative && (
                  <div className="p-4 rounded-xl bg-[#1E1E1E] border border-[#2A2A2A]">
                    <h4 className="text-white text-sm font-semibold mb-2">Narrative Analysis</h4>
                    <MarkdownBlock text={aiReport.narrative} />
                  </div>
                )}

                {/* Strengths & Risks */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#1E1E1E] border border-[#2A2A2A]">
                    <h4 className="text-[#22C55E] text-sm font-semibold mb-3">Strengths</h4>
                    <ul className="space-y-2">
                      {aiReport.strengths?.map((s, i) => (
                        <li key={i} className="text-[#CCC] text-sm flex items-start gap-2"><span className="text-[#22C55E] mt-1 text-xs">●</span> {s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-[#1E1E1E] border border-[#2A2A2A]">
                    <h4 className="text-[#FF4444] text-sm font-semibold mb-3">Risks</h4>
                    <ul className="space-y-2">
                      {aiReport.risks?.map((r, i) => (
                        <li key={i} className="text-[#CCC] text-sm flex items-start gap-2"><span className="text-[#FF4444] mt-1 text-xs">●</span> {r}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Deep Analysis */}
                {[
                  { title: "Liquidity Analysis", content: aiReport.liquidityAnalysis },
                  { title: "Volume Analysis", content: aiReport.volumeAnalysis },
                  { title: "Buy Pressure Analysis", content: aiReport.buyPressureAnalysis },
                  { title: "Price Action", content: aiReport.priceAction },
                ].filter(s => s.content).map(section => (
                  <div key={section.title} className="p-4 rounded-xl bg-[#1E1E1E] border border-[#2A2A2A]">
                    <h4 className="text-white text-sm font-semibold mb-2">{section.title}</h4>
                    <MarkdownBlock text={section.content} />
                  </div>
                ))}

                {/* Key Insights */}
                {aiReport.keyInsights && (
                  <div className="p-4 rounded-xl bg-[#1E1E1E] border border-[#2A2A2A]">
                    <h4 className="text-[#F5D90A] text-sm font-semibold mb-3">Key Insights</h4>
                    <ul className="space-y-2">
                      {aiReport.keyInsights.map((insight, i) => (
                        <li key={i} className="text-[#CCC] text-sm flex items-start gap-2"><span className="text-[#F5D90A] mt-1 text-xs">★</span> {insight}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Detailed Recommendation */}
                {aiReport.recommendation?.includes(" — ") && (
                  <div className="p-4 rounded-xl bg-[#F5D90A]/5 border border-[#F5D90A]/20">
                    <h4 className="text-[#F5D90A] text-sm font-semibold mb-2">Detailed Recommendation</h4>
                    <MarkdownBlock text={aiReport.recommendation} />
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </motion.div>
      )}

      <InsufficientTokensModal isOpen={showModal} onClose={() => setShowModal(false)} required={AI_REPORT_COST} balance={balance} />
    </div>
  );
}
