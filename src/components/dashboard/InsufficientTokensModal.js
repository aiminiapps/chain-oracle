"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { RiCoinLine, RiCloseLine, RiArrowRightLine } from "react-icons/ri";

export default function InsufficientTokensModal({ isOpen, onClose, required, balance }) {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm p-6 rounded-2xl border border-[#2A2A2A] bg-[#151515] relative"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-[#888] hover:text-white">
            <RiCloseLine size={20} />
          </button>

          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#F5D90A]/10 flex items-center justify-center mx-auto mb-4">
              <RiCoinLine className="text-[#F5D90A] text-2xl" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Insufficient $ASCP</h3>
            <p className="text-[#888] text-sm mb-4">
              You need <span className="text-[#F5D90A] font-semibold">{required} ASCP</span> for this action but only have <span className="text-white font-semibold">{balance} ASCP</span>.
            </p>
            <p className="text-[#888] text-sm mb-6">
              Complete quests to earn more tokens and unlock premium features.
            </p>
            <Link
              href="/app/quests"
              onClick={onClose}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#F5D90A] text-[#0B0B0B] rounded-xl font-semibold text-sm hover:bg-[#F5D90A]/90 transition-all w-full justify-center"
            >
              Earn More $ASCP <RiArrowRightLine />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
