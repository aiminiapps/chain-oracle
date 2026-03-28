"use client";

import Image from "next/image";
import Link from "next/link";
import { RiTwitterXLine, RiArrowRightUpLine, RiBnbFill } from "react-icons/ri";

const footerLinks = {
  Product: [
    { name: "AI Analyzer", href: "/app/analyzer" },
    { name: "Gem Scanner", href: "/app/gems" },
    { name: "Wallet Tracker", href: "/app/wallets" },
    { name: "Alpha Alerts", href: "/app/alerts" },
  ],
  Community: [
    { name: "Twitter / X", href: "https://x.com/ascp_ai" },
    { name: "Whitepaper", href: "https://alpha-scope.gitbook.io/alpha-scope-docs" }
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#111] bg-[#0B0B0B] pt-24 pb-12 relative overflow-hidden"> 
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-20">
          
          {/* Brand & Socials */}
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-3 mb-6 group inline-flex">
            <Image src="/logo.png" alt="Logo" width={150} height={50} className="scale-110 pl-3" /> 
            </Link>
            <p className="text-[#888] text-sm leading-relaxed mb-8">
              The premier AI-powered crypto research platform. Discover early-stage tokens, analyze smart wallets, and unlock hidden market opportunities before the crowd.
            </p>
            
            {/* Minimal Socials (X and BscScan) */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="https://x.com/ascp_ai"
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#0B0B0B] border border-[#2A2A2A] text-[#AAA] hover:text-[#F5D90A] hover:border-[#F5D90A]/40 hover:bg-[#F5D90A]/5 transition-all duration-300"
              >
                <RiTwitterXLine className="text-lg" />
                <span className="text-sm font-medium">Twitter / X</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#0B0B0B] border border-[#2A2A2A] text-[#AAA] hover:text-[#F5D90A] hover:border-[#F5D90A]/40 hover:bg-[#F5D90A]/5 transition-all duration-300 group"
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
                        className="text-[#888] text-sm hover:text-[#F5D90A] hover:translate-x-1 inline-block transition-all duration-300"
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

        {/* Global Bottom / Copyright */}
        <div className="pt-8 border-t border-[#1A1A1A] flex items-center justify-center text-center">
          <p className="text-[#666] text-sm tracking-wide">
            © {currentYear} AlphaScope. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
