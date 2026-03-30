import { Inter } from "next/font/google";
import "./globals.css";
import Web3Provider from "@/providers/Web3Provider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "ChainOracle ($CORA) — AI Predictive Analytics",
  description: "Predict the next trending crypto before everyone else. AI-powered forecasting, curated alpha feeds, personalized watchlists, and real-time signal intelligence.",
  keywords: ["crypto", "AI", "predictive analytics", "blockchain", "DeFi", "forecast", "CORA", "ChainOracle", "token prediction"],
  openGraph: {
    title: "ChainOracle ($CORA) — AI Predictive Analytics",
    description: "Predict the next trending crypto before everyone else with AI-powered forecasting and signal intelligence.",
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
