"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  RiAlarmWarningLine, RiArrowUpLine, RiBarChartLine,
  RiVipCrownLine, RiSparklingLine, RiSettings3Line,
  RiCheckLine, RiCloseLine, RiLoader4Line, RiExternalLinkLine,
  RiPulseLine, RiArrowUpSLine, RiArrowDownSLine,
} from "react-icons/ri";
import { useTokens } from "@/context/TokenContext";
import { getTrendingTokens, getTopBoostedTokens, searchTokens, formatPairData, formatCurrency, getChainLabel } from "@/lib/dexscreener";

const ALERT_TYPE_META = {
  WHALE_BUY: { label: "Whale Buys", color: "#7C3AED", icon: RiVipCrownLine },
  LIQUIDITY_SPIKE: { label: "Liquidity Spikes", color: "#22C55E", icon: RiArrowUpLine },
  VOLUME_SURGE: { label: "Volume Surges", color: "#F97316", icon: RiBarChartLine },
  SMART_MONEY: { label: "Smart Money", color: "#3B82F6", icon: RiSparklingLine },
  NEW_TOKEN: { label: "New Tokens", color: "#9F67FF", icon: RiAlarmWarningLine },
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
  high: { bg: "bg-[#FF4444]/10 border-[#FF4444]/30", text: "text-[#FF4444]", label: "High Priority" },
  medium: { bg: "bg-[#F97316]/10 border-[#F97316]/30", text: "text-[#F97316]", label: "Medium Alert" },
  low: { bg: "bg-[#22C55E]/10 border-[#22C55E]/30", text: "text-[#22C55E]", label: "Low Impact" },
};

const CARD = "rounded-2xl border border-dashed border-[#2A2A3A]/60 bg-[#0D0D14] relative overflow-hidden";
const CARD_INNER = "rounded-xl border border-[#1E1E2E] bg-[#0A0A0F]";

export default function AlertsPage() {
  const { alertSettings, updateAlertSettings } = useTokens();
  const [showSettings, setShowSettings] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const [trending, top] = await Promise.all([getTrendingTokens(), getTopBoostedTokens()]);
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
      case "SMART_MONEY": return `${token.symbol} scored ${token.alphaScore}/10 Forecast Score with exceptional metrics across the board`;
      default: return `${token.symbol} is a newly boosted token on ${getChainLabel(token.chain)} via ${token.dex}`;
    }
  }

  const toggleSetting = (key) => {
    updateAlertSettings({ ...alertSettings, [key]: !alertSettings[key] });
  };

  const filtered = alerts.filter(a => alertSettings[a.alertType]);

  return (
    <div className="space-y-6">
      {/* ═══ HEADER ═══ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 flex items-center justify-center">
            <RiAlarmWarningLine className="text-[#F97316] text-sm" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Signal Alerts</h1>
            <p className="text-[#555] text-xs mt-0.5">Live on-chain anomalies & algorithmic triggers</p>
          </div>
        </div>
        <button onClick={() => setShowSettings(!showSettings)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${showSettings ? "bg-[#F97316]/10 text-[#F97316] border border-dashed border-[#F97316]/30" : "bg-[#0D0D14] text-[#8E8E9A] border border-dashed border-[#2A2A3A]/60 hover:text-white hover:border-[#F97316]/30"}`}>
          <RiSettings3Line className={showSettings ? "animate-spin-slow" : ""} /> Config
        </button>
      </div>

      {/* ═══ SETTINGS PANEL ═══ */}
      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ opacity: 0, height: 0, scaleY: 0.95 }} animate={{ opacity: 1, height: "auto", scaleY: 1 }} exit={{ opacity: 0, height: 0, scaleY: 0.95 }} className="origin-top overflow-hidden">
            <div className={`p-5 ${CARD} mb-6`}>
              <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2"><RiPulseLine className="text-[#F97316]" /> Notification Matrix</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 relative z-10">
                {Object.entries(ALERT_TYPE_META).map(([key, val]) => {
                  const isActive = alertSettings[key];
                  return (
                    <button key={key} onClick={() => toggleSetting(key)} className={`flex items-center justify-between p-3.5 ${CARD_INNER} transition-all duration-300 ${isActive ? "border-[#2A2A3A] bg-[#0A0A0F]" : "opacity-60 grayscale hover:grayscale-0 hover:opacity-100"}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${val.color}15`, color: val.color }}>
                          <val.icon className="text-sm" />
                        </div>
                        <span className="text-white text-xs font-semibold">{val.label}</span>
                      </div>
                      <div className={`w-8 h-5 rounded-full relative transition-colors duration-300 ${isActive ? "bg-[#F97316]" : "bg-[#1E1E2E]"}`}>
                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${isActive ? "translate-x-3" : "translate-x-0"}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ ALERTS FEED ═══ */}
      {loading ? (
        <div className={`flex items-center justify-center py-20 ${CARD}`}>
          <div className="text-center">
             <div className="w-12 h-12 rounded-2xl bg-[#F97316]/10 flex items-center justify-center mx-auto mb-4">
              <RiLoader4Line className="text-[#F97316] text-2xl animate-spin" />
            </div>
            <p className="text-[#8E8E9A] text-sm font-medium">Scanning mempool for signals...</p>
            <p className="text-[#555] text-xs">Processing algorithmic anomalies</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#555] text-[10px] uppercase font-bold tracking-wider">Live Feed ({filtered.length})</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-[#8E8E9A] text-[10px] font-medium uppercase tracking-wider">Connected</span>
            </div>
          </div>
          
          {filtered.map((alert, i) => {
            const typeMeta = ALERT_TYPE_META[alert.alertType] || {};
            const Icon = typeMeta.icon || RiAlarmWarningLine;
            const severity = SEVERITY_STYLES[alert.severity];
            
            return (
              <motion.div key={alert.address + i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.04 }} 
                className={`group ${CARD} hover:border-[#2A2A3A] transition-all`}>
                
                {/* Severity glow line */}
                <div className={`absolute top-0 left-0 w-1 h-full ${alert.severity === 'high' ? 'bg-[#FF4444]' : alert.severity === 'medium' ? 'bg-[#F97316]' : 'bg-[#22C55E]'}`} />
                
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ring-1 ring-[#1E1E2E] bg-[#0A0A0F]" style={{ boxShadow: `inset 0 0 20px ${typeMeta.color}15` }}>
                      <Icon className="text-xl" style={{ color: typeMeta.color || "#888" }} />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <h3 className="text-white font-bold text-sm truncate mr-1">{alert.name}</h3>
                            <span className="text-[#8E8E9A] text-[11px] font-mono">{alert.symbol}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded border border-dashed uppercase font-bold tracking-wider" style={{ borderColor: `${typeMeta.color}30`, backgroundColor: `${typeMeta.color}10`, color: typeMeta.color }}>{typeMeta.label}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded border border-dashed uppercase font-bold tracking-wider ${severity.bg} ${severity.text}`}>{severity.label}</span>
                          </div>
                          <p className="text-[#8E8E9A] text-xs leading-relaxed max-w-2xl">{alert.description}</p>
                        </div>
                        
                        <div className="text-right shrink-0">
                          <span className="text-white text-sm font-bold block mb-0.5">{alert.price}</span>
                          <span className={`flex items-center justify-end gap-0.5 text-[10px] font-semibold ${alert.positive ? "text-[#22C55E]" : "text-[#FF4444]"}`}>
                            {alert.positive ? <RiArrowUpSLine /> : <RiArrowDownSLine />}{Math.abs(alert.priceChange24h || 0).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      
                      {/* Footer metrics */}
                      <div className="mt-3.5 pt-3.5 border-t border-dashed border-[#1E1E2E] flex items-center gap-3 sm:gap-6 flex-wrap">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <span className="text-[#555] uppercase tracking-wider font-semibold">Vol</span>
                          <span className="text-[#8E8E9A] font-medium">{formatCurrency(alert.volume24h)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <span className="text-[#555] uppercase tracking-wider font-semibold">Network</span>
                          <span className="text-[#8E8E9A] font-medium">{getChainLabel(alert.chain)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] ml-auto">
                           <a href={alert.url} target="_blank" rel="noopener noreferrer" className="text-[#9F67FF] flex items-center gap-1 font-semibold hover:underline">
                            View Evidence <RiExternalLinkLine className="text-[10px]" />
                          </a>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ═══ EMPTY STATE ═══ */}
      {!loading && filtered.length === 0 && (
        <div className={`flex flex-col items-center justify-center py-20 text-center ${CARD}`}>
           <div className="w-16 h-16 rounded-3xl bg-[#0A0A0F] border border-dashed border-[#2A2A3A] flex items-center justify-center mx-auto mb-4">
            <RiAlarmWarningLine className="text-[#555] text-2xl" />
          </div>
          <h3 className="text-white font-semibold text-sm mb-1">No Active Signals</h3>
          <p className="text-[#8E8E9A] text-xs max-w-sm mx-auto leading-relaxed">The algorithm hasn't detected any anomalies matching your active configuration. Check your settings to enable more alert types.</p>
        </div>
      )}
    </div>
  );
}
