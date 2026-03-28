"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  RiAddLine, RiDeleteBinLine, RiSearchLine, RiExternalLinkLine,
  RiLoader4Line, RiWallet3Line, RiStarLine, RiFileCopyLine,
  RiCheckLine, RiEditLine, RiArrowRightUpLine, RiArrowRightDownLine,
  RiInformationLine,
} from "react-icons/ri";
import { useTokens } from "@/context/TokenContext";
import { searchTokens, formatPairData, formatCurrency, formatNumber, getChainLabel, timeAgo } from "@/lib/dexscreener";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Wallet Intelligence</h1>
        <p className="text-[#888] text-sm mt-1">Track wallets and lookup token data</p>
      </div>

      {/* ─── Summary Strip ─── */}
      {trackedWallets.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl border border-[#2A2A2A] bg-[#151515]">
            <span className="text-[#888] text-[10px] uppercase tracking-wider block mb-1">Tracked</span>
            <span className="text-white font-bold text-lg">{trackedWallets.length}</span>
          </div>
          <div className="p-3 rounded-xl border border-[#2A2A2A] bg-[#151515]">
            <span className="text-[#888] text-[10px] uppercase tracking-wider block mb-1">EVM Wallets</span>
            <span className="text-white font-bold text-lg">{walletsByChain["ethereum"]?.length || 0}</span>
          </div>
          <div className="p-3 rounded-xl border border-[#2A2A2A] bg-[#151515]">
            <span className="text-[#888] text-[10px] uppercase tracking-wider block mb-1">Solana Wallets</span>
            <span className="text-white font-bold text-lg">{walletsByChain["solana"]?.length || 0}</span>
          </div>
        </div>
      )}

      {/* ─── Add Wallet ─── */}
      <div className="p-5 rounded-2xl border border-[#2A2A2A] bg-[#151515]">
        <h3 className="text-white font-semibold mb-3">Track a Wallet</h3>
        <form onSubmit={handleAddWallet} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input type="text" value={newAddress} onChange={e => { setNewAddress(e.target.value); setAddError(""); }} placeholder="Wallet address (0x... or SOL...)" className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B0B] border border-[#2A2A2A] text-white text-sm placeholder:text-[#666] focus:border-[#F5D90A]/50 focus:outline-none font-mono" />
          </div>
          <input type="text" value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Label (optional)" className="sm:w-40 px-4 py-2.5 rounded-xl bg-[#0B0B0B] border border-[#2A2A2A] text-white text-sm placeholder:text-[#666] focus:border-[#F5D90A]/50 focus:outline-none" />
          <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#F5D90A] text-[#0B0B0B] font-semibold text-sm hover:bg-[#F5D90A]/90 transition-colors flex items-center gap-2 justify-center shrink-0">
            <RiAddLine /> Track
          </button>
        </form>
        {addError && <p className="text-[#FF4444] text-xs mt-2">{addError}</p>}
        <p className="text-[#555] text-xs mt-2">Supports EVM (0x...) and Solana wallet addresses</p>
      </div>

      {/* ─── Tracked Wallets ─── */}
      {trackedWallets.length > 0 ? (
        <div className="p-5 rounded-2xl border border-[#2A2A2A] bg-[#151515]">
          <h3 className="text-white font-semibold mb-4">Tracked Wallets ({trackedWallets.length})</h3>
          <div className="space-y-3">
            {trackedWallets.map(wallet => {
              const chain = detectChain(wallet.address);
              const explorerUrl = getExplorerUrl(wallet.address);
              return (
                <motion.div key={wallet.address} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-[#1E1E1E] border border-[#2A2A2A]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${chain === "solana" ? "bg-[#9945FF]/10" : "bg-[#627EEA]/10"}`}>
                        <RiWallet3Line className={chain === "solana" ? "text-[#9945FF]" : "text-[#627EEA]"} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm font-medium">{wallet.label}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${chain === "solana" ? "bg-[#9945FF]/10 text-[#9945FF]" : chain === "ethereum" ? "bg-[#627EEA]/10 text-[#627EEA]" : "bg-[#888]/10 text-[#888]"}`}>
                            {chain === "solana" ? "SOL" : chain === "ethereum" ? "EVM" : "???"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[#888] text-xs truncate block font-mono max-w-[200px] sm:max-w-[300px]">{wallet.address}</span>
                          <button onClick={() => copyAddress(wallet.address)} className="text-[#888] hover:text-white transition-colors shrink-0 p-0.5">
                            {copiedAddr === wallet.address ? <RiCheckLine className="text-[#22C55E] text-xs" /> : <RiFileCopyLine className="text-xs" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {explorerUrl && (
                        <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-[#888] hover:text-white hover:bg-[#2A2A2A] transition-colors" title={`View on ${getExplorerLabel(wallet.address)}`}>
                          <RiExternalLinkLine />
                        </a>
                      )}
                      {walletToDelete === wallet.address ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => { removeTrackedWallet(wallet.address); setWalletToDelete(null); }} className="px-2 py-1 rounded-lg text-xs font-medium bg-[#FF4444]/10 text-[#FF4444] hover:bg-[#FF4444]/20 transition-colors">Remove</button>
                          <button onClick={() => setWalletToDelete(null)} className="px-2 py-1 rounded-lg text-xs text-[#888] hover:text-white transition-colors">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setWalletToDelete(wallet.address)} className="p-2 rounded-lg text-[#888] hover:text-[#FF4444] hover:bg-[#FF4444]/10 transition-colors">
                          <RiDeleteBinLine />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl border border-[#2A2A2A] bg-[#151515] text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#F5D90A]/10 flex items-center justify-center mx-auto mb-3">
            <RiWallet3Line className="text-[#F5D90A] text-2xl" />
          </div>
          <h3 className="text-white font-semibold mb-1">No wallets tracked yet</h3>
          <p className="text-[#888] text-sm max-w-sm mx-auto">Add wallet addresses above to keep them organized. You can track whale wallets, your own wallets, or wallets of interest.</p>
        </div>
      )}

      {/* ─── Token Lookup ─── */}
      <div className="p-5 rounded-2xl border border-[#2A2A2A] bg-[#151515]">
        <h3 className="text-white font-semibold mb-1">Token Lookup</h3>
        <p className="text-[#888] text-sm mb-4">Search any token to see live market data and key metrics</p>
        <form onSubmit={handleTokenLookup} className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888] text-sm" />
            <input type="text" value={lookupQuery} onChange={e => setLookupQuery(e.target.value)} placeholder="Search token name, symbol, or contract..." className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0B0B0B] border border-[#2A2A2A] text-white text-sm placeholder:text-[#666] focus:border-[#F5D90A]/50 focus:outline-none" />
          </div>
          <button type="submit" disabled={lookupLoading} className="px-5 py-2.5 rounded-xl bg-[#F5D90A] text-[#0B0B0B] font-semibold text-sm hover:bg-[#F5D90A]/90 transition-colors disabled:opacity-50 flex items-center gap-2 shrink-0">
            {lookupLoading ? <RiLoader4Line className="animate-spin" /> : <RiSearchLine />} Lookup
          </button>
        </form>

        {lookupResults.length > 0 && (
          <div className="space-y-2">
            {lookupResults.map((token, i) => {
              const isExpanded = expandedToken === token.address;
              const buyRatio = token.buys24h + token.sells24h > 0 ? Math.round((token.buys24h / (token.buys24h + token.sells24h)) * 100) : 50;
              return (
                <motion.div key={token.address || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="rounded-xl bg-[#1E1E1E] border border-[#2A2A2A] overflow-hidden">
                  {/* Main row */}
                  <button onClick={() => setExpandedToken(isExpanded ? null : token.address)} className="w-full flex items-center justify-between p-3 text-left hover:bg-[#252525] transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      {token.imageUrl ? <img src={token.imageUrl} alt="" className="w-8 h-8 rounded-full shrink-0" /> : <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F5D90A]/20 to-[#F97316]/20 flex items-center justify-center text-xs font-bold text-[#F5D90A] shrink-0">{token.symbol?.slice(0, 2)}</div>}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm font-medium truncate max-w-[120px]">{token.name}</span>
                          <span className="text-[#888] text-xs">{token.symbol}</span>
                          <span className="text-[#888] text-[10px] px-1.5 py-0.5 rounded bg-[#0B0B0B]">{getChainLabel(token.chain)}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-[#888] text-xs">Vol: {formatCurrency(token.volume24h)}</span>
                          <span className="text-[#888] text-xs">Liq: {formatCurrency(token.liquidity)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-white text-sm font-medium block">{token.price}</span>
                        <span className={`text-xs font-medium ${token.positive ? "text-[#22C55E]" : "text-[#FF4444]"}`}>
                          {token.positive ? "+" : ""}{token.priceChange24h?.toFixed(1)}%
                        </span>
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${token.alphaScore >= 8 ? "bg-[#22C55E]/10 text-[#22C55E]" : token.alphaScore >= 6 ? "bg-[#F5D90A]/10 text-[#F5D90A]" : "bg-[#F97316]/10 text-[#F97316]"}`}>
                        <RiStarLine className="text-[10px]" /> {token.alphaScore}
                      </div>
                    </div>
                  </button>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="px-3 pb-3 space-y-3 border-t border-[#2A2A2A]">
                          {/* Metrics grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                            {[
                              { label: "FDV", value: formatCurrency(token.fdv) },
                              { label: "Market Cap", value: formatCurrency(token.marketCap) },
                              { label: "1h Change", value: `${token.priceChange1h >= 0 ? "+" : ""}${token.priceChange1h?.toFixed(1)}%`, color: token.priceChange1h >= 0 ? "#22C55E" : "#FF4444" },
                              { label: "Pair Age", value: timeAgo(token.pairCreatedAt) },
                            ].map(m => (
                              <div key={m.label} className="p-2 rounded-lg bg-[#0B0B0B] text-center">
                                <span className="text-[#888] text-[10px] block">{m.label}</span>
                                <span className="text-white text-xs font-medium" style={m.color ? { color: m.color } : undefined}>{m.value}</span>
                              </div>
                            ))}
                          </div>

                          {/* Buy/Sell bar */}
                          <div>
                            <div className="flex justify-between text-[10px] mb-1">
                              <span className="text-[#22C55E]">Buys: {formatNumber(token.buys24h)} ({buyRatio}%)</span>
                              <span className="text-[#FF4444]">Sells: {formatNumber(token.sells24h)} ({100 - buyRatio}%)</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-[#2A2A2A] overflow-hidden flex">
                              <div className="h-full bg-[#22C55E] rounded-l-full" style={{ width: `${buyRatio}%` }} />
                              <div className="h-full bg-[#FF4444] rounded-r-full flex-1" />
                            </div>
                          </div>

                          {/* Contract + links */}
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-[#888] text-[10px]">Contract:</span>
                              <span className="text-[#888] text-[10px] font-mono truncate max-w-[160px]">{token.address}</span>
                              <button onClick={() => copyAddress(token.address)} className="text-[#888] hover:text-white transition-colors p-0.5 shrink-0">
                                {copiedAddr === token.address ? <RiCheckLine className="text-[#22C55E] text-xs" /> : <RiFileCopyLine className="text-xs" />}
                              </button>
                            </div>
                            <a href={token.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#F5D90A] text-xs font-medium hover:underline shrink-0">
                              <RiExternalLinkLine /> DexScreener
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

      {/* ─── Tips ─── */}
      <div className="p-4 rounded-2xl border border-[#2A2A2A] bg-[#151515] flex items-start gap-3">
        <RiInformationLine className="text-[#3B82F6] text-lg shrink-0 mt-0.5" />
        <div>
          <p className="text-[#888] text-xs leading-relaxed">
            <strong className="text-[#CCC]">Tip:</strong> Track whale wallets or smart money addresses to monitor their activity. Use Token Lookup to quickly check any token's live price, Alpha Score, buy/sell pressure, and more — tap any result to expand full details.
          </p>
        </div>
      </div>
    </div>
  );
}
