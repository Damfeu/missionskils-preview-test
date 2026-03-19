import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import UseCasesSection from "@/components/landing/UseCasesSection";
import FeaturesGridSection from "@/components/landing/FeaturesGridSection";
import ImpactSection from "@/components/landing/ImpactSection";
import RoadmapSection from "@/components/landing/RoadmapSection";
import PartnersSection from "@/components/landing/PartnersSection";
import FinalCTASection from "@/components/landing/FinalCTASection";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <ProblemSection />
    <SolutionSection />
    <HowItWorksSection />
    <UseCasesSection />
    <FeaturesGridSection />
    <ImpactSection />
    <RoadmapSection />
    <PartnersSection />
    <FinalCTASection />
    <Footer />
  </div>
);

export default Index;
