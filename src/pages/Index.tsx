
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import BlueprintStackSection from "@/components/BlueprintStackSection";
import InteractiveDemo from "@/components/InteractiveDemo";
import ProofSection from "@/components/ProofSection";
import CommunitySection from "@/components/CommunitySection";
import FinalCTA from "@/components/FinalCTA";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <div id="problem-section">
        <ProblemSection />
      </div>
      <div id="blueprint-stack">
        <BlueprintStackSection />
      </div>
      <div id="interactive-demo">
        <InteractiveDemo />
      </div>
      <div id="proof-section">
        <ProofSection />
      </div>
      <div id="community-section">
        <CommunitySection />
      </div>
      <div id="final-cta">
        <FinalCTA />
      </div>
    </div>
  );
};

export default Index;
