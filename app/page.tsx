import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import SocialProof from "@/components/SocialProof";
import Showcase from "@/components/Showcase";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 gradient-subtle -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)] -z-10" />
      
      {/* Fast CSS animation instead of Framer Motion */}
      <div className="animate-fast-fade-in">
        <Hero />
        <Features />
        <HowItWorks />
        <SocialProof />
        <Showcase />
        <Footer />
      </div>
    </main>
  );
}
