
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
      <ProblemSection />
      <BlueprintStackSection />
      <InteractiveDemo />
      <ProofSection />
      <CommunitySection />
      <FinalCTA />
    </div>
  );
};

export default Index;
