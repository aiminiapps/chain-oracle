import { Inter } from "next/font/google";
import "./globals.css";
import Web3Provider from "@/providers/Web3Provider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "AlphaScope — AI-Powered Crypto Research",
  description: "Discover early-stage tokens and hidden opportunities before they become widely known. AI-powered on-chain research, gem scanning, and wallet intelligence.",
  keywords: ["crypto", "AI", "token research", "blockchain", "DeFi", "alpha", "gem scanner"],
  openGraph: {
    title: "AlphaScope — AI-Powered Crypto Research",
    description: "Discover early-stage tokens and hidden opportunities with AI-powered on-chain analytics.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
