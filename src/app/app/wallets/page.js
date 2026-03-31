"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  RiAddLine, RiDeleteBinLine, RiSearchLine, RiExternalLinkLine,
  RiLoader4Line, RiWallet3Line, RiStarLine, RiFileCopyLine,
  RiCheckLine, RiArrowRightUpLine, RiArrowUpSLine, RiArrowDownSLine,
  RiInformationLine, RiEyeLine,
} from "react-icons/ri";
import { useTokens } from "@/context/TokenContext";
import { searchTokens, formatPairData, formatCurrency, formatNumber, getChainLabel, timeAgo } from "@/lib/dexscreener";

const CARD = "rounded-2xl border border-dashed border-[#2A2A3A]/60 bg-[#0D0D14] relative overflow-hidden";
const CARD_INNER = "rounded-xl border border-[#1E1E2E] bg-[#0A0A0F]";

function detectChain(address) {
  if (!address) return "unknown";
  if (address.startsWith("0x")) return "ethereum";
  if (address.length >= 32 && address.length <= 44 && !address.startsWith("0x")) return "solana";
  return "unknown";
}

function getExplorerUrl(address) {
  const chain = detectChain(address);
  if (chain === "ethereum") return `https://etherscan.io/address/${address}`;
  if (chain === "solana") return `https://solscan.io/account/${address}`;
  return null;
}

function getExplorerLabel(address) {
  const chain = detectChain(address);
  if (chain === "ethereum") return "Etherscan";
  if (chain === "solana") return "Solscan";
  return "Explorer";
}

export default function WalletsPage() {
  const { trackedWallets, trackWallet, removeTrackedWallet } = useTokens();
  const [newAddress, setNewAddress] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [addError, setAddError] = useState("");
  const [copiedAddr, setCopiedAddr] = useState(null);
  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupResults, setLookupResults] = useState([]);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [expandedToken, setExpandedToken] = useState(null);
  const [walletToDelete, setWalletToDelete] = useState(null);

  function handleAddWallet(e) {
    e.preventDefault();
    setAddError("");
    const addr = newAddress.trim();
    if (!addr) { setAddError("Please enter a wallet address"); return; }
    if (addr.length < 20) { setAddError("Address seems too short"); return; }
    if (trackedWallets.find(w => w.address === addr)) { setAddError("This wallet is already tracked"); return; }
    const added = trackWallet(addr, newLabel.trim());
    if (added) { setNewAddress(""); setNewLabel(""); setAddError(""); }
  }

  async function copyAddress(addr) {
    try {
      await navigator.clipboard.writeText(addr);
      setCopiedAddr(addr);
      setTimeout(() => setCopiedAddr(null), 2000);
    } catch {}
  }

  async function handleTokenLookup(e) {
    e.preventDefault();
    if (!lookupQuery.trim()) return;
    setLookupLoading(true);
    setExpandedToken(null);
    try {
      const pairs = await searchTokens(lookupQuery.trim());
      const seen = new Set();
      const unique = pairs.filter(p => {
        const k = p.baseToken?.address;
        if (!k || seen.has(k)) return false;
        seen.add(k);
        return true;
      });
      setLookupResults(unique.slice(0, 8).map(formatPairData).filter(Boolean));
    } catch (err) {
      console.error("Lookup failed:", err);
    } finally {
      setLookupLoading(false);
    }
  }

  const walletsByChain = useMemo(() => {
    const groups = {};
    trackedWallets.forEach(w => {
      const chain = detectChain(w.address);
      if (!groups[chain]) groups[chain] = [];
      groups[chain].push(w);
    });
    return groups;
  }, [trackedWallets]);

  return (
    <div className="space-y-5">
      {/* ═══ HEADER ═══ */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
          <RiWallet3Line className="text-[#3B82F6] text-sm" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Wallet Intelligence</h1>
          <p className="text-[#555] text-xs mt-0.5">Track smart money & monitor portfolio assets</p>
        </div>
      </div>

      {/* ═══ STATS ═══ */}
      {trackedWallets.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className={`p-4 ${CARD}`}>
            <span className="text-[#555] text-[10px] uppercase font-semibold tracking-wider block mb-1">Tracked Wallets</span>
            <span className="text-white font-bold text-2xl">{trackedWallets.length}</span>
          </div>
          <div className={`p-4 ${CARD}`}>
            <span className="text-[#555] text-[10px] uppercase font-semibold tracking-wider block mb-1">EVM Chains</span>
            <span className="text-white font-bold text-2xl">{walletsByChain["ethereum"]?.length || 0}</span>
          </div>
          <div className={`p-4 ${CARD}`}>
            <span className="text-[#555] text-[10px] uppercase font-semibold tracking-wider block mb-1">Solana Network</span>
            <span className="text-white font-bold text-2xl">{walletsByChain["solana"]?.length || 0}</span>
          </div>
        </div>
      )}

      {/* ═══ ADD WALLET ═══ */}
      <div className={`p-5 ${CARD}`}>
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#3B82F6]/5 rounded-full blur-3xl pointer-events-none" />
        <h3 className="text-white font-semibold text-sm mb-3">Track Smart Money</h3>
        <form onSubmit={handleAddWallet} className="flex flex-col sm:flex-row gap-3 relative z-10">
          <div className="flex-1">
            <input type="text" value={newAddress} onChange={e => { setNewAddress(e.target.value); setAddError(""); }} placeholder="Wallet address (0x... or SOL...)" className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A0F] border border-dashed border-[#2A2A3A] text-white text-sm placeholder:text-[#555] focus:border-[#7C3AED]/50 focus:outline-none font-mono transition-colors" />
          </div>
          <input type="text" value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Label (optional)" className="sm:w-48 px-4 py-2.5 rounded-xl bg-[#0A0A0F] border border-dashed border-[#2A2A3A] text-white text-sm placeholder:text-[#555] focus:border-[#7C3AED]/50 focus:outline-none transition-colors" />
          <button type="submit" className="btn-3d btn-3d-sm px-6 py-2.5 flex items-center gap-2 justify-center shrink-0">
            <RiAddLine /> Track Wallet
          </button>
        </form>
        {addError && <p className="text-[#FF4444] text-xs mt-2.5 relative z-10">{addError}</p>}
      </div>

      {/* ═══ TRACKED WALLETS LIST ═══ */}
      {trackedWallets.length > 0 ? (
        <div className={`p-5 ${CARD}`}>
          <h3 className="text-white font-semibold text-sm mb-4">Monitored Wallets</h3>
          <div className="space-y-2">
            {trackedWallets.map(wallet => {
              const chain = detectChain(wallet.address);
              const explorerUrl = getExplorerUrl(wallet.address);
              return (
                <motion.div key={wallet.address} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-3 ${CARD_INNER} flex items-center justify-between group hover:border-[#2A2A3A] transition-colors`}>
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${chain === "solana" ? "bg-[#14F195]/10" : "bg-[#627EEA]/10"}`}>
                      <RiWallet3Line className={chain === "solana" ? "text-[#14F195]" : "text-[#627EEA]"} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-white text-sm font-medium">{wallet.label}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${chain === "solana" ? "bg-[#14F195]/10 text-[#14F195]" : chain === "ethereum" ? "bg-[#627EEA]/10 text-[#627EEA]" : "bg-[#555]/10 text-[#8E8E9A]"}`}>
                          {chain === "solana" ? "SOL" : chain === "ethereum" ? "EVM" : "???"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#8E8E9A] text-[11px] truncate block font-mono max-w-[200px] sm:max-w-[300px]">{wallet.address}</span>
                        <button onClick={() => copyAddress(wallet.address)} className="text-[#555] hover:text-[#9F67FF] transition-colors shrink-0 p-0.5">
                          {copiedAddr === wallet.address ? <RiCheckLine className="text-[#22C55E] text-xs" /> : <RiFileCopyLine className="text-xs" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {explorerUrl && (
                      <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-[#555] hover:text-[#9F67FF] hover:bg-[#7C3AED]/5 transition-colors" title={`View on ${getExplorerLabel(wallet.address)}`}>
                        <RiExternalLinkLine className="text-sm" />
                      </a>
                    )}
                    {walletToDelete === wallet.address ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => { removeTrackedWallet(wallet.address); setWalletToDelete(null); }} className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-[#FF4444]/10 text-[#FF4444] hover:bg-[#FF4444]/20 transition-colors">Confirm Remove</button>
                        <button onClick={() => setWalletToDelete(null)} className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-[#8E8E9A] hover:text-white transition-colors border border-dashed border-[#2A2A3A]/60 bg-[#0D0D14]">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setWalletToDelete(wallet.address)} className="p-2 rounded-lg text-[#555] hover:text-[#FF4444] hover:bg-[#FF4444]/10 transition-colors">
                        <RiDeleteBinLine className="text-sm" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className={`p-10 ${CARD} text-center`}>
          <div className="w-16 h-16 rounded-3xl bg-[#0A0A0F] border border-dashed border-[#2A2A3A] flex items-center justify-center mx-auto mb-4">
            <RiEyeLine className="text-[#555] text-2xl" />
          </div>
          <h3 className="text-white font-semibold mb-1">No Wallets Tracked</h3>
          <p className="text-[#8E8E9A] text-xs max-w-sm mx-auto leading-relaxed">Add wallet addresses above to monitor their activity. Follow top traders or track your own portfolios.</p>
        </div>
      )}

      {/* ═══ TOKEN LOOKUP ═══ */}
      <div className={`p-5 ${CARD}`}>
        <h3 className="text-white font-semibold text-sm mb-1">Token Intelligence Lookup</h3>
        <p className="text-[#555] text-xs mb-4">Search any token to reveal live market metrics</p>
        <form onSubmit={handleTokenLookup} className="flex gap-3 mb-5">
          <div className="relative flex-1">
            <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555] text-sm" />
            <input type="text" value={lookupQuery} onChange={e => setLookupQuery(e.target.value)} placeholder="Contract address or token symbol..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A0A0F] border border-dashed border-[#2A2A3A] text-white text-sm placeholder:text-[#555] focus:border-[#7C3AED]/50 focus:outline-none transition-colors" />
          </div>
          <button type="submit" disabled={lookupLoading} className="btn-3d btn-3d-sm px-6 py-2.5 flex items-center gap-2 shrink-0 disabled:opacity-50 text-sm">
            {lookupLoading ? <RiLoader4Line className="animate-spin text-sm" /> : <RiSearchLine className="text-sm" />} Lookup
          </button>
        </form>

        {lookupResults.length > 0 && (
          <div className="space-y-2">
            {lookupResults.map((token, i) => {
              const isExpanded = expandedToken === token.address;
              const buyRatio = token.buys24h + token.sells24h > 0 ? Math.round((token.buys24h / (token.buys24h + token.sells24h)) * 100) : 50;
              return (
                <motion.div key={token.address || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} 
                  className={`rounded-xl border border-dashed transition-all ${isExpanded ? "bg-[#0A0A0F] border-[#2A2A3A]" : "bg-[#0D0D14] border-[#1E1E2E] hover:border-[#2A2A3A]"}`}>
                  
                  <button onClick={() => setExpandedToken(isExpanded ? null : token.address)} className="w-full flex items-center justify-between p-3 text-left">
                    <div className="flex items-center gap-3 min-w-0">
                      {token.imageUrl ? <img src={token.imageUrl} alt="" className="w-9 h-9 rounded-full shrink-0 ring-1 ring-[#1E1E2E]" /> : <div className="w-9 h-9 rounded-full bg-[#7C3AED]/8 ring-1 ring-[#1E1E2E] flex items-center justify-center text-xs font-bold text-[#9F67FF] shrink-0">{token.symbol?.slice(0, 2)}</div>}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-white text-sm font-semibold truncate max-w-[120px]">{token.name}</span>
                          <span className="text-[#555] text-xs">{token.symbol}</span>
                          <span className="text-[#555] text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border border-dashed border-[#2A2A3A]" style={{ background: "rgba(255,255,255,0.02)" }}>{getChainLabel(token.chain)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[#8E8E9A] text-[11px]">Vol <span className="text-white font-medium">{formatCurrency(token.volume24h)}</span></span>
                          <span className="text-[#8E8E9A] text-[11px]">Liq <span className="text-white font-medium">{formatCurrency(token.liquidity)}</span></span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-white text-sm font-bold block mb-0.5">{token.price}</span>
                        <span className={`flex items-center justify-end gap-0.5 text-[10px] font-semibold ${token.positive ? "text-[#22C55E]" : "text-[#FF4444]"}`}>
                          {token.positive ? <RiArrowUpSLine /> : <RiArrowDownSLine />}{Math.abs(token.priceChange24h || 0).toFixed(1)}%
                        </span>
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold border border-dashed ${token.alphaScore >= 8 ? "bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]" : token.alphaScore >= 6 ? "bg-[#7C3AED]/10 border-[#7C3AED]/30 text-[#9F67FF]" : "bg-[#F97316]/10 border-[#F97316]/30 text-[#F97316]"}`}>
                        <RiStarLine className="text-[9px]" /> {token.alphaScore}
                      </div>
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="px-4 pb-4 space-y-4 border-t border-dashed border-[#1E1E2E] pt-3">
                          
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {[
                              { label: "FDV", value: formatCurrency(token.fdv) },
                              { label: "Market Cap", value: formatCurrency(token.marketCap) },
                              { label: "1h Change", value: `${token.priceChange1h >= 0 ? "+" : ""}${token.priceChange1h?.toFixed(1)}%`, color: token.priceChange1h >= 0 ? "#22C55E" : "#FF4444" },
                              { label: "Pair Age", value: timeAgo(token.pairCreatedAt) },
                            ].map(m => (
                              <div key={m.label} className="p-2.5 rounded-xl border border-[#1E1E2E] bg-[#0D0D14] text-center">
                                <span className="text-[#555] text-[10px] uppercase tracking-wider block mb-1">{m.label}</span>
                                <span className="text-white text-xs font-bold" style={m.color ? { color: m.color } : undefined}>{m.value}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="p-3 rounded-xl border border-[#1E1E2E] bg-[#0D0D14]">
                            <div className="flex justify-between text-[10px] mb-1.5">
                              <span className="text-[#22C55E] font-medium">Buys: {formatNumber(token.buys24h)} ({buyRatio}%)</span>
                              <span className="text-[#FF4444] font-medium">Sells: {formatNumber(token.sells24h)} ({100 - buyRatio}%)</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-[#1E1E2E] overflow-hidden flex">
                              <div className="h-full bg-[#22C55E] rounded-l-full" style={{ width: `${buyRatio}%` }} />
                              <div className="h-full bg-[#FF4444] rounded-r-full flex-1" />
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2 min-w-0 bg-[#0D0D14] border border-[#1E1E2E] rounded-lg px-2 py-1">
                              <span className="text-[#555] text-[10px] font-medium">Contract:</span>
                              <span className="text-[#8E8E9A] text-[10px] font-mono truncate max-w-[120px] sm:max-w-[200px]">{token.address}</span>
                              <button onClick={() => copyAddress(token.address)} className="text-[#555] hover:text-white transition-colors p-0.5 shrink-0 ml-1">
                                {copiedAddr === token.address ? <RiCheckLine className="text-[#22C55E] text-[10px]" /> : <RiFileCopyLine className="text-[10px]" />}
                              </button>
                            </div>
                            <a href={token.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#7C3AED]/20 bg-[#7C3AED]/5 text-[#9F67FF] text-[10px] font-bold hover:bg-[#7C3AED]/10 transition-colors shrink-0">
                              <RiExternalLinkLine className="text-[11px]" /> DexScreener
                            </a>
                          </div>
                          
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <div className={`p-4 ${CARD} flex items-start gap-3 bg-[#3B82F6]/[0.02] border-[#3B82F6]/20`}>
        <RiInformationLine className="text-[#3B82F6] text-lg shrink-0 mt-0.5" />
        <div>
          <p className="text-[#8E8E9A] text-[11px] leading-relaxed">
            <strong className="text-white">Tip:</strong> Track whale wallets or smart money addresses to monitor their activity. Use Token Lookup to quickly check any token's live price, Forecast Score, buy/sell pressure, and more.
          </p>
        </div>
      </div>
    </div>
  );
}
