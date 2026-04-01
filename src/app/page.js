import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import TokenSection from "@/components/landing/TokenSection";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0F]">
      <Navbar />
      <Hero />
      <About />
      <Features />
      <HowItWorks />
      <TokenSection />
      <CTA />
      <Footer />
    </main>
  );
}
