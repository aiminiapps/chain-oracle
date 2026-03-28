import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import TokenSection from "@/components/landing/TokenSection";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0B0B0B]">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <TokenSection />
      <CTA />
      <Footer />
    </main>
  );
}
