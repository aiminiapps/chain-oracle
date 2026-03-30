"use client";

import Link from "next/link";
import { RiTwitterXLine, RiArrowRightUpLine, RiBnbFill } from "react-icons/ri";

const footerLinks = {
  Product: [
    { name: "AI Forecast", href: "/app/analyzer" },
    { name: "Predictions", href: "/app/gems" },
    { name: "Wallet Tracker", href: "/app/wallets" },
    { name: "Signal Alerts", href: "/app/alerts" },
  ],
  Community: [
    { name: "Twitter / X", href: "https://x.com/ascp_ai" },
    { name: "Whitepaper", href: "https://alpha-scope.gitbook.io/alpha-scope-docs" }
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#141420] bg-[#0A0A0F] pt-24 pb-12 relative overflow-hidden"> 
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-20">
          
          {/* Brand & Socials */}
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2.5 mb-6 group inline-flex">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] flex items-center justify-center shadow-lg shadow-[#7C3AED]/20">
                <span className="text-white font-extrabold text-xs">CO</span>
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                Chain<span className="text-[#7C3AED]">Oracle</span>
              </span>
            </Link>
            <p className="text-[#A1A1AA] text-sm leading-relaxed mb-8">
              The premier AI-powered predictive analytics platform. Forecast token trends, discover alpha opportunities, and receive real-time signal intelligence before the crowd.
            </p>
            
            {/* Minimal Socials */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="https://x.com/ascp_ai"
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#0A0A0F] border border-[#2A2A3A] text-[#A1A1AA] hover:text-[#9F67FF] hover:border-[#7C3AED]/40 hover:bg-[#7C3AED]/5 transition-all duration-300"
              >
                <RiTwitterXLine className="text-lg" />
                <span className="text-sm font-medium">Twitter / X</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#0A0A0F] border border-[#2A2A3A] text-[#A1A1AA] hover:text-[#9F67FF] hover:border-[#7C3AED]/40 hover:bg-[#7C3AED]/5 transition-all duration-300 group"
              >
                <div className="text-lg">
                <RiBnbFill />
                </div>
                <span className="text-sm font-medium">BscScan</span>
                <RiArrowRightUpLine className="text-xs opacity-50 group-hover:opacity-100" />
              </a>
            </div>
          </div>

          {/* Links Grid */}
          <div className="flex flex-wrap gap-16 md:gap-24 pt-2">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="flex flex-col">
                <h4 className="text-white font-bold text-base mb-6 tracking-wide uppercase">
                  {category}
                </h4>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-[#A1A1AA] text-sm hover:text-[#9F67FF] hover:translate-x-1 inline-block transition-all duration-300"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-[#1C1C2E] flex items-center justify-center text-center">
          <p className="text-[#6B6B76] text-sm tracking-wide">
            © {currentYear} ChainOracle. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
