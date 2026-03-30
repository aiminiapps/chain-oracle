"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import {
  RiCoinLine, RiSearchEyeLine, RiAlertLine, RiStarLine,
  RiArrowRightUpLine, RiArrowRightDownLine, RiFlashlightLine,
  RiVipDiamondLine, RiTaskLine, RiFireLine, RiBarChartBoxLine,
  RiShieldCheckLine, RiPulseLine, RiLineChartLine,
  RiTrophyLine, RiEyeLine, RiSparklingLine,
} from "react-icons/ri";
import {
  Area, AreaChart, ResponsiveContainer, XAxis, YAxis,
  CartesianGrid, Tooltip, Bar, BarChart, Cell, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";
import { useTokens } from "@/context/TokenContext";
import { getTrendingTokens, searchTokens, formatPairData, formatCurrency, formatNumber, getChainLabel } from "@/lib/dexscreener";

function deduplicatePairs(pairs) {
  const bestByAddress = {};
  for (const pair of pairs) {
    const addr = pair.baseToken?.address;
    if (!addr) continue;
    const existing = bestByAddress[addr];
    if (!existing || (pair.liquidity?.usd || 0) > (existing.liquidity?.usd || 0)) {
      bestByAddress[addr] = pair;
    }
  }
  return Object.values(bestByAddress);
}

/* ───────── Custom Chart Tooltip ───────── */
function CustomChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#141420]/95 backdrop-blur-xl border border-[#2A2A3A] rounded-xl p-3 shadow-2xl">
      <p className="text-white text-xs font-semibold mb-2">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-[#A1A1AA]">{entry.name}:</span>
          <span className="text-white font-medium">
            {entry.name === "Price Change" ? `${entry.value}%` : formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN DASHBOARD PAGE
   ═══════════════════════════════════════════ */
export default function DashboardPage() {
  const { balance, history, completedQuests, loaded } = useTokens();
  const [trending, setTrending] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const boosts = await getTrendingTokens();
        const uniqueAddresses = [...new Set(boosts.slice(0, 20).map(b => b.tokenAddress))];
        const searchPromises = uniqueAddresses.slice(0, 10).map(addr => searchTokens(addr).catch(() => []));
        const results = await Promise.all(searchPromises);
        const allPairs = results.flatMap(r => r).filter(p => p && p.priceUsd);
        const uniquePairs = deduplicatePairs(allPairs);
        const formatted = uniquePairs.slice(0, 10).map(formatPairData).filter(Boolean);
        setTrending(formatted);
      } catch (err) {
        console.error("Failed to fetch trending:", err);
      } finally {
        setTrendingLoading(false);
      }
    }
    fetchTrending();
  }, []);

  /* ─── Derived data ─── */
  const chartData = useMemo(() => {
    return trending.map(t => ({
      name: t.symbol?.length > 6 ? t.symbol.slice(0, 6) + "…" : t.symbol,
      volume: t.volume24h || 0,
      liquidity: t.liquidity || 0,
      "Price Change": t.priceChange24h || 0,
    }));
  }, [trending]);

  const marketPulse = useMemo(() => {
    if (!trending.length) return null;
    const totalBuys = trending.reduce((s, t) => s + (t.buys24h || 0), 0);
    const totalSells = trending.reduce((s, t) => s + (t.sells24h || 0), 0);
    const total = totalBuys + totalSells;
    const buyPressure = total > 0 ? Math.round((totalBuys / total) * 100) : 50;
    const avgScore = trending.reduce((s, t) => s + (t.alphaScore || 0), 0) / trending.length;
    const avgChange = trending.reduce((s, t) => s + (t.priceChange24h || 0), 0) / trending.length;
    const sentiment = avgChange > 5 ? "Bullish" : avgChange > -5 ? "Neutral" : "Bearish";
    const sentimentColor = avgChange > 5 ? "#22C55E" : avgChange > -5 ? "#7C3AED" : "#FF4444";
    return { totalBuys, totalSells, buyPressure, avgScore, avgChange, sentiment, sentimentColor, total };
  }, [trending]);

  const topMovers = useMemo(() => {
    if (!trending.length) return { gainers: [], losers: [] };
    const sorted = [...trending].sort((a, b) => (b.priceChange24h || 0) - (a.priceChange24h || 0));
    return {
      gainers: sorted.filter(t => t.priceChange24h > 0).slice(0, 3),
      losers: sorted.filter(t => t.priceChange24h < 0).slice(-3).reverse(),
    };
  }, [trending]);

  const bestOfWeek = useMemo(() => {
    if (!trending.length) return [];
    return [...trending]
      .sort((a, b) => b.alphaScore - a.alphaScore)
      .slice(0, 3)
      .map(t => ({ ...t, badge: "Best of Week" }));
  }, [trending]);

  const bestOfMonth = useMemo(() => {
    if (!trending.length) return [];
    return [...trending]
      .sort((a, b) => (b.volume24h || 0) - (a.volume24h || 0))
      .slice(0, 3)
      .map(t => ({ ...t, badge: "Best of Month" }));
  }, [trending]);

  const radarData = useMemo(() => {
    if (!trending.length) return [];
    return trending.slice(0, 5).map(t => {
      const maxVol = Math.max(...trending.map(x => x.volume24h || 1));
      const maxLiq = Math.max(...trending.map(x => x.liquidity || 1));
      return {
        name: t.symbol?.length > 5 ? t.symbol.slice(0, 5) : t.symbol,
        Volume: Math.round(((t.volume24h || 0) / maxVol) * 100),
        Liquidity: Math.round(((t.liquidity || 0) / maxLiq) * 100),
        Score: Math.round((t.alphaScore / 10) * 100),
        Momentum: Math.min(100, Math.max(0, 50 + (t.priceChange24h || 0))),
      };
    });
  }, [trending]);

  const stats = [
    { label: "CORA Balance", value: loaded ? balance.toLocaleString() : "...", icon: RiCoinLine, color: "#7C3AED" },
    { label: "Quests Done", value: loaded ? completedQuests.length.toString() : "...", icon: RiTaskLine, color: "#22C55E" },
    { label: "Actions Logged", value: loaded ? history.length.toString() : "...", icon: RiBarChartBoxLine, color: "#3B82F6" },
    { label: "Trending Live", value: trendingLoading ? "..." : trending.length.toString(), icon: RiFireLine, color: "#F97316" },
  ];

  const recentHistory = loaded ? history.slice(0, 5) : [];

  function ActivityIcon({ type }) {
    const icons = {
      earn: <RiCoinLine className="text-[#22C55E]" />,
      spend: <RiCoinLine className="text-[#F97316]" />,
      analysis: <RiSearchEyeLine className="text-[#3B82F6]" />,
      alert: <RiAlertLine className="text-[#F97316]" />,
      quest: <RiTaskLine className="text-[#22C55E]" />,
      gem: <RiVipDiamondLine className="text-[#7C3AED]" />,
    };
    return icons[type] || <RiFlashlightLine className="text-[#7C3AED]" />;
  }

  return (
    <div className="space-y-6">
      {/* ───── Stat Cards ───── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }} className="p-5 rounded-2xl border border-[#2A2A3A] bg-[#141420] card-hover relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full blur-2xl pointer-events-none" style={{ background: `${stat.color}10` }} />
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#A1A1AA] text-sm">{stat.label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                <stat.icon className="text-sm" style={{ color: stat.color }} />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* ═══════ BEST OF WEEK / MONTH ═══════ */}
      {!trendingLoading && trending.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Best of Week */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="p-5 rounded-2xl border border-[#2A2A3A] bg-[#141420] relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#7C3AED]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center">
                <RiTrophyLine className="text-[#7C3AED] text-sm" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Best of the Week</h3>
                <p className="text-[#6B6B76] text-[10px]">AI-curated top performers</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {bestOfWeek.map((token, i) => (
                <div key={token.address} className="flex items-center justify-between p-3 rounded-xl bg-[#0A0A0F] border border-[#2A2A3A] hover:border-[#7C3AED]/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-[#6B6B76] text-xs font-mono w-5">#{i + 1}</span>
                    {token.imageUrl ? <img src={token.imageUrl} alt="" className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 rounded-full bg-[#7C3AED]/10 flex items-center justify-center text-[10px] font-bold text-[#9F67FF]">{token.symbol?.slice(0, 2)}</div>}
                    <div>
                      <span className="text-white text-sm font-medium block truncate max-w-[100px]">{token.name}</span>
                      <span className="text-[#6B6B76] text-[10px]">{token.symbol} · {getChainLabel(token.chain)}</span>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <span className="text-white text-sm font-medium block">{token.price}</span>
                      <span className={`text-xs font-medium ${token.positive ? "text-[#22C55E]" : "text-[#FF4444]"}`}>
                        {token.positive ? "+" : ""}{token.priceChange24h?.toFixed(1)}%
                      </span>
                    </div>
                    <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-[#7C3AED]/10 text-[#9F67FF]">
                      <RiStarLine className="text-[10px]" />{token.alphaScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Best of Month */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="p-5 rounded-2xl border border-[#2A2A3A] bg-[#141420] relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#22C55E]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#22C55E]/10 flex items-center justify-center">
                <RiSparklingLine className="text-[#22C55E] text-sm" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Best of the Month</h3>
                <p className="text-[#6B6B76] text-[10px]">Highest volume & momentum</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {bestOfMonth.map((token, i) => (
                <div key={token.address} className="flex items-center justify-between p-3 rounded-xl bg-[#0A0A0F] border border-[#2A2A3A] hover:border-[#22C55E]/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-[#6B6B76] text-xs font-mono w-5">#{i + 1}</span>
                    {token.imageUrl ? <img src={token.imageUrl} alt="" className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 rounded-full bg-[#22C55E]/10 flex items-center justify-center text-[10px] font-bold text-[#22C55E]">{token.symbol?.slice(0, 2)}</div>}
                    <div>
                      <span className="text-white text-sm font-medium block truncate max-w-[100px]">{token.name}</span>
                      <span className="text-[#6B6B76] text-[10px]">{token.symbol} · Vol: {formatCurrency(token.volume24h)}</span>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <span className="text-white text-sm font-medium block">{token.price}</span>
                      <span className={`text-xs font-medium ${token.positive ? "text-[#22C55E]" : "text-[#FF4444]"}`}>
                        {token.positive ? "+" : ""}{token.priceChange24h?.toFixed(1)}%
                      </span>
                    </div>
                    <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-[#22C55E]/10 text-[#22C55E]">
                      <RiStarLine className="text-[10px]" />{token.alphaScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* ───── Trending Tokens + Activity + Radar ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trending Tokens Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="lg:col-span-2 p-5 rounded-2xl border border-[#2A2A3A] bg-[#141420]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold text-lg">Trending Tokens</h3>
              <p className="text-[#6B6B76] text-sm">Live from DexScreener boosted tokens</p>
            </div>
            <Link href="/app/gems" className="text-[#9F67FF] text-sm font-medium hover:underline">View All →</Link>
          </div>
          {trendingLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : trending.length === 0 ? (
            <p className="text-[#6B6B76] text-sm text-center py-8">No trending data available</p>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-[#2A2A3A]">
                      <th className="text-left text-[#6B6B76] text-xs font-medium py-3 px-2">Token</th>
                      <th className="text-right text-[#6B6B76] text-xs font-medium py-3 px-2">Price</th>
                      <th className="text-right text-[#6B6B76] text-xs font-medium py-3 px-2">24h</th>
                      <th className="text-right text-[#6B6B76] text-xs font-medium py-3 px-2">Volume</th>
                      <th className="text-right text-[#6B6B76] text-xs font-medium py-3 px-2 hidden md:table-cell">Liquidity</th>
                      <th className="text-right text-[#6B6B76] text-xs font-medium py-3 px-2">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trending.map((token) => (
                      <tr key={token.address || token.symbol} className="border-b border-[#2A2A3A]/50 hover:bg-[#1C1C2E] transition-colors cursor-pointer">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            {token.imageUrl ? <img src={token.imageUrl} alt="" className="w-7 h-7 rounded-full" /> : <div className="w-7 h-7 rounded-full bg-[#7C3AED]/10 flex items-center justify-center text-[10px] font-bold text-[#9F67FF]">{token.symbol?.slice(0, 2)}</div>}
                            <div>
                              <span className="text-white text-sm font-medium block truncate max-w-[100px]">{token.name}</span>
                              <span className="text-[#6B6B76] text-[10px]">{token.symbol} · {getChainLabel(token.chain)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-right text-white text-sm">{token.price}</td>
                        <td className={`py-3 px-2 text-right text-sm font-medium ${token.positive ? "text-[#22C55E]" : "text-[#FF4444]"}`}>
                          {token.positive ? "+" : ""}{token.priceChange24h?.toFixed(1)}%
                        </td>
                        <td className="py-3 px-2 text-right text-[#A1A1AA] text-sm">{formatCurrency(token.volume24h)}</td>
                        <td className="py-3 px-2 text-right text-[#A1A1AA] text-sm hidden md:table-cell">{formatCurrency(token.liquidity)}</td>
                        <td className="py-3 px-2 text-right">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${token.alphaScore >= 8 ? "bg-[#22C55E]/10 text-[#22C55E]" : token.alphaScore >= 7 ? "bg-[#7C3AED]/10 text-[#9F67FF]" : "bg-[#F97316]/10 text-[#F97316]"}`}>
                            <RiStarLine className="text-[10px]" />{token.alphaScore}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile card list */}
              <div className="sm:hidden space-y-2">
                {trending.map((token) => (
                  <div key={token.address || token.symbol} className="flex items-center justify-between p-3 rounded-xl bg-[#0A0A0F] border border-[#2A2A3A]/50">
                    <div className="flex items-center gap-2 min-w-0">
                      {token.imageUrl ? <img src={token.imageUrl} alt="" className="w-8 h-8 rounded-full shrink-0" /> : <div className="w-8 h-8 rounded-full bg-[#7C3AED]/10 flex items-center justify-center text-[10px] font-bold text-[#9F67FF] shrink-0">{token.symbol?.slice(0, 2)}</div>}
                      <div className="min-w-0">
                        <span className="text-white text-sm font-medium block truncate">{token.name}</span>
                        <span className="text-[#6B6B76] text-[10px]">{token.symbol} · {getChainLabel(token.chain)}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <span className="text-white text-sm font-medium block">{token.price}</span>
                      <div className="flex items-center justify-end gap-1.5">
                        <span className={`text-xs font-medium ${token.positive ? "text-[#22C55E]" : "text-[#FF4444]"}`}>
                          {token.positive ? "+" : ""}{token.priceChange24h?.toFixed(1)}%
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${token.alphaScore >= 8 ? "bg-[#22C55E]/10 text-[#22C55E]" : token.alphaScore >= 7 ? "bg-[#7C3AED]/10 text-[#9F67FF]" : "bg-[#F97316]/10 text-[#F97316]"}`}>
                          {token.alphaScore}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>

        {/* Right column: Activity + Token Radar */}
        <div className="flex flex-col gap-6">
          {/* Activity Log */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="p-5 rounded-2xl border border-[#2A2A3A] bg-[#141420] flex-1">
            <h3 className="text-white font-semibold text-lg mb-4">Recent Activity</h3>
            {recentHistory.length === 0 ? (
              <p className="text-[#6B6B76] text-sm text-center py-8">No activity yet. Complete quests to get started!</p>
            ) : (
              <div className="space-y-3">
                {recentHistory.map((entry, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[#0A0A0F] border border-[#2A2A3A]">
                    <div className="w-8 h-8 rounded-lg bg-[#1C1C2E] flex items-center justify-center shrink-0 mt-0.5">
                      <ActivityIcon type={entry.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{entry.reason}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-semibold ${entry.type === "earn" ? "text-[#22C55E]" : "text-[#F97316]"}`}>
                          {entry.type === "earn" ? "+" : "-"}{entry.amount} CORA
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Token Radar */}
          {!trendingLoading && trending.length >= 3 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className="p-5 rounded-2xl border border-[#2A2A3A] bg-[#141420] relative overflow-hidden flex-1">
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#7C3AED]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-white font-semibold mb-1">Oracle Radar</h3>
                <p className="text-[#6B6B76] text-xs mb-3">Top 5 trending comparison</p>
              </div>
              <div className="relative z-10" style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#2A2A3A" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: "#ccc", fontSize: 10 }} />
                    <PolarRadiusAxis tick={false} domain={[0, 100]} axisLine={false} />
                    <Radar name="Volume" dataKey="Volume" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.15} />
                    <Radar name="Liquidity" dataKey="Liquidity" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.15} />
                    <Radar name="Score" dataKey="Score" stroke="#9F67FF" fill="#9F67FF" fillOpacity={0.15} />
                    <Radar name="Momentum" dataKey="Momentum" stroke="#22C55E" fill="#22C55E" fillOpacity={0.15} />
                    <Tooltip content={<CustomChartTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* ═══════ COMPARISON CHART ═══════ */}
      {!trendingLoading && trending.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="relative p-6 rounded-2xl border border-[#2A2A3A] bg-[#141420] overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#7C3AED]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#3B82F6]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div>
              <h3 className="text-white font-semibold text-lg">Trending Coins Comparison</h3>
              <p className="text-[#6B6B76] text-sm">Volume vs Liquidity vs 24h Price Change</p>
            </div>
          </div>
          <div className="relative z-10" style={{ height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={4} barCategoryGap="20%">
                <defs>
                  <linearGradient id="gradVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.3} />
                  </linearGradient>
                  <linearGradient id="gradLiquidity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3A" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#A1A1AA", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: "#A1A1AA", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => formatCurrency(v)} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: "#A1A1AA", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip content={<CustomChartTooltip />} cursor={{ fill: "rgba(124,58,237,0.05)" }} />
                <Legend wrapperStyle={{ paddingTop: 12 }} formatter={(value) => <span style={{ color: "#ccc", fontSize: 12 }}>{value}</span>} />
                <Bar yAxisId="left" dataKey="volume" name="Volume 24h" fill="url(#gradVolume)" radius={[6, 6, 0, 0]} maxBarSize={32} />
                <Bar yAxisId="left" dataKey="liquidity" name="Liquidity" fill="url(#gradLiquidity)" radius={[6, 6, 0, 0]} maxBarSize={32} />
                <Bar yAxisId="right" dataKey="Price Change" name="Price Change" radius={[6, 6, 0, 0]} maxBarSize={32}>
                  {chartData.map((entry, idx) => (
                    <Cell key={idx} fill={entry["Price Change"] >= 0 ? "#22C55E" : "#FF4444"} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* ═══════ MARKET INSIGHTS ROW ═══════ */}
      {!trendingLoading && trending.length > 0 && marketPulse && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Market Pulse */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }} className="p-5 rounded-2xl border border-[#2A2A3A] bg-[#141420] relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl pointer-events-none" style={{ background: `${marketPulse.sentimentColor}08` }} />
            <div className="flex items-center gap-2 mb-4">
              <RiPulseLine className="text-lg" style={{ color: marketPulse.sentimentColor }} />
              <h3 className="text-white font-semibold">Market Pulse</h3>
            </div>
            <div className="flex items-center gap-3 mb-5">
              <span className="px-3 py-1.5 rounded-xl text-sm font-bold" style={{ background: `${marketPulse.sentimentColor}15`, color: marketPulse.sentimentColor }}>
                {marketPulse.sentiment}
              </span>
              <span className="text-[#A1A1AA] text-xs">Avg: <span className={`font-semibold ${marketPulse.avgChange >= 0 ? "text-[#22C55E]" : "text-[#FF4444]"}`}>{marketPulse.avgChange >= 0 ? "+" : ""}{marketPulse.avgChange.toFixed(1)}%</span></span>
            </div>
            <div className="mb-2">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-[#22C55E] font-medium">Buys {marketPulse.buyPressure}%</span>
                <span className="text-[#FF4444] font-medium">Sells {100 - marketPulse.buyPressure}%</span>
              </div>
              <div className="h-3 rounded-full bg-[#2A2A3A] overflow-hidden flex">
                <motion.div initial={{ width: 0 }} animate={{ width: `${marketPulse.buyPressure}%` }} transition={{ duration: 1, delay: 0.8 }} className="h-full rounded-l-full" style={{ background: "linear-gradient(90deg, #22C55E, #86EFAC)" }} />
                <motion.div initial={{ width: 0 }} animate={{ width: `${100 - marketPulse.buyPressure}%` }} transition={{ duration: 1, delay: 0.8 }} className="h-full rounded-r-full" style={{ background: "linear-gradient(90deg, #FCA5A5, #FF4444)" }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 rounded-xl bg-[#0A0A0F] border border-[#2A2A3A]">
                <p className="text-[#6B6B76] text-[10px] uppercase tracking-wider mb-1">Total Buys</p>
                <p className="text-white font-bold text-lg">{formatNumber(marketPulse.totalBuys)}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#0A0A0F] border border-[#2A2A3A]">
                <p className="text-[#6B6B76] text-[10px] uppercase tracking-wider mb-1">Total Sells</p>
                <p className="text-white font-bold text-lg">{formatNumber(marketPulse.totalSells)}</p>
              </div>
            </div>
          </motion.div>

          {/* Top Movers */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }} className="p-5 rounded-2xl border border-[#2A2A3A] bg-[#141420]">
            <div className="flex items-center gap-2 mb-4">
              <RiFireLine className="text-lg text-[#F97316]" />
              <h3 className="text-white font-semibold">Top Movers</h3>
            </div>
            <div className="mb-4">
              <p className="text-[10px] text-[#22C55E] uppercase tracking-wider font-semibold mb-2">🟢 Gainers</p>
              {topMovers.gainers.length === 0 ? (
                <p className="text-[#6B6B76] text-xs">No gainers right now</p>
              ) : topMovers.gainers.map(t => (
                <div key={t.address} className="flex items-center justify-between py-2 border-b border-[#2A2A3A]/40 last:border-0">
                  <div className="flex items-center gap-2">
                    {t.imageUrl ? <img src={t.imageUrl} alt="" className="w-5 h-5 rounded-full" /> : <div className="w-5 h-5 rounded-full bg-[#22C55E]/10 flex items-center justify-center text-[8px] font-bold text-[#22C55E]">{t.symbol?.slice(0, 2)}</div>}
                    <span className="text-white text-sm font-medium">{t.symbol}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 rounded-full bg-[#22C55E]/20 overflow-hidden" style={{ width: 60 }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, Math.abs(t.priceChange24h))}%` }} transition={{ duration: 1 }} className="h-full rounded-full bg-[#22C55E]" />
                    </div>
                    <span className="text-[#22C55E] text-xs font-bold">+{t.priceChange24h?.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <p className="text-[10px] text-[#FF4444] uppercase tracking-wider font-semibold mb-2">🔴 Losers</p>
              {topMovers.losers.length === 0 ? (
                <p className="text-[#6B6B76] text-xs">No losers right now</p>
              ) : topMovers.losers.map(t => (
                <div key={t.address} className="flex items-center justify-between py-2 border-b border-[#2A2A3A]/40 last:border-0">
                  <div className="flex items-center gap-2">
                    {t.imageUrl ? <img src={t.imageUrl} alt="" className="w-5 h-5 rounded-full" /> : <div className="w-5 h-5 rounded-full bg-[#FF4444]/10 flex items-center justify-center text-[8px] font-bold text-[#FF4444]">{t.symbol?.slice(0, 2)}</div>}
                    <span className="text-white text-sm font-medium">{t.symbol}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 rounded-full bg-[#FF4444]/20 overflow-hidden" style={{ width: 60 }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, Math.abs(t.priceChange24h))}%` }} transition={{ duration: 1 }} className="h-full rounded-full bg-[#FF4444]" />
                    </div>
                    <span className="text-[#FF4444] text-xs font-bold">{t.priceChange24h?.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Forecast Score Breakdown */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.9 }} className="p-5 rounded-2xl border border-[#2A2A3A] bg-[#141420]">
            <div className="flex items-center gap-2 mb-4">
              <RiShieldCheckLine className="text-lg text-[#7C3AED]" />
              <h3 className="text-white font-semibold">Forecast Score</h3>
            </div>
            <div className="p-4 rounded-xl bg-[#0A0A0F] border border-[#2A2A3A] text-center mb-4">
              <p className="text-[#6B6B76] text-[10px] uppercase tracking-wider mb-1">Average Oracle Score</p>
              <p className="text-white font-bold text-3xl">{marketPulse.avgScore.toFixed(1)}<span className="text-[#6B6B76] text-sm font-normal"> / 10</span></p>
            </div>
            <div className="space-y-3">
              {[
                { label: "High (8-10)", count: trending.filter(t => t.alphaScore >= 8).length, color: "#22C55E" },
                { label: "Medium (6-8)", count: trending.filter(t => t.alphaScore >= 6 && t.alphaScore < 8).length, color: "#7C3AED" },
                { label: "Low (1-6)", count: trending.filter(t => t.alphaScore < 6).length, color: "#F97316" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                  <span className="text-[#A1A1AA] text-sm flex-1">{item.label}</span>
                  <div className="w-20 h-1.5 bg-[#2A2A3A] rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(item.count / Math.max(1, trending.length)) * 100}%` }} transition={{ duration: 1 }} className="h-full rounded-full" style={{ background: item.color }} />
                  </div>
                  <span className="text-white text-sm font-bold w-6 text-right">{item.count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* ───── Quick Actions ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: "Run Forecast", desc: "AI-powered prediction engine", href: "/app/analyzer", icon: RiLineChartLine, color: "#7C3AED" },
          { title: "Oracle Scanner", desc: "Find hidden opportunities", href: "/app/gems", icon: RiEyeLine, color: "#9F67FF" },
          { title: "Earn $CORA", desc: "Complete quests for rewards", href: "/app/quests", icon: RiCoinLine, color: "#22C55E" },
        ].map((action, i) => (
          <motion.div key={action.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}>
            <Link href={action.href} className="flex items-center gap-4 p-4 rounded-2xl border border-[#2A2A3A] bg-[#141420] card-hover group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${action.color}15` }}>
                <action.icon className="text-lg" style={{ color: action.color }} />
              </div>
              <div>
                <h4 className="text-white font-medium text-sm group-hover:text-[#9F67FF] transition-colors">{action.title}</h4>
                <p className="text-[#6B6B76] text-xs">{action.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
