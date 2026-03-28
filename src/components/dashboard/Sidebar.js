"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useDisconnect, useAccount } from "wagmi";
import {
  RiMenu3Line,
  RiCloseLine,
  RiLogoutBoxRLine,
  RiCoinLine,
} from "react-icons/ri";
import { NAV_ITEMS } from "@/lib/constants";
import { useTokens } from "@/context/TokenContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();
  const { balance, loaded } = useTokens();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);


  const isActive = (href) => {
    if (href === "/app") return pathname === "/app";
    return pathname.startsWith(href);
  };

  function handleDisconnect() {
    if (isConnected) {
      disconnect();
    }
  }

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-[#1E1E1E]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F5D90A] to-[#F0C000] flex items-center justify-center shrink-0 shadow-lg shadow-[#F5D90A]/10 group-hover:shadow-[#F5D90A]/20 transition-shadow">
            <span className="text-[#0B0B0B] font-extrabold text-sm tracking-tight">AS</span>
          </div>
          {(!collapsed || mobile) && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-white font-bold text-lg tracking-tight"
            >
              Alpha<span className="text-[#F5D90A]">Scope</span>
            </motion.span>
          )}
        </Link>
        {!mobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center text-[#666] hover:text-white hover:bg-[#1E1E1E] transition-all"
          >
            <motion.div animate={{ rotate: collapsed ? 0 : 180 }} transition={{ duration: 0.3 }}>
              {collapsed ? <RiMenu3Line size={15} /> : <RiCloseLine size={15}  className="sm:hidden block"/>}
            </motion.div>
          </button>
        )}
      </div>

      {/* ASCP Balance (mobile & expanded) */}
      {(!collapsed || mobile) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-3 mt-3 p-3 rounded-xl bg-gradient-to-r from-[#F5D90A]/5 to-[#F97316]/5 border border-[#F5D90A]/10"
        >
          <div className="flex items-center gap-2">
            <RiCoinLine className="text-[#F5D90A] text-sm" />
            <span className="text-[#888] text-xs">ASCP Balance</span>
          </div>
          <p className="text-[#F5D90A] font-bold text-lg mt-0.5">
            {loaded ? balance.toLocaleString() : "..."}
          </p>
        </motion.div>
      )}

      {/* Nav items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto mt-1">
        {NAV_ITEMS.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => mobile && setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium relative transition-all duration-200 ${
                active
                  ? "bg-[#F5D90A]/10 text-[#F5D90A] border border-[#F5D90A]/15"
                  : "text-[#888] hover:text-white hover:bg-[#1E1E1E] border border-transparent"
              }`}
            >
              <Icon className={`text-lg shrink-0 ${active ? "text-[#F5D90A]" : ""}`} />
              {(!collapsed || mobile) && <span>{item.name}</span>}

              {/* Active dot for collapsed */}
              {collapsed && !mobile && active && (
                <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#F5D90A]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Disconnect */}
      <div className="p-3 border-t border-[#1E1E1E]">
        <button
          onClick={handleDisconnect}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#888] hover:text-[#FF4444] hover:bg-[#FF4444]/5 transition-all text-sm font-medium w-full group"
        >
          <RiLogoutBoxRLine className="text-lg shrink-0 group-hover:rotate-12 transition-transform" />
          {(!collapsed || mobile) && <span>Disconnect</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="hidden lg:flex flex-col border-r border-[#1E1E1E] bg-[#0B0B0B] h-screen sticky top-0 overflow-hidden"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-[#151515]/90 backdrop-blur-md border border-[#2A2A2A] flex items-center justify-center text-white shadow-lg"
      >
        <RiMenu3Line size={18} />
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280, opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-[270px] bg-[#0B0B0B] border-r border-[#1E1E1E] shadow-2xl shadow-black/50"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-[#1E1E1E] flex items-center justify-center text-[#888] hover:text-white transition-colors z-10"
              >
                <RiCloseLine size={18} />
              </button>
              <SidebarContent mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
