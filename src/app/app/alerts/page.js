"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  RiAlarmWarningLine, RiArrowUpLine, RiBarChartLine,
  RiVipCrownLine, RiSparklingLine, RiSettings3Line,
  RiToggleLine, RiToggleFill, RiLoader4Line, RiExternalLinkLine,
} from "react-icons/ri";
import { useTokens } from "@/context/TokenContext";
import { getTrendingTokens, getTopBoostedTokens, searchTokens, formatPairData, formatCurrency, getChainLabel } from "@/lib/dexscreener";

const ALERT_TYPE_META = {
  WHALE_BUY: { label: "Whale Buys", color: "#8B5CF6", icon: RiVipCrownLine },
  LIQUIDITY_SPIKE: { label: "Liquidity Spikes", color: "#22C55E", icon: RiArrowUpLine },
  VOLUME_SURGE: { label: "Volume Surges", color: "#F97316", icon: RiBarChartLine },
  SMART_MONEY: { label: "Smart Money", color: "#3B82F6", icon: RiSparklingLine },
  NEW_TOKEN: { label: "New Tokens", color: "#F5D90A", icon: RiAlarmWarningLine },
};

function classifyAlert(token) {
  if (token.volume24h > 1000000) return "VOLUME_SURGE";
  if (token.liquidity > 500000 && token.priceChange24h > 10) return "LIQUIDITY_SPIKE";
  if (token.buys24h > token.sells24h * 2) return "WHALE_BUY";
  if (token.alphaScore >= 8) return "SMART_MONEY";
  return "NEW_TOKEN";
}

function getSeverity(token) {
  if (token.alphaScore >= 8.5) return "high";
  if (token.alphaScore >= 7) return "medium";
  return "low";
}

const SEVERITY_STYLES = {
  high: { bg: "bg-[#FF4444]/10", text: "text-[#FF4444]", label: "High" },
  medium: { bg: "bg-[#F97316]/10", text: "text-[#F97316]", label: "Medium" },
  low: { bg: "bg-[#22C55E]/10", text: "text-[#22C55E]", label: "Low" },
};

export default function AlertsPage() {
  const { alertSettings, updateAlertSettings } = useTokens();
  const [showSettings, setShowSettings] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const [trending, top] = await Promise.all([
          getTrendingTokens(),
          getTopBoostedTokens(),
        ]);
        const allTokens = [...(trending || []), ...(top || [])];
        const unique = [...new Map(allTokens.map(t => [t.tokenAddress, t])).values()];
        const searchPromises = unique.slice(0, 12).map(t => searchTokens(t.tokenAddress).catch(() => []));
        const results = await Promise.all(searchPromises);
        const pairs = results.flatMap(r => r).filter(p => p && p.priceUsd);
        const seen = new Set();
        const uniquePairs = pairs.filter(p => {
          const key = p.baseToken?.address;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        const formatted = uniquePairs.map(formatPairData).filter(Boolean);
        const alertsData = formatted.map(token => ({
          ...token,
          alertType: classifyAlert(token),
          severity: getSeverity(token),
          description: generateAlertDescription(token),
        }));
        setAlerts(alertsData);
      } catch (err) {
        console.error("Failed to fetch alerts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAlerts();
  }, []);

  function generateAlertDescription(token) {
    const type = classifyAlert(token);
    switch (type) {
      case "VOLUME_SURGE": return `${token.symbol} saw ${formatCurrency(token.volume24h)} in 24h volume with ${token.priceChange24h >= 0 ? "+" : ""}${token.priceChange24h?.toFixed(1)}% price change`;
      case "LIQUIDITY_SPIKE": return `${token.symbol} liquidity rose to ${formatCurrency(token.liquidity)} with strong buying momentum`;
      case "WHALE_BUY": return `${token.symbol} shows ${token.buys24h} buys vs ${token.sells24h} sells — significant whale accumulation detected`;
      case "SMART_MONEY": return `${token.symbol} scored ${token.alphaScore}/10 Alpha Score with exceptional metrics across the board`;
      default: return `${token.symbol} is a newly boosted token on ${getChainLabel(token.chain)} via ${token.dex}`;
    }
  }

  const toggleSetting = (key) => {
    updateAlertSettings({ ...alertSettings, [key]: !alertSettings[key] });
  };

  const filtered = alerts.filter(a => alertSettings[a.alertType]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Alpha Alerts</h1>
          <p className="text-[#888] text-sm mt-1">Live signals from on-chain activity</p>
        </div>
        <button onClick={() => setShowSettings(!showSettings)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#2A2A2A] bg-[#151515] text-[#888] hover:text-white text-sm transition-colors">
          <RiSettings3Line /> Settings
        </button>
      </div>

      {showSettings && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-5 rounded-2xl border border-[#2A2A2A] bg-[#151515]">
          <h3 className="text-white font-semibold mb-4">Alert Configuration</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(ALERT_TYPE_META).map(([key, val]) => (
              <button key={key} onClick={() => toggleSetting(key)} className="flex items-center justify-between p-3 rounded-xl bg-[#1E1E1E] border border-[#2A2A2A] hover:border-[#2A2A2A]/80 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: val.color }} />
                  <span className="text-white text-sm">{val.label}</span>
                </div>
                {alertSettings[key] ? <RiToggleFill className="text-[#F5D90A] text-xl" /> : <RiToggleLine className="text-[#888] text-xl" />}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <RiLoader4Line className="text-[#F5D90A] text-3xl animate-spin mx-auto mb-3" />
            <p className="text-[#888] text-sm">Fetching live alerts...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((alert, i) => {
            const typeMeta = ALERT_TYPE_META[alert.alertType] || {};
            const Icon = typeMeta.icon || RiAlarmWarningLine;
            const severity = SEVERITY_STYLES[alert.severity];
            return (
              <motion.div key={alert.address + i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.04 }} className="p-4 rounded-2xl border border-[#2A2A2A] bg-[#151515] card-hover">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${typeMeta.color || "#888"}15` }}>
                    <Icon className="text-lg" style={{ color: typeMeta.color || "#888" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-white font-semibold text-sm">{alert.name} ({alert.symbol})</h3>
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: `${typeMeta.color}20`, color: typeMeta.color }}>{typeMeta.label}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${severity.bg} ${severity.text}`}>{severity.label}</span>
                        </div>
                        <p className="text-[#888] text-sm">{alert.description}</p>
                      </div>
                      <span className="text-white text-sm font-medium shrink-0">{alert.price}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-3 flex-wrap">
                      <span className={`text-xs font-medium ${alert.positive ? "text-[#22C55E]" : "text-[#FF4444]"}`}>
                        {alert.positive ? "+" : ""}{alert.priceChange24h?.toFixed(1)}% 24h
                      </span>
                      <span className="text-[#888] text-xs">Vol: {formatCurrency(alert.volume24h)}</span>
                      <span className="text-[#888] text-xs">{getChainLabel(alert.chain)}</span>
                      <a href={alert.url} target="_blank" rel="noopener noreferrer" className="text-[#F5D90A] text-xs flex items-center gap-1 hover:underline">
                        DexScreener <RiExternalLinkLine className="text-[10px]" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <RiAlarmWarningLine className="text-[#888] text-3xl mb-3" />
          <h3 className="text-white font-semibold mb-1">No Active Alerts</h3>
          <p className="text-[#888] text-sm">Enable alert types in settings to see signals</p>
        </div>
      )}
    </div>
  );
}
