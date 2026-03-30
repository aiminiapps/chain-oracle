"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { RiArrowRightLine } from "react-icons/ri";

export default function CTA() {
  return (
    <section className="py-24 relative">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl border border-[#2A2A3A] bg-[#141420] p-12 md:p-16 text-center overflow-hidden"
        >
          <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: `radial-gradient(circle at center, #7C3AED 1px, transparent 1px)`,
            backgroundSize: "22px 22px",
            backgroundPosition: "0 0"
          }}
        />
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[#7C3AED]/10 rounded-full blur-[100px]" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Ready to Predict the Next{" "}
              <span className="text-[#7C3AED]">100x</span>?
            </h2>
            <p className="text-[#A1A1AA] text-lg mb-8 max-w-xl mx-auto">
              Join thousands of oracles using ChainOracle to discover
              opportunities before they go mainstream.
            </p>
            <Link
              href="/app"
              className="btn-3d inline-flex items-center gap-2 px-8 py-4 text-base"
            >
              Start Predicting
              <RiArrowRightLine />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
