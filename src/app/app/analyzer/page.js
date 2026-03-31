"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  RiSearchLine, RiShieldCheckLine, RiAlertLine,
  RiLockLine, RiSparklingLine, RiArrowUpSLine, RiArrowDownSLine,
  RiExternalLinkLine, RiCoinLine,
  RiLoader4Line, RiStarLine, RiFireLine,
  RiHistoryLine, RiCloseLine, RiLightbulbLine,
  RiBarChartBoxLine, RiPulseLine, RiSearchEyeLine,
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
const CARD = "rounded-2xl border border-dashed border-[#2A2A3A]/60 bg-[#0D0D14] relative overflow-hidden";
const CARD_INNER = "rounded-xl border border-[#1E1E2E] bg-[#0A0A0F]";
const RISK_COLORS = { LOW: "#22C55E", MEDIUM: "#7C3AED", HIGH: "#F97316", CRITICAL: "#FF4444" };
const REC_COLORS = { STRONG_BUY: "#22C55E", BUY: "#22C55E", HOLD: "#7C3AED", CAUTION: "#F97316", AVOID: "#FF4444" };

function renderInline(text) {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={i} className="text-[#CCC] italic">{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={i} className="px-1.5 py-0.5 rounded bg-[#1E1E2E] text-[#9F67FF] text-xs font-mono">{part.slice(1, -1)}</code>;
    return part;
  });
}
function MarkdownBlock({ text }) {
  if (!text) return null;
  return (<div>{text.split("\n").map((line, i) => {
    if (line.startsWith("### ")) return <h4 key={i} className="text-white font-semibold text-sm mt-3 mb-1">{line.slice(4)}</h4>;
    if (line.startsWith("## ")) return <h3 key={i} className="text-white font-bold text-base mt-4 mb-1">{line.slice(3)}</h3>;
    if (line.startsWith("- ") || line.startsWith("* ")) return <li key={i} className="text-[#8E8E9A] text-sm ml-4 list-disc">{renderInline(line.slice(2))}</li>;
    if (line.trim() === "") return <div key={i} className="h-2" />;
    return <p key={i} className="text-[#8E8E9A] text-sm leading-relaxed mb-1">{renderInline(line)}</p>;
  })}</div>);
}
function ChartTip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (<div className="bg-[#0D0D14]/95 backdrop-blur-xl border border-dashed border-[#2A2A3A] rounded-lg p-2 shadow-2xl">
    {payload.map((e, i) => (<div key={i} className="flex items-center gap-2 text-[11px]"><span className="w-1.5 h-1.5 rounded-full" style={{ background: e.color || e.stroke }} /><span className="text-[#555]">{e.name}:</span><span className="text-white font-medium">{typeof e.value === "number" ? `$${e.value < 0.01 ? e.value.toExponential(2) : e.value.toFixed(e.value < 1 ? 6 : 2)}` : e.value}</span></div>))}
  </div>);
}

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

  useEffect(() => {
    (async () => {
      try {
        const boosts = await getTrendingTokens();
        const addrs = [...new Set(boosts.slice(0, 8).map(b => b.tokenAddress))];
        const results = await Promise.all(addrs.slice(0, 5).map(a => searchTokens(a).catch(() => [])));
        const pairs = results.flatMap(r => r).filter(p => p?.priceUsd);
        const seen = new Set();
        setSuggestions(pairs.filter(p => { const k = p.baseToken?.address; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 6).map(formatPairData).filter(Boolean));
      } catch (e) { console.error(e); }
      finally { setSuggestionsLoading(false); }
    })();
    try { const s = localStorage.getItem("cora_recent_searches"); if (s) setRecentSearches(JSON.parse(s)); } catch {}
  }, []);

  function saveRecent(token) {
    const u = [{ name: token.name, symbol: token.symbol, address: token.address, chain: token.chain, imageUrl: token.imageUrl }, ...recentSearches.filter(r => r.address !== token.address)].slice(0, 5);
    setRecentSearches(u);
    try { localStorage.setItem("cora_recent_searches", JSON.stringify(u)); } catch {}
  }
  async function handleSearch(e) {
    e.preventDefault(); if (!query.trim()) return; setSearching(true); setSelectedToken(null); setAiReport(null); setReportUnlocked(false);
    try { setSearchResults((await searchTokens(query.trim())).slice(0, 10).map(formatPairData).filter(Boolean)); }
    catch { setSearchResults([]); } finally { setSearching(false); }
  }
  function selectToken(token) { setSelectedToken(token); setAiReport(null); setReportUnlocked(false); setSearchResults([]); saveRecent(token); const c = getCachedAnalysis(token.address); if (c?.report) { setAiReport(c.report); setReportUnlocked(true); } }
  async function quickAnalyze(addr) {
    setQuery(addr); setSearching(true); setSelectedToken(null); setAiReport(null); setReportUnlocked(false); setSearchResults([]);
    try { const f = (await searchTokens(addr)).slice(0, 1).map(formatPairData).filter(Boolean); if (f.length) selectToken(f[0]); else setSearchResults((await searchTokens(addr)).slice(0, 10).map(formatPairData).filter(Boolean)); }
    catch {} finally { setSearching(false); }
  }
  async function unlockReport() {
    if (balance < AI_REPORT_COST) { setShowModal(true); return; }
    if (!spendTokens(AI_REPORT_COST, `AI Forecast: ${selectedToken.symbol}`)) { setShowModal(true); return; }
    setReportLoading(true); setReportUnlocked(true);
    try { const d = await (await fetch("/api/ai/report", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tokenData: selectedToken }) })).json(); setAiReport(d.report); cacheAnalysis(selectedToken.address, { ...selectedToken, report: d.report }); }
    catch {} finally { setReportLoading(false); }
  }

  const radarData = selectedToken ? [
    { m: "Liquidity", v: Math.min(10, (selectedToken.liquidity / 500000) * 10) },
    { m: "Volume", v: Math.min(10, (selectedToken.volume24h / 1000000) * 10) },
    { m: "Txns", v: Math.min(10, ((selectedToken.buys24h + selectedToken.sells24h) / 500) * 10) },
    { m: "Momentum", v: Math.min(10, Math.max(0, (selectedToken.priceChange24h + 50) / 10)) },
    { m: "Buy Power", v: selectedToken.buys24h + selectedToken.sells24h > 0 ? (selectedToken.buys24h / (selectedToken.buys24h + selectedToken.sells24h)) * 10 : 5 },
    { m: "Score", v: selectedToken.alphaScore },
  ] : [];
  const pieData = selectedToken ? [{ name: "Buys", value: selectedToken.buys24h || 1 }, { name: "Sells", value: selectedToken.sells24h || 1 }] : [];
  const priceHistory = selectedToken ? [
    { t: "-24h", p: selectedToken.priceRaw * (1 - (selectedToken.priceChange24h || 0) / 100) },
    { t: "-6h", p: selectedToken.priceRaw * (1 - (selectedToken.priceChange6h || 0) / 100) },
    { t: "-1h", p: selectedToken.priceRaw * (1 - (selectedToken.priceChange1h || 0) / 100) },
    { t: "-5m", p: selectedToken.priceRaw * (1 - (selectedToken.priceChange5m || 0) / 100) },
    { t: "Now", p: selectedToken.priceRaw },
  ] : [];
  const insights = useMemo(() => {
    if (!selectedToken) return [];
    const t = selectedToken, r = [];
    const br = t.buys24h + t.sells24h > 0 ? t.buys24h / (t.buys24h + t.sells24h) : 0.5;
    const vl = t.liquidity > 0 ? t.volume24h / t.liquidity : 0;
    if (t.alphaScore >= 8) r.push({ type: "positive", text: `High Forecast Score (${t.alphaScore}/10) — strong signal` });
    else if (t.alphaScore <= 4) r.push({ type: "negative", text: `Low Forecast Score (${t.alphaScore}/10) — elevated risk` });
    if (br > 0.65) r.push({ type: "positive", text: `Strong buy pressure at ${(br * 100).toFixed(0)}%` });
    else if (br < 0.35) r.push({ type: "negative", text: `Heavy sell pressure at ${((1 - br) * 100).toFixed(0)}%` });
    if (vl > 3) r.push({ type: "warning", text: `Volume ${vl.toFixed(1)}x liquidity — potential wash trading` });
    else if (vl > 1) r.push({ type: "positive", text: `Healthy vol/liq ratio (${vl.toFixed(1)}x)` });
    if (t.liquidity < 50000) r.push({ type: "negative", text: `Critical liquidity (${formatCurrency(t.liquidity)}) — high slippage` });
    if (t.priceChange24h > 100) r.push({ type: "warning", text: `Massive pump (+${t.priceChange24h.toFixed(0)}%)` });
    else if (t.priceChange24h > 20) r.push({ type: "positive", text: `Strong momentum (+${t.priceChange24h.toFixed(1)}% 24h)` });
    else if (t.priceChange24h < -30) r.push({ type: "negative", text: `Significant dump (${t.priceChange24h.toFixed(1)}% 24h)` });
    return r.slice(0, 6);
  }, [selectedToken]);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center"><RiSearchEyeLine className="text-[#9F67FF] text-sm" /></div>
        <div><h1 className="text-xl font-bold text-white">AI Forecast Analyzer</h1><p className="text-[#555] text-xs">Predictive analytics · Report costs {AI_REPORT_COST} CORA</p></div>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" />
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by token name, symbol, or contract..." className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0D0D14] border border-dashed border-[#2A2A3A]/60 text-white placeholder:text-[#555] focus:border-[#7C3AED]/40 focus:outline-none transition-colors text-sm" />
        </div>
        <button type="submit" disabled={searching} className="btn-3d px-6 py-3 flex items-center gap-2 shrink-0 disabled:opacity-50">
          {searching && <RiLoader4Line className="animate-spin" />} Analyze
        </button>
      </form>

      <AnimatePresence>
        {searchResults.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={CARD}>
            <p className="text-[#555] text-xs px-4 pt-3 pb-1">Found {searchResults.length} results</p>
            {searchResults.map((token, i) => (
              <button key={i} onClick={() => selectToken(token)} className="w-full flex items-center gap-4 px-4 py-3 hover:bg-[#7C3AED]/[0.02] transition-colors text-left border-b border-dashed border-[#1E1E2E]/50 last:border-b-0">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {token.imageUrl ? <img src={token.imageUrl} alt="" className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 rounded-full bg-[#7C3AED]/8 flex items-center justify-center text-xs font-bold text-[#9F67FF]">{token.symbol?.slice(0, 2)}</div>}
                  <div className="min-w-0"><span className="text-white font-medium text-sm block truncate">{token.name}</span><span className="text-[#555] text-xs">{token.symbol} · {getChainLabel(token.chain)}</span></div>
                </div>
                <div className="text-right shrink-0"><span className="text-white text-sm font-medium block">{token.price}</span><span className={`text-xs ${token.positive ? "text-[#22C55E]" : "text-[#FF4444]"}`}>{token.positive ? "+" : ""}{token.priceChange24h?.toFixed(1)}%</span></div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!selectedToken && !searching && searchResults.length === 0 && (
        <div className="space-y-5">
          {recentSearches.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-5 ${CARD}`}>
              <div className="flex items-center gap-2 mb-3"><RiHistoryLine className="text-[#555]" /><h3 className="text-white font-semibold text-sm">Recent Searches</h3></div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map(r => (
                  <button key={r.address} onClick={() => quickAnalyze(r.address)} className={`flex items-center gap-2 px-3 py-2 ${CARD_INNER} hover:border-[#7C3AED]/20 transition-colors group`}>
                    {r.imageUrl ? <img src={r.imageUrl} alt="" className="w-5 h-5 rounded-full" /> : <div className="w-5 h-5 rounded-full bg-[#7C3AED]/8 flex items-center justify-center text-[8px] font-bold text-[#9F67FF]">{r.symbol?.slice(0, 2)}</div>}
                    <span className="text-[#8E8E9A] text-xs font-medium group-hover:text-white transition-colors">{r.symbol}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded border border-dashed border-[#1E1E2E] text-[#555]">{getChainLabel(r.chain)}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`p-5 ${CARD}`}>
            <div className="flex items-center gap-2 mb-4"><RiFireLine className="text-[#F97316] text-sm" /><h3 className="text-white font-semibold text-sm">Trending — Quick Analyze</h3><span className="text-[#555] text-[10px] ml-auto">Tap to analyze</span></div>
            {suggestionsLoading ? <div className="flex items-center justify-center py-8"><RiLoader4Line className="text-[#7C3AED] animate-spin text-xl" /></div>
            : suggestions.length === 0 ? <p className="text-[#555] text-xs text-center py-4">No suggestions available</p>
            : (<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {suggestions.map(s => (
                  <button key={s.address} onClick={() => quickAnalyze(s.address)} className={`flex items-center gap-3 p-3 ${CARD_INNER} hover:border-[#7C3AED]/20 transition-all text-left group`}>
                    {s.imageUrl ? <img src={s.imageUrl} alt="" className="w-9 h-9 rounded-full shrink-0" /> : <div className="w-9 h-9 rounded-full bg-[#7C3AED]/8 flex items-center justify-center text-xs font-bold text-[#9F67FF] shrink-0">{s.symbol?.slice(0, 2)}</div>}
                    <div className="flex-1 min-w-0"><span className="text-white text-sm font-medium block truncate group-hover:text-[#9F67FF] transition-colors">{s.name}</span><span className="text-[#555] text-[10px]">{s.symbol} · {getChainLabel(s.chain)}</span></div>
                    <div className="text-right shrink-0"><span className="text-white text-xs font-medium block">{s.price}</span><span className={`text-[10px] font-medium ${s.positive ? "text-[#22C55E]" : "text-[#FF4444]"}`}>{s.positive ? "+" : ""}{s.priceChange24h?.toFixed(1)}%</span></div>
                  </button>
                ))}
              </div>)}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`p-5 ${CARD}`}>
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#7C3AED]/4 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-3 relative z-10"><RiLightbulbLine className="text-[#9F67FF] text-sm" /><h3 className="text-white font-semibold text-sm">Pro Tips</h3></div>
            <div className="grid sm:grid-cols-2 gap-2 relative z-10">
              {[{ tip: "Paste contract address for best results", icon: "📋" }, { tip: "Forecast Score 7+ = better opportunities", icon: "⭐" }, { tip: "Healthy Vol/Liq ratio is 0.5x-2x", icon: "📊" }, { tip: "Buy pressure >55% = bullish momentum", icon: "📈" }].map((t, i) => (
                <div key={i} className={`flex items-start gap-2 p-2.5 ${CARD_INNER}`}><span className="text-sm shrink-0">{t.icon}</span><span className="text-[#8E8E9A] text-xs leading-relaxed">{t.tip}</span></div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {selectedToken && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {/* Token Header */}
          <div className={`p-5 ${CARD}`}>
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#7C3AED]/4 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-wrap items-center gap-4 relative z-10">
              {selectedToken.imageUrl ? <img src={selectedToken.imageUrl} alt="" className="w-14 h-14 rounded-2xl ring-1 ring-[#1E1E2E]" /> : <div className="w-14 h-14 rounded-2xl bg-[#7C3AED]/8 ring-1 ring-[#1E1E2E] flex items-center justify-center font-bold text-[#9F67FF] text-lg">{selectedToken.symbol?.slice(0, 2)}</div>}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-white font-bold text-xl">{selectedToken.name}</h2>
                  <span className="text-[#8E8E9A] text-sm">{selectedToken.symbol}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded border border-dashed border-[#1E1E2E] text-[#555] font-medium">{getChainLabel(selectedToken.chain)}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded border border-dashed border-[#1E1E2E] text-[#555] font-medium">{selectedToken.dex}</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-white text-2xl font-bold">{selectedToken.price}</span>
                  <span className={`flex items-center gap-0.5 text-sm font-semibold px-2 py-0.5 rounded-md ${selectedToken.positive ? "bg-[#22C55E]/8 text-[#22C55E]" : "bg-[#FF4444]/8 text-[#FF4444]"}`}>
                    {selectedToken.positive ? <RiArrowUpSLine /> : <RiArrowDownSLine />}{selectedToken.positive ? "+" : ""}{selectedToken.priceChange24h?.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-sm font-bold border border-dashed ${selectedToken.alphaScore >= 8 ? "border-[#22C55E]/30 bg-[#22C55E]/8 text-[#22C55E]" : selectedToken.alphaScore >= 6 ? "border-[#7C3AED]/30 bg-[#7C3AED]/8 text-[#9F67FF]" : "border-[#F97316]/30 bg-[#F97316]/8 text-[#F97316]"}`}><RiStarLine className="text-xs" /> {selectedToken.alphaScore}/10</span>
                {selectedToken.url && <a href={selectedToken.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-dashed border-[#2A2A3A]/60 text-[#8E8E9A] hover:text-white transition-colors"><RiExternalLinkLine /></a>}
                <button onClick={() => { setSelectedToken(null); setAiReport(null); setReportUnlocked(false); }} className="p-2 rounded-lg border border-dashed border-[#2A2A3A]/60 text-[#8E8E9A] hover:text-white transition-colors"><RiCloseLine /></button>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
              <div key={m.label} className={`p-3.5 ${CARD}`}><span className="text-[#555] text-[10px] uppercase tracking-wider block mb-1">{m.label}</span><span className="text-white font-semibold text-sm" style={m.color ? { color: m.color } : undefined}>{m.value}</span></div>
            ))}
          </div>

          {/* Smart Insights */}
          {insights.length > 0 && (
            <div className={`p-5 ${CARD}`}><div className="flex items-center gap-2 mb-3"><RiLightbulbLine className="text-[#9F67FF] text-sm" /><h3 className="text-white font-semibold text-sm">Smart Insights</h3></div>
              <div className="grid sm:grid-cols-2 gap-2">
                {insights.map((ins, i) => (
                  <div key={i} className={`flex items-start gap-2 p-3 rounded-xl border border-dashed ${ins.type === "positive" ? "border-[#22C55E]/20 bg-[#22C55E]/[0.03]" : ins.type === "negative" ? "border-[#FF4444]/20 bg-[#FF4444]/[0.03]" : ins.type === "warning" ? "border-[#F97316]/20 bg-[#F97316]/[0.03]" : "border-[#3B82F6]/20 bg-[#3B82F6]/[0.03]"}`}>
                    <span className="text-sm mt-0.5 shrink-0">{ins.type === "positive" ? "✅" : ins.type === "negative" ? "🔴" : "⚠️"}</span>
                    <span className="text-[#8E8E9A] text-xs leading-relaxed">{ins.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price Trend */}
          <div className={`p-5 ${CARD}`}><h3 className="text-white font-semibold text-sm mb-3">Price Trend</h3>
            <div style={{ height: 220 }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={priceHistory}>
              <defs><linearGradient id="apg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={selectedToken.positive ? "#22C55E" : "#FF4444"} stopOpacity={0.2} /><stop offset="100%" stopColor={selectedToken.positive ? "#22C55E" : "#FF4444"} stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#1E1E2E" vertical={false} /><XAxis dataKey="t" tick={{ fill: "#8E8E9A", fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: "#555", fontSize: 10 }} axisLine={false} tickLine={false} domain={["auto", "auto"]} tickFormatter={v => `$${v < 0.01 ? v.toExponential(1) : v.toFixed(v < 1 ? 4 : 2)}`} />
              <Area type="monotone" dataKey="p" name="Price" stroke={selectedToken.positive ? "#22C55E" : "#FF4444"} fill="url(#apg)" strokeWidth={2} /><Tooltip content={<ChartTip />} />
            </AreaChart></ResponsiveContainer></div>
          </div>

          {/* Radar + Pie */}
          <div className="grid lg:grid-cols-2 gap-5">
            <div className={`p-5 ${CARD}`}><h3 className="text-white font-semibold text-sm mb-3">Risk / Strength Radar</h3>
              <ResponsiveContainer width="100%" height={250}><RadarChart data={radarData}><PolarGrid stroke="#1E1E2E" strokeDasharray="4 4" /><PolarAngleAxis dataKey="m" tick={{ fill: "#8E8E9A", fontSize: 10 }} /><PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} /><Radar dataKey="v" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.12} strokeWidth={1.5} /></RadarChart></ResponsiveContainer>
            </div>
            <div className={`p-5 ${CARD}`}><h3 className="text-white font-semibold text-sm mb-3">Buy / Sell Pressure</h3>
              <ResponsiveContainer width="100%" height={220}><PieChart><Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} strokeWidth={0} paddingAngle={2}><Cell fill="#22C55E" /><Cell fill="#FF4444" /></Pie></PieChart></ResponsiveContainer>
              <div className="flex justify-center gap-6 -mt-2">{[{ c: "#22C55E", l: `Buys (${formatNumber(selectedToken.buys24h)})` }, { c: "#FF4444", l: `Sells (${formatNumber(selectedToken.sells24h)})` }].map(x => <div key={x.l} className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ background: x.c }} /><span className="text-[#8E8E9A] text-xs">{x.l}</span></div>)}</div>
            </div>
          </div>

          {/* AI Report Section */}
          <div className={`p-5 ${CARD}`}>
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#7C3AED]/4 rounded-full blur-3xl pointer-events-none" />
            {!reportUnlocked ? (
              <div className="text-center py-10 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[#7C3AED]/8 flex items-center justify-center mx-auto mb-4"><RiLockLine className="text-[#7C3AED] text-xl" /></div>
                <h3 className="text-white font-bold text-lg mb-2">Unlock AI Oracle Report</h3>
                <p className="text-[#8E8E9A] text-sm mb-1 max-w-md mx-auto">Deep analysis with risk assessment, narrative, signals & recommendations.</p>
                <p className="text-[#9F67FF] text-sm font-semibold mb-5">Cost: {AI_REPORT_COST} CORA (Balance: {balance})</p>
                <button onClick={unlockReport} className="btn-3d px-8 py-3 inline-flex items-center gap-2"><RiSparklingLine /> Unlock Report</button>
              </div>
            ) : reportLoading ? (
              <div className="text-center py-14"><RiLoader4Line className="text-[#7C3AED] text-2xl animate-spin mx-auto mb-3" /><h3 className="text-white font-semibold text-sm mb-1">Analyzing {selectedToken.symbol}...</h3><p className="text-[#555] text-xs">Oracle AI processing on-chain data</p></div>
            ) : aiReport ? (
              <div className="space-y-3 relative z-10">
                <div className="flex items-center gap-2 mb-2"><RiSparklingLine className="text-[#9F67FF] text-sm" /><h3 className="text-white font-bold">AI Oracle Report</h3></div>
                <div className={`p-4 ${CARD_INNER}`}><h4 className="text-white text-sm font-semibold mb-2">Executive Summary</h4><MarkdownBlock text={aiReport.summary} /></div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className={`p-4 ${CARD_INNER}`}><span className="text-[#555] text-[10px] uppercase tracking-wider block mb-2">Risk Level</span><div className="flex items-center gap-2"><RiShieldCheckLine style={{ color: RISK_COLORS[aiReport.riskLevel] || "#888" }} /><span className="font-bold" style={{ color: RISK_COLORS[aiReport.riskLevel] }}>{aiReport.riskLevel}</span></div></div>
                  <div className={`p-4 ${CARD_INNER}`}><span className="text-[#555] text-[10px] uppercase tracking-wider block mb-2">Recommendation</span><span className="font-bold text-sm" style={{ color: REC_COLORS[aiReport.recommendation?.split(" ")[0]] || "#888" }}>{aiReport.recommendation?.split(" — ")[0]}</span></div>
                </div>
                {aiReport.narrative && <div className={`p-4 ${CARD_INNER}`}><h4 className="text-white text-sm font-semibold mb-2">Narrative</h4><MarkdownBlock text={aiReport.narrative} /></div>}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className={`p-4 ${CARD_INNER}`}><h4 className="text-[#22C55E] text-sm font-semibold mb-2">Strengths</h4><ul className="space-y-1.5">{aiReport.strengths?.map((s, i) => <li key={i} className="text-[#8E8E9A] text-xs flex items-start gap-2"><span className="text-[#22C55E] mt-0.5 text-[10px]">●</span>{s}</li>)}</ul></div>
                  <div className={`p-4 ${CARD_INNER}`}><h4 className="text-[#FF4444] text-sm font-semibold mb-2">Risks</h4><ul className="space-y-1.5">{aiReport.risks?.map((r, i) => <li key={i} className="text-[#8E8E9A] text-xs flex items-start gap-2"><span className="text-[#FF4444] mt-0.5 text-[10px]">●</span>{r}</li>)}</ul></div>
                </div>
                {[{ title: "Liquidity Analysis", content: aiReport.liquidityAnalysis }, { title: "Volume Analysis", content: aiReport.volumeAnalysis }, { title: "Price Action", content: aiReport.priceAction }].filter(s => s.content).map(s => <div key={s.title} className={`p-4 ${CARD_INNER}`}><h4 className="text-white text-sm font-semibold mb-2">{s.title}</h4><MarkdownBlock text={s.content} /></div>)}
                {aiReport.keyInsights && <div className={`p-4 ${CARD_INNER}`}><h4 className="text-[#9F67FF] text-sm font-semibold mb-2">Key Insights</h4><ul className="space-y-1.5">{aiReport.keyInsights.map((ins, i) => <li key={i} className="text-[#8E8E9A] text-xs flex items-start gap-2"><span className="text-[#9F67FF] mt-0.5 text-[10px]">★</span>{ins}</li>)}</ul></div>}
                {aiReport.recommendation?.includes(" — ") && <div className="p-4 rounded-xl bg-[#7C3AED]/[0.03] border border-dashed border-[#7C3AED]/20"><h4 className="text-[#9F67FF] text-sm font-semibold mb-2">Detailed Recommendation</h4><MarkdownBlock text={aiReport.recommendation} /></div>}
              </div>
            ) : null}
          </div>
        </motion.div>
      )}
      <InsufficientTokensModal isOpen={showModal} onClose={() => setShowModal(false)} required={AI_REPORT_COST} balance={balance} />
    </div>
  );
}
